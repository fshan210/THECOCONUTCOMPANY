import { NextResponse } from "next/server";
import { cartAddInputSchema, cartMergeInputSchema, cartMutationInputSchema } from "@dotco/contracts";
import { customerAwsApi } from "@/lib/customer/aws-api";

export const dynamic = "force-dynamic";

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}
function errorMessage(status: number) {
  if (status === 401) return "Sign in again to update your cart.";
  if (status === 404) return "That product is no longer available.";
  if (status === 409) return "Your cart changed elsewhere. Refresh and try again.";
  if (status === 422) return "That cart change is not available.";
  if (status === 429) return "Too many cart changes. Please wait a moment.";
  return "Your cart could not be updated. Please try again.";
}

function reply(result: { ok: boolean; status: number; data: unknown }) {
  if (!result.ok) return NextResponse.json({ error: { message: errorMessage(result.status) } }, { status: result.status });
  return NextResponse.json({ data: result.data }, { status: result.status });
}

export async function GET() {
  return reply(await customerAwsApi("v1/cart"));
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: { message: "Origin not allowed." } }, { status: 403 });
  const parsed = cartAddInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: { message: "Invalid cart item." } }, { status: 400 });
  return reply(await customerAwsApi("v1/cart/items", { method: "POST", body: JSON.stringify(parsed.data), headers: { "idempotency-key": parsed.data.idempotencyKey } }));
}

export async function PUT(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: { message: "Origin not allowed." } }, { status: 403 });
  const parsed = cartMergeInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: { message: "Invalid cart merge." } }, { status: 400 });
  return reply(await customerAwsApi("v1/cart/merge", { method: "POST", body: JSON.stringify(parsed.data), headers: { "idempotency-key": parsed.data.idempotencyKey } }));
}

export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: { message: "Origin not allowed." } }, { status: 403 });
  const parsed = cartMutationInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: { message: "Invalid cart mutation." } }, { status: 400 });
  return reply(await customerAwsApi("v1/cart", { method: "DELETE", body: JSON.stringify(parsed.data), headers: { "idempotency-key": parsed.data.idempotencyKey } }));
}
