import type {
  NewsletterSubscriptionInput,
  OrderPreviewInput,
  ProductListQuery
} from "@dotco/contracts";

export type ApiEnvelope<T> = {
  data: T;
  meta?: Record<string, unknown>;
  requestId: string;
};

export type ApiErrorEnvelope = {
  error: {
    code: string;
    message: string;
    fields?: Record<string, string[]>;
  };
  requestId: string;
};

export class DotCoApiError extends Error {
  readonly code: string;
  readonly requestId: string;
  readonly fields?: Record<string, string[]>;

  constructor(error: ApiErrorEnvelope) {
    super(error.error.message);
    this.name = "DotCoApiError";
    this.code = error.error.code;
    this.requestId = error.requestId;
    this.fields = error.error.fields;
  }
}

const apiBaseUrl = process.env.NEXT_PUBLIC_DOTCO_API_BASE_URL;

function toQueryString(params: Record<string, unknown>) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") query.set(key, String(value));
  }
  const value = query.toString();
  return value ? `?${value}` : "";
}

async function dotcoFetch<T>(path: string, init: RequestInit = {}): Promise<ApiEnvelope<T>> {
  if (!apiBaseUrl) {
    throw new DotCoApiError({
      error: { code: "SERVICE_UNAVAILABLE", message: "The .CO API is not configured yet." },
      requestId: "local-not-configured"
    });
  }
  const response = await fetch(`${apiBaseUrl.replace(/\/$/, "")}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init.headers || {})
    },
    credentials: "include"
  });
  const payload = await response.json() as ApiEnvelope<T> | ApiErrorEnvelope;
  if (!response.ok || "error" in payload) throw new DotCoApiError(payload as ApiErrorEnvelope);
  return payload as ApiEnvelope<T>;
}

export const dotcoApi = {
  products: (query: Partial<ProductListQuery> = {}) => dotcoFetch(`/v1/products${toQueryString(query)}`),
  categories: () => dotcoFetch("/v1/categories"),
  newsletterSubscribe: (input: NewsletterSubscriptionInput) => dotcoFetch("/v1/newsletter/subscriptions", {
    method: "POST",
    body: JSON.stringify(input)
  }),
  orderPreview: (input: OrderPreviewInput) => dotcoFetch("/v1/orders/preview", {
    method: "POST",
    body: JSON.stringify(input)
  }),
  me: () => dotcoFetch("/v1/me")
};
