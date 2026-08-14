"use client";

import { useEffect, useRef } from "react";
import SplitType from "split-type";
import { getScrollTrigger, prefersReducedMotion } from "@/lib/animation/gsap-scrolltrigger";
import { cn } from "@/lib/utils";

export function FoldText({ children, className }: { children: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return undefined;
    const { gsap, ScrollTrigger } = getScrollTrigger();
    const split = new SplitType(node, { types: "words,chars" });
    const chars = split.chars ?? [];
    gsap.set(chars, { opacity: 0, rotateX: -82, yPercent: 46, transformOrigin: "50% 100%", transformPerspective: 800 });
    const tween = gsap.to(chars, { opacity: 1, rotateX: 0, yPercent: 0, duration: .86, stagger: .018, ease: "expo.out", paused: true });
    const trigger = ScrollTrigger.create({ trigger: node, start: "top 86%", once: true, onEnter: () => tween.play() });
    return () => { trigger.kill(); tween.kill(); split.revert(); };
  }, [children]);

  return <span className={cn("co-fold-text", className)}><span className="sr-only">{children}</span><span ref={ref} aria-hidden="true" className="co-fold-text-visual">{children}</span></span>;
}
