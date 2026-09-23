import { newsletterSubscriptionSchema } from "@dotco/contracts";
import { isSameOriginMutation, privateJson, readBoundedJson } from "@/lib/security/http";
import { checkRateLimit } from "@/lib/security/rate-limit";

const timeoutMs = 8_000;

export async function POST(request: Request) {
  if (!isSameOriginMutation(request)) return privateJson({ ok: false, message: "Origin not allowed." }, { status: 403 });
  const requestBody = await readBoundedJson(request);
  const parsed = newsletterSubscriptionSchema.safeParse(requestBody.ok ? requestBody.value : null);
  if (!parsed.success) {
    return privateJson({ ok: false, message: requestBody.ok ? "Please enter a valid email and confirm your consent." : requestBody.message }, { status: requestBody.ok ? 400 : requestBody.status });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  const rate = await checkRateLimit({ key: ip + ":" + parsed.data.email.toLowerCase(), action: "newsletter", limit: 6, windowMs: 15 * 60_000, area: "forms" });
  if (!rate.allowed) return privateJson({ ok: false, message: "Too many requests. Please wait a few minutes and try again." }, { status: 429 });

  const baseUrl = process.env.SERVER_API_BASE_URL;
  if (!baseUrl) {
    return privateJson({ ok: false, message: "Newsletter signup is temporarily unavailable." }, { status: 503 });
  }

  try {
    const response = await fetch(new URL("v1/newsletter/subscriptions", baseUrl), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(parsed.data),
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs)
    });
    const payload = await response.json().catch(() => null) as { data?: { status?: string } } | null;
    if (!response.ok) {
      return privateJson({ ok: false, message: "We couldn't save your subscription right now." }, { status: response.status >= 500 ? 503 : 400 });
    }
    return privateJson({ ok: true, status: payload?.data?.status === "already_subscribed" ? "already_subscribed" : "subscribed" });
  } catch {
    return privateJson({ ok: false, message: "We couldn't save your subscription right now." }, { status: 503 });
  }
}
