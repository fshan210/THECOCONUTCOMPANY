import "server-only";

import { cookies } from "next/headers";
import { awsSessionCookieName, maxAwsSessionChunks, readAwsSession } from "@/lib/auth/aws-session";

export type CustomerApiTiming = { auth: number; upstream: number; total: number; responseBytes: number };

function timingClass(path: string) {
  if (/^v1\/cart(?:\/|$)/.test(path)) return "cart";
  if (/^v1\/(?:wishlist|saved)(?:\/|$)/.test(path)) return "saved";
  if (/^v1\/me\/addresses(?:\/|$)/.test(path)) return "addresses";
  if (/^v1\/me(?:\?|$)/.test(path)) return "profile";
  if (/^v1\/orders(?:\/|$)/.test(path)) return "orders";
  return "other";
}

function recordTiming(path: string, method: string, status: number, timing: CustomerApiTiming) {
  if (process.env.VERCEL_ENV !== "preview" && process.env.NODE_ENV !== "development") return;
  // Fixed route classes and durations only: never log paths, IDs, bodies, headers, or tokens.
  console.info("co-private-timing", JSON.stringify({
    route: timingClass(path), method, status,
    authMs: Math.round(timing.auth * 10) / 10,
    upstreamMs: Math.round(timing.upstream * 10) / 10,
    totalMs: Math.round(timing.total * 10) / 10,
    responseBytes: timing.responseBytes
  }));
}

export type SavedContentRecord = {
  productIds: string[];
  recipeIds: string[];
  journalIds: string[];
  communityIds: string[];
  recentlyViewedProductIds: string[];
  updatedAt?: string;
};

export type CustomerProfileRecord = {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  email?: string;
  phone?: string;
  preferredCategory?: string;
  newsletterOptIn?: boolean;
  marketingOptIn?: boolean;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
  };
};

export async function customerAwsApi<T>(path: string, init: RequestInit = {}) {
  const started = performance.now();
  const cookieStore = await cookies();
  const session = readAwsSession(cookieStore);
  const baseUrl = process.env.SERVER_API_BASE_URL;
  const auth = performance.now() - started;
  const method = init.method || "GET";
  if (!session?.accessToken || !baseUrl) {
    const status = session?.accessToken ? 503 : 401;
    const timing = { auth, upstream: 0, total: performance.now() - started, responseBytes: 0 };
    recordTiming(path, method, status, timing);
    return { ok: false as const, status, data: null, timing };
  }

  const upstreamStarted = performance.now();
  try {
    const response = await fetch(new URL(path.replace(/^\//, ""), `${baseUrl.replace(/\/?$/, "/")}`), {
      ...init,
      headers: {
        accept: "application/json",
        authorization: `Bearer ${session.accessToken}`,
        ...(init.body ? { "content-type": "application/json" } : {}),
        ...(init.headers || {})
      },
      cache: "no-store"
    });
    const body = await response.text();
    let payload: { data?: T } | null = null;
    try { payload = JSON.parse(body) as { data?: T }; } catch { /* Preserve the existing null fallback. */ }
    const timing = { auth, upstream: performance.now() - upstreamStarted, total: performance.now() - started, responseBytes: Buffer.byteLength(body) };
    recordTiming(path, method, response.status, timing);
    return { ok: response.ok, status: response.status, data: payload?.data ?? null, timing } as const;
  } catch {
    const timing = { auth, upstream: performance.now() - upstreamStarted, total: performance.now() - started, responseBytes: 0 };
    recordTiming(path, method, 503, timing);
    return { ok: false as const, status: 503, data: null, timing };
  }
}

export async function getCustomerSavedContent() {
  const result = await customerAwsApi<SavedContentRecord>("v1/wishlist");
  return result.data ?? { productIds: [], recipeIds: [], journalIds: [], communityIds: [], recentlyViewedProductIds: [] };
}

export async function getCustomerProfile() {
  const result = await customerAwsApi<{ profile: CustomerProfileRecord }>("v1/me");
  return result.data?.profile ?? null;
}

export function clearCustomerSessionCookie() {
  return cookies().then((store) => {
    for (let index = 0; index < maxAwsSessionChunks; index += 1) store.delete(awsSessionCookieName(index));
  });
}
