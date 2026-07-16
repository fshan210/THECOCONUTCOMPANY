import { NextResponse } from "next/server";
import { savedContentItemSchema } from "@dotco/contracts";
import { customerAwsApi, type SavedContentRecord } from "@/lib/customer/aws-api";

export const dynamic = "force-dynamic";

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  return origin === new URL(request.url).origin;
}

export async function GET() {
  const result = await customerAwsApi<SavedContentRecord>("v1/wishlist");
  return NextResponse.json({ data: result.data }, { status: result.status });
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Origin not allowed." }, { status: 403 });
  const parsed = savedContentItemSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid saved item." }, { status: 400 });
  const result = await customerAwsApi<SavedContentRecord>("v1/saved", { method: "POST", body: JSON.stringify(parsed.data) });
  return NextResponse.json({ data: result.data }, { status: result.status });
}

export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Origin not allowed." }, { status: 403 });
  const parsed = savedContentItemSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid saved item." }, { status: 400 });
  const result = await customerAwsApi<SavedContentRecord>(`v1/saved/${parsed.data.kind}/${encodeURIComponent(parsed.data.itemId)}`, { method: "DELETE" });
  return NextResponse.json({ data: result.data }, { status: result.status });
}
