"use client";

import { useEffect, useRef } from "react";
import { getScrollTrigger, prefersReducedMotion } from "@/lib/animation/gsap-scrolltrigger";

type CounterStatProps = {
  value: string;
  label: string;
};

export function CounterStat({ value, label }: CounterStatProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) {
      return undefined;
    }

    const { gsap, ScrollTrigger } = getScrollTrigger();
    const animation = gsap.fromTo(ref.current, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" });
    const trigger = ScrollTrigger.create({ trigger: ref.current, start: "top 85%", animation });

    return () => {
      trigger.kill();
      animation.kill();
    };
  }, []);

  return (
    <div ref={ref} className="rounded-[32px] border border-[var(--co-border)] bg-[var(--co-white)] p-5">
      <p className="text-4xl font-bold tracking-[-0.05em] text-[var(--co-brown)]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--co-muted)]">{label}</p>
    </div>
  );
}
