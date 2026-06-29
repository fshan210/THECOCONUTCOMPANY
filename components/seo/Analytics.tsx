"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics/events";
import { getFirebaseAnalyticsClient } from "@/lib/firebase/client";
import { isFirebasePublicConfigured } from "@/lib/firebase/config";

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-CNXDJ3EMHQ";
const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
const isProduction = process.env.NODE_ENV === "production";

export function Analytics() {
  return (
    <>
      <GoogleAnalytics />
      <MicrosoftClarity />
      <FirebaseAnalytics />
      <AnalyticsEventListeners />
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  );
}

function FirebaseAnalytics() {
  useEffect(() => {
    if (!isProduction || !isFirebasePublicConfigured()) return;
    void getFirebaseAnalyticsClient();
  }, []);

  return null;
}

function GoogleAnalytics() {
  if (!isProduction || !gaMeasurementId) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${gaMeasurementId}', {
            page_path: window.location.pathname + window.location.search,
            page_location: window.location.href,
            page_title: document.title
          });
        `}
      </Script>
    </>
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

  useEffect(() => {
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
        trackEvent("cta_click", {
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
