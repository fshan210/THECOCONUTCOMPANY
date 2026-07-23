"use client";

import { MotionConfig } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";
import { choreography, motionEase, updateMotionDiagnostics, useMotionQuality, type MotionQuality } from "@/lib/motion";
import { MotionDebugOverlay } from "./MotionDebugOverlay";
import { CoconutCursor } from "./CoconutCursor";

export type RoutePhase = "idle" | "covering" | "navigating" | "revealing";

type MotionContextValue = {
  quality: MotionQuality;
  reducedMotion: boolean;
  routeKey: string;
  routePhase: RoutePhase;
  navigate: (href: string) => void;
  refreshScrollTriggers: () => void;
};

const MotionContext = createContext<MotionContextValue | null>(null);

function isPlainInternalClick(event: MouseEvent, anchor: HTMLAnchorElement) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey &&
    anchor.target !== "_blank" && !anchor.hasAttribute("download") && anchor.origin === window.location.origin;
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const quality = useMotionQuality();
  const reducedMotion = quality !== "full";
  const routeKey = `${pathname}?${searchParams.toString()}`;
  const adminRoute = pathname.startsWith("/admin") || pathname.startsWith("/control-center");
  const [routePhase, setRoutePhase] = useState<RoutePhase>("idle");
  const pendingHref = useRef<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const refreshScrollTriggers = useCallback(() => {
    if (adminRoute || typeof window === "undefined") return;
    void import("@/lib/animation/gsap-scrolltrigger").then(({ getScrollTrigger }) => {
      const { ScrollTrigger } = getScrollTrigger();
      ScrollTrigger.refresh();
      updateMotionDiagnostics({ activeScrollTriggers: ScrollTrigger.getAll().length });
    });
  }, [adminRoute]);

  const navigate = useCallback((href: string) => {
    if (href === `${window.location.pathname}${window.location.search}${window.location.hash}`) return;
    clearTimer();
    pendingHref.current = href;
    updateMotionDiagnostics({ routePhase: "covering", lastNavigation: href });
    if (quality !== "full") {
      router.push(href);
      return;
    }
    setRoutePhase("covering");
    timerRef.current = window.setTimeout(() => {
      setRoutePhase("navigating");
      updateMotionDiagnostics({ routePhase: "navigating" });
      router.push(href);
    }, choreography.route.coverMs);
  }, [clearTimer, quality, router]);

  useEffect(() => {
    if (!pendingHref.current) return;
    clearTimer();
    setRoutePhase("revealing");
    updateMotionDiagnostics({ routePhase: "revealing" });
    timerRef.current = window.setTimeout(() => {
      pendingHref.current = null;
      setRoutePhase("idle");
      updateMotionDiagnostics({ routePhase: "idle" });
    }, quality === "full" ? choreography.route.revealMs : 0);
  }, [pathname, searchParams, clearTimer, quality]);

  useEffect(() => {
    updateMotionDiagnostics({ pathname, quality, reducedMotion });
    if (adminRoute) return;
    const refreshTimer = window.setTimeout(refreshScrollTriggers, 140);
    const onImageLoad = () => refreshScrollTriggers();
    document.addEventListener("load", onImageLoad, true);
    return () => {
      window.clearTimeout(refreshTimer);
      document.removeEventListener("load", onImageLoad, true);
    };
  }, [adminRoute, pathname, quality, reducedMotion, refreshScrollTriggers]);

  useEffect(() => {
    if (adminRoute) return;
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor || !isPlainInternalClick(event, anchor) || anchor.dataset.motion === "off") return;
      const target = new URL(anchor.href);
      const current = new URL(window.location.href);
      if (target.pathname === current.pathname && target.search === current.search) return;
      event.preventDefault();
      navigate(`${target.pathname}${target.search}${target.hash}`);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (quality !== "full") return;
      const target = (event.target as Element | null)?.closest(".co-primary-cta, [data-water-ripple], [data-co-ripple]") as HTMLElement | null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "co-water-ripple";
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;
      target.appendChild(ripple);
      window.setTimeout(() => ripple.remove(), 720);
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("pointerdown", onPointerDown, true);
      clearTimer();
    };
  }, [adminRoute, clearTimer, navigate, quality]);

  const value = useMemo(() => ({ quality, reducedMotion, routeKey, routePhase, navigate, refreshScrollTriggers }), [quality, reducedMotion, routeKey, routePhase, navigate, refreshScrollTriggers]);
  return (
    <MotionContext.Provider value={value}>
      <MotionConfig reducedMotion="user" transition={{ ease: motionEase }}>
        {children}
        {adminRoute ? null : <CoconutCursor />}
        <MotionDebugOverlay />
      </MotionConfig>
    </MotionContext.Provider>
  );
}

export function useCoMotion() {
  const context = useContext(MotionContext);
  if (!context) throw new Error("useCoMotion must be used within MotionProvider");
  return context;
}

export function MotionLink({ href, onClick, ...props }: React.ComponentPropsWithoutRef<"a"> & { href: string }) {
  const { navigate } = useCoMotion();
  return <a href={href} {...props} onClick={(event: ReactMouseEvent<HTMLAnchorElement>) => { onClick?.(event); if (!event.defaultPrevented) { event.preventDefault(); navigate(href); } }} />;
}
