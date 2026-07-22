"use client";

import { motion, useMotionValueEvent, useTransform } from "framer-motion";
import { Droplets, Leaf } from "lucide-react";
import { useState } from "react";
import { CoconutBottleFallback } from "./CoconutBottleFallback";
import { useCoconutScrollProgress } from "./useCoconutScrollProgress";
import {
  coconutScrollAssets,
  coconutScrollStages,
  coconutStageIndex,
} from "@/lib/experience/coconut-scroll-config";

function ResponsiveFrame({
  frame,
  className,
}: {
  frame: (typeof coconutScrollAssets)["opening"] | (typeof coconutScrollAssets)["final"];
  className?: string;
}) {
  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={frame.desktop.avif} type="image/avif" />
      <source media="(min-width: 768px)" srcSet={frame.desktop.jpeg} type="image/jpeg" />
      <source srcSet={frame.mobile.avif} type="image/avif" />
      <motion.img
        src={frame.mobile.jpeg}
        alt={frame.alt}
        width={frame.mobile.width}
        height={frame.mobile.height}
        loading="lazy"
        decoding="async"
        className={className}
      />
    </picture>
  );
}

export function CoconutBottleScroll() {
  const { sectionRef, progress, reducedMotion } = useCoconutScrollProgress();
  const [activeStage, setActiveStage] = useState(0);

  useMotionValueEvent(progress, "change", (value) => {
    const nextStage = coconutStageIndex(value);
    setActiveStage((current) => current === nextStage ? current : nextStage);
  });

  const openingOpacity = useTransform(progress, [0, 0.35, 0.67], [1, 1, 0]);
  const openingScale = useTransform(progress, [0, 0.35, 0.67], [1, 1.012, 1.035]);
  const finalOpacity = useTransform(progress, [0.38, 0.62, 0.9], [0, 0.32, 1]);
  const finalY = useTransform(progress, [0.38, 0.7, 0.94], [34, 8, 0]);
  const finalScale = useTransform(progress, [0.38, 0.74, 1], [0.985, 0.996, 1]);
  const openingCrownOpacity = useTransform(progress, [0.12, 0.22, 0.46, 0.56], [0, 1, 1, 0]);
  const openingCrownY = useTransform(progress, [0.18, 0.48], [0, -54]);
  const openingCrownRotate = useTransform(progress, [0.18, 0.48], [0, 13]);
  const waterOpacity = useTransform(progress, [0.25, 0.34, 0.73, 0.84], [0, 0.92, 0.92, 0]);
  const waterScaleY = useTransform(progress, [0.27, 0.48, 0.72], [0, 0.72, 1]);
  const stageOpacity = useTransform(progress, [0.02, 0.1, 0.93, 1], [0, 1, 1, 0]);
  const stageY = useTransform(progress, [0.02, 0.12], [12, 0]);

  if (reducedMotion) return <CoconutBottleFallback />;

  const stage = coconutScrollStages[activeStage];

  return (
    <section
      ref={sectionRef}
      className="relative h-[300svh] bg-[#e9dbc2] md:h-[360svh]"
      aria-labelledby="coconut-bottle-story-title"
      data-coconut-scroll-world
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#e9dbc2]">
        <motion.div className="absolute inset-0" style={{ opacity: openingOpacity, scale: openingScale }}>
          <ResponsiveFrame frame={coconutScrollAssets.opening} className="absolute inset-0 size-full object-cover" />
        </motion.div>

        <motion.div className="absolute inset-0" style={{ opacity: finalOpacity, y: finalY, scale: finalScale }}>
          <ResponsiveFrame frame={coconutScrollAssets.final} className="absolute inset-0 size-full object-cover" />
        </motion.div>

        <motion.div
          aria-hidden="true"
          className="absolute left-1/2 top-[32.5%] h-8 w-20 -translate-x-1/2 rounded-[50%] border border-[#d7ef9d]/75 bg-[#456d2c]/78 shadow-[0_8px_22px_rgba(44,76,33,.24)] md:top-[29%] md:h-9 md:w-24"
          style={{ opacity: openingCrownOpacity, y: openingCrownY, rotate: openingCrownRotate }}
        />

        <motion.svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute left-1/2 top-[34%] h-[35%] w-[8%] -translate-x-1/2 overflow-visible md:top-[31%] md:h-[39%] md:w-[5%]"
          style={{ opacity: waterOpacity, scaleY: waterScaleY, transformOrigin: "50% 0%" }}
        >
          <defs>
            <linearGradient id="coconut-water-stream" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f5fff1" stopOpacity=".94" />
              <stop offset=".52" stopColor="#d9f0d4" stopOpacity=".78" />
              <stop offset="1" stopColor="#fff" stopOpacity=".25" />
            </linearGradient>
            <filter id="coconut-water-glow" x="-80%" y="-20%" width="260%" height="160%">
              <feGaussianBlur stdDeviation="2.2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <path d="M52 0 C42 18,62 34,48 52 C37 68,58 82,50 100" fill="none" stroke="url(#coconut-water-stream)" strokeWidth="8" strokeLinecap="round" filter="url(#coconut-water-glow)" />
          <path d="M51 1 C47 24,55 47,50 99" fill="none" stroke="rgba(255,255,255,.9)" strokeWidth="1.5" strokeLinecap="round" />
        </motion.svg>

        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,239,224,.04),transparent_52%,rgba(31,56,30,.18))]" />

        <motion.div
          className="absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-4 right-4 z-10 md:bottom-8 md:left-8 md:right-auto md:w-[390px]"
          style={{ opacity: stageOpacity, y: stageY }}
        >
          <div className="rounded-[24px] border border-white/55 bg-[rgba(247,242,232,.48)] p-4 shadow-[0_18px_55px_rgba(53,39,30,.14)] backdrop-blur-2xl md:p-5">
            <div className="flex items-center gap-2 text-[#305a34]">
              {activeStage < 2 ? <Leaf size={15} strokeWidth={1.7} /> : <Droplets size={15} strokeWidth={1.7} />}
              <p className="text-[9px] font-semibold uppercase tracking-[.16em]">Nature, bottled carefully</p>
            </div>
            <div className="mt-3 min-h-[54px]" aria-live="polite" aria-atomic="true">
              <h2 id="coconut-bottle-story-title" className="font-['Cormorant_Garamond'] text-[27px] leading-none text-[#35271e] md:text-[34px]">{stage.label}</h2>
              <p className="mt-2 text-[11px] leading-5 text-[#5e554d] md:text-xs">{stage.detail}</p>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-1.5" aria-hidden="true">
              {coconutScrollStages.map((item, index) => (
                <span key={item.label} className="h-1 overflow-hidden rounded-full bg-white/45">
                  <motion.span className="block h-full origin-left rounded-full bg-[#305a34]" animate={{ scaleX: index <= activeStage ? 1 : 0 }} transition={{ duration: 0.24 }} />
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        <p className="sr-only">Scroll forward to transform a whole coconut into the final .CO coconut water bottle. Scroll backward to reverse the process.</p>
      </div>
    </section>
  );
}
