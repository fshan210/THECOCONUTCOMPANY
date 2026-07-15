"use client";

import { useSyncExternalStore } from "react";

function subscribeToMediaQuery(query: string, callback: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (callback) => subscribeToMediaQuery(query, callback),
    () => window.matchMedia(query).matches,
    () => false
  );
}

export function useCoconutMotionMode() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const shouldReduce = prefersReducedMotion;
  const shouldSimplify = isMobile || prefersReducedMotion;

  return {
    isMobile,
    prefersReducedMotion,
    quality: shouldSimplify ? "mobile" : "desktop",
    shouldReduce,
    shouldSimplify
  } as const;
}

export const coconutEase = [0.16, 1, 0.3, 1] as const;

export const CoconutMotion = {
  CoconutFloat: {
    y: [0, -8, 0],
    transition: { duration: 7, repeat: Infinity, ease: "easeInOut" }
  },
  CoconutReveal: {
    initial: { opacity: 0, y: 28, filter: "blur(8px)" },
    whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.85, ease: coconutEase }
  },
  CoconutRotate: {
    rotate: [0, 2, 0, -2, 0],
    transition: { duration: 14, repeat: Infinity, ease: "easeInOut" }
  },
  PalmSway: {
    x: [0, 6, 0, -4, 0],
    transition: { duration: 12, repeat: Infinity, ease: "easeInOut" }
  },
  NatureFade: {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 1, ease: coconutEase }
  },
  OrganicParallax: {
    initial: { y: 18 },
    whileInView: { y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 1.1, ease: coconutEase }
  },
  ProductLift: {
    whileHover: { y: -6 },
    transition: { duration: 0.45, ease: coconutEase }
  },
  RecipeReveal: {
    initial: { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-70px" },
    transition: { duration: 0.72, ease: coconutEase }
  },
  TestimonialFade: {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.8, ease: coconutEase }
  }
};
