"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Droplets } from "lucide-react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Appear } from "@/components/motion/Appear";
import { useCoconutMotionMode } from "@/lib/animations/coconut-motion";

const storyStages = [
  { label: "Coconut", detail: "Fresh tender coconut from origin." },
  { label: "Coconut Water", detail: "Clean liquid ritual for heat, travel and table." },
  { label: ".CO Product", detail: "Resolved into the first everyday bottle." }
];

function RippleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 420 180" className="h-full w-full">
      <path d="M22 54c45-32 88-32 132 0s88 32 132 0 78-29 112-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M22 91c45-32 88-32 132 0s88 32 132 0 78-29 112-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M22 128c45-32 88-32 132 0s88 32 132 0 78-29 112-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function HeroStoryCanvas() {
  const ref = useRef<HTMLElement>(null);
  const { shouldReduce, isMobile } = useCoconutMotionMode();
  const [progress, setProgress] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: isMobile ? 160 : 92, damping: isMobile ? 38 : 30, mass: 0.35 });

  const coconutOpacity = useTransform(smoothProgress, [0, 0.36, 0.52], [1, 0.82, 0]);
  const coconutY = useTransform(smoothProgress, [0, 1], shouldReduce || isMobile ? [0, 0] : [0, -52]);
  const rippleOpacity = useTransform(smoothProgress, [0.18, 0.38, 0.72], [0, 1, 0.18]);
  const rippleY = useTransform(smoothProgress, [0, 1], shouldReduce || isMobile ? [0, 0] : [28, -26]);
  const bottleOpacity = useTransform(smoothProgress, [0.48, 0.78], [0, 1]);
  const bottleY = useTransform(smoothProgress, [0, 1], shouldReduce || isMobile ? [0, 0] : [42, -18]);
  const bottleScale = useTransform(smoothProgress, [0.44, 1], [0.92, 1.04]);
  const patternY = useTransform(smoothProgress, [0, 1], shouldReduce || isMobile ? [0, 0] : [0, -46]);

  useMotionValueEvent(smoothProgress, "change", (latest) => setProgress(latest));

  const activeStage = progress < 0.34 ? 0 : progress < 0.68 ? 1 : 2;

  return (
    <section ref={ref} className="relative min-h-[220vh] overflow-clip bg-paper md:min-h-[280vh]">
      <div className="sticky top-0 min-h-svh overflow-hidden border-b border-coconut/10">
        <div className="editorial-rule pointer-events-none absolute inset-0 opacity-[0.045]" />
        <motion.div
          aria-hidden="true"
          style={{ y: patternY }}
          className="co-wave-pattern pointer-events-none absolute inset-y-0 right-0 w-[30vw] min-w-56 opacity-[0.11]"
        />
        <div className="mx-auto grid min-h-svh max-w-7xl gap-10 px-5 pb-12 pt-28 md:px-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-center lg:pb-16 lg:pt-32">
          <div className="relative z-10 max-w-2xl">
            <Appear>
              <p className="mb-7 text-[0.72rem] font-medium uppercase tracking-editorial text-grove">Whole coconut to .CO water</p>
              <h1 className="max-w-3xl font-display text-5xl font-light leading-[0.96] text-coconut md:text-7xl lg:text-8xl">
                The coconut becomes the drink.
              </h1>
              <p className="mt-7 max-w-xl text-base leading-8 text-coconut/70 md:text-lg md:leading-9">
                A quiet scroll story for the first .CO ritual: origin fruit, natural coconut water, and a bottle made for everyday living.
              </p>
            </Appear>

            <Appear delay={0.08} className="mt-10 grid gap-px border-y border-coconut/10 md:max-w-xl">
              {storyStages.map((stage, index) => (
                <motion.div
                  key={stage.label}
                  animate={{ opacity: activeStage === index ? 1 : 0.48, x: activeStage === index ? 0 : -4 }}
                  transition={{ duration: 0.35, ease: [0.215, 0.61, 0.355, 1] }}
                  className="grid grid-cols-[3rem_1fr] items-start gap-4 py-5"
                >
                  <span className={`grid h-10 w-10 place-items-center border text-sm ${activeStage === index ? "border-grove bg-grove text-paper" : "border-coconut/12 text-coconut/54"}`}>
                    {index === 1 ? <Droplets size={17} /> : `0${index + 1}`}
                  </span>
                  <span>
                    <span className="block text-sm font-medium uppercase tracking-editorial text-coconut">{stage.label}</span>
                    <span className="mt-2 block text-sm leading-6 text-coconut/66">{stage.detail}</span>
                  </span>
                </motion.div>
              ))}
            </Appear>

            <Appear delay={0.16} className="mt-9 flex flex-wrap gap-4">
              <Link href="/shop/co-water" className="inline-flex min-h-12 items-center gap-3 bg-coconut px-6 py-4 text-sm font-medium text-paper transition hover:bg-grove">
                See .CO Water <ArrowUpRight size={16} />
              </Link>
              <Link href="/products" className="inline-flex min-h-12 items-center gap-3 border border-coconut/14 px-6 py-4 text-sm font-medium text-coconut transition hover:border-grove hover:text-grove">
                Explore ecosystem
              </Link>
            </Appear>
          </div>

          <Appear delay={0.1} className="relative z-10">
            <div className="relative min-h-[430px] overflow-hidden border border-coconut/10 bg-[#fff8ea] shadow-[0_28px_90px_rgba(62,46,31,0.12)] md:min-h-[680px]">
              <div className="absolute inset-x-8 top-8 h-px bg-coconut/12" />
              <div className="absolute bottom-8 left-8 top-8 w-px bg-coconut/12" />
              <motion.div style={{ opacity: coconutOpacity, y: coconutY }} className="absolute inset-0 grid place-items-center">
                <Image
                  src="/assets/transparent/co-tender-coconut.webp"
                  alt="Tender coconut"
                  width={760}
                  height={760}
                  priority
                  sizes="(min-width: 1024px) 44vw, 92vw"
                  className="w-[76%] max-w-[560px] object-contain drop-shadow-[0_34px_58px_rgba(62,46,31,0.18)]"
                />
              </motion.div>
              <motion.div style={{ opacity: rippleOpacity, y: rippleY }} className="absolute inset-x-[10%] top-[34%] h-40 text-grove/55">
                <RippleMark />
              </motion.div>
              <motion.div style={{ opacity: rippleOpacity }} className="absolute left-[19%] top-[28%] h-44 w-44 rounded-full bg-palm/20 blur-3xl" />
              <motion.div style={{ opacity: bottleOpacity, y: bottleY, scale: bottleScale }} className="absolute inset-0 grid place-items-center">
                <Image
                  src="/assets/transparent/co-water-bottle.webp"
                  alt=".CO Coconut Water bottle"
                  width={620}
                  height={820}
                  priority
                  sizes="(min-width: 1024px) 42vw, 88vw"
                  className="h-[76%] w-auto object-contain drop-shadow-[0_36px_62px_rgba(62,46,31,0.22)]"
                />
              </motion.div>
              <div className="absolute bottom-8 right-8 border border-coconut/10 bg-paper/80 px-4 py-3 text-[0.64rem] font-medium uppercase tracking-editorial text-coconut/62 backdrop-blur">
                {storyStages[activeStage].label}
              </div>
            </div>
          </Appear>
        </div>
      </div>
    </section>
  );
}
