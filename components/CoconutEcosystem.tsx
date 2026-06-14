"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useCoconutMotionMode } from "@/lib/animations/coconut-motion";

const HeroCoconut3D = dynamic(() => import("@/components/HeroCoconut3D"), {
  ssr: false,
  loading: () => (
    <div className="h-[330px] w-[330px] rounded-full bg-[radial-gradient(circle_at_38%_30%,#9a6a43_0,#654026_44%,#2f2018_100%)] shadow-[inset_-28px_-24px_60px_rgba(0,0,0,0.22),0_34px_90px_rgba(33,25,21,0.2)] md:h-[470px] md:w-[470px]" />
  )
});

const stages = [
  "Whole Coconut",
  "Coconut Water",
  "Food Products",
  "Lifestyle Products",
  "Global Brand Vision"
];

const emergeItems = [
  { label: "Coconut Water", x: "-34%", y: "-20%", delay: 1.15 },
  { label: "Coconut Ice Cream", x: "22%", y: "-31%", delay: 1.55 },
  { label: "Coconut Oil", x: "-24%", y: "26%", delay: 1.95 },
  { label: "Coconut Cosmetics", x: "30%", y: "20%", delay: 2.35 }
];

function CoconutFallback() {
  return (
    <div className="h-[330px] w-[330px] rounded-full bg-[radial-gradient(circle_at_38%_30%,#9a6a43_0,#654026_44%,#2f2018_100%)] shadow-[inset_-28px_-24px_60px_rgba(0,0,0,0.22),0_34px_90px_rgba(33,25,21,0.2)] md:h-[470px] md:w-[470px]" />
  );
}

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

export function CoconutEcosystem() {
  const ref = useRef<HTMLDivElement>(null);
  const motionMode = useCoconutMotionMode();
  const [canUse3D, setCanUse3D] = useState(false);
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
  const shellGap = useTransform(scrollYProgress, [0, 0.28, 0.65, 1], [0, 34, 54, 76]);
  const leftShellX = useTransform(shellGap, (value) => -value);
  const rightShellX = useTransform(shellGap, (value) => value);
  const shellOverlayOpacity = useTransform(scrollYProgress, [0.08, 0.34], [0, 0.22]);
  const waterOpacity = useTransform(scrollYProgress, [0.12, 0.28, 0.48], [0, 1, 0.35]);
  const creamOpacity = useTransform(scrollYProgress, [0.34, 0.5, 0.7], [0, 1, 0.45]);
  const lifeOpacity = useTransform(scrollYProgress, [0.55, 0.72, 0.95], [0, 1, 0.5]);
  const globalOpacity = useTransform(scrollYProgress, [0.72, 0.95], [0, 1]);

  useEffect(() => {
    if (motionMode.shouldReduce) {
      setCanUse3D(false);
      return;
    }

    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setCanUse3D(media.matches && supportsWebGL());

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, [motionMode.shouldReduce]);

  return (
    <section ref={ref} className="relative min-h-[240vh] bg-porcelain md:min-h-[420vh]">
      <div className="sticky top-20 mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-10 px-5 py-14 md:grid-cols-[0.9fr_1.1fr] md:px-8">
        <div className="max-w-md">
          <p className="mb-5 text-[0.72rem] uppercase tracking-editorial text-grove">One coconut. Endless possibilities.</p>
          <motion.h2
            style={{ opacity: motionMode.shouldReduce ? 1 : globalOpacity }}
            className="mb-8 font-display text-5xl leading-tight text-ink md:text-7xl"
          >
            A lifestyle house, grown from a single origin.
          </motion.h2>
          <div className="space-y-4">
            {stages.map((stage, index) => (
              <StageIndicator key={stage} stage={stage} index={index} progress={scrollYProgress} />
            ))}
          </div>
        </div>

        <div
          className="relative mx-auto flex min-h-[540px] w-full max-w-2xl items-center justify-center overflow-hidden"
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
          <motion.div style={{ x, y, scale, rotate }} className="relative h-[360px] w-[360px] md:h-[470px] md:w-[470px]">
            <motion.div
              animate={motionMode.shouldReduce ? { rotateY: 0 } : { rotateY: [0, 360] }}
              transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 grid place-items-center rounded-full"
            >
              {canUse3D ? <HeroCoconut3D /> : <CoconutFallback />}
              <motion.div
                style={{ x: leftShellX, opacity: shellOverlayOpacity }}
                className="absolute left-[8%] top-[8%] h-[84%] w-[46%] rounded-l-full border border-coconut/10 bg-coconut/10 blur-[0.5px]"
              />
              <motion.div
                style={{ x: rightShellX, opacity: shellOverlayOpacity }}
                className="absolute right-[8%] top-[8%] h-[84%] w-[46%] rounded-r-full border border-coconut/10 bg-coconut/10 blur-[0.5px]"
              />
            </motion.div>

            <motion.div style={{ opacity: waterOpacity }} className="absolute left-[31%] top-[24%] h-28 w-28 rounded-full bg-[radial-gradient(circle,#d8f4ef_0,#8cc9bd_52%,#4a6f4a_100%)] blur-[1px]" />
            <motion.div style={{ opacity: creamOpacity }} className="absolute right-[22%] top-[28%] h-24 w-24 rounded-full bg-[radial-gradient(circle,#fffdf8_0,#efe2ce_60%,#c5a47d_100%)]" />
            <motion.div style={{ opacity: lifeOpacity }} className="absolute bottom-[22%] left-[30%] h-24 w-16 rounded-full bg-[linear-gradient(160deg,#fffdf8,#d8c6b1,#654026)] shadow-soft" />
            <motion.div style={{ opacity: globalOpacity }} className="absolute inset-[22%] rounded-full border border-grove/40">
              <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-grove/20" />
              <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-grove/20" />
            </motion.div>

            {emergeItems.map((item) => (
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
                {item.label}
              </motion.div>
            ))}
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
