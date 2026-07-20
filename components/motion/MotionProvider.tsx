"use client";

import { MotionConfig } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";
import { choreography, motionEase, updateMotionDiagnostics, useMotionQuality, type MotionQuality } from "@/lib/motion";
import { MotionDebugOverlay } from "./MotionDebugOverlay";

export type RoutePhase = "idle" | "covering" | "navigating" | "revealing";

type MotionContextValue = {
  quality: MotionQuality;
  routePhase: RoutePhase;
  navigate: (href: string) => void;
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
  const [routePhase, setRoutePhase] = useState<RoutePhase>("idle");
  const pendingHref = useRef<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

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
  }, [clearTimer, navigate, quality]);

  const value = useMemo(() => ({ quality, routePhase, navigate }), [quality, routePhase, navigate]);
  return (
    <MotionContext.Provider value={value}>
      <MotionConfig reducedMotion="user" transition={{ ease: motionEase }}>
        {children}
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
