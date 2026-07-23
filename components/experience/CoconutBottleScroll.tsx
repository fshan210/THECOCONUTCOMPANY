"use client";

import { AnimatePresence, motion, useMotionValueEvent, useTransform } from "framer-motion";
import { Droplets, Leaf } from "lucide-react";
import { useState } from "react";
import { BlurFade } from "@/components/ui/BlurFade";
import { coconutScrollStages, coconutStageIndex } from "@/lib/experience/coconut-scroll-config";
import { CoconutBottleFallback } from "./CoconutBottleFallback";
import { CoconutFrameSequence } from "./CoconutFrameSequence";
import { useCoconutScrollProgress } from "./useCoconutScrollProgress";

export function CoconutBottleScroll() {
  const { sectionRef, progress, reducedMotion } = useCoconutScrollProgress();
  const [activeStage, setActiveStage] = useState(0);
  const mediaY = useTransform(progress, [0, 1], [9, -9]);
  const sheenX = useTransform(progress, [0, 0.52, 1], ["-120%", "20%", "130%"]);

  useMotionValueEvent(progress, "change", (value) => {
    const nextStage = coconutStageIndex(value);
    setActiveStage((current) => current === nextStage ? current : nextStage);
  });

  if (reducedMotion) return <CoconutBottleFallback />;

  const stage = coconutScrollStages[activeStage];

  return (
    <section
      ref={sectionRef}
      className="relative h-[195svh] bg-[#f7f2e8] px-3 py-12 md:h-[220svh] md:px-8 md:py-16"
      aria-labelledby="coconut-bottle-story-title"
      data-coconut-scroll-world
    >
      <div className="sticky top-[76px] flex min-h-[calc(100svh-88px)] items-center py-3 md:top-[88px] md:min-h-[calc(100svh-104px)] md:py-5">
        <div className="mx-auto grid h-[min(78svh,780px)] w-full max-w-[1200px] grid-rows-[auto_1fr] overflow-hidden rounded-[30px] border border-white/72 bg-[rgba(249,246,238,.78)] p-3 shadow-[0_30px_85px_rgba(53,39,30,.14),inset_0_1px_0_rgba(255,255,255,.9)] backdrop-blur-2xl md:h-[min(64svh,680px)] md:grid-cols-[.72fr_1.28fr] md:grid-rows-1 md:gap-5 md:rounded-[36px] md:p-5">
          <div className="relative z-10 flex min-h-[150px] flex-col justify-between px-3 py-4 md:min-h-0 md:px-5 md:py-6">
            <BlurFade>
              <div className="flex items-center gap-2 text-[#305a34]">
                <Leaf size={15} strokeWidth={1.7} />
                <p className="text-[9px] font-semibold uppercase tracking-[.17em]">From origin to everyday</p>
              </div>
            </BlurFade>

            <div className="my-4 min-h-[86px] md:my-8 md:min-h-[126px]" aria-live="polite" aria-atomic="true">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={stage.label}
                  initial={{ opacity: 0, y: 10, filter: "blur(7px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
                  transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h2 id="coconut-bottle-story-title" className="font-['Cormorant_Garamond'] text-[31px] leading-[.96] tracking-[-.025em] text-[#35271e] md:text-[48px]">{stage.label}</h2>
                  <p className="mt-3 max-w-[310px] text-[11px] leading-5 text-[#665b51] md:mt-4 md:text-xs md:leading-6">{stage.detail}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div>
              <div className="grid grid-cols-5 gap-1.5" aria-hidden="true">
                {coconutScrollStages.map((item, index) => (
                  <span key={item.label} className="h-1 overflow-hidden rounded-full bg-[#305a34]/10">
                    <motion.span className="block h-full origin-left rounded-full bg-[#305a34]" animate={{ scaleX: index <= activeStage ? 1 : 0 }} transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }} />
                  </span>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[.13em] text-[#305a34]/70">
                <Droplets size={13} strokeWidth={1.6} /> Scroll to follow the flow
              </div>
            </div>
          </div>

          <motion.div className="relative min-h-0 overflow-hidden rounded-[24px] bg-[#d9bd8d] shadow-[inset_0_1px_0_rgba(255,255,255,.6)] md:rounded-[28px]" style={{ y: mediaY }}>
            <CoconutFrameSequence progress={progress} />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,.04),transparent_58%,rgba(35,62,31,.10))]" />
            <motion.div aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-[32%] -skew-x-12 bg-gradient-to-r from-transparent via-white/14 to-transparent blur-xl" style={{ x: sheenX }} />
          </motion.div>
        </div>
      </div>
      <p className="sr-only">Scroll forward to follow a whole coconut becoming the final .CO coconut water bottle. Scroll backward to reverse every stage.</p>
    </section>
  );
}
