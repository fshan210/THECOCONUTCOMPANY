"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { CTAButton, DoodleIcon, TrustBadge } from "@/components/brand/BrandPrimitives";
import { useCoconutMotionMode } from "@/lib/animations/coconut-motion";

const ease = [0.16, 1, 0.3, 1] as const;

export function HeroStoryCanvas() {
  const { shouldReduce } = useCoconutMotionMode();
  const { scrollY } = useScroll();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [storyStage, setStoryStage] = useState("01 Coconut");
  const mediaY = useTransform(scrollY, [0, 620], [0, shouldReduce ? 0 : -68]);
  const mediaScale = useTransform(scrollY, [0, 620], [1, shouldReduce ? 1 : 0.94]);
  const mediaOpacity = useTransform(scrollY, [0, 420, 720], [1, 0.98, shouldReduce ? 1 : 0.72]);
  const transition = { duration: shouldReduce ? 0 : 0.82, ease };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (shouldReduce) {
      video.pause();
      return;
    }

    void video.play().catch(() => undefined);
  }, [shouldReduce]);

  const updateStoryStage = () => {
    const currentTime = videoRef.current?.currentTime ?? 0;
    const nextStage = currentTime < 2.8 ? "01 Coconut" : currentTime < 6.2 ? "02 Coconut water" : "03 .CO bottle";
    setStoryStage((current) => (current === nextStage ? current : nextStage));
  };

  return (
    <section className="relative isolate overflow-hidden border-b border-[var(--co-border)] bg-[var(--co-cream)]">
      <div className="co-container relative z-10 grid min-h-[calc(100dvh-88px)] grid-cols-[minmax(0,1fr)] items-center gap-8 py-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10 lg:py-16">
        <div className="relative min-w-0 max-w-2xl">
          <motion.p
            initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition}
            className="co-hero-mobile-reveal mb-5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--co-palm)] md:text-sm"
          >
            Tender coconut water from Kerala
          </motion.p>
          <motion.h1
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: shouldReduce ? 0 : 0.1 } } }}
            className="co-display-hero relative z-10 max-w-[10.5ch] uppercase text-[var(--co-ink)]"
          >
            {["Nature's", "hydration.", ".CO by", "nature."].map((line) => (
              <span key={line} className="co-text-mask">
                <motion.span
                  variants={{ hidden: { opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : "108%" }, show: { opacity: 1, y: 0 } }}
                  transition={transition}
                  className="co-hero-mobile-reveal"
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </motion.h1>
          <motion.p
            initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: shouldReduce ? 0 : 0.18 }}
            className="co-hero-mobile-reveal mt-6 max-w-[calc(100vw-24px)] [overflow-wrap:anywhere] text-base leading-7 text-[var(--co-brown)]/88 sm:max-w-md md:text-lg md:leading-8"
          >
            Tender coconut water with a clean Kerala origin story. Cold ritual. Real goodness. Fridge shelf ready.
          </motion.p>
          <motion.div
            initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: shouldReduce ? 0 : 0.78 }}
            className="co-hero-mobile-reveal mt-7 flex flex-wrap gap-3"
          >
            <CTAButton href="/shop">Shop Now</CTAButton>
            <CTAButton href="/about" variant="outline">
              Explore Story
            </CTAButton>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: shouldReduce ? 0 : 0.07, delayChildren: shouldReduce ? 0 : 0.96 } } }}
            className="mt-8 hidden max-w-xl grid-cols-1 gap-3 sm:grid sm:grid-cols-3"
          >
            {[
              <TrustBadge key="leaf" icon="leaf" title="100% Natural" body="Real coconut taste." />,
              <TrustBadge key="drop" icon="drop" title="Nothing Added" body="Clean and simple." />,
              <TrustBadge key="cold" icon="cold" title="Fridge Shelf Ready" body="Best served cold." />
            ].map((badge, index) => (
              <motion.div
                key={index}
                variants={{ hidden: { opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 16 }, show: { opacity: 1, y: 0 } }}
                transition={transition}
                className="co-hero-mobile-reveal"
              >
                {badge}
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          style={{ y: mediaY, scale: mediaScale, opacity: mediaOpacity }}
          initial={false}
          className="co-hero-mobile-media relative min-h-[390px] overflow-hidden rounded-[40px] border border-[var(--co-border)] bg-[var(--co-white)] shadow-[0_20px_60px_rgba(58,36,22,0.10)] md:min-h-[520px] lg:min-h-[650px]"
        >
          <div className="absolute inset-0 overflow-hidden rounded-[inherit] bg-[#e8e4dd]">
            <Image
              src="/assets/video/coconut-to-bottle-poster.webp"
              alt=".CO coconut water bottle formed from a fresh coconut"
              fill
              loading="eager"
              fetchPriority="high"
              unoptimized
              sizes="(min-width: 1024px) 54vw, 92vw"
              className="object-cover object-center"
            />
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              preload="none"
              poster="/assets/video/coconut-to-bottle-poster.webp"
              aria-hidden="true"
              onTimeUpdate={updateStoryStage}
              className="co-hero-film absolute inset-0 h-full w-full object-cover object-center"
            >
              <source src="/assets/video/coconut-to-bottle.webm" type="video/webm" />
              <source src="/assets/video/coconut-to-bottle.mp4" type="video/mp4" />
            </video>
          </div>
          <motion.div
            aria-hidden="true"
            initial={{ scaleY: shouldReduce ? 0 : 1 }}
            animate={{ scaleY: 0 }}
            transition={{ ...transition, delay: shouldReduce ? 0 : 0.08 }}
            className="pointer-events-none absolute inset-0 z-20 hidden origin-bottom bg-[var(--co-cream)] md:block"
          />
          <p className="sr-only">A fresh coconut opens into coconut water before forming the .CO coconut water bottle.</p>
          <motion.div
            key={storyStage}
            initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduce ? 0 : 0.42, ease }}
            className="absolute bottom-5 left-5 rounded-full border border-white/55 bg-[rgba(21,17,13,0.76)] px-4 py-3 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-md"
          >
            {storyStage}
          </motion.div>
          <motion.div
            initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: shouldReduce ? 0 : 0.52 }}
            className="absolute bottom-5 right-5 rounded-full border border-[var(--co-white)]/70 bg-[var(--co-black)]/82 px-5 py-4 text-center text-[0.68rem] font-bold uppercase tracking-[0.1em] text-[var(--co-white)] shadow-[0_8px_20px_rgba(58,36,22,0.18)] backdrop-blur-md"
          >
            From Kerala
            <br />
            with care
          </motion.div>
          <motion.svg aria-hidden="true" viewBox="0 0 520 190" className="pointer-events-none absolute left-5 top-8 h-28 w-72 text-[var(--co-palm)] md:h-36 md:w-96">
            <motion.path
              d="M12 116 C104 16 184 178 268 78 C344 -10 438 42 508 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: shouldReduce ? 1 : 0, opacity: shouldReduce ? 0.28 : 0 }}
              animate={{ pathLength: 1, opacity: 0.28 }}
              transition={{ duration: shouldReduce ? 0 : 1.1, ease, delay: shouldReduce ? 0 : 0.45 }}
            />
            <motion.path
              d="M18 146 C112 64 198 198 286 108 C366 28 442 76 506 54"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: shouldReduce ? 1 : 0, opacity: shouldReduce ? 0.16 : 0 }}
              animate={{ pathLength: 1, opacity: 0.16 }}
              transition={{ duration: shouldReduce ? 0 : 1.25, ease, delay: shouldReduce ? 0 : 0.58 }}
            />
          </motion.svg>
          <div className="absolute left-5 top-5 flex items-center gap-3 rounded-full border border-white/55 bg-white/78 px-4 py-3 backdrop-blur-sm">
            <DoodleIcon name="wave" animated className="h-8 w-8 text-[var(--co-palm)]/55" />
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[var(--co-brown)]">Coconut to bottle</span>
          </div>
        </motion.div>
        <div className="flex gap-2 overflow-x-auto pb-1 sm:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[
            ["leaf", "100% Natural"],
            ["drop", "Nothing Added"],
            ["cold", "Fridge Shelf Ready"]
          ].map(([icon, label]) => (
            <div key={label} className="flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-[var(--co-border)] bg-white px-4 text-xs font-bold text-[var(--co-brown)]">
              <DoodleIcon name={icon as "leaf" | "drop" | "cold"} className="h-6 w-6 text-[var(--co-palm)]" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
