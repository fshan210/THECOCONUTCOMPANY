"use client";

import { motion } from "framer-motion";
import { useCoReducedMotion } from "@/lib/motion/reduced-motion";

type MotionMarqueeProps = {
  items: string[];
  className?: string;
  itemClassName?: string;
};

export function MotionMarquee({ items, className = "", itemClassName = "" }: MotionMarqueeProps) {
  const { shouldReduceMotion } = useCoReducedMotion();
  const repeatedItems = [...items, ...items];

  if (shouldReduceMotion) {
    return (
      <div className={`flex flex-wrap gap-3 ${className}`}>
        {items.map((item) => (
          <span key={item} className={itemClassName}>
            {item}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        className="flex w-max gap-4"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 24, ease: "linear", repeat: Infinity }}
      >
        {repeatedItems.map((item, index) => (
          <span key={`${item}-${index}`} className={itemClassName} aria-hidden={index >= items.length}>
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

