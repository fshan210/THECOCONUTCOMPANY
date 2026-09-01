"use client";

import type { RefObject } from "react";
import { useEffect } from "react";

const revealSelector = [
  ".recipe-culture",
  ".world-section",
  ".moment",
  ".recipe-lab",
  ".three-worlds",
  ".lifestyle",
  ".recipe-index",
  ".community-recipes",
  ".passed-around",
  ".recipes-newsletter",
].join(",");

export function useRecipesMotion(rootRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    root.dataset.motion = reducedMotion ? "reduced" : "ready";

    const sections = Array.from(
      root.querySelectorAll<HTMLElement>(revealSelector),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    sections.forEach((section) => observer.observe(section));

    if (reducedMotion) {
      sections.forEach((section) => section.classList.add("is-revealed"));
      return () => observer.disconnect();
    }

    const hero = root.querySelector<HTMLElement>(".recipe-hero");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const progress = Math.min(
        1,
        Math.max(0, -rect.top / Math.max(rect.height, 1)),
      );
      root.style.setProperty("--recipe-hero-shift", `${progress * 10}px`);
      root.style.setProperty("--recipe-hero-copy-shift", `${progress * 4}px`);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [rootRef]);
}
