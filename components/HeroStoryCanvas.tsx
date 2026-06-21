"use client";

import Image from "next/image";
import { motion, useMotionTemplate, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { BrandImage } from "@/components/BrandImage";
import { BillboardWord, CTAButton, IngredientBadge } from "@/components/brand/BrandPrimitives";
import { useCoconutMotionMode } from "@/lib/animations/coconut-motion";
import { publicAssets } from "@/lib/public-assets";

const stages = [
  { label: "Origin", copy: "Kerala coconut source", progress: "01" },
  { label: "Liquid", copy: "Cold coconut water line", progress: "02" },
  { label: "Pack", copy: ".CO bottle reveal", progress: "03" },
  { label: "Shelf", copy: "Ready for the fridge", progress: "04" }
];

export function HeroStoryCanvas() {
  const ref = useRef<HTMLElement>(null);
  const { shouldReduce, isMobile } = useCoconutMotionMode();
  const [activeStage, setActiveStage] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 82, damping: 26, mass: 0.42 });

  const originOpacity = useTransform(smooth, [0, 0.24, 0.46], isMobile || shouldReduce ? [0.34, 0.28, 0.18] : [1, 0.86, 0]);
  const liquidOpacity = useTransform(smooth, [0.18, 0.42, 0.74], isMobile || shouldReduce ? [0.28, 0.34, 0.28] : [0, 1, 0.22]);
  const pathLength = useTransform(smooth, [0.12, 0.62], [0.05, 1]);
  const packOpacity = useTransform(smooth, [0, 0.48, 0.72], isMobile || shouldReduce ? [1, 1, 1] : [0.78, 0.9, 1]);
  const packScale = useTransform(smooth, [0.45, 1], isMobile || shouldReduce ? [1, 1] : [0.92, 1.08]);
  const packY = useTransform(smooth, [0.45, 1], isMobile || shouldReduce ? [0, 0] : [34, -18]);
  const mask = useTransform(smooth, [0, 0.74], isMobile || shouldReduce ? [90, 90] : [36, 86]);
  const clipPath = useMotionTemplate`circle(${mask}% at 50% 48%)`;
  const wordY = useTransform(smooth, [0, 1], shouldReduce || isMobile ? [0, 0] : [0, -52]);

  useMotionValueEvent(smooth, "change", (value) => {
    setActiveStage(Math.min(stages.length - 1, Math.floor(value * stages.length)));
  });

  return (
    <section ref={ref} className="relative bg-[var(--co-cream)] md:min-h-[220vh]">
      <div className="min-h-dvh overflow-hidden md:sticky md:top-0">
        <motion.div style={{ y: wordY }} className="absolute inset-x-0 top-[10vh] z-0 text-center">
          <BillboardWord word="COCONUT" className="co-display-hero text-[var(--co-brown)]/[0.075]" />
        </motion.div>

        <div className="co-container relative z-10 grid min-h-dvh items-center gap-8 pt-24 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="pb-8 lg:pb-0">
            <div className="mb-8 flex flex-wrap gap-3">
              <IngredientBadge tone="sun">Tender coconut water</IngredientBadge>
              <IngredientBadge>Cold ritual</IngredientBadge>
              <IngredientBadge>Fridge shelf ready</IngredientBadge>
            </div>
            <h1 className="max-w-4xl text-[clamp(44px,13vw,152px)] font-bold leading-[0.84] text-[var(--co-ink)]">
              Cold coconut water. Made for living.
            </h1>
            <p className="co-body mt-7 max-w-xl">
              .CO turns coconut origin into a desirable cold bottle: crisp, familiar, and made for everyday rituals.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <CTAButton href="/shop/co-water">Shop .CO Water</CTAButton>
              <CTAButton href="/products" variant="outline">Explore the range</CTAButton>
            </div>
            <div className="mt-10 hidden max-w-xl grid-cols-2 gap-3 md:grid md:grid-cols-4">
              {stages.map((stage, index) => (
                <div
                  key={stage.label}
                  className={`rounded-[28px] border px-4 py-4 transition duration-500 ${activeStage === index ? "border-[var(--co-black)] bg-[var(--co-black)] text-[var(--co-white)]" : "border-[var(--co-border)] bg-[var(--co-white)] text-[var(--co-muted)]"}`}
                >
                  <p className="text-xs font-bold uppercase tracking-[0.12em]">{stage.progress}</p>
                  <p className="mt-3 text-sm font-bold">{stage.label}</p>
                  <p className="mt-1 text-xs opacity-70">{stage.copy}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative order-first min-h-[360px] sm:min-h-[540px] lg:order-none lg:min-h-[760px]">
            <div className="absolute inset-0 rounded-[48px] border border-[var(--co-border)] bg-[var(--co-white)] shadow-[0_34px_110px_rgba(58,36,22,0.13)]" />
            <motion.div style={{ opacity: originOpacity }} className="absolute inset-4 overflow-hidden rounded-[36px]">
              <BrandImage
                src={publicAssets.brand.tenderCoconut}
                alt="Tender coconut origin for .CO coconut water"
                sizes="(min-width: 1024px) 52vw, 92vw"
                aspect="portrait"
                fit="cover"
                position="center 48%"
                priority
                className="h-full rounded-[36px]"
              />
            </motion.div>
            <motion.svg aria-hidden="true" viewBox="0 0 900 680" className="absolute inset-0 h-full w-full" style={{ opacity: liquidOpacity }}>
              <motion.path
                d="M110 402 C250 242 344 492 488 336 C624 188 706 302 812 178"
                pathLength={pathLength}
                stroke="var(--co-palm)"
                strokeWidth="34"
                strokeLinecap="round"
                fill="none"
                opacity="0.2"
              />
              <motion.path
                d="M94 438 C262 300 350 520 522 372 C650 262 724 342 832 240"
                pathLength={pathLength}
                stroke="var(--co-white)"
                strokeWidth="15"
                strokeLinecap="round"
                fill="none"
                opacity="0.92"
              />
            </motion.svg>
            <motion.div style={{ opacity: liquidOpacity }} className="absolute left-8 top-8 rounded-full border border-[var(--co-border)] bg-[var(--co-cream)] px-5 py-3 text-sm font-bold text-[var(--co-brown)]">
              Coconut → water
            </motion.div>
            <motion.div style={{ opacity: packOpacity, scale: packScale, y: packY, clipPath }} className="absolute inset-0">
              <Image
                src={publicAssets.water.floating}
                alt=".CO coconut water bottle packshot"
                fill
                priority
                sizes="(min-width: 1024px) 52vw, 92vw"
                className="object-contain p-10 drop-shadow-[0_48px_80px_rgba(58,36,22,0.28)] md:p-14"
              />
            </motion.div>
            <motion.div style={{ opacity: packOpacity }} className="absolute bottom-8 left-8 right-8 rounded-[36px] border border-[var(--co-border)] bg-[var(--co-cream)] p-5 md:left-auto md:w-72">
              <p className="co-label">Final packshot</p>
              <p className="mt-3 text-3xl font-bold leading-none text-[var(--co-brown)]">Cold. Clean. Coconut.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
