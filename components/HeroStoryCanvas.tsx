"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { CTAButton, DoodleIcon, TrustBadge } from "@/components/brand/BrandPrimitives";
import { useCoconutMotionMode } from "@/lib/animations/coconut-motion";
import { publicAssets } from "@/lib/public-assets";

const ease = [0.16, 1, 0.3, 1] as const;

export function HeroStoryCanvas() {
  const { shouldReduce } = useCoconutMotionMode();
  const { scrollY } = useScroll();
  const mediaY = useTransform(scrollY, [0, 520], [0, shouldReduce ? 0 : -24]);
  const transition = { duration: shouldReduce ? 0 : 0.82, ease };

  return (
    <section className="relative isolate overflow-hidden border-b border-[var(--co-border)] bg-[var(--co-cream)]">
      <div className="co-container relative z-10 grid min-h-[calc(100dvh-88px)] items-center gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:py-16">
        <div className="relative max-w-2xl">
          <motion.p
            initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition}
            className="mb-5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--co-palm)] md:text-sm"
          >
            Tender coconut water from Kerala
          </motion.p>
          <motion.h1
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: shouldReduce ? 0 : 0.1 } } }}
            className="relative z-10 max-w-[7.4ch] overflow-hidden text-[clamp(52px,14vw,82px)] font-bold uppercase leading-[0.84] tracking-[-0.035em] text-[var(--co-ink)] lg:text-[clamp(82px,9.4vw,146px)] lg:leading-[0.8]"
          >
            {["Cold", "Coconut", "Water."].map((line) => (
              <motion.span
                key={line}
                variants={{ hidden: { opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 52 }, show: { opacity: 1, y: 0 } }}
                transition={transition}
                className="block"
              >
                {line}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p
            initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: shouldReduce ? 0 : 0.18 }}
            className="mt-6 max-w-md text-base leading-7 text-[var(--co-brown)]/88 md:text-lg md:leading-8"
          >
            Tender coconut water with a clean Kerala origin story. Cold ritual. Real goodness. Fridge shelf ready.
          </motion.p>
          <motion.div
            initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: shouldReduce ? 0 : 0.28 }}
            className="mt-7 flex flex-wrap gap-3"
          >
            <CTAButton href="/shop">Shop Now</CTAButton>
            <CTAButton href="/about" variant="outline">
              Explore Story
            </CTAButton>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: shouldReduce ? 0 : 0.07, delayChildren: shouldReduce ? 0 : 0.36 } } }}
            className="mt-8 grid max-w-xl grid-cols-1 gap-3 border-t border-[var(--co-border)] pt-6 sm:grid-cols-3"
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
              >
                {badge}
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          style={{ y: mediaY }}
          initial={{
            opacity: shouldReduce ? 1 : 0,
            clipPath: shouldReduce ? "inset(0% 0% 0% 0% round 40px)" : "inset(0% 0% 18% 0% round 40px)",
            scale: shouldReduce ? 1 : 0.985
          }}
          animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0% round 40px)", scale: 1 }}
          transition={{ ...transition, delay: shouldReduce ? 0 : 0.12 }}
          className="relative min-h-[390px] overflow-hidden rounded-[40px] border border-[var(--co-border)] bg-[var(--co-white)] shadow-[0_20px_60px_rgba(58,36,22,0.10)] md:min-h-[520px] lg:min-h-[650px]"
        >
          <Image
            src={publicAssets.water.hero}
            alt=".CO coconut water bottle with coconut and palm leaves"
            fill
            priority
            sizes="(min-width: 1024px) 54vw, 92vw"
            className="object-cover object-[58%_center]"
          />
          <motion.div
            initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: shouldReduce ? 0 : 0.52 }}
            className="absolute bottom-5 right-5 rounded-full border border-[var(--co-white)]/70 bg-[var(--co-black)]/82 px-5 py-5 text-center text-xs font-bold uppercase tracking-[0.1em] text-[var(--co-white)] shadow-[0_8px_20px_rgba(58,36,22,0.18)]"
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
          </motion.svg>
          <div className="absolute left-5 top-5 rounded-full bg-[var(--co-white)]/78 p-3 backdrop-blur-sm">
            <DoodleIcon name="wave" className="h-12 w-12 text-[var(--co-palm)]/45" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
