"use client";

import { motion } from "framer-motion";
import { coMotionDuration, coTransition } from "@/lib/motion/easings";
import { useCoReducedMotion } from "@/lib/motion/reduced-motion";

type TextRevealProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  lineClassName?: string;
  delay?: number;
};

export function TextReveal({ text, as = "span", className = "", lineClassName = "", delay = 0 }: TextRevealProps) {
  const { shouldReduceMotion } = useCoReducedMotion();
  const Component = motion[as];
  const lines = text.split("\n").filter(Boolean);

  if (shouldReduceMotion) {
    const StaticComponent = as;
    return <StaticComponent className={className}>{text}</StaticComponent>;
  }

  return (
    <Component className={className} aria-label={text}>
      {lines.map((line, index) => (
        <span key={`${line}-${index}`} className={`block overflow-hidden ${lineClassName}`} aria-hidden="true">
          <motion.span
            className="block"
            initial={{ y: "105%", opacity: 0.001 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={coTransition(coMotionDuration.reveal, delay + index * 0.07)}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Component>
  );
}

