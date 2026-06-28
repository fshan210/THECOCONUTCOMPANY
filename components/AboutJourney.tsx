"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { BrandImage } from "@/components/BrandImage";
import { BentoCard, CTAButton, DoodleIcon, MotionSection } from "@/components/brand/BrandPrimitives";
import { useCoconutMotionMode } from "@/lib/animations/coconut-motion";
import { publicAssets } from "@/lib/public-assets";

const steps: Array<{
  title: string;
  body: string;
  image: string;
  fit: "cover" | "contain";
  position?: string;
}> = [
  {
    title: "Kerala roots",
    body: "Coconut culture, shade, heat, and everyday use shape the product world.",
    image: publicAssets.journey.grove,
    fit: "cover"
  },
  {
    title: "Farmers",
    body: "The brand stays close to people who understand coconut as daily work.",
    image: publicAssets.journey.farmers,
    fit: "cover"
  },
  {
    title: "Village aggregation",
    body: "A simple local handoff gathers coconuts before processing and bottling.",
    image: publicAssets.journey.aggregation,
    fit: "cover"
  },
  {
    title: "Processing",
    body: "Clean handling keeps the consumer promise simple and easy to trust.",
    image: publicAssets.journey.processing,
    fit: "cover"
  },
  {
    title: "Bottling",
    body: "The origin story becomes a cold product designed for shelves and fridge doors.",
    image: publicAssets.water.floating,
    fit: "contain"
  },
  {
    title: "Everyday ritual",
    body: "A bottle, a recipe, a meal, a dessert, and a coconut world people remember.",
    image: publicAssets.journey.ritual,
    fit: "cover"
  }
];

export function AboutJourney() {
  const journeyRef = useRef<HTMLDivElement>(null);
  const { shouldReduce } = useCoconutMotionMode();
  const { scrollYProgress } = useScroll({ target: journeyRef, offset: ["start 72%", "end 38%"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="co-section bg-[var(--co-white)]">
      <div className="co-container">
        <div className="mb-8 grid gap-5 md:grid-cols-[0.72fr_1fr] md:items-end">
          <MotionSection>
            <h2 className="co-h2 text-[var(--co-brown)]">From grove to good choices.</h2>
          </MotionSection>
          <MotionSection delay={0.06}>
            <p className="max-w-2xl text-lg leading-8 text-[var(--co-muted)]">
              The .CO journey is intentionally straightforward: source clearly, process carefully, bottle beautifully, and make coconut useful in daily life.
            </p>
          </MotionSection>
        </div>

        <div ref={journeyRef} className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="pointer-events-none absolute left-8 right-8 top-14 hidden h-px overflow-hidden rounded-full bg-[rgba(58,36,22,0.12)] lg:block">
            <motion.div
              style={{ scaleX: shouldReduce ? 1 : lineScale }}
              className="co-journey-line h-full w-full rounded-full bg-[var(--co-palm)]/60"
            />
          </div>
          {steps.map((step, index) => (
            <MotionSection key={step.title} delay={index * 0.04} className="relative">
              <article className="co-press relative z-10 h-full rounded-[28px] border border-[var(--co-border)] bg-[var(--co-white)] p-4">
                <div className="mb-4 flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-[var(--co-border)] bg-[var(--co-cream)] text-sm font-bold text-[var(--co-brown)] shadow-[0_8px_18px_rgba(58,36,22,0.08)]">0{index + 1}</span>
                  <h3 className="text-xl font-bold leading-tight text-[var(--co-brown)]">{step.title}</h3>
                </div>
                <BrandImage
                  src={step.image}
                  alt={`${step.title} in the .CO journey`}
                  sizes="(min-width: 1024px) 31vw, (min-width: 768px) 48vw, 92vw"
                  aspect="landscape"
                  fit={step.fit}
                  position={step.position ?? "center"}
                  hoverZoom
                  className="rounded-[24px]"
                />
                <p className="mt-4 text-sm leading-6 text-[var(--co-muted)]">{step.body}</p>
              </article>
            </MotionSection>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.36fr]">
          <BentoCard tone="green" className="rounded-[24px]">
            <h3 className="text-[clamp(32px,5vw,66px)] font-bold leading-[0.92]">Made for living, not just for launch.</h3>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/76">
              The brand world supports water, dessert, kitchen, care, recipes, and the everyday rituals that make coconut useful.
            </p>
          </BentoCard>
          <BentoCard className="flex items-center justify-between rounded-[24px] bg-[var(--co-cream)]">
            <DoodleIcon name="palm" className="h-16 w-16 text-[var(--co-palm)]" />
            <CTAButton href="/products" variant="outline">See products</CTAButton>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}
