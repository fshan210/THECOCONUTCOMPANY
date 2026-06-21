"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { BrandImage } from "@/components/BrandImage";
import { useCoconutMotionMode } from "@/lib/animations/coconut-motion";

const easeBrand = [0.16, 1, 0.3, 1] as const;

type MotionSectionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function MotionSection({ children, className = "", delay = 0 }: MotionSectionProps) {
  const { shouldReduce } = useCoconutMotionMode();

  return (
    <motion.div
      initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 28 }}
      animate={{ opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduce ? 0 : 0.6, ease: easeBrand, delay: shouldReduce ? 0 : delay }}
      viewport={{ once: true, margin: "-12%" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function CTAButton({
  href,
  children,
  variant = "dark",
  className = ""
}: {
  href: string;
  children: ReactNode;
  variant?: "dark" | "outline" | "light";
  className?: string;
}) {
  const styles = {
    dark: "border-[var(--co-black)] bg-[var(--co-black)] text-[var(--co-white)] hover:bg-[var(--co-palm)] hover:border-[var(--co-palm)]",
    outline: "border-[var(--co-palm)] text-[var(--co-palm)] hover:bg-[var(--co-palm)] hover:text-[var(--co-white)]",
    light: "border-[var(--co-white)] bg-[var(--co-white)] text-[var(--co-black)] hover:bg-[var(--co-sun)] hover:border-[var(--co-sun)]"
  };

  return (
    <Link
      href={href}
      className={`co-press inline-flex min-h-12 items-center justify-center rounded-full border px-6 py-3 text-sm font-bold ${styles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

export function BentoCard({
  children,
  className = "",
  tone = "white"
}: {
  children: ReactNode;
  className?: string;
  tone?: "white" | "cream" | "dark" | "green" | "sun";
}) {
  const tones = {
    white: "bg-[var(--co-white)] text-[var(--co-ink)]",
    cream: "bg-[var(--co-cream)] text-[var(--co-ink)]",
    dark: "bg-[var(--co-black)] text-[var(--co-white)] border-[rgba(255,255,255,0.14)]",
    green: "bg-[var(--co-palm)] text-[var(--co-white)] border-[rgba(255,255,255,0.16)]",
    sun: "bg-[var(--co-sun)] text-[var(--co-ink)]"
  };

  return <article className={`co-bento co-bento-lg relative overflow-hidden p-5 md:p-7 ${tones[tone]} ${className}`}>{children}</article>;
}

export function BillboardWord({ word, className = "" }: { word: string; className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none w-full max-w-full select-none overflow-hidden break-words font-sans font-bold uppercase leading-[0.78] ${className}`}>
      {word}
    </div>
  );
}

export function IngredientBadge({ children, tone = "cream" }: { children: ReactNode; tone?: "cream" | "sun" | "green" }) {
  const tones = {
    cream: "border-[var(--co-border)] bg-[var(--co-cream)] text-[var(--co-brown)]",
    sun: "border-[var(--co-sun)] bg-[var(--co-sun)] text-[var(--co-black)]",
    green: "border-[var(--co-palm)] bg-[var(--co-palm)] text-[var(--co-white)]"
  };

  return <span className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-bold ${tones[tone]}`}>{children}</span>;
}

export function ProductTile({
  title,
  eyebrow,
  body,
  image,
  hoverImage,
  href,
  word,
  trust = [],
  className = ""
}: {
  title: string;
  eyebrow: string;
  body: string;
  image: string;
  hoverImage?: string;
  href: string;
  word?: string;
  trust?: string[];
  className?: string;
}) {
  return (
    <Link href={href} className={`group block h-full ${className}`}>
      <BentoCard className="co-press flex h-full flex-col">
        {word ? <BillboardWord word={word} className="absolute -right-3 top-3 text-[clamp(72px,10vw,150px)] text-[var(--co-brown)]/[0.055]" /> : null}
        <div className="relative z-10 mb-6">
          <div className="relative">
            <BrandImage
              src={image}
              alt={title}
              sizes="(min-width: 1024px) 44vw, 92vw"
              aspect="product"
              fit="contain"
              fallbackLabel={title}
              hoverZoom
              className="rounded-[36px]"
            />
            {hoverImage ? (
              <Image
                src={hoverImage}
                alt=""
                aria-hidden="true"
                fill
                sizes="(min-width: 1024px) 44vw, 92vw"
                className="rounded-[36px] object-contain p-6 opacity-0 transition duration-700 ease-out group-hover:opacity-100"
              />
            ) : null}
          </div>
        </div>
        <p className="co-label relative z-10 mb-4">{eyebrow}</p>
        {trust.length ? (
          <div className="relative z-10 mb-5 flex flex-wrap gap-2">
            {trust.slice(0, 3).map((item) => (
              <span key={item} className="rounded-full border border-[var(--co-border)] bg-[var(--co-cream)] px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[var(--co-brown)]">
                {item}
              </span>
            ))}
          </div>
        ) : null}
        <h3 className="relative z-10 text-[clamp(36px,4vw,68px)] font-bold leading-[0.9] text-[var(--co-brown)]">{title}</h3>
        <p className="co-body relative z-10 mt-5 max-w-xl">{body}</p>
      </BentoCard>
    </Link>
  );
}

export function RitualCard({
  title,
  body,
  image,
  label,
  className = ""
}: {
  title: string;
  body: string;
  image: string;
  label: string;
  className?: string;
}) {
  return (
    <BentoCard className={`co-press min-h-[360px] ${className}`}>
      <BrandImage src={image} alt={title} sizes="(min-width: 768px) 33vw, 92vw" aspect="wide" fit="cover" hoverZoom className="mb-6 rounded-[28px]" />
      <p className="co-label mb-3">{label}</p>
      <h3 className="text-[clamp(34px,4vw,58px)] font-bold leading-[0.9] text-[var(--co-brown)]">{title}</h3>
      <p className="co-body mt-4">{body}</p>
    </BentoCard>
  );
}

export function SplitStoryPanel({
  eyebrow,
  title,
  body,
  image,
  reverse = false,
  word
}: {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  reverse?: boolean;
  word?: string;
}) {
  return (
    <div className="co-grid-12 co-container items-stretch">
      <MotionSection className={`${reverse ? "lg:col-start-7" : "lg:col-start-1"} lg:col-span-6`}>
        <BentoCard className="flex min-h-[520px] flex-col justify-between">
          {word ? <BillboardWord word={word} className="text-[clamp(72px,12vw,168px)] text-[var(--co-brown)]/[0.07]" /> : null}
          <div>
            <p className="co-label mb-6">{eyebrow}</p>
            <h2 className="co-h2 text-[var(--co-brown)]">{title}</h2>
            <p className="co-body mt-7 max-w-xl">{body}</p>
          </div>
        </BentoCard>
      </MotionSection>
      <MotionSection delay={0.08} className={`${reverse ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-7"} mt-4 lg:col-span-6 lg:mt-0`}>
        <BrandImage src={image} alt={title} sizes="(min-width: 1024px) 48vw, 92vw" aspect="portrait" fit="cover" hoverZoom className="h-full min-h-[520px] rounded-[48px] shadow-[0_24px_70px_rgba(58,36,22,0.1)]" />
      </MotionSection>
    </div>
  );
}

export function ProductMarquee({ words }: { words: string[] }) {
  return (
    <div className="overflow-hidden border-y border-[var(--co-border)] bg-[var(--co-black)] py-5 text-[var(--co-white)]">
      <div className="co-container flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
        {words.map((word) => (
          <span key={word} className="text-[clamp(34px,5vw,80px)] font-bold uppercase leading-none">
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}
