import { savedContentItemSchema } from "@dotco/contracts";
import { customerAwsApi, type SavedContentRecord } from "@/lib/customer/aws-api";
import { isSameOriginMutation, privateJson, readBoundedJson } from "@/lib/security/http";

export const dynamic = "force-dynamic";

function failure(status: number, message?: string) {
  const fallback = status === 401 ? "Sign in again to update saved items." : status === 409 ? "Your saved items changed elsewhere. Refresh and try again." : status === 429 ? "Too many saved-item changes. Please wait a moment." : "Your saved items could not be updated. Please try again.";
  return privateJson({ error: { message: message ?? fallback } }, { status });
}

function reply(result: { ok: boolean; status: number; data: SavedContentRecord | null }) {
  return result.ok ? privateJson({ data: result.data }, { status: result.status }) : failure(result.status);
}

export async function GET() {
  return reply(await customerAwsApi<SavedContentRecord>("v1/wishlist"));
}

export async function POST(request: Request) {
  if (!isSameOriginMutation(request)) return failure(403, "Origin not allowed.");
  const body = await readBoundedJson(request);
  const parsed = savedContentItemSchema.safeParse(body.ok ? body.value : null);
  if (!body.ok) return failure(body.status, body.message);
  if (!parsed.success) return failure(400, "Invalid saved item.");
  const { idempotencyKey: requestedKey, ...item } = parsed.data;
  const idempotencyKey = requestedKey ?? crypto.randomUUID();
  const result = await customerAwsApi<SavedContentRecord>("v1/saved", { method: "POST", body: JSON.stringify(item), headers: { "idempotency-key": idempotencyKey } });
  return reply(result);
}

export async function DELETE(request: Request) {
  if (!isSameOriginMutation(request)) return failure(403, "Origin not allowed.");
  const body = await readBoundedJson(request);
  const parsed = savedContentItemSchema.safeParse(body.ok ? body.value : null);
  if (!body.ok) return failure(body.status, body.message);
  if (!parsed.success) return failure(400, "Invalid saved item.");
  const idempotencyKey = parsed.data.idempotencyKey ?? crypto.randomUUID();
  const result = await customerAwsApi<SavedContentRecord>(`v1/saved/${parsed.data.kind}/${encodeURIComponent(parsed.data.itemId)}?idempotencyKey=${encodeURIComponent(idempotencyKey)}`, { method: "DELETE", headers: { "idempotency-key": idempotencyKey } });
  return reply(result);
}
