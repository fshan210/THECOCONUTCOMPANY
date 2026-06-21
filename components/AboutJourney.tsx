"use client";

import Image from "next/image";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { BentoCard, BillboardWord, CTAButton, MotionSection } from "@/components/brand/BrandPrimitives";
import { BrandImage } from "@/components/BrandImage";
import { useCoconutMotionMode } from "@/lib/animations/coconut-motion";
import { publicAssets } from "@/lib/public-assets";

const journey = [
  {
    title: "Kerala Grove",
    detail: "Coconut memory starts in shade, heat, palms, and daily food culture.",
    image: publicAssets.journey.grove
  },
  {
    title: "Farmers",
    detail: "The product story stays close to people who understand coconut as work and ritual.",
    image: publicAssets.journey.farmers
  },
  {
    title: "Village Collection",
    detail: "A simple local handoff gathers coconut before processing and bottling.",
    image: publicAssets.journey.aggregation
  },
  {
    title: "Processing",
    detail: "Clean handling keeps the product language focused on taste, coldness, and clarity.",
    image: publicAssets.journey.processing
  },
  {
    title: "Bottling",
    detail: "The story becomes a cold, clear product designed for shelves and fridge doors.",
    image: publicAssets.journey.bottling
  },
  {
    title: "Customer Ritual",
    detail: "A cold bottle, a recipe glass, a sunny reset, and a product people remember.",
    image: publicAssets.journey.ritual
  }
];

function JourneyRail() {
  const ref = useRef<HTMLDivElement>(null);
  const { shouldReduce, isMobile } = useCoconutMotionMode();
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 92, damping: 30, mass: 0.45 });
  const pathLength = useTransform(smooth, [0, 1], [0.05, 1]);
  const bottleY = useTransform(smooth, [0, 1], shouldReduce || isMobile ? [0, 0] : [28, -34]);

  useMotionValueEvent(smooth, "change", (value) => {
    setActiveIndex(Math.min(journey.length - 1, Math.max(0, Math.floor(value * journey.length))));
  });

  const active = journey[activeIndex];

  return (
    <div ref={ref} className="relative md:min-h-[260vh]">
      <div className="co-container grid items-center gap-5 py-6 md:sticky md:top-20 md:min-h-[calc(100dvh-5rem)] lg:grid-cols-[0.96fr_1.04fr]">
        <BentoCard className="min-h-[460px] md:min-h-[560px]">
          <div className="relative h-full min-h-[420px] overflow-hidden rounded-[36px] md:min-h-[520px]">
            {journey.map((stage, index) => (
              <motion.div
                key={stage.title}
                animate={{ opacity: activeIndex === index ? 1 : 0, scale: activeIndex === index ? 1 : 1.04 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <Image src={stage.image} alt={stage.title} fill sizes="(min-width: 1024px) 46vw, 92vw" className={stage.title === "Bottling" ? "object-contain p-10" : "object-cover"} />
              </motion.div>
            ))}
            <div className="absolute inset-0 bg-[var(--co-black)]/10" />
          </div>
        </BentoCard>
        <div>
          <p className="co-label mb-5">Origin to ritual</p>
          <h2 className="co-h2 text-[var(--co-brown)]">{active.title}</h2>
          <p className="co-body mt-7 max-w-xl">{active.detail}</p>
          <div className="relative mt-10 h-24">
            <svg aria-hidden="true" viewBox="0 0 840 120" className="h-full w-full">
              <path d="M20 68 C170 8 230 112 370 58 C520 0 594 98 820 34" stroke="rgba(58,36,22,0.18)" strokeWidth="3" fill="none" strokeLinecap="round" />
              <motion.path style={{ pathLength }} d="M20 68 C170 8 230 112 370 58 C520 0 594 98 820 34" stroke="var(--co-palm)" strokeWidth="5" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {journey.map((stage, index) => (
              <button
                key={stage.title}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`min-h-12 rounded-full border px-4 text-left text-xs font-bold uppercase tracking-[0.12em] transition ${activeIndex === index ? "border-[var(--co-black)] bg-[var(--co-black)] text-[var(--co-white)]" : "border-[var(--co-border)] bg-[var(--co-white)] text-[var(--co-muted)]"}`}
              >
                0{index + 1} / {stage.title}
              </button>
            ))}
          </div>
        </div>
        <motion.div style={{ y: bottleY }} className="pointer-events-none absolute bottom-8 right-6 hidden w-40 lg:block">
          <BrandImage src={publicAssets.water.floating} alt=".CO coconut water bottle" sizes="160px" aspect="product" fit="contain" className="rounded-[28px]" />
        </motion.div>
      </div>
    </div>
  );
}

export function AboutJourney() {
  return (
    <section className="co-section bg-[var(--co-white)]">
      <MotionSection className="co-container mb-10">
        <BillboardWord word="GROVE" className="co-display-section text-[var(--co-brown)]/[0.085]" />
        <h2 className="co-h2 -mt-3 max-w-5xl text-[var(--co-ink)]">A premium coconut brand with an origin system behind it.</h2>
      </MotionSection>
      <JourneyRail />
      <div className="co-container grid gap-4 md:grid-cols-3">
        {[
          ["Coconut-first", "Products begin with rituals people already understand."],
          ["Shelf discipline", "Design decisions serve product desire and repeat purchase."],
          ["Made for living", "A warm brand world for water, dessert, kitchen, care, and recipes."]
        ].map(([title, body], index) => (
          <MotionSection key={title} delay={index * 0.05}>
            <BentoCard className="h-full">
              <p className="text-7xl font-bold leading-none text-[var(--co-brown)]/15">0{index + 1}</p>
              <h3 className="mt-8 text-4xl font-bold leading-none text-[var(--co-brown)]">{title}</h3>
              <p className="co-body mt-5">{body}</p>
            </BentoCard>
          </MotionSection>
        ))}
      </div>
      <div className="co-container mt-6">
        <BentoCard tone="green" className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="co-label mb-4 text-[var(--co-sun)]">Brand position</p>
            <h3 className="text-[clamp(42px,6vw,92px)] font-bold leading-[0.88]">Consumer coconut products made for the fridge, kitchen, and table.</h3>
          </div>
          <CTAButton href="/products" variant="light">See products</CTAButton>
        </BentoCard>
      </div>
    </section>
  );
}
