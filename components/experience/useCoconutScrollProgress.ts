"use client";

import { useRef } from "react";
import { useReducedMotion, useScroll, useSpring } from "framer-motion";

export function useCoconutScrollProgress() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
    layoutEffect: false,
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 115,
    damping: 28,
    mass: 0.42,
    restDelta: 0.001,
  });

  return { sectionRef, progress, reducedMotion: Boolean(reducedMotion) };
}
