"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { createCoLenis, startCoLenis } from "@/lib/motion/scroll";

export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      return undefined;
    }

    const lenis = createCoLenis();
    return startCoLenis(lenis);
  }, []);

  return children;
}
