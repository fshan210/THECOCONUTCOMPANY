"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { coMotionDuration, coMotionDistance, coTransition } from "@/lib/motion/easings";
import { useCoReducedMotion } from "@/lib/motion/reduced-motion";

type ImageRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function ImageReveal({ children, className = "", delay = 0 }: ImageRevealProps) {
  const { shouldReduceMotion } = useCoReducedMotion();

  if (shouldReduceMotion) {
    return <div className={`overflow-hidden ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      initial={{ clipPath: "inset(12% 12% 12% 12% round 32px)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 32px)" }}
      viewport={{ once: true, margin: "-10%" }}
      transition={coTransition(coMotionDuration.story, delay)}
    >
      <motion.div
        initial={{ scale: coMotionDistance.imageScale, y: 14 }}
        whileInView={{ scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={coTransition(coMotionDuration.story, delay)}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

