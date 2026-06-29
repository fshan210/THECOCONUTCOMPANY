"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { coTransition } from "@/lib/motion/easings";
import { useCoReducedMotion } from "@/lib/motion/reduced-motion";

export type ScrollStoryStep = {
  id: string;
  eyebrow: string;
  title: string;
  caption: string;
};

type ScrollStoryProps = {
  steps: ScrollStoryStep[];
  className?: string;
};

export function ScrollStory({ steps, className = "" }: ScrollStoryProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { shouldReduceMotion } = useCoReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 35%"] });
  const pathScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className="absolute left-6 top-8 hidden h-[calc(100%-4rem)] w-px overflow-hidden rounded-full bg-[var(--co-border)] md:block">
        <motion.div
          className="h-full origin-top bg-[var(--co-palm)]"
          style={{ scaleY: shouldReduceMotion ? 1 : pathScale }}
          transition={coTransition()}
        />
      </div>

      <div className="grid gap-4">
        {steps.map((step, index) => (
          <motion.article
            key={step.id}
            className="rounded-[32px] border border-[var(--co-border)] bg-[var(--co-white)] p-5 md:ml-12 md:p-6"
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={coTransition(0.62, shouldReduceMotion ? 0 : index * 0.05)}
          >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--co-palm)]">{step.eyebrow}</p>
            <h3 className="mt-3 text-2xl font-bold text-[var(--co-brown)]">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--co-muted)]">{step.caption}</p>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

