import "server-only";

import { cookies } from "next/headers";
import { awsSessionCookie, readAwsSession } from "@/lib/auth/aws-session";

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
  const cookieStore = await cookies();
  const session = readAwsSession(cookieStore);
  const baseUrl = process.env.SERVER_API_BASE_URL;
  if (!session?.accessToken || !baseUrl) return { ok: false as const, status: 401, data: null };

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
  const payload = await response.json().catch(() => null) as { data?: T } | null;
  return { ok: response.ok, status: response.status, data: payload?.data ?? null } as const;
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
  return cookies().then((store) => store.delete(awsSessionCookie));
}
