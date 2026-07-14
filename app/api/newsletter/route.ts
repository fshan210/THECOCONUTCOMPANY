import { NextResponse } from "next/server";
import { newsletterSubscriptionSchema } from "@dotco/contracts";

const timeoutMs = 8_000;

export async function POST(request: Request) {
  const parsed = newsletterSubscriptionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Please enter a valid email and confirm your consent." }, { status: 400 });
  }

  const baseUrl = process.env.SERVER_API_BASE_URL;
  if (!baseUrl) {
    return NextResponse.json({ ok: false, message: "Newsletter signup is temporarily unavailable." }, { status: 503 });
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
      return NextResponse.json({ ok: false, message: "We couldn't save your subscription right now." }, { status: response.status >= 500 ? 503 : 400 });
    }
    return NextResponse.json({ ok: true, status: payload?.data?.status === "already_subscribed" ? "already_subscribed" : "subscribed" });
  } catch {
    return NextResponse.json({ ok: false, message: "We couldn't save your subscription right now." }, { status: 503 });
  }
}
