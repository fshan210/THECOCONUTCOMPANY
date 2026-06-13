"use client";

import { motion } from "framer-motion";

const words = ["Made", "For", "Living"];

export function CinematicWords() {
  return (
    <motion.h1
      initial="hidden"
      animate="show"
      className="max-w-4xl font-display text-6xl uppercase leading-[0.88] text-ink md:text-8xl lg:text-9xl"
      aria-label="Made for Living"
    >
      {words.map((word) => (
        <motion.span
          key={word}
          variants={{
            hidden: { opacity: 0, y: 34, filter: "blur(10px)" },
            show: { opacity: 1, y: 0, filter: "blur(0px)" }
          }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="block"
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
}
