"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function getScrollTrigger() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }

  return { gsap, ScrollTrigger };
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") {
    return true;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function cleanupScrollTriggers(scope?: Element | string) {
  const { ScrollTrigger: Trigger } = getScrollTrigger();
  const triggers = Trigger.getAll();

  triggers.forEach((trigger) => {
    if (!scope) {
      trigger.kill();
      return;
    }

    if (typeof scope === "string" && trigger.vars.id === scope) {
      trigger.kill();
      return;
    }

    if (scope instanceof Element && trigger.trigger && scope.contains(trigger.trigger as Element)) {
      trigger.kill();
    }
  });
}
