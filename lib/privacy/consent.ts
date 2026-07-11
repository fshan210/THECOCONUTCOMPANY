export const CONSENT_STORAGE_KEY = "co_cookie_consent_v1";
export const CONSENT_EVENT = "co:consent-updated";
export const OPEN_CONSENT_EVENT = "co:open-cookie-preferences";

export type CookieConsent = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

export function readCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value ? (JSON.parse(value) as CookieConsent) : null;
  } catch {
    return null;
  }
}

export function saveCookieConsent(preferences: Pick<CookieConsent, "analytics" | "marketing">) {
  const consent: CookieConsent = {
    essential: true,
    analytics: preferences.analytics,
    marketing: preferences.marketing,
    updatedAt: new Date().toISOString()
  };
  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
  document.cookie = `co_cookie_consent=${preferences.analytics ? "analytics" : "essential"}; Max-Age=31536000; Path=/; SameSite=Lax; Secure`;
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: consent }));
  return consent;
}
