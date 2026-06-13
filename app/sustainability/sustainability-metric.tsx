"use client";

import { motion } from "framer-motion";

type Metric = {
  label: string;
  value: string;
  detail: string;
};

export function AnimatedMetric({ metric, delay }: { metric: Metric; delay: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      className="min-h-72 bg-porcelain p-8"
    >
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: delay + 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10 h-px origin-left bg-grove"
      />
      <p className="font-display text-6xl text-coconut">{metric.value}</p>
      <h2 className="mt-8 font-display text-3xl text-ink">{metric.label}</h2>
      <p className="mt-4 text-sm leading-7 text-muted">{metric.detail}</p>
    </motion.article>
  );
}
