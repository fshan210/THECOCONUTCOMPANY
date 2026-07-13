import { NextResponse } from "next/server";
import { z } from "zod";
import { cognitoErrorName, normalizeCognitoEmail, resendCognitoConfirmation } from "@/lib/auth/cognito-bff";
import { maskEmail, setPendingVerification } from "@/lib/auth/verification-state";
import { checkRateLimit } from "@/lib/security/rate-limit";

const input = z.object({ email: z.string().email(), returnTo: z.string().max(512).optional() });

function allowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try { return new URL(origin).host === request.headers.get("host"); } catch { return false; }
}

function sourceKey(request: Request, email: string) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  return `${ip}:${email}`;
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  if (!allowedOrigin(request)) return NextResponse.json({ ok: false, message: "This request was blocked for your protection.", requestId }, { status: 403 });
  if (Number(request.headers.get("content-length") || 0) > 8_192) return NextResponse.json({ ok: false, message: "This request is too large.", requestId }, { status: 413 });
  const parsed = input.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Enter a valid email address.", requestId }, { status: 400 });
  const email = normalizeCognitoEmail(parsed.data.email);
  const rate = await checkRateLimit({ key: sourceKey(request, email), action: "customer_resend_confirmation", limit: 3, windowMs: 60_000, area: "customer_auth" });
  if (!rate.allowed) {
    const retryAfter = Math.max(1, Math.ceil((rate.resetAt - Date.now()) / 1000));
    return NextResponse.json({ ok: false, message: "Please wait a moment before trying again.", requestId, retryAfter }, { status: 429, headers: { "retry-after": String(retryAfter) } });
  }
  try {
    await resendCognitoConfirmation(email);
    const state = await setPendingVerification(email, parsed.data.returnTo);
    return NextResponse.json({ ok: true, data: { delivery: "email", maskedDestination: maskEmail(state.email) }, requestId });
  } catch (error) {
    const code = cognitoErrorName(error);
    if (code.includes("LimitExceeded") || code.includes("TooManyRequests")) return NextResponse.json({ ok: false, message: "Please wait a moment before requesting another code.", requestId }, { status: 429 });
    if (code.includes("InvalidParameter") || code.includes("NotAuthorized") || code.includes("UserNotFound")) return NextResponse.json({ ok: false, message: "We couldn't send a code right now. Check the address or try again shortly.", requestId }, { status: 400 });
    if (code.includes("CodeDeliveryFailure")) return NextResponse.json({ ok: false, message: "We couldn't deliver a code right now. Please try again shortly.", requestId }, { status: 503 });
    console.error("[cognito-resend-error]", { requestId, code });
    return NextResponse.json({ ok: false, message: "We couldn't send a code right now. Please try again shortly.", requestId }, { status: 503 });
  }
}
