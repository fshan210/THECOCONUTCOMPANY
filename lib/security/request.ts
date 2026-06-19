import "server-only";

import { headers } from "next/headers";

export async function getRequestContext() {
  const headerStore = await headers();
  const forwardedFor = headerStore.get("x-forwarded-for");
  const ipAddress = forwardedFor?.split(",")[0]?.trim() || headerStore.get("x-real-ip") || "unknown";
  return {
    ipAddress,
    userAgent: headerStore.get("user-agent") || "unknown"
  };
}

export function sanitizeLogValue(value: unknown): unknown {
  if (!value || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(sanitizeLogValue);

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([key]) => !/(password|secret|token|key|credential|csrf)/i.test(key))
      .map(([key, entry]) => [key, sanitizeLogValue(entry)])
  );
}
