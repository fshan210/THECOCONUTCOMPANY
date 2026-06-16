"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Bell, Droplets, Leaf, Sparkles } from "lucide-react";
import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { useCoconutMotionMode } from "@/lib/animations/coconut-motion";

const stages = [
  "Whole Coconut",
  "Coconut Water",
  "Food Products",
  "Lifestyle Products",
  "Global Brand Vision"
];

const emergeItems = [
  { label: "Hydration", x: "-36%", y: "-22%", delay: 0.4, icon: Droplets },
  { label: "Creamery", x: "20%", y: "-32%", delay: 0.75, icon: Sparkles },
  { label: "Kitchen", x: "-26%", y: "28%", delay: 1.1, icon: Leaf },
  { label: "Care", x: "30%", y: "22%", delay: 1.45, icon: Sparkles }
];

function CoconutFallback() {
  return (
    <div className="relative h-[330px] w-[330px] md:h-[470px] md:w-[470px]">
      <Image
        src="/assets/transparent/co-tender-coconut.webp"
        alt="Tender green coconut with water droplets"
        fill
        priority
        sizes="(min-width: 768px) 470px, 330px"
        className="object-contain drop-shadow-[0_34px_46px_rgba(62,46,31,0.22)]"
      />
    </div>
  );
}

export function CoconutEcosystem() {
  const ref = useRef<HTMLDivElement>(null);
  const motionMode = useCoconutMotionMode();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const x = useSpring(mouseX, { stiffness: 120, damping: 22, mass: 0.5 });
  const y = useSpring(mouseY, { stiffness: 120, damping: 22, mass: 0.5 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 28]);
  const scale = useTransform(scrollYProgress, [0, 0.28, 0.5, 0.72, 1], [1, 0.9, 0.96, 0.92, 1.04]);
  const waterOpacity = useTransform(scrollYProgress, [0.12, 0.28, 0.48], [0, 1, 0.35]);
  const creamOpacity = useTransform(scrollYProgress, [0.34, 0.5, 0.7], [0, 1, 0.45]);
  const lifeOpacity = useTransform(scrollYProgress, [0.55, 0.72, 0.95], [0, 1, 0.5]);
  const globalOpacity = useTransform(scrollYProgress, [0.72, 0.95], [0, 1]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.72, 0.95], [1, 0.92, 1]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-[linear-gradient(145deg,#fffdf8_0%,#F5EBD7_45%,#A8B07B_140%)] md:min-h-[330vh]">
      <div className="co-wave-pattern pointer-events-none absolute inset-y-0 left-0 w-60 opacity-[0.08]" />
      <div className="sticky top-20 mx-auto grid min-h-[calc(100svh-80px)] max-w-7xl items-center gap-8 px-5 py-10 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:py-14">
        <div className="max-w-md">
          <p className="mb-5 text-[0.72rem] uppercase tracking-editorial text-grove">One coconut. Endless possibilities.</p>
          <motion.h2
            style={{ opacity: motionMode.shouldReduce ? 1 : titleOpacity }}
            className="mb-6 font-display text-5xl leading-[0.98] text-ink md:text-7xl"
          >
            A lifestyle house, grown from a single origin.
          </motion.h2>
          <p className="mb-7 text-sm leading-7 text-muted md:text-base">
            From Palakkad farms to everyday hydration, .CO turns one ingredient into fresh drinks, dessert rituals, pantry staples, care products, and a global coconut culture.
          </p>
          <div className="mb-8 flex flex-wrap gap-3">
            <Link href="/shop" className="co-button-soft inline-flex min-h-12 items-center gap-3 bg-coconut px-5 py-3 text-sm text-paper transition hover:bg-ink">
              Explore products <ArrowUpRight size={15} />
            </Link>
            <Link href="/sign-up" className="co-neu inline-flex min-h-12 items-center gap-3 px-5 py-3 text-sm text-coconut transition hover:-translate-y-0.5">
              Notify me <Bell size={15} />
            </Link>
          </div>
          <div className="space-y-4">
            {stages.map((stage, index) => (
              <StageIndicator key={stage} stage={stage} index={index} progress={scrollYProgress} />
            ))}
          </div>
        </div>

        <div
          className="relative mx-auto flex min-h-[430px] w-full max-w-2xl items-center justify-center overflow-hidden md:min-h-[540px]"
          onMouseMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            mouseX.set(Math.max(-10, Math.min(10, (event.clientX - rect.left - rect.width / 2) / 18)));
            mouseY.set(Math.max(-8, Math.min(8, (event.clientY - rect.top - rect.height / 2) / 20)));
          }}
          onMouseLeave={() => {
            mouseX.set(0);
            mouseY.set(0);
          }}
        >
          <motion.div style={{ x, y, scale, rotate }} className="relative h-[330px] w-[330px] md:h-[470px] md:w-[470px]">
            <motion.div
              animate={motionMode.shouldReduce ? { y: 0 } : { y: [-8, 8, -8] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 grid place-items-center rounded-full"
            >
              <CoconutFallback />
            </motion.div>

            <motion.div style={{ opacity: waterOpacity }} className="absolute left-[26%] top-[20%] h-24 w-24 rounded-full border border-grove/15 bg-paper/35 blur-2xl" />
            <motion.div style={{ opacity: creamOpacity }} className="absolute right-[18%] top-[24%] h-24 w-24 rounded-full border border-sun/20 bg-sun/20 blur-2xl" />
            <motion.div style={{ opacity: lifeOpacity }} className="absolute bottom-[18%] left-[24%] h-24 w-24 rounded-full border border-coconut/10 bg-coconut/10 blur-2xl" />
            <motion.div style={{ opacity: globalOpacity }} className="absolute inset-[20%] rounded-full border border-grove/35">
              <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-grove/20" />
              <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-grove/20" />
            </motion.div>

            {emergeItems.map((item) => {
              const Icon = item.icon;
              return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.92, x: "-50%", y: "-50%" }}
                animate={{ opacity: [0, 1, 0.72], scale: [0.92, 1, 0.98] }}
                transition={{
                  duration: motionMode.shouldReduce ? 3.2 : 4.8,
                  delay: item.delay,
                  repeat: motionMode.shouldReduce ? 0 : Infinity,
                  repeatDelay: 8,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="absolute left-1/2 top-1/2 rounded-full border border-coconut/10 bg-porcelain/80 px-4 py-2 text-[0.65rem] uppercase tracking-editorial text-coconut shadow-soft backdrop-blur-md"
                style={{ marginLeft: item.x, marginTop: item.y }}
              >
                <span className="inline-flex items-center gap-2"><Icon size={13} /> {item.label}</span>
              </motion.div>
              );
            })}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="co-glass absolute bottom-4 left-3 max-w-[172px] p-4 text-xs leading-5 text-muted md:left-8"
            >
              <span className="mb-2 block text-[0.62rem] uppercase tracking-editorial text-grove">Launching soon</span>
              .CO Water in a 330 ml everyday format.
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="co-glass absolute right-3 top-8 max-w-[168px] p-4 text-xs leading-5 text-muted md:right-4"
            >
              <span className="mb-2 block text-[0.62rem] uppercase tracking-editorial text-coconut">One ingredient</span>
              Beverage, food, care, kitchen, and lifestyle.
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StageIndicator({
  stage,
  index,
  progress
}: {
  stage: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const start = index / stages.length;
  const opacity = useTransform(progress, [start, start + 0.12, start + 0.2], [0.35, 1, 0.45]);

  return (
    <motion.div style={{ opacity }} className="flex items-center gap-4">
      <span className="h-px w-10 bg-coconut/50" />
      <span className="text-sm uppercase tracking-editorial text-muted">{stage}</span>
    </motion.div>
  );
}
