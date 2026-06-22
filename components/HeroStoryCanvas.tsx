"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CTAButton, DoodleIcon, TrustBadge } from "@/components/brand/BrandPrimitives";
import { useCoconutMotionMode } from "@/lib/animations/coconut-motion";
import { publicAssets } from "@/lib/public-assets";

const ease = [0.16, 1, 0.3, 1] as const;

export function HeroStoryCanvas() {
  const { shouldReduce } = useCoconutMotionMode();
  const transition = { duration: shouldReduce ? 0 : 0.8, ease };

  return (
    <section className="relative isolate overflow-hidden border-b border-[var(--co-border)] bg-[var(--co-cream)]">
      <motion.div initial={{ clipPath: shouldReduce ? "inset(0% 0% 0% 0%)" : "inset(0% 16% 0% 0%)" }} animate={{ clipPath: "inset(0% 0% 0% 0%)" }} transition={{ duration: shouldReduce ? 0 : 0.9, ease }} className="absolute inset-0 z-0 lg:hidden">
        <Image
          src={publicAssets.water.hero}
          alt=".CO coconut water bottle with coconut and palm leaves"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_center]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--co-cream)_0%,rgba(247,240,228,0.96)_18%,rgba(247,240,228,0.72)_46%,rgba(247,240,228,0.12)_78%,rgba(247,240,228,0)_100%)]" />
        <div className="absolute inset-y-0 left-0 w-[52%] bg-[var(--co-cream)]/20 backdrop-blur-[0.2px]" />
      </motion.div>
      <motion.div initial={{ clipPath: shouldReduce ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 0% 22%)" }} animate={{ clipPath: "inset(0% 0% 0% 0%)" }} transition={{ duration: shouldReduce ? 0 : 0.95, ease }} className="absolute inset-y-0 right-0 z-0 hidden w-[62%] lg:block">
        <Image
          src={publicAssets.water.hero}
          alt=".CO coconut water bottle with coconut and palm leaves"
          fill
          priority
          sizes="62vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--co-cream)_0%,rgba(247,240,228,0.88)_18%,rgba(247,240,228,0.18)_46%,rgba(247,240,228,0)_100%)]" />
      </motion.div>

      <div className="co-container relative z-10 grid min-h-[640px] items-center gap-8 py-8 sm:min-h-[600px] lg:min-h-[calc(100dvh-96px)] lg:grid-cols-[0.92fr_1.08fr] lg:py-16">
        <div className="relative max-w-[340px] lg:-mt-10 lg:max-w-4xl">
          <motion.p initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 18 }} animate={{ opacity: 1, y: 0 }} transition={transition} className="mb-5 hidden text-sm font-bold uppercase tracking-[0.08em] text-[var(--co-palm)] lg:block">
            Tender coconut water from Kerala
          </motion.p>
          <motion.h1
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: shouldReduce ? 0 : 0.09 } } }}
            className="relative z-10 max-w-[7.6ch] overflow-hidden text-[clamp(44px,13.4vw,58px)] font-bold uppercase leading-[0.86] tracking-[-0.025em] text-[var(--co-ink)] lg:max-w-[7ch] lg:text-[clamp(62px,9.4vw,138px)] lg:leading-[0.82]"
          >
            {["Cold", "Coconut", "Water."].map((line) => (
              <motion.span key={line} variants={{ hidden: { opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 42 }, show: { opacity: 1, y: 0 } }} transition={transition} className="block">
                {line}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p
            initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: shouldReduce ? 0 : 0.16 }}
            className="mt-5 max-w-[24ch] text-sm leading-6 text-[var(--co-brown)]/88 [overflow-wrap:normal] lg:mt-6 lg:max-w-md lg:text-lg lg:leading-8"
          >
            Tender coconut water from Kerala. Cold ritual. Fridge shelf ready.
          </motion.p>
          <motion.div
            initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: shouldReduce ? 0 : 0.24 }}
            className="mt-6 flex flex-wrap gap-3 lg:mt-8"
          >
            <CTAButton href="/shop" className="px-5 text-xs lg:px-6 lg:text-sm">Shop Now</CTAButton>
            <CTAButton href="/about" variant="outline" className="px-5 text-xs lg:px-6 lg:text-sm">Explore Story</CTAButton>
          </motion.div>

          <motion.div
            initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: shouldReduce ? 0 : 0.32 }}
            className="mt-7 grid max-w-[340px] grid-cols-3 gap-2 border-t border-[var(--co-border)] pt-5 lg:mt-10 lg:max-w-2xl lg:gap-4 lg:pt-7"
          >
            <TrustBadge icon="leaf" title="100% Natural" body="Real coconut taste." className="flex-col items-start gap-1 [&_svg]:h-8 [&_svg]:w-8 [&_p:last-child]:hidden lg:flex-row lg:items-center lg:gap-3 lg:[&_p:last-child]:block" />
            <TrustBadge icon="drop" title="Nothing Added" body="Clean and simple." className="flex-col items-start gap-1 [&_svg]:h-8 [&_svg]:w-8 [&_p:last-child]:hidden lg:flex-row lg:items-center lg:gap-3 lg:[&_p:last-child]:block" />
            <TrustBadge icon="cold" title="Fridge Shelf Ready" body="Best served cold." className="flex-col items-start gap-1 [&_svg]:h-8 [&_svg]:w-8 [&_p:last-child]:hidden lg:flex-row lg:items-center lg:gap-3 lg:[&_p:last-child]:block" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: shouldReduce ? 1 : 0, scale: shouldReduce ? 1 : 0.96, y: shouldReduce ? 0 : 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ ...transition, delay: shouldReduce ? 0 : 0.12 }}
          className="relative hidden min-h-[620px] lg:block"
        >
          <div className="pointer-events-none absolute bottom-6 right-5 hidden rounded-full border border-[var(--co-white)]/70 bg-[var(--co-black)]/82 px-5 py-5 text-center text-xs font-bold uppercase tracking-[0.1em] text-[var(--co-white)] shadow-[0_8px_20px_rgba(58,36,22,0.18)] lg:block">
            From Kerala
            <br />
            with care
          </div>
          <motion.svg
            aria-hidden="true"
            viewBox="0 0 520 190"
            className="pointer-events-none absolute left-0 top-6 hidden h-36 w-96 text-[var(--co-palm)] lg:block"
          >
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
          <div className="absolute -left-2 top-8 hidden lg:block">
            <DoodleIcon name="wave" className="h-16 w-16 text-[var(--co-palm)]/35" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
