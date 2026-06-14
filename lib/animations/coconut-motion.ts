"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export function useCoconutMotionMode() {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return {
    isMobile,
    prefersReducedMotion: Boolean(prefersReducedMotion),
    quality: isMobile || prefersReducedMotion ? "mobile" : "desktop",
    shouldReduce: isMobile || Boolean(prefersReducedMotion)
  } as const;
}
