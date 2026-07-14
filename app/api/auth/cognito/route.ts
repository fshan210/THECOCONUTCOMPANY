import { NextResponse } from "next/server";
import { ConfirmForgotPasswordCommand, ConfirmSignUpCommand, ForgotPasswordCommand, GetUserCommand, InitiateAuthCommand, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { z } from "zod";
import { awsSessionCookieName, maxAwsSessionChunks, sealAwsSession, splitAwsSession } from "@/lib/auth/aws-session";
import { cognitoClient, cognitoClientId, cognitoErrorName, hasCognitoError, normalizeCognitoEmail, resendCognitoConfirmation } from "@/lib/auth/cognito-bff";
import { clearPendingVerification, getPendingVerification, maskEmail, safeReturnTo, setPendingVerification } from "@/lib/auth/verification-state";
import { checkRateLimit } from "@/lib/security/rate-limit";

const input = z.object({
  action: z.enum(["login", "signup", "confirm", "resend", "forgot", "reset", "logout"]),
  email: z.string().email().optional(),
  password: z.string().min(10).max(256).optional(),
  name: z.string().trim().min(2).max(80).optional(),
  code: z.string().regex(/^\d{6}$/).optional(),
  returnTo: z.string().max(512).optional()
});

const maxRequestBytes = 8_192;

function requestId() {
  return crypto.randomUUID();
}

function reply(requestIdValue: string, body: Record<string, unknown>, status = 200) {
  return NextResponse.json({ ...body, requestId: requestIdValue }, { status });
}

const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/"
};

function setSessionCookies(response: NextResponse, value: string, maxAge: number) {
  const chunks = splitAwsSession(value);
  for (let index = 0; index < maxAwsSessionChunks; index += 1) {
    const name = awsSessionCookieName(index);
    if (index < chunks.length) {
      response.cookies.set(name, chunks[index], { ...sessionCookieOptions, maxAge });
    } else {
      response.cookies.set(name, "", { ...sessionCookieOptions, maxAge: 0, expires: new Date(0) });
    }
  }
}

function clearSessionCookies(response: NextResponse) {
  for (let index = 0; index < maxAwsSessionChunks; index += 1) {
    response.cookies.set(awsSessionCookieName(index), "", { ...sessionCookieOptions, maxAge: 0, expires: new Date(0) });
  }
}

function bad(requestIdValue: string, message: string, status = 400, flow?: string) {
  return reply(requestIdValue, { ok: false, message, ...(flow ? { flow } : {}) }, status);
}

function isAllowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

function sourceKey(request: Request, email: string) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  return `${ip}:${email}`;
}

async function applyRateLimit(request: Request, action: string, email: string, id: string) {
  const rate = await checkRateLimit({ key: sourceKey(request, email), action, limit: 3, windowMs: 60_000, area: "customer_auth" });
  if (rate.allowed) return null;
  const retryAfter = Math.max(1, Math.ceil((rate.resetAt - Date.now()) / 1000));
  return NextResponse.json({ ok: false, message: "Please wait a moment before trying again.", requestId: id, retryAfter }, { status: 429, headers: { "retry-after": String(retryAfter) } });
}

async function beginVerification(email: string, returnTo?: string) {
  const state = await setPendingVerification(email, returnTo);
  return { status: "verification_required", delivery: "email", maskedDestination: maskEmail(state.email), returnTo: state.returnTo };
}

export async function POST(request: Request) {
  const id = requestId();
  if (!isAllowedOrigin(request)) return bad(id, "This request was blocked for your protection.", 403);
  if (Number(request.headers.get("content-length") || 0) > maxRequestBytes) return bad(id, "This request is too large.", 413);
  const parsed = input.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return bad(id, "Please check the information and try again.");
  const body = parsed.data;
  const appClientId = cognitoClientId();
  if (body.action !== "logout" && !appClientId) return bad(id, "Account authentication is not configured.", 503);
  const email = body.email ? normalizeCognitoEmail(body.email) : undefined;

  try {
    if (body.action === "logout") {
      const response = reply(id, { ok: true });
      clearSessionCookies(response);
      return response;
    }

    if (body.action === "signup") {
      if (!email || !body.password) return bad(id, "Email and password are required.");
      const rateBlocked = await applyRateLimit(request, "customer_signup", email, id);
      if (rateBlocked) return rateBlocked;
      try {
        const result = await cognitoClient.send(new SignUpCommand({
          ClientId: appClientId,
          Username: email,
          Password: body.password,
          UserAttributes: body.name ? [{ Name: "name", Value: body.name }] : undefined
        }));
        return reply(id, { ok: true, ...await beginVerification(email, body.returnTo), ...(result.CodeDeliveryDetails ? { delivery: "email" } : {}) });
      } catch (error) {
        if (!hasCognitoError(error, "UsernameExists")) throw error;
        try {
          await resendCognitoConfirmation(email, appClientId);
          return reply(id, { ok: true, resumed: true, ...await beginVerification(email, body.returnTo) });
        } catch (resendError) {
          if (hasCognitoError(resendError, "InvalidParameter") || hasCognitoError(resendError, "NotAuthorized")) {
            return bad(id, "An account already exists with this email. Sign in or reset your password.", 409, "account_exists");
          }
          throw resendError;
        }
      }
    }

    if (body.action === "confirm") {
      const pending = await getPendingVerification();
      const confirmationEmail = email || pending?.email;
      if (!confirmationEmail || !body.code) return bad(id, "Enter the six-digit code we sent to your email.");
      const rateBlocked = await applyRateLimit(request, "customer_confirm", confirmationEmail, id);
      if (rateBlocked) return rateBlocked;
      await cognitoClient.send(new ConfirmSignUpCommand({ ClientId: appClientId, Username: confirmationEmail, ConfirmationCode: body.code }));
      const returnTo = safeReturnTo(body.returnTo || pending?.returnTo);
      await clearPendingVerification();
      return reply(id, { ok: true, returnTo });
    }

    if (body.action === "resend") {
      const pending = await getPendingVerification();
      const confirmationEmail = email || pending?.email;
      if (!confirmationEmail) return bad(id, "Enter your email address to receive a new code.");
      const rateBlocked = await applyRateLimit(request, "customer_resend_confirmation", confirmationEmail, id);
      if (rateBlocked) return rateBlocked;
      await resendCognitoConfirmation(confirmationEmail, appClientId);
      return reply(id, { ok: true, ...await beginVerification(confirmationEmail, body.returnTo || pending?.returnTo) });
    }

    if (body.action === "forgot") {
      if (!email) return bad(id, "Email is required.");
      const rateBlocked = await applyRateLimit(request, "customer_forgot_password", email, id);
      if (rateBlocked) return rateBlocked;
      await cognitoClient.send(new ForgotPasswordCommand({ ClientId: appClientId, Username: email }));
      return reply(id, { ok: true });
    }

    if (body.action === "reset") {
      if (!email || !body.password || !body.code) return bad(id, "Email, code, and password are required.");
      const rateBlocked = await applyRateLimit(request, "customer_reset_password", email, id);
      if (rateBlocked) return rateBlocked;
      await cognitoClient.send(new ConfirmForgotPasswordCommand({ ClientId: appClientId, Username: email, ConfirmationCode: body.code, Password: body.password }));
      return reply(id, { ok: true });
    }

    if (!email || !body.password) return bad(id, "Email and password are required.");
    const rateBlocked = await applyRateLimit(request, "customer_login", email, id);
    if (rateBlocked) return rateBlocked;
    const result = await cognitoClient.send(new InitiateAuthCommand({ ClientId: appClientId, AuthFlow: "USER_PASSWORD_AUTH", AuthParameters: { USERNAME: email, PASSWORD: body.password } }));
    const auth = result.AuthenticationResult;
    if (!auth?.AccessToken) return bad(id, "Additional verification is required.", 401);
    const user = await cognitoClient.send(new GetUserCommand({ AccessToken: auth.AccessToken }));
    const attributes = Object.fromEntries((user.UserAttributes || []).flatMap((attribute) => attribute.Name && attribute.Value ? [[attribute.Name, attribute.Value]] : []));
    const customerEmail = attributes.email || email;
    const name = attributes.name || customerEmail.split("@")[0] || "Customer";
    const response = reply(id, { ok: true, email: customerEmail, name, returnTo: safeReturnTo(body.returnTo) });
    setSessionCookies(response, sealAwsSession({ accessToken: auth.AccessToken, idToken: auth.IdToken, refreshToken: auth.RefreshToken, sub: attributes.sub, email: customerEmail, name, expiresAt: Math.floor(Date.now() / 1000) + (auth.ExpiresIn || 900) }), auth.ExpiresIn || 900);
    return response;
  } catch (error) {
    const name = cognitoErrorName(error);
    if (name.includes("UserNotConfirmed") && email) {
      const verification = await beginVerification(email, body.returnTo);
      return reply(id, { ok: false, flow: "verification_required", message: "Your email is not verified yet. Enter your code or ask us to send a new one.", ...verification }, 409);
    }
    if (name.includes("PasswordResetRequired") || name.includes("ResetRequired")) return bad(id, "Your password needs to be reset before you can sign in.", 409, "password_reset_required");
    if (name.includes("NotAuthorized") || name.includes("UserNotFound")) return bad(id, "Invalid email or password.", 401);
    if (name.includes("CodeMismatch") || name.includes("ExpiredCode")) return bad(id, "That verification code is invalid or expired. Request a new code and try again.");
    if (name.includes("LimitExceeded") || name.includes("TooManyRequests")) return bad(id, "Too many attempts. Please try again shortly.", 429);
    if (name.includes("UserNotFound") || name.includes("InvalidParameter") || name.includes("CodeDeliveryFailure")) return bad(id, "We couldn't send a code right now. Please try again shortly.", 503);
    console.error("[cognito-auth-error]", { requestId: id, code: name });
    return bad(id, "Authentication is temporarily unavailable.", 503);
  }
}
