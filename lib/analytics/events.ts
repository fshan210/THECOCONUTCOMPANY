export type AnalyticsEventName =
  | "cta_click"
  | "contact_submit"
  | "distributor_inquiry_submit"
  | "newsletter_submit"
  | "product_interest_click"
  | "scroll_depth";

type AnalyticsEventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: AnalyticsEventName, params: AnalyticsEventParams = {}) {
  if (typeof window === "undefined") return;

  window.gtag?.("event", name, params);

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
