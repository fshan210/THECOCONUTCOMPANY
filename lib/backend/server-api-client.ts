import "server-only";

import type { ApiEnvelope } from "@/lib/backend/api-client";

const baseUrl = process.env.SERVER_API_BASE_URL || process.env.NEXT_PUBLIC_DOTCO_API_BASE_URL;

export function isServerApiConfigured() {
  return Boolean(baseUrl);
}

export async function serverApiGet<T>(path: string): Promise<T> {
  if (!baseUrl) throw new Error("DEV API is not configured.");
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
    headers: { accept: "application/json" },
    cache: "no-store"
  });
  const payload = await response.json() as ApiEnvelope<T> | { error?: { message?: string } };
  if (!response.ok || !("data" in payload)) throw new Error("DEV API read failed.");
  return payload.data;
}
