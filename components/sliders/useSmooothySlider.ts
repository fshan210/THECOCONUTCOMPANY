"use client";

import Smooothy, { damp } from "smooothy";
import { useCallback, useEffect, useRef, useState } from "react";
import { getScrollTrigger } from "@/lib/animation/gsap-scrolltrigger";
import { useMotionQuality } from "@/lib/motion";
import { boundedSlideIndex } from "./interaction";
import type { SliderAxis } from "./types";

interface Options {
  axis: SliderAxis;
  infinite: boolean;
  variableWidth: boolean;
  parallax: boolean;
  slideCount: number;
  onSlideChange?: (index: number) => void;
}

export function useSmooothySlider({ axis, infinite, variableWidth, parallax, slideCount, onSlideChange }: Options) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<Smooothy | null>(null);
  const smoothedSpeedRef = useRef(0);
  const [current, setCurrent] = useState(0);
  const quality = useMotionQuality();
  const reduced = quality !== "full";

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || reduced || slideCount < 2) return;

    const media = Array.from(wrapper.querySelectorAll<HTMLElement>("[data-smooothy-media]"));
    const core = new Smooothy(wrapper, {
      infinite,
      snap: true,
      variableWidth,
      vertical: axis === "vertical",
      dragSensitivity: 1.05,
      scrollSensitivity: 0.7,
      lerpFactor: 0.12,
      snapStrength: 0.11,
      speedDecay: 0.91,
      virtualScroll: {
        mouseMultiplier: 1,
        touchMultiplier: 2,
        firefoxMultiplier: 15,
        useKeyboard: false,
        passive: false,
      },
      onSlideChange: (next) => {
        const safe = ((next % slideCount) + slideCount) % slideCount;
        setCurrent(safe);
        onSlideChange?.(safe);
      },
      onUpdate: (instance) => {
        if (!parallax || !instance.isVisible) return;
        smoothedSpeedRef.current = damp(
          smoothedSpeedRef.current,
          instance.speed,
          8,
          Math.max(instance.deltaTime, 1 / 120),
        );
        media.forEach((node, index) => {
          const raw = instance.parallaxValues?.[index] ?? 0;
          const offset = Math.max(-14, Math.min(14, raw * -0.018));
          const tilt = Math.max(-0.7, Math.min(0.7, smoothedSpeedRef.current * 0.012));
          node.style.transform = axis === "vertical"
            ? `translate3d(0, ${offset}px, 0) scale(1.035) rotateX(${tilt}deg)`
            : `translate3d(${offset}px, 0, 0) scale(1.035) rotateY(${tilt}deg)`;
        });
      },
    });

    coreRef.current = core;
    const { gsap } = getScrollTrigger();
    const update = () => core.update();
    gsap.ticker.add(update);

    const handleVisibility = () => {
      core.paused = document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      gsap.ticker.remove(update);
      media.forEach((node) => { node.style.transform = ""; });
      core.destroy();
      coreRef.current = null;
    };
  }, [axis, infinite, onSlideChange, parallax, reduced, slideCount, variableWidth]);

  const scrollReduced = useCallback((index: number) => {
    const wrapper = wrapperRef.current;
    const items = wrapper?.children;
    if (!items?.length) return;
    const safe = boundedSlideIndex(index, items.length);
    (items[safe] as HTMLElement).scrollIntoView({ behavior: "auto", block: "nearest", inline: "center" });
    setCurrent(safe);
    onSlideChange?.(safe);
  }, [onSlideChange]);

  const goTo = useCallback((index: number) => {
    if (reduced) return scrollReduced(index);
    coreRef.current?.goToIndex(index);
  }, [reduced, scrollReduced]);

  const next = useCallback(() => {
    if (reduced) return scrollReduced(Math.min(current + 1, slideCount - 1));
    coreRef.current?.goToNext();
  }, [current, reduced, scrollReduced, slideCount]);

  const previous = useCallback(() => {
    if (reduced) return scrollReduced(Math.max(current - 1, 0));
    coreRef.current?.goToPrev();
  }, [current, reduced, scrollReduced]);

  return { wrapperRef, current, goTo, next, previous, reduced };
}
