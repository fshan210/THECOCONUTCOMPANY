"use client";

import Image from "next/image";
import { Leaf, Package, PackageCheck, Sprout, Store, UsersRound } from "lucide-react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Appear } from "@/components/motion/Appear";
import { PublicHeader, PublicSection } from "@/components/PublicDesign";
import { useCoconutMotionMode } from "@/lib/animations/coconut-motion";
import { publicAssets } from "@/lib/public-assets";

const journey = [
  {
    title: "Kerala Grove",
    detail: "Shade, soil, palms, and the familiar taste of tender coconut set the emotional origin.",
    image: publicAssets.journey.grove,
    icon: Sprout
  },
  {
    title: "Farmers",
    detail: "The story stays close to people who understand coconut as daily work and daily food.",
    image: publicAssets.journey.farmers,
    icon: UsersRound
  },
  {
    title: "Village Aggregation Point",
    detail: "Coconuts come together in a simple local handoff before becoming finished products.",
    image: publicAssets.journey.aggregation,
    icon: Leaf
  },
  {
    title: "Processing",
    detail: "The goal is clarity: protect taste, keep the product language simple, and respect the ingredient.",
    image: publicAssets.journey.processing,
    icon: PackageCheck
  },
  {
    title: "Bottling",
    detail: "The coconut story becomes a sharp, cold, easy-to-hold .CO product.",
    image: publicAssets.journey.bottling,
    icon: Package
  },
  {
    title: "Customer Ritual",
    detail: "A fridge-door bottle, a recipe glass, a sunny reset, and a product that feels at home.",
    image: publicAssets.journey.ritual,
    icon: Store
  }
];

function JourneyInteraction() {
  const ref = useRef<HTMLDivElement>(null);
  const { shouldReduce, isMobile } = useCoconutMotionMode();
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.42 });
  const pathLength = useTransform(smooth, [0, 1], [0.06, 1]);
  const markerX = useTransform(smooth, [0, 1], shouldReduce || isMobile ? ["8%", "8%"] : ["8%", "88%"]);

  useMotionValueEvent(smooth, "change", (value) => {
    setActiveIndex(Math.min(journey.length - 1, Math.max(0, Math.floor(value * journey.length))));
  });

  return (
    <div ref={ref} className="relative min-h-[260vh]">
      <div className="sticky top-24 mx-auto grid min-h-[calc(100svh-6rem)] max-w-7xl gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
        <div className="relative overflow-hidden rounded-3xl border border-coconut/10 bg-paper p-4 shadow-[0_24px_70px_rgba(62,46,31,0.09)] md:p-5">
          <div className="co-wave-pattern absolute inset-0 opacity-[0.055]" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#fff8ea]">
            {journey.map((stage, index) => (
              <motion.div
                key={stage.title}
                initial={false}
                animate={{ opacity: activeIndex === index ? 1 : 0, scale: activeIndex === index ? 1 : 1.04 }}
                transition={{ duration: 0.62, ease: [0.215, 0.61, 0.355, 1] }}
                className="absolute inset-0"
              >
                <Image src={stage.image} alt={stage.title} fill sizes="(min-width: 1024px) 42vw, 92vw" className={index === 4 ? "object-contain p-8 drop-shadow-[0_34px_54px_rgba(62,46,31,0.22)]" : "object-cover"} />
              </motion.div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-coconut/28 via-transparent to-transparent" />
          </div>
          <motion.div style={{ x: markerX }} className="absolute bottom-9 left-0 h-4 w-4 rounded-full bg-sun shadow-[0_0_0_8px_rgba(216,192,122,0.2)]" />
        </div>

        <div className="relative">
          <p className="mb-6 text-[0.72rem] font-medium uppercase tracking-editorial text-grove">Origin to ritual</p>
          <h2 className="font-display text-5xl font-light leading-[0.92] text-coconut md:text-7xl lg:text-8xl">{journey[activeIndex].title}</h2>
          <p className="mt-7 max-w-xl text-lg leading-9 text-coconut/70">{journey[activeIndex].detail}</p>
          <div className="relative mt-12 hidden h-28 md:block">
            <svg aria-hidden="true" viewBox="0 0 820 120" className="h-full w-full text-coconut/18">
              <path d="M20 74 C150 10 224 112 356 58 C500 -2 566 96 800 38" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
              <motion.path style={{ pathLength }} d="M20 74 C150 10 224 112 356 58 C500 -2 566 96 800 38" stroke="#4A6F4A" strokeWidth="4" fill="none" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-x-0 top-0 flex justify-between">
              {journey.map((stage, index) => {
                const Icon = stage.icon;
                const active = index <= activeIndex;
                return (
                  <span key={stage.title} className={`grid h-11 w-11 place-items-center rounded-2xl border transition ${active ? "border-grove bg-grove text-paper" : "border-coconut/12 bg-paper text-coconut/42"}`}>
                    <Icon size={17} />
                  </span>
                );
              })}
            </div>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {journey.map((stage, index) => (
              <button
                key={stage.title}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`rounded-2xl border px-4 py-3 text-left text-xs font-medium uppercase tracking-editorial transition ${activeIndex === index ? "border-grove bg-grove text-paper" : "border-coconut/10 bg-[#fff8ea] text-coconut/58"}`}
              >
                0{index + 1} / {stage.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AboutJourney() {
  return (
    <PublicSection tone="warm">
      <PublicHeader
        kicker="Our journey"
        title="From grove to ritual, with the coconut kept at the centre."
        body="A simple journey told with product context: origin, farmers, aggregation, processing, bottling, and the daily moment that follows."
      />
      <JourneyInteraction />
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">
        {journey.map((item, index) => {
          const Icon = item.icon;
          return (
            <Appear key={item.title} delay={index * 0.04}>
              <article className="grid h-full overflow-hidden rounded-3xl border border-coconut/10 bg-paper shadow-[0_18px_48px_rgba(62,46,31,0.06)] lg:grid-cols-[0.82fr_1fr]">
                <div className="relative min-h-72">
                  <Image src={item.image} alt={item.title} fill sizes="(min-width: 1024px) 28vw, (min-width: 768px) 46vw, 92vw" className="object-cover" />
                </div>
                <div className="flex min-h-72 flex-col justify-between p-6 md:p-7">
                  <div className="flex items-center justify-between gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-grove/10 text-grove">
                      <Icon size={20} />
                    </span>
                    <span className="text-[0.68rem] font-medium uppercase tracking-editorial text-coconut/38">0{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-4xl font-light leading-tight text-coconut">{item.title}</h3>
                    <p className="mt-5 text-sm leading-7 text-coconut/68">{item.detail}</p>
                  </div>
                </div>
              </article>
            </Appear>
          );
        })}
      </div>
    </PublicSection>
  );
}
