export type AnalyticsEventName =
  | "account_view"
  | "add_to_cart"
  | "auth_login"
  | "auth_logout"
  | "auth_signup"
  | "auth_verify"
  | "community_interaction"
  | "cta_click"
  | "download"
  | "error_view"
  | "contact_submit"
  | "distributor_inquiry_submit"
  | "journal_view"
  | "newsletter_submit"
  | "outbound_click"
  | "performance_metric"
  | "product_interest_click"
  | "recipe_view"
  | "remove_from_cart"
  | "search"
  | "scroll_depth"
  | "waitlist_submit"
  | "wishlist_add"
  | "wishlist_remove";

type AnalyticsEventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: AnalyticsEventName, params: AnalyticsEventParams = {}) {
  if (typeof window === "undefined") return;

  window.gtag?.("event", name, params);

  if (process.env.NEXT_PUBLIC_GTM_ID) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...params });
  }

  if (window.clarity) {
    window.clarity("event", name);
  }
}

export function trackContactSubmission(status: "success" | "error") {
  trackEvent("contact_submit", { status });
}

export function trackDistributorInquiry(status: "success" | "error") {
  trackEvent("distributor_inquiry_submit", { status });
}

export function trackNewsletterSignup(status: "success" | "error") {
  trackEvent("newsletter_submit", { status });
}

export function trackProductInteraction(product: string, action = "view") {
  trackEvent("product_interest_click", { product, action });
}

export function trackAuthEvent(action: "login" | "logout" | "signup" | "verify", status: "attempt" | "success" | "error") {
  trackEvent(`auth_${action}` as AnalyticsEventName, { status });
}
