import "server-only";

import { NextResponse } from "next/server";
import { privateNoStoreHeaders } from "@/lib/security/request-integrity";
export { isSameOriginMutation, readBoundedJson } from "@/lib/security/request-integrity";

export function privateJson(body: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  for (const [key, value] of Object.entries(privateNoStoreHeaders)) headers.set(key, value);
  return NextResponse.json(body, { ...init, headers });
}
