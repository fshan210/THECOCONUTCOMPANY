export type AnalyticsEventName =
  | "cta_click"
  | "contact_submission"
  | "distributor_inquiry"
  | "newsletter_signup"
  | "product_interaction"
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
  trackEvent("contact_submission", { status });
}

export function trackDistributorInquiry(status: "success" | "error") {
  trackEvent("distributor_inquiry", { status });
}

export function trackNewsletterSignup(status: "success" | "error") {
  trackEvent("newsletter_signup", { status });
}

export function trackProductInteraction(product: string, action = "view") {
  trackEvent("product_interaction", { product, action });
}
