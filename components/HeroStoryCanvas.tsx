"use client";

import Image from "next/image";
import { ArrowDown, Droplets, Leaf, Sparkles } from "lucide-react";
import { motion, useMotionTemplate, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
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

const droplets = [
  { left: "18%", top: "24%", size: "h-2 w-2", delay: 0 },
  { left: "28%", top: "63%", size: "h-3 w-3", delay: 0.2 },
  { left: "72%", top: "30%", size: "h-2.5 w-2.5", delay: 0.45 },
  { left: "82%", top: "58%", size: "h-2 w-2", delay: 0.7 },
  { left: "44%", top: "18%", size: "h-1.5 w-1.5", delay: 0.9 },
  { left: "60%", top: "76%", size: "h-2 w-2", delay: 1.1 }
];

export function HeroStoryCanvas() {
  const ref = useRef<HTMLElement>(null);
  const { shouldReduce, isMobile } = useCoconutMotionMode();
  const [progress, setProgress] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: isMobile ? 150 : 88, damping: isMobile ? 36 : 30, mass: 0.38 });

  const visualY = useTransform(smoothProgress, [0, 1], shouldReduce || isMobile ? [0, 0] : [24, -36]);
  const patternY = useTransform(smoothProgress, [0, 1], shouldReduce || isMobile ? [0, 0] : [0, -42]);
  const coconutOpacity = useTransform(smoothProgress, [0, 0.3, 0.52], [1, 0.95, 0]);
  const coconutLeftX = useTransform(smoothProgress, [0.12, 0.48], ["0%", "-11%"]);
  const coconutRightX = useTransform(smoothProgress, [0.12, 0.48], ["0%", "11%"]);
  const waterOpacity = useTransform(smoothProgress, [0.18, 0.42, 0.72], [0, 1, 0.34]);
  const liquidPath = useTransform(smoothProgress, [0.18, 0.62], [0.05, 1]);
  const productOpacity = useTransform(smoothProgress, [0.5, 0.72], [0, 1]);
  const productScale = useTransform(smoothProgress, [0.48, 1], [0.88, 1.08]);
  const productY = useTransform(smoothProgress, [0.45, 1], [36, -10]);
  const reveal = useTransform(smoothProgress, [0.48, 0.78], [0, 82]);
  const bottleClip = useMotionTemplate`circle(${reveal}% at 50% 52%)`;

  useMotionValueEvent(smoothProgress, "change", (latest) => setProgress(latest));

  const activeStage = progress < 0.34 ? 0 : progress < 0.68 ? 1 : 2;

  return (
    <section ref={ref} className="relative min-h-[220vh] overflow-clip bg-paper md:min-h-[285vh]">
      <div className="sticky top-0 z-0 min-h-svh overflow-hidden rounded-b-[2rem] border-b border-coconut/10 bg-paper">
        <div className="editorial-rule pointer-events-none absolute inset-0 opacity-[0.04]" />
        <motion.div style={{ y: patternY }} className="co-wave-pattern pointer-events-none absolute inset-y-0 right-0 w-[32vw] min-w-64 opacity-[0.1]" />
        <DoodleImage src={publicAssets.doodles.rawCoconut} className="left-4 top-28 h-28 w-28 md:h-44 md:w-44" />
        <DoodleImage src={publicAssets.doodles.bottle} className="bottom-20 right-8 h-32 w-32 md:h-48 md:w-48" />

        <div className="mx-auto grid min-h-svh max-w-7xl gap-10 px-5 pb-12 pt-28 md:px-8 lg:grid-cols-[0.76fr_1.24fr] lg:items-center lg:pb-16 lg:pt-32">
          <div className="relative z-10 max-w-2xl">
            <Appear>
              <p className="mb-7 inline-flex items-center gap-3 rounded-full border border-coconut/10 bg-[#fff8ea] px-4 py-3 text-[0.72rem] font-medium uppercase tracking-editorial text-grove">
                Coconut <ArrowDown size={13} /> Bottle
              </p>
              <h1 className="font-display text-6xl font-light leading-[0.9] text-coconut md:text-8xl lg:text-[7.5rem]">
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
            <motion.div style={{ y: visualY }} className="relative min-h-[470px] overflow-hidden rounded-3xl border border-coconut/10 bg-[#fff8ea] shadow-[0_32px_110px_rgba(62,46,31,0.18)] md:min-h-[700px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_46%,rgba(216,192,122,0.34),transparent_30%),radial-gradient(circle_at_72%_28%,rgba(74,111,74,0.18),transparent_24%)]" />
              <div className="absolute inset-5 rounded-[1.35rem] border border-coconut/8" />

              <motion.div style={{ opacity: coconutOpacity, x: coconutLeftX }} className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
                <Image src={publicAssets.brand.tenderCoconut} alt="Fresh tender coconut origin" fill priority sizes="(min-width: 1024px) 30vw, 50vw" className="object-cover object-[42%_52%] scale-110" />
              </motion.div>
              <motion.div style={{ opacity: coconutOpacity, x: coconutRightX }} className="absolute inset-y-0 right-0 w-1/2 overflow-hidden">
                <Image src={publicAssets.brand.tenderCoconut} alt="" aria-hidden="true" fill priority sizes="(min-width: 1024px) 30vw, 50vw" className="object-cover object-[58%_52%] scale-110" />
              </motion.div>
              <motion.div style={{ opacity: coconutOpacity }} className="absolute inset-0 bg-coconut/10 mix-blend-multiply" />

              <motion.svg aria-hidden="true" viewBox="0 0 860 620" className="absolute inset-0 h-full w-full text-grove/60" style={{ opacity: waterOpacity }}>
                <motion.path
                  d="M92 330 C216 222 322 424 442 296 C552 178 658 248 760 168"
                  pathLength={liquidPath}
                  stroke="currentColor"
                  strokeWidth="42"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.22"
                  filter="url(#softLiquid)"
                />
                <motion.path
                  d="M92 360 C246 270 324 470 470 334 C602 214 674 306 792 226"
                  pathLength={liquidPath}
                  stroke="#F5EBD7"
                  strokeWidth="18"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.82"
                />
                <defs>
                  <filter id="softLiquid">
                    <feGaussianBlur stdDeviation="10" />
                  </filter>
                </defs>
              </motion.svg>

              <motion.div style={{ opacity: waterOpacity }} className="absolute inset-x-[8%] top-[35%] h-36 text-paper/80">
                <RippleLines />
              </motion.div>

              {droplets.map((drop) => (
                <motion.span
                  key={`${drop.left}-${drop.top}`}
                  aria-hidden="true"
                  style={{ opacity: waterOpacity, left: drop.left, top: drop.top }}
                  animate={shouldReduce ? { y: 0 } : { y: [0, -18, 0], scale: [0.8, 1.08, 0.86] }}
                  transition={{ duration: 4.8, repeat: Infinity, delay: drop.delay, ease: "easeInOut" }}
                  className={`absolute rounded-full bg-paper/80 shadow-[0_0_22px_rgba(245,235,215,0.78)] ${drop.size}`}
                />
              ))}

              <motion.div style={{ opacity: productOpacity, scale: productScale, y: productY, clipPath: bottleClip }} className="absolute inset-0">
                <Image src={publicAssets.water.floating} alt=".CO coconut water bottle" fill priority sizes="(min-width: 1024px) 52vw, 92vw" className="object-contain p-8 drop-shadow-[0_44px_72px_rgba(62,46,31,0.28)] md:p-12" />
              </motion.div>
              <motion.div style={{ opacity: productOpacity }} className="absolute inset-x-[18%] bottom-12 h-14 rounded-full bg-coconut/18 blur-2xl" />

              <div className="absolute bottom-7 left-7 rounded-2xl border border-coconut/10 bg-paper/90 px-4 py-3 text-[0.64rem] font-medium uppercase tracking-editorial text-coconut/68 backdrop-blur">
                {stages[activeStage].label}
              </div>
            </motion.div>
          </Appear>
        </div>
      </div>
    </section>
  );
}
