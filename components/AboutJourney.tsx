"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useCoconutMotionMode } from "@/lib/animations/coconut-motion";

const journey = [
  {
    title: "Kerala",
    detail: "A quiet map reveal begins in Palakkad, where the brand keeps its sourcing intelligence close to the land.",
    accent: "Map reveal",
    image: "/optimized/assets-farming-kerala-coconut-palm.webp"
  },
  {
    title: "Farmers",
    detail: "Direct relationships form the first line of quality, with measured harvest windows and accountable supply.",
    accent: "Connection lines",
    image: "/optimized/assets-farms-coconut-harvesting.webp"
  },
  {
    title: "Village Aggregation",
    detail: "Collection points reduce handling loss and create local participation before the product reaches production.",
    accent: "Network nodes",
    image: "/optimized/assets-coconut-made-for-living-banner.webp"
  },
  {
    title: "Production",
    detail: "Cold-chain discipline, bottling standards, and format development turn raw origin into a modern house system.",
    accent: "Bottling flow",
    image: "/optimized/assets-coconut-tender-coconut-water.webp"
  },
  {
    title: "Export",
    detail: "Formats are prepared for export discipline, shelf clarity, and hospitality conversations beyond the local launch.",
    accent: "Export route",
    image: "/optimized/assets-products-co-water-reserve.webp"
  },
  {
    title: "UAE",
    detail: "A first international route connects Kerala to Dubai through hospitality, premium retail, and diaspora demand.",
    accent: "Kerala to Dubai",
    image: "/optimized/assets-social-founder-journey.webp"
  },
  {
    title: "Global Vision",
    detail: "The long horizon is a coconut lifestyle house: beverage, food, care, kitchen, and culture.",
    accent: "World reveal",
    image: "/optimized/assets-textures-palm-shadow.webp"
  }
];

export function AboutJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const motionMode = useCoconutMotionMode();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], motionMode.shouldReduce ? ["0%", "-68%"] : ["0%", "-78%"]);

  return (
    <section ref={ref} className="relative min-h-[360vh] bg-paper">
      <div className="sticky top-20 overflow-hidden px-5 py-20 md:px-8">
        <div className="mx-auto mb-12 max-w-7xl">
          <p className="mb-5 text-[0.72rem] uppercase tracking-editorial text-grove">Coconut journey</p>
          <h2 className="max-w-4xl font-display text-5xl leading-tight text-ink md:text-7xl">
            From a Kerala grove to a global table.
          </h2>
        </div>
        <motion.div style={{ x }} className="flex w-[650vw] gap-5 md:w-[430vw]">
          {journey.map((item, index) => (
            <article
              key={item.title}
              className="grid h-[560px] w-[86vw] shrink-0 overflow-hidden border border-shell bg-porcelain p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_24px_80px_rgba(62,46,31,0.05)] md:w-[56vw] md:grid-cols-[0.9fr_1.1fr] md:p-10"
            >
              <div className="flex flex-col justify-between">
                <p className="text-[0.7rem] uppercase tracking-editorial text-grove">{item.accent}</p>
                <div>
                  <p className="mb-5 font-display text-7xl text-coconut/20">0{index + 1}</p>
                  <h3 className="font-display text-5xl text-ink">{item.title}</h3>
                  <p className="mt-6 max-w-sm text-base leading-8 text-muted">{item.detail}</p>
                </div>
              </div>
              <JourneyVisual index={index} reduceMotion={motionMode.shouldReduce} image={item.image} title={item.title} />
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function JourneyVisual({ index, reduceMotion, image, title }: { index: number; reduceMotion: boolean; image: string; title: string }) {
  const nodes = Array.from({ length: 8 }, (_, item) => item);

  return (
    <div className="relative mt-8 min-h-72 overflow-hidden bg-[linear-gradient(135deg,#F5EBD7,#fffdf8)] md:mt-0">
      <Image src={image} alt={`${title} stage of the .CO coconut journey`} fill sizes="(min-width: 768px) 31vw, 80vw" className="object-cover opacity-45" />
      <div className="absolute inset-0 bg-gradient-to-br from-porcelain/70 via-porcelain/40 to-paper/72" />
      <motion.div
        initial={{ opacity: 0, pathLength: 0 }}
        whileInView={{ opacity: 1, pathLength: 1 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-10 rounded-[48%] border border-grove/30"
      />
      <div className="absolute inset-0">
        {nodes.map((node) => (
          <motion.span
            key={node}
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: node * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute h-2.5 w-2.5 rounded-full bg-grove shadow-[0_0_24px_rgba(74,111,74,0.28)]"
            style={{
              left: `${18 + ((node * 19 + index * 7) % 62)}%`,
              top: `${20 + ((node * 13 + index * 11) % 56)}%`
            }}
          />
        ))}
      </div>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-[18%] top-1/2 h-px w-[64%] origin-left bg-gradient-to-r from-coconut/10 via-grove/60 to-coconut/10"
      />
      <motion.div
        animate={reduceMotion ? { x: "0%", y: "0%" } : { x: ["-8%", "8%", "-8%"], y: ["2%", "-3%", "2%"] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-10 h-28 w-20 rounded-full bg-[radial-gradient(circle_at_45%_28%,#fffdf8,#F5EBD7_54%,#3e2e1f_100%)] shadow-soft"
      />
    </div>
  );
}
