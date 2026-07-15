"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics/events";
import { CONSENT_EVENT, readCookieConsent, type CookieConsent } from "@/lib/privacy/consent";

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-CNXDJ3EMHQ";
const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
const googleTagManagerId = process.env.NEXT_PUBLIC_GTM_ID;
const isProduction = process.env.NODE_ENV === "production";

export function Analytics() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);

  useEffect(() => {
    const update = () => {
      const nextConsent = readCookieConsent();
      setConsent(nextConsent);
      if (nextConsent && typeof window.gtag === "function") {
        window.gtag("consent", "update", {
          analytics_storage: nextConsent.analytics ? "granted" : "denied",
          ad_storage: nextConsent.marketing ? "granted" : "denied",
          ad_user_data: nextConsent.marketing ? "granted" : "denied",
          ad_personalization: nextConsent.marketing ? "granted" : "denied"
        });
      }
    };
    update();
    window.addEventListener(CONSENT_EVENT, update);
    return () => window.removeEventListener(CONSENT_EVENT, update);
  }, []);

  if (!consent?.analytics) return null;

  return (
    <>
      <GoogleAnalytics marketing={consent.marketing} />
      <GoogleTagManager />
      <MicrosoftClarity />
      <AnalyticsEventListeners />
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  );
}

function GoogleAnalytics({ marketing }: { marketing: boolean }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!isProduction || !gaMeasurementId) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args);
    };
    if (!initialized.current) {
      window.gtag("js", new Date());
    }
    window.gtag("consent", "update", {
      analytics_storage: "granted",
      ad_storage: marketing ? "granted" : "denied",
      ad_user_data: marketing ? "granted" : "denied",
      ad_personalization: marketing ? "granted" : "denied"
    });
    if (!initialized.current) {
      window.gtag("config", gaMeasurementId, {
        page_path: window.location.pathname + window.location.search,
        page_location: window.location.href,
        page_title: document.title
      });
      initialized.current = true;
    }
  }, [marketing]);

  if (!isProduction || !gaMeasurementId) return null;

  return <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} strategy="afterInteractive" />;
}

function GoogleTagManager() {
  if (!isProduction || !googleTagManagerId) return null;
  return (
    <Script id="google-tag-manager" strategy="afterInteractive">
      {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${googleTagManagerId}');
      `}
    </Script>
  );
}

function MicrosoftClarity() {
  if (!isProduction || !clarityProjectId) return null;

  return (
    <Script id="microsoft-clarity" strategy="lazyOnload">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${clarityProjectId}");
      `}
    </Script>
  );
}

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isInitialPageView = useRef(true);

  useEffect(() => {
    if (isInitialPageView.current) {
      isInitialPageView.current = false;
      return;
    }

    if (!gaMeasurementId || typeof window.gtag === "undefined") return;

    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;

    window.gtag("event", "page_view", {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title
    });
  }, [pathname, searchParams]);

  return null;
}

function AnalyticsEventListeners() {
  const sentScrollDepths = useRef(new Set<number>());

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const analyticsTarget = target?.closest<HTMLElement>("[data-analytics]");
      const link = target?.closest<HTMLAnchorElement>("a[href]");

      if (analyticsTarget) {
        trackEvent((analyticsTarget.dataset.analytics as "cta_click") || "cta_click", {
          label: analyticsTarget.dataset.analyticsLabel,
          href: link?.href
        });
        return;
      }

      if (link) {
        const url = new URL(link.href, window.location.href);
        const isOutbound = url.origin !== window.location.origin;
        const isDownload = /\.(pdf|docx?|xlsx?|csv|zip)$/i.test(url.pathname) || link.hasAttribute("download");
        const eventName = isDownload ? "download" : isOutbound ? "outbound_click" : "cta_click";
        trackEvent(eventName, {
          label: link.textContent?.trim().slice(0, 80) || link.getAttribute("aria-label") || "link",
          href: link.href
        });
      }
    }

    function handleSubmit(event: SubmitEvent) {
      const form = event.target as HTMLFormElement | null;
      const formType = form?.dataset.analyticsForm;
      if (!formType) return;

      if (formType === "contact") trackEvent("contact_submit", { status: "attempt" });
      if (formType === "distributor") trackEvent("distributor_inquiry_submit", { status: "attempt" });
      if (formType === "newsletter") trackEvent("newsletter_submit", { status: "attempt" });
    }

    function handleScroll() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const depth = Math.round((window.scrollY / scrollable) * 100);
      for (const threshold of [25, 50, 75, 90]) {
        if (depth >= threshold && !sentScrollDepths.current.has(threshold)) {
          sentScrollDepths.current.add(threshold);
          trackEvent("scroll_depth", { depth: threshold, page_path: window.location.pathname });
        }
      }
    }

    document.addEventListener("click", handleClick);
    document.addEventListener("submit", handleSubmit);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("submit", handleSubmit);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return null;
}
