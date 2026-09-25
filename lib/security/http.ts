import "server-only";

import { NextResponse } from "next/server";
import { privateNoStoreHeaders } from "@/lib/security/request-integrity";
import type { CustomerApiTiming } from "@/lib/customer/aws-api";
export { isSameOriginMutation, readBoundedJson } from "@/lib/security/request-integrity";

export function privateJson(body: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  for (const [key, value] of Object.entries(privateNoStoreHeaders)) headers.set(key, value);
  return NextResponse.json(body, { ...init, headers });
}

export function privateServerTiming(timing: CustomerApiTiming, started: number): Record<string, string> | undefined {
  if (process.env.VERCEL_ENV !== "preview" && process.env.NODE_ENV !== "development") return undefined;
  const duration = (value: number) => Math.max(0, value).toFixed(1);
  return { "server-timing": `auth;dur=${duration(timing.auth)}, upstream;dur=${duration(timing.upstream)}, total;dur=${duration(performance.now() - started)}` };
}
