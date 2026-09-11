"use client";

import Lenis from "lenis";
import { getScrollTrigger } from "@/lib/animation/gsap-scrolltrigger";

export type CoLenis = InstanceType<typeof Lenis>;
export type CoLenisOptions = ConstructorParameters<typeof Lenis>[0];

let activeLenis: CoLenis | null = null;

export function scrollToDocumentTop() {
  activeLenis?.scrollTo(0, { immediate: true, force: true });
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

export function createCoLenis(options: CoLenisOptions = {}) {
  return new Lenis({
    duration: 1.08,
    easing: (time) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
    lerp: 0.09,
    smoothWheel: true,
    syncTouch: false,
    ...options
  });
}

export function startCoLenis(lenis: CoLenis) {
  activeLenis = lenis;
  const { gsap, ScrollTrigger } = getScrollTrigger();
  const update = (time: number) => lenis.raf(time * 1000);
  const syncScrollTrigger = () => ScrollTrigger.update();
  lenis.on("scroll", syncScrollTrigger);
  gsap.ticker.add(update);
  gsap.ticker.lagSmoothing(0);

  return () => {
    lenis.off("scroll", syncScrollTrigger);
    gsap.ticker.remove(update);
    if (activeLenis === lenis) activeLenis = null;
    lenis.destroy();
  };
}
