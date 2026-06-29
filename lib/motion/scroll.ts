"use client";

import Lenis from "lenis";

export type CoLenis = InstanceType<typeof Lenis>;
export type CoLenisOptions = ConstructorParameters<typeof Lenis>[0];

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
  let frame = 0;

  const raf = (time: number) => {
    lenis.raf(time);
    frame = requestAnimationFrame(raf);
  };

  frame = requestAnimationFrame(raf);

  return () => {
    cancelAnimationFrame(frame);
    lenis.destroy();
  };
}

