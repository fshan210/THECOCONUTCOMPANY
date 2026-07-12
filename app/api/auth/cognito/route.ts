import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ConfirmForgotPasswordCommand, ConfirmSignUpCommand, ForgotPasswordCommand, GetUserCommand, InitiateAuthCommand, ResendConfirmationCodeCommand, SignUpCommand, CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { z } from "zod";
import { sealAwsSession } from "@/lib/auth/aws-session";
import { awsSessionCookie as cookieName } from "@/lib/auth/aws-cookie";

const client = new CognitoIdentityProviderClient({ region: process.env.DOTCO_AWS_REGION || "ap-south-1" });
const input = z.object({ action: z.enum(["login", "signup", "confirm", "resend", "forgot", "reset", "logout"]), email: z.string().email().optional(), password: z.string().min(8).optional(), name: z.string().min(2).max(80).optional(), code: z.string().length(6).optional(), clientId: z.string().optional(), refreshToken: z.string().optional() });

function clientId() { return process.env.COGNITO_APP_CLIENT_ID; }
function bad(message: string, status = 400) { return NextResponse.json({ ok: false, message }, { status }); }

function isAllowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) return bad("This request was blocked for your protection.", 403);
  const parsed = input.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return bad("Please check the information and try again.");
  const body = parsed.data;
  const id = body.clientId || clientId();
  if (body.action !== "logout" && !id) return bad("Account authentication is not configured.", 503);
  try {
    if (body.action === "logout") {
      const store = await cookies(); store.delete(cookieName); return NextResponse.json({ ok: true });
    }
    if (body.action === "signup") {
      if (!body.email || !body.password) return bad("Email and password are required.");
      await client.send(new SignUpCommand({ ClientId: id, Username: body.email, Password: body.password, UserAttributes: body.name ? [{ Name: "name", Value: body.name }] : undefined }));
      return NextResponse.json({ ok: true, status: "verification_required", email: body.email });
    }
    if (body.action === "confirm") {
      if (!body.email || !body.code) return bad("Email and verification code are required.");
      await client.send(new ConfirmSignUpCommand({ ClientId: id, Username: body.email, ConfirmationCode: body.code }));
      return NextResponse.json({ ok: true });
    }
    if (body.action === "resend") {
      if (!body.email) return bad("Email is required.");
      await client.send(new ResendConfirmationCodeCommand({ ClientId: id, Username: body.email }));
      return NextResponse.json({ ok: true });
    }
    if (body.action === "forgot") {
      if (!body.email) return bad("Email is required.");
      await client.send(new ForgotPasswordCommand({ ClientId: id, Username: body.email }));
      return NextResponse.json({ ok: true });
    }
    if (body.action === "reset") {
      if (!body.email || !body.password || !body.code) return bad("Email, code, and password are required.");
      await client.send(new ConfirmForgotPasswordCommand({ ClientId: id, Username: body.email, ConfirmationCode: body.code, Password: body.password }));
      return NextResponse.json({ ok: true });
    }
    if (!body.email || !body.password) return bad("Email and password are required.");
    const result = await client.send(new InitiateAuthCommand({ ClientId: id, AuthFlow: "USER_PASSWORD_AUTH", AuthParameters: { USERNAME: body.email, PASSWORD: body.password } }));
    const auth = result.AuthenticationResult;
    if (!auth?.AccessToken) return bad("Additional verification is required.", 401);
    const user = await client.send(new GetUserCommand({ AccessToken: auth.AccessToken }));
    const attributes = Object.fromEntries((user.UserAttributes || []).flatMap((attribute) => attribute.Name && attribute.Value ? [[attribute.Name, attribute.Value]] : []));
    const email = attributes.email || body.email;
    const name = attributes.name || email.split("@")[0] || "Customer";
    const store = await cookies();
    store.set(cookieName, sealAwsSession({ accessToken: auth.AccessToken, idToken: auth.IdToken, refreshToken: auth.RefreshToken, sub: attributes.sub, email, name, expiresAt: Math.floor(Date.now() / 1000) + (auth.ExpiresIn || 900) }), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: auth.ExpiresIn || 900 });
    return NextResponse.json({ ok: true, email, name });
  } catch (error) {
    const name = error instanceof Error ? error.name : "";
    if (name.includes("NotAuthorized") || name.includes("UserNotFound")) return bad("Invalid email or password.", 401);
    if (name.includes("UserNotConfirmed")) return bad("Please verify your email before signing in.", 403);
    if (name.includes("CodeMismatch") || name.includes("ExpiredCode")) return bad("That verification code is invalid or expired.");
    if (name.includes("LimitExceeded") || name.includes("TooManyRequests")) return bad("Too many attempts. Please try again shortly.", 429);
    if (name.includes("UsernameExists")) return bad("An account already exists for this email.", 409);
    console.error("[cognito-auth-error]", name);
    return bad("Authentication is temporarily unavailable.", 503);
  }
}
