import { cartItemIdParamSchema, cartMutationInputSchema, cartQuantityInputSchema } from "@dotco/contracts";
import { customerAwsApi } from "@/lib/customer/aws-api";
import { isSameOriginMutation, privateJson, readBoundedJson } from "@/lib/security/http";

export const dynamic = "force-dynamic";

function failure(status: number) {
  const message = status === 401 ? "Sign in again to update your cart." : status === 404 ? "That cart item no longer exists." : status === 409 ? "Your cart changed elsewhere. Refresh and try again." : "Your cart could not be updated. Please try again.";
  return privateJson({ error: { message } }, { status });
}

async function itemId(context: { params: Promise<{ itemId: string }> }) {
  return cartItemIdParamSchema.safeParse(await context.params);
}

export async function PATCH(request: Request, context: { params: Promise<{ itemId: string }> }) {
  if (!isSameOriginMutation(request)) return failure(403);
  const [params, body] = await Promise.all([itemId(context), readBoundedJson(request)]);
  const parsed = cartQuantityInputSchema.safeParse(body.ok ? body.value : null);
  if (!body.ok) return failure(body.status);
  if (!params.success || !parsed.success) return failure(400);
  const result = await customerAwsApi(`v1/cart/items/${encodeURIComponent(params.data.itemId)}`, { method: "PATCH", body: JSON.stringify(parsed.data), headers: { "idempotency-key": parsed.data.idempotencyKey } });
  if (!result.ok) return failure(result.status);
  return privateJson({ data: result.data }, { status: result.status });
}

export async function DELETE(request: Request, context: { params: Promise<{ itemId: string }> }) {
  if (!isSameOriginMutation(request)) return failure(403);
  const [params, body] = await Promise.all([itemId(context), readBoundedJson(request)]);
  const parsed = cartMutationInputSchema.safeParse(body.ok ? body.value : null);
  if (!body.ok) return failure(body.status);
  if (!params.success || !parsed.success) return failure(400);
  const result = await customerAwsApi(`v1/cart/items/${encodeURIComponent(params.data.itemId)}`, { method: "DELETE", body: JSON.stringify(parsed.data), headers: { "idempotency-key": parsed.data.idempotencyKey } });
  if (!result.ok) return failure(result.status);
  return privateJson({ data: result.data }, { status: result.status });
}
