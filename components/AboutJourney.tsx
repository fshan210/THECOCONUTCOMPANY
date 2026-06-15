"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useCoconutMotionMode } from "@/lib/animations/coconut-motion";

const journey = [
  {
    title: "Palakkad",
    detail: "The brand begins in Kerala's coconut country, keeping origin, community knowledge, and sourcing intelligence close to the land.",
    accent: "Map reveal",
    image: "/optimized/assets-farming-kerala-coconut-palm.webp",
    visual: "map"
  },
  {
    title: "Farmers",
    detail: "Farm relationships form the first line of quality, with accountable supply, harvest discipline, and closer origin visibility.",
    accent: "Connection lines",
    image: "/optimized/assets-farms-coconut-harvesting.webp",
    visual: "farm"
  },
  {
    title: "VAP",
    detail: "Village aggregation points reduce handling loss and create a practical, local route into the product system.",
    accent: "Village aggregation",
    image: "/assets/generated/journey-aggregation.webp",
    visual: "vap"
  },
  {
    title: "Manufacturing",
    detail: "Cold-chain discipline, bottling standards, and format development turn raw origin into a modern house system.",
    accent: "Bottling flow",
    image: "/assets/generated/journey-manufacturing.webp",
    visual: "manufacturing"
  },
  {
    title: "UAE",
    detail: "A first international route connects Kerala to Dubai through hospitality, premium retail, and diaspora demand.",
    accent: "Kerala to Dubai",
    image: "/assets/generated/journey-uae.webp",
    visual: "route"
  },
  {
    title: "Global Expansion",
    detail: "The long horizon is a coconut lifestyle house: beverage, food, care, kitchen, and culture.",
    accent: "World reveal",
    image: "/assets/generated/journey-global.webp",
    visual: "global"
  }
];

export function AboutJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const motionMode = useCoconutMotionMode();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], motionMode.shouldReduce || motionMode.isMobile ? ["0%", "0%"] : ["0%", "-82%"]);

  return (
    <section ref={ref} className="relative bg-paper md:min-h-[320vh]">
      <div className="overflow-hidden px-5 py-16 md:sticky md:top-20 md:px-8 md:py-20">
        <div className="mx-auto mb-12 max-w-7xl">
          <p className="mb-5 text-[0.72rem] uppercase tracking-editorial text-grove">Coconut journey</p>
          <h2 className="max-w-4xl font-display text-5xl leading-tight text-ink md:text-7xl">
            From a Kerala grove to a global table.
          </h2>
        </div>
        <motion.div style={{ x }} className="grid gap-5 md:flex md:w-[368vw]">
          {journey.map((item, index) => (
            <article
              key={item.title}
              className="co-glass grid min-h-[560px] shrink-0 overflow-hidden p-6 md:w-[56vw] md:grid-cols-[0.9fr_1.1fr] md:p-10"
            >
              <div className="flex flex-col justify-between">
                <p className="text-[0.7rem] uppercase tracking-editorial text-grove">{item.accent}</p>
                <div>
                  <p className="mb-5 font-display text-7xl text-coconut/20">0{index + 1}</p>
                  <h3 className="font-display text-5xl text-ink">{item.title}</h3>
                  <p className="mt-6 max-w-sm text-base leading-8 text-muted">{item.detail}</p>
                </div>
              </div>
              <JourneyVisual index={index} reduceMotion={motionMode.shouldReduce} image={item.image} title={item.title} visual={item.visual} />
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function JourneyVisual({
  index,
  reduceMotion,
  image,
  title,
  visual
}: {
  index: number;
  reduceMotion: boolean;
  image: string;
  title: string;
  visual: string;
}) {
  const nodes = Array.from({ length: 8 }, (_, item) => item);
  const labels: Record<string, string[]> = {
    map: ["Palakkad", "Kerala", "Origin"],
    farm: ["Harvest", "Farm gate", "Quality"],
    vap: ["Village", "Sorting", "Cold route"],
    manufacturing: ["Wash", "Fill", "Pack"],
    route: ["India", "UAE", "Hospitality"],
    global: ["Water", "Food", "Care"]
  };

  return (
    <div className="co-glass relative mt-8 min-h-72 overflow-hidden bg-[linear-gradient(135deg,#F5EBD7,#fffdf8)] md:mt-0">
      <Image src={image} alt={`${title} stage of the .CO coconut journey`} fill sizes="(min-width: 768px) 31vw, 80vw" className="object-cover opacity-72" />
      <div className="absolute inset-0 bg-gradient-to-br from-porcelain/70 via-porcelain/40 to-paper/72" />
      <StageOverlay visual={visual} reduceMotion={reduceMotion} index={index} />
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
      <div className="absolute bottom-6 left-6 right-6 grid gap-2 sm:grid-cols-3">
        {(labels[visual] ?? labels.global).map((label) => (
          <span key={label} className="co-glass-dark px-3 py-2 text-center text-[0.62rem] uppercase tracking-editorial text-paper/80">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function StageOverlay({ visual, reduceMotion, index }: { visual: string; reduceMotion: boolean; index: number }) {
  if (visual === "map" || visual === "route" || visual === "global") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-10 rounded-[48%] border border-grove/40"
      >
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-grove/20" />
        <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-grove/20" />
        <motion.span
          animate={reduceMotion ? undefined : { offsetDistance: ["0%", "100%"] }}
          transition={{ duration: 9 + index, repeat: Infinity, ease: "linear" }}
          className="absolute h-3 w-3 rounded-full bg-sun shadow-[0_0_24px_rgba(216,192,122,0.8)] [offset-path:ellipse(42%_36%_at_50%_50%)]"
        />
      </motion.div>
    );
  }

  if (visual === "manufacturing") {
    return (
      <div className="absolute inset-x-10 top-1/2 flex -translate-y-1/2 items-center justify-between gap-3">
        {["Wash", "Chill", "Bottle", "Pack"].map((step, stepIndex) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: stepIndex * 0.12, duration: 0.6 }}
            className="co-glass grid h-20 flex-1 place-items-center text-xs uppercase tracking-editorial text-coconut"
          >
            {step}
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
      className="absolute left-[18%] top-1/2 h-px w-[64%] origin-left bg-gradient-to-r from-coconut/10 via-grove/70 to-coconut/10"
    />
  );
}
