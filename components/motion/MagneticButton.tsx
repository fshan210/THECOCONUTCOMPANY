"use client";

import type { ReactNode } from "react";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { useCoReducedMotion } from "@/lib/motion/reduced-motion";

type MagneticButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  children: ReactNode;
};

export function MagneticButton({ children, className = "", onMouseLeave, onMouseMove, ...props }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const { shouldReduceMotion } = useCoReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      type="button"
      className={`co-press co-button-depth inline-flex min-h-12 items-center justify-center rounded-[24px] border border-[var(--co-black)] bg-[var(--co-black)] px-6 py-3 text-sm font-bold text-[var(--co-white)] ${className}`}
      animate={shouldReduceMotion ? { x: 0, y: 0 } : offset}
      transition={{ type: "spring", stiffness: 180, damping: 18, mass: 0.35 }}
      onMouseMove={(event) => {
        onMouseMove?.(event);

        if (shouldReduceMotion || !ref.current) {
          return;
        }

        const rect = ref.current.getBoundingClientRect();
        setOffset({
          x: (event.clientX - (rect.left + rect.width / 2)) * 0.12,
          y: (event.clientY - (rect.top + rect.height / 2)) * 0.12
        });
      }}
      onMouseLeave={(event) => {
        onMouseLeave?.(event);
        setOffset({ x: 0, y: 0 });
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
