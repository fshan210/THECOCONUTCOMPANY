"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type AppearProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "article" | "li";
};

export const appearPreset = {
  initial: { opacity: 0, y: 35 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.85, ease: [0.215, 0.61, 0.355, 1] },
  viewport: { once: true, margin: "-10%" }
} as const;

export function Appear({ children, className, delay = 0, as = "div" }: AppearProps) {
  const Component = motion[as];

  return (
    <Component
      initial={appearPreset.initial}
      whileInView={appearPreset.whileInView}
      transition={{ ...appearPreset.transition, delay }}
      viewport={appearPreset.viewport}
      className={className}
    >
      {children}
    </Component>
  );
}
