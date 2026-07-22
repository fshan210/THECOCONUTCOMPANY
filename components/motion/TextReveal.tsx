"use client";

import { motion } from "framer-motion";
import { choreography, motionDuration, motionEase, useMotionQuality } from "@/lib/motion";

type TextRevealProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  lineClassName?: string;
  delay?: number;
};

export function TextReveal({ text, as = "span", className = "", lineClassName = "", delay = 0 }: TextRevealProps) {
  const quality = useMotionQuality();
  const Component = motion[as];
  const lines = text.split("\n").filter(Boolean);

  if (quality !== "full") {
    const StaticComponent = as;
    return <StaticComponent className={className}>{text}</StaticComponent>;
  }

  return (
    <Component className={className} aria-label={text}>
      {lines.map((line, index) => (
        <span key={`${line}-${index}`} className={`block overflow-hidden ${lineClassName}`} aria-hidden="true">
          <motion.span
            className="block"
            initial={{ y: "105%", opacity: 0.001, filter: "blur(7px)" }}
            whileInView={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: motionDuration.reveal, delay: delay + index * choreography.text.lineStagger, ease: motionEase }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Component>
  );
}
