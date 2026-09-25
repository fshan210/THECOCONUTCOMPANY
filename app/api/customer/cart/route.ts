import { cartAddInputSchema, cartMergeInputSchema, cartMutationInputSchema } from "@dotco/contracts";
import { customerAwsApi, type CustomerApiTiming } from "@/lib/customer/aws-api";
import { isSameOriginMutation, privateJson, privateServerTiming, readBoundedJson } from "@/lib/security/http";

export const dynamic = "force-dynamic";

function errorMessage(status: number) {
  if (status === 401) return "Sign in again to update your cart.";
  if (status === 404) return "That product is no longer available.";
  if (status === 409) return "Your cart changed elsewhere. Refresh and try again.";
  if (status === 422) return "That cart change is not available.";
  if (status === 429) return "Too many cart changes. Please wait a moment.";
  return "Your cart could not be updated. Please try again.";
}

function reply(result: { ok: boolean; status: number; data: unknown; timing: CustomerApiTiming }, started: number) {
  const init = { status: result.status, headers: privateServerTiming(result.timing, started) };
  if (!result.ok) return privateJson({ error: { message: errorMessage(result.status) } }, init);
  return privateJson({ data: result.data }, init);
}

export async function GET() {
  const started = performance.now();
  return reply(await customerAwsApi("v1/cart"), started);
}

export async function POST(request: Request) {
  const started = performance.now();
  if (!isSameOriginMutation(request)) return privateJson({ error: { message: "Origin not allowed." } }, { status: 403 });
  const body = await readBoundedJson(request);
  const parsed = cartAddInputSchema.safeParse(body.ok ? body.value : null);
  if (!body.ok || !parsed.success) return privateJson({ error: { message: body.ok ? "Invalid cart item." : body.message } }, { status: body.ok ? 400 : body.status });
  return reply(await customerAwsApi("v1/cart/items", { method: "POST", body: JSON.stringify(parsed.data), headers: { "idempotency-key": parsed.data.idempotencyKey } }), started);
}

export async function PUT(request: Request) {
  const started = performance.now();
  if (!isSameOriginMutation(request)) return privateJson({ error: { message: "Origin not allowed." } }, { status: 403 });
  const body = await readBoundedJson(request, 32_768);
  const parsed = cartMergeInputSchema.safeParse(body.ok ? body.value : null);
  if (!body.ok || !parsed.success) return privateJson({ error: { message: body.ok ? "Invalid cart merge." : body.message } }, { status: body.ok ? 400 : body.status });
  return reply(await customerAwsApi("v1/cart/merge", { method: "POST", body: JSON.stringify(parsed.data), headers: { "idempotency-key": parsed.data.idempotencyKey } }), started);
}

export async function DELETE(request: Request) {
  const started = performance.now();
  if (!isSameOriginMutation(request)) return privateJson({ error: { message: "Origin not allowed." } }, { status: 403 });
  const body = await readBoundedJson(request);
  const parsed = cartMutationInputSchema.safeParse(body.ok ? body.value : null);
  if (!body.ok || !parsed.success) return privateJson({ error: { message: body.ok ? "Invalid cart mutation." : body.message } }, { status: body.ok ? 400 : body.status });
  return reply(await customerAwsApi("v1/cart", { method: "DELETE", body: JSON.stringify(parsed.data), headers: { "idempotency-key": parsed.data.idempotencyKey } }), started);
}
