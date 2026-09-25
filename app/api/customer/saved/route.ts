import { savedContentItemSchema } from "@dotco/contracts";
import { customerAwsApi, type CustomerApiTiming, type SavedContentRecord } from "@/lib/customer/aws-api";
import { isSameOriginMutation, privateJson, privateServerTiming, readBoundedJson, recordPrivateBffTiming } from "@/lib/security/http";

export const dynamic = "force-dynamic";

function failure(status: number, message?: string, headers?: HeadersInit) {
  const fallback = status === 401 ? "Sign in again to update saved items." : status === 409 ? "Your saved items changed elsewhere. Refresh and try again." : status === 429 ? "Too many saved-item changes. Please wait a moment." : "Your saved items could not be updated. Please try again.";
  return privateJson({ error: { message: message ?? fallback } }, { status, headers });
}

function reply(result: { ok: boolean; status: number; data: SavedContentRecord | null; timing: CustomerApiTiming }, started: number, method: string) {
  const headers = privateServerTiming(result.timing, started);
  if (!result.ok) return failure(result.status, undefined, headers);
  const body = { data: result.data };
  const response = privateJson(body, { status: result.status, headers });
  recordPrivateBffTiming("saved", method, result.status, started, result.timing, body);
  return response;
}

export async function GET() {
  const started = performance.now();
  return reply(await customerAwsApi<SavedContentRecord>("v1/wishlist"), started, "GET");
}

export async function POST(request: Request) {
  const started = performance.now();
  if (!isSameOriginMutation(request)) return failure(403, "Origin not allowed.");
  const body = await readBoundedJson(request);
  const parsed = savedContentItemSchema.safeParse(body.ok ? body.value : null);
  if (!body.ok) return failure(body.status, body.message);
  if (!parsed.success) return failure(400, "Invalid saved item.");
  const { idempotencyKey: requestedKey, ...item } = parsed.data;
  const idempotencyKey = requestedKey ?? crypto.randomUUID();
  const result = await customerAwsApi<SavedContentRecord>("v1/saved", { method: "POST", body: JSON.stringify(item), headers: { "idempotency-key": idempotencyKey } });
  return reply(result, started, "POST");
}

export async function DELETE(request: Request) {
  const started = performance.now();
  if (!isSameOriginMutation(request)) return failure(403, "Origin not allowed.");
  const body = await readBoundedJson(request);
  const parsed = savedContentItemSchema.safeParse(body.ok ? body.value : null);
  if (!body.ok) return failure(body.status, body.message);
  if (!parsed.success) return failure(400, "Invalid saved item.");
  const idempotencyKey = parsed.data.idempotencyKey ?? crypto.randomUUID();
  const result = await customerAwsApi<SavedContentRecord>(`v1/saved/${parsed.data.kind}/${encodeURIComponent(parsed.data.itemId)}?idempotencyKey=${encodeURIComponent(idempotencyKey)}`, { method: "DELETE", headers: { "idempotency-key": idempotencyKey } });
  return reply(result, started, "DELETE");
}
