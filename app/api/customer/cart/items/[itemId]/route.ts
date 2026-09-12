import { NextResponse } from "next/server";
import { cartItemIdParamSchema, cartMutationInputSchema, cartQuantityInputSchema } from "@dotco/contracts";
import { customerAwsApi } from "@/lib/customer/aws-api";

export const dynamic = "force-dynamic";

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}
function failure(status: number) {
  const message = status === 401 ? "Sign in again to update your cart." : status === 404 ? "That cart item no longer exists." : status === 409 ? "Your cart changed elsewhere. Refresh and try again." : "Your cart could not be updated. Please try again.";
  return NextResponse.json({ error: { message } }, { status });
}

async function itemId(context: { params: Promise<{ itemId: string }> }) {
  return cartItemIdParamSchema.safeParse(await context.params);
}

export async function PATCH(request: Request, context: { params: Promise<{ itemId: string }> }) {
  if (!isSameOrigin(request)) return failure(403);
  const [params, body] = await Promise.all([itemId(context), request.json().catch(() => null)]);
  const parsed = cartQuantityInputSchema.safeParse(body);
  if (!params.success || !parsed.success) return failure(400);
  const result = await customerAwsApi(`v1/cart/items/${encodeURIComponent(params.data.itemId)}`, { method: "PATCH", body: JSON.stringify(parsed.data), headers: { "idempotency-key": parsed.data.idempotencyKey } });
  if (!result.ok) return failure(result.status);
  return NextResponse.json({ data: result.data }, { status: result.status });
}

export async function DELETE(request: Request, context: { params: Promise<{ itemId: string }> }) {
  if (!isSameOrigin(request)) return failure(403);
  const [params, body] = await Promise.all([itemId(context), request.json().catch(() => null)]);
  const parsed = cartMutationInputSchema.safeParse(body);
  if (!params.success || !parsed.success) return failure(400);
  const result = await customerAwsApi(`v1/cart/items/${encodeURIComponent(params.data.itemId)}`, { method: "DELETE", body: JSON.stringify(parsed.data), headers: { "idempotency-key": parsed.data.idempotencyKey } });
  if (!result.ok) return failure(result.status);
  return NextResponse.json({ data: result.data }, { status: result.status });
}
