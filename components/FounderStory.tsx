"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function FounderStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [-18, 18]);

  return (
    <section ref={ref} className="mx-auto grid max-w-7xl gap-12 px-5 py-24 md:grid-cols-[0.9fr_1.1fr] md:px-8">
      <motion.div style={{ y: imageY }} className="relative min-h-[560px] overflow-hidden bg-shell">
        <Image src="/optimized/images-social-media-mockup-2.webp" alt="Founder story visual" fill sizes="(min-width: 768px) 46vw, 90vw" className="object-cover" />
      </motion.div>
      <div className="flex flex-col justify-center">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-5 text-[0.72rem] uppercase tracking-editorial text-grove"
        >
          Founder story
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-5xl leading-tight text-ink md:text-7xl"
        >
          Close to origin, precise about the future.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 max-w-xl text-lg leading-9 text-muted"
        >
          Fazil Shersha and Afsala Muthali are building .CO as a lifestyle brand with local memory and international discipline: rooted in Palakkad, designed for homes, hotels, shelves, and daily rituals across markets.
        </motion.p>
      </div>
    </section>
  );
}
