"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { createCoLenis, startCoLenis } from "@/lib/motion/scroll";
import { updateMotionDiagnostics } from "@/lib/motion/diagnostics";

export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      updateMotionDiagnostics({ lenisStatus: "disabled" });
      return undefined;
    }

    const lenis = createCoLenis();
    updateMotionDiagnostics({ lenisStatus: "active" });
    const stop = startCoLenis(lenis);
    return () => {
      updateMotionDiagnostics({ lenisStatus: "idle" });
      stop();
    };
  }, []);

  return children;
}
