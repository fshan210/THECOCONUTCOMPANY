"use client";

import Image from "next/image";
import { Droplets, Leaf, Sparkles } from "lucide-react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Appear } from "@/components/motion/Appear";
import { CtaLink, DoodleImage } from "@/components/PublicDesign";
import { useCoconutMotionMode } from "@/lib/animations/coconut-motion";
import { publicAssets } from "@/lib/public-assets";

const stages = [
  {
    label: "Coconut",
    detail: "Fresh coconut character, close to origin.",
    image: publicAssets.water.hero,
    icon: Leaf
  },
  {
    label: "Coconut Water",
    detail: "Clean, light, naturally refreshing.",
    image: publicAssets.water.ingredients,
    icon: Droplets
  },
  {
    label: ".CO Product",
    detail: "Made for fridge doors and everyday rituals.",
    image: publicAssets.water.floating,
    icon: Sparkles
  }
];

function RippleLines() {
  return (
    <svg aria-hidden="true" viewBox="0 0 520 180" className="h-full w-full">
      {[42, 82, 122].map((y) => (
        <path key={y} d={`M24 ${y}c54-34 106-34 160 0s106 34 160 0 96-31 150-3`} stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      ))}
    </svg>
  );
}

export function HeroStoryCanvas() {
  const ref = useRef<HTMLElement>(null);
  const { shouldReduce, isMobile } = useCoconutMotionMode();
  const [progress, setProgress] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: isMobile ? 150 : 88, damping: isMobile ? 36 : 30, mass: 0.38 });

  const visualY = useTransform(smoothProgress, [0, 1], shouldReduce || isMobile ? [0, 0] : [18, -28]);
  const patternY = useTransform(smoothProgress, [0, 1], shouldReduce || isMobile ? [0, 0] : [0, -42]);
  const coconutOpacity = useTransform(smoothProgress, [0, 0.28, 0.46], [1, 0.9, 0]);
  const waterOpacity = useTransform(smoothProgress, [0.22, 0.42, 0.66], [0, 1, 0]);
  const productOpacity = useTransform(smoothProgress, [0.56, 0.76], [0, 1]);
  const productScale = useTransform(smoothProgress, [0.55, 1], [0.96, 1.04]);

  useMotionValueEvent(smoothProgress, "change", (latest) => setProgress(latest));

  const activeStage = progress < 0.34 ? 0 : progress < 0.68 ? 1 : 2;

  return (
    <section ref={ref} className="relative min-h-[210vh] overflow-clip bg-paper md:min-h-[260vh]">
      <div className="sticky top-0 min-h-svh overflow-hidden rounded-b-[2rem] border-b border-coconut/10 bg-paper">
        <div className="editorial-rule pointer-events-none absolute inset-0 opacity-[0.04]" />
        <motion.div style={{ y: patternY }} className="co-wave-pattern pointer-events-none absolute inset-y-0 right-0 w-[32vw] min-w-64 opacity-[0.1]" />
        <DoodleImage src={publicAssets.doodles.rawCoconut} className="left-4 top-28 h-28 w-28 md:h-44 md:w-44" />
        <DoodleImage src={publicAssets.doodles.bottle} className="bottom-20 right-8 h-32 w-32 md:h-48 md:w-48" />

        <div className="mx-auto grid min-h-svh max-w-7xl gap-10 px-5 pb-12 pt-28 md:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:pb-16 lg:pt-32">
          <div className="relative z-10 max-w-2xl">
            <Appear>
              <p className="mb-7 text-[0.72rem] font-medium uppercase tracking-editorial text-grove">Coconut to bottle</p>
              <h1 className="font-display text-5xl font-light leading-[0.96] text-coconut md:text-7xl lg:text-8xl">
                Coconut water, made for living.
              </h1>
              <p className="mt-7 max-w-xl text-base leading-8 text-coconut/72 md:text-lg md:leading-9">
                .CO turns the familiar freshness of coconut into clean everyday products: a cold drink, a simple scoop, a kitchen note, a care ritual.
              </p>
            </Appear>

            <Appear delay={0.08} className="mt-10 grid gap-3 md:max-w-xl">
              {stages.map((stage, index) => {
                const Icon = stage.icon;
                const active = activeStage === index;
                return (
                  <motion.div
                    key={stage.label}
                    animate={{ opacity: active ? 1 : 0.55, x: active ? 0 : -4 }}
                    transition={{ duration: 0.35, ease: [0.215, 0.61, 0.355, 1] }}
                    className="grid grid-cols-[3rem_1fr] items-start gap-4 rounded-2xl border border-coconut/10 bg-[#fff8ea]/80 px-5 py-5 backdrop-blur"
                  >
                    <span className={`grid h-10 w-10 place-items-center rounded-xl border ${active ? "border-grove bg-grove text-paper" : "border-coconut/12 text-coconut/54"}`}>
                      <Icon size={17} />
                    </span>
                    <span>
                      <span className="block text-sm font-medium uppercase tracking-editorial text-coconut">{stage.label}</span>
                      <span className="mt-2 block text-sm leading-6 text-coconut/66">{stage.detail}</span>
                    </span>
                  </motion.div>
                );
              })}
            </Appear>

            <Appear delay={0.16} className="mt-9 flex flex-wrap gap-4">
              <CtaLink href="/shop/co-water">Taste .CO Water</CtaLink>
              <CtaLink href="/products" variant="secondary">Explore products</CtaLink>
            </Appear>
          </div>

          <Appear delay={0.1} className="relative z-10">
            <motion.div style={{ y: visualY }} className="relative min-h-[440px] overflow-hidden rounded-3xl border border-coconut/10 bg-[#fff8ea] shadow-[0_28px_90px_rgba(62,46,31,0.12)] md:min-h-[680px]">
              <div className="absolute inset-5 rounded-[1.35rem] border border-coconut/8" />
              <motion.div style={{ opacity: coconutOpacity }} className="absolute inset-0">
                <Image src={publicAssets.water.hero} alt="Tender coconut and .CO coconut water story" fill priority sizes="(min-width: 1024px) 52vw, 92vw" className="object-contain p-8 md:p-12" />
              </motion.div>
              <motion.div style={{ opacity: waterOpacity }} className="absolute inset-0">
                <Image src={publicAssets.water.ingredients} alt="Coconut water ingredient composition" fill priority sizes="(min-width: 1024px) 52vw, 92vw" className="object-contain p-8 md:p-12" />
              </motion.div>
              <motion.div style={{ opacity: productOpacity, scale: productScale }} className="absolute inset-0">
                <Image src={publicAssets.water.floating} alt=".CO coconut water pack" fill priority sizes="(min-width: 1024px) 52vw, 92vw" className="object-contain p-8 md:p-12 drop-shadow-[0_34px_58px_rgba(62,46,31,0.2)]" />
              </motion.div>
              <motion.div style={{ opacity: waterOpacity }} className="absolute inset-x-[8%] top-[35%] h-36 text-grove/50">
                <RippleLines />
              </motion.div>
              <div className="absolute bottom-7 left-7 rounded-2xl border border-coconut/10 bg-paper/86 px-4 py-3 text-[0.64rem] font-medium uppercase tracking-editorial text-coconut/68 backdrop-blur">
                {stages[activeStage].label}
              </div>
            </motion.div>
          </Appear>
        </div>
      </div>
    </section>
  );
}
