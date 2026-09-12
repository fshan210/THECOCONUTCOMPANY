import { NextResponse } from "next/server";
import { savedContentItemSchema } from "@dotco/contracts";
import { customerAwsApi, type SavedContentRecord } from "@/lib/customer/aws-api";

export const dynamic = "force-dynamic";

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  return origin === new URL(request.url).origin;
}

function failure(status: number, message?: string) {
  const fallback = status === 401 ? "Sign in again to update saved items." : status === 409 ? "Your saved items changed elsewhere. Refresh and try again." : status === 429 ? "Too many saved-item changes. Please wait a moment." : "Your saved items could not be updated. Please try again.";
  return NextResponse.json({ error: { message: message ?? fallback } }, { status });
}

function reply(result: { ok: boolean; status: number; data: SavedContentRecord | null }) {
  return result.ok ? NextResponse.json({ data: result.data }, { status: result.status }) : failure(result.status);
}

export async function GET() {
  return reply(await customerAwsApi<SavedContentRecord>("v1/wishlist"));
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return failure(403, "Origin not allowed.");
  const parsed = savedContentItemSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return failure(400, "Invalid saved item.");
  const body = { ...parsed.data, idempotencyKey: parsed.data.idempotencyKey ?? crypto.randomUUID() };
  const result = await customerAwsApi<SavedContentRecord>("v1/saved", { method: "POST", body: JSON.stringify(body), headers: { "idempotency-key": body.idempotencyKey } });
  return reply(result);
}

export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) return failure(403, "Origin not allowed.");
  const parsed = savedContentItemSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return failure(400, "Invalid saved item.");
  const idempotencyKey = parsed.data.idempotencyKey ?? crypto.randomUUID();
  const result = await customerAwsApi<SavedContentRecord>(`v1/saved/${parsed.data.kind}/${encodeURIComponent(parsed.data.itemId)}?idempotencyKey=${encodeURIComponent(idempotencyKey)}`, { method: "DELETE", headers: { "idempotency-key": idempotencyKey } });
  return reply(result);
}
