"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
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
      initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 28, scale: shouldReduce ? 1 : 0.992 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: shouldReduce ? 0 : 0.72, ease: easeBrand, delay: shouldReduce ? 0 : delay }}
      viewport={{ once: true, margin: "-10%" }}
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
      className={`co-press co-button-depth group/cta inline-flex min-h-12 items-center justify-center rounded-[24px] border px-6 py-3 text-sm font-bold ${styles[variant]} ${className}`}
    >
      <span className="transition-transform duration-300 ease-out group-hover/cta:translate-x-0.5">{children}</span>
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

  return <article className={`co-bento relative overflow-hidden p-5 md:p-6 ${tones[tone]} ${className}`}>{children}</article>;
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

  return <span className={`inline-flex min-h-12 items-center rounded-full border px-4 text-sm font-bold ${tones[tone]}`}>{children}</span>;
}

export function SectionShell({
  children,
  className = "",
  innerClassName = ""
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <section className={`co-section ${className}`}>
      <div className={`co-container ${innerClassName}`}>{children}</div>
    </section>
  );
}

export function BentoGrid({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`grid gap-3 md:gap-4 ${className}`}>{children}</div>;
}

export type DoodleName = "coconut" | "leaf" | "drop" | "wave" | "palm" | "cold" | "bottle" | "bowl";

export function DoodleIcon({ name, className = "", animated = false }: { name: DoodleName; className?: string; animated?: boolean }) {
  if (animated) return <AnimatedDoodleIcon name={name} className={className} />;

  return <DoodleIconGraphic name={name} className={className} animated={false} shouldReduce />;
}

function AnimatedDoodleIcon({ name, className }: { name: DoodleName; className: string }) {
  const { shouldReduce } = useCoconutMotionMode();

  return <DoodleIconGraphic name={name} className={className} animated shouldReduce={shouldReduce} />;
}

function DoodleIconGraphic({
  name,
  className,
  animated,
  shouldReduce
}: {
  name: DoodleName;
  className: string;
  animated: boolean;
  shouldReduce: boolean;
}) {
  const common = "fill-none stroke-current stroke-[1.8] stroke-linecap-round stroke-linejoin-round";
  const draw = (opacity = 1, delay = 0) => ({
    initial: animated && !shouldReduce ? { pathLength: 0, opacity: 0 } : false,
    whileInView: animated && !shouldReduce ? { pathLength: 1, opacity } : undefined,
    viewport: { once: true, margin: "-12%" },
    transition: { duration: 0.9, ease: easeBrand, delay }
  });

  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className={`co-doodle-draw h-9 w-9 text-[var(--co-brown)] ${className}`}>
      {name === "coconut" ? (
        <>
          <motion.path {...draw()} className={common} d="M14 30c1-11 7-19 16-20 7 5 9 14 3 22-5 7-15 8-19-2Z" />
          <motion.path {...draw(0.42, 0.08)} className={common} d="M18 29c4 4 11 3 15-2" opacity=".42" />
          <motion.path {...draw(1, 0.14)} className={common} d="M27 10c1-2 3-4 6-5" />
        </>
      ) : null}
      {name === "leaf" ? (
        <>
          <motion.path {...draw()} className={common} d="M8 36c18 0 27-10 32-27-18 1-29 9-32 27Z" />
          <motion.path {...draw(0.62, 0.1)} className={common} d="M9 36c9-9 19-16 31-27" opacity=".62" />
        </>
      ) : null}
      {name === "drop" ? (
        <>
          <motion.path {...draw()} className={common} d="M24 6c8 11 13 18 13 26 0 7-6 12-13 12S11 39 11 32c0-8 5-15 13-26Z" />
          <motion.path {...draw(0.42, 0.1)} className={common} d="M18 33c2 3 5 5 9 4" opacity=".42" />
        </>
      ) : null}
      {name === "wave" ? (
        <>
          <motion.path {...draw()} className={common} d="M5 27c7-8 13-8 20 0s12 8 18 0" />
          <motion.path {...draw(0.42, 0.1)} className={common} d="M7 35c6-5 11-5 17 0s11 5 17 0" opacity=".42" />
        </>
      ) : null}
      {name === "palm" ? (
        <>
          <motion.path {...draw()} className={common} d="M24 43c2-12 2-23 0-34" />
          <motion.path {...draw(1, 0.06)} className={common} d="M24 10C14 9 8 13 5 20c8-3 14-3 19-10Z" />
          <motion.path {...draw(1, 0.1)} className={common} d="M24 10c8-7 15-7 20-3-6 3-11 6-20 3Z" />
          <motion.path {...draw(1, 0.14)} className={common} d="M24 14c8 0 14 4 18 11-8-2-14-5-18-11Z" />
          <motion.path {...draw(1, 0.18)} className={common} d="M24 14c-8 2-13 7-16 14 7-3 12-6 16-14Z" />
        </>
      ) : null}
      {name === "cold" ? (
        <>
          <motion.path {...draw()} className={common} d="M24 6v36M9 15l30 18M39 15 9 33" />
          <motion.path {...draw(0.55, 0.1)} className={common} d="m18 9 6 6 6-6M18 39l6-6 6 6" opacity=".55" />
        </>
      ) : null}
      {name === "bottle" ? (
        <>
          <motion.path {...draw()} className={common} d="M18 5h12v8l4 6v21c0 3-2 5-5 5H19c-3 0-5-2-5-5V19l4-6V5Z" />
          <motion.path {...draw(0.45, 0.1)} className={common} d="M16 28h16M18 11h12" opacity=".45" />
        </>
      ) : null}
      {name === "bowl" ? (
        <>
          <motion.path {...draw()} className={common} d="M8 23h32c-1 12-7 18-16 18S9 35 8 23Z" />
          <motion.path {...draw(1, 0.08)} className={common} d="M13 19c5-5 17-5 22 0" />
          <motion.path {...draw(0.45, 0.14)} className={common} d="M17 27h14" opacity=".45" />
        </>
      ) : null}
    </svg>
  );
}

export function JourneyStage({
  progress,
  index,
  total,
  children,
  className = "",
  reduced = false
}: {
  progress: MotionValue<number>;
  index: number;
  total: number;
  children: ReactNode;
  className?: string;
  reduced?: boolean;
}) {
  const start = Math.max(0, index / total - 0.04);
  const active = Math.min(1, (index + 0.72) / total);
  const opacity = useTransform(progress, [start, active], [index === 0 ? 0.72 : 0.42, 1]);
  const y = useTransform(progress, [start, active], [index === 0 ? 8 : 24, 0]);
  const scale = useTransform(progress, [start, active], [0.985, 1]);

  return (
    <motion.div
      style={reduced ? undefined : { opacity, y, scale }}
      className={`co-journey-stage relative ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function TrustBadge({
  icon,
  title,
  body,
  className = ""
}: {
  icon: DoodleName;
  title: string;
  body: string;
  className?: string;
}) {
  return (
    <div className={`flex items-start gap-3 rounded-[28px] border border-[var(--co-border)] bg-[rgba(255,255,255,0.74)] p-4 text-[var(--co-brown)] shadow-[inset_0_1px_0_rgba(255,255,255,0.76)] ${className}`}>
      <DoodleIcon name={icon} className="h-8 w-8 shrink-0 text-[var(--co-palm)]" />
      <div>
        <p className="text-sm font-bold leading-tight">{title}</p>
        <p className="mt-1 text-xs leading-5 text-[var(--co-muted)]">{body}</p>
      </div>
    </div>
  );
}

export function FeatureStrip({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`co-feature-grid mt-4 grid gap-3 p-3 md:p-4 ${className}`}>{children}</div>;
}

export function ProductSwapImage({
  title,
  image,
  hoverImage,
  sizes,
  aspect = "product",
  fit = "contain",
  className = "",
  imageClassName = ""
}: {
  title: string;
  image: string;
  hoverImage?: string;
  sizes: string;
  aspect?: "square" | "portrait" | "landscape" | "wide" | "product";
  fit?: "cover" | "contain";
  className?: string;
  imageClassName?: string;
}) {
  return (
    <div className={`co-product-swap relative overflow-hidden rounded-[32px] bg-[var(--co-cream)] ${className}`}>
      <BrandImage
        src={image}
        alt={title}
        sizes={sizes}
        aspect={aspect}
        fit={fit}
        fallbackLabel={title}
        hoverZoom={!hoverImage}
        className={`rounded-[32px] border-0 bg-transparent transition duration-700 ease-out ${hoverImage ? "group-hover:opacity-0" : ""}`}
        imageClassName={imageClassName}
      />
      {hoverImage ? (
        <Image
          src={hoverImage}
          alt=""
          aria-hidden="true"
          fill
          sizes={sizes}
          className="pointer-events-none rounded-[32px] object-contain p-5 opacity-0 transition duration-700 ease-out group-hover:scale-[1.03] group-hover:opacity-100 md:p-6"
        />
      ) : null}
    </div>
  );
}

export function ProductCard({
  title,
  body,
  image,
  href,
  badge,
  accent = false,
  imageFit = "cover",
  className = ""
}: {
  title: string;
  body: string;
  image: string;
  href: string;
  badge?: string;
  accent?: boolean;
  imageFit?: "cover" | "contain";
  className?: string;
}) {
  return (
    <Link href={href} className={`group block h-full ${className}`}>
      <article className={`co-press relative flex h-full min-h-[440px] flex-col justify-between overflow-hidden rounded-[32px] border border-[var(--co-border)] p-5 md:p-6 ${accent ? "bg-[var(--co-sun)]" : "bg-[var(--co-white)]"}`}>
        {badge ? <span className="w-fit rounded-[8px] bg-[var(--co-sun)] px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[var(--co-black)]">{badge}</span> : <span />}
        <div className="relative my-3 min-h-[190px]">
          <BrandImage src={image} alt={title} sizes="(min-width: 1024px) 30vw, (min-width: 768px) 46vw, calc(100vw - 72px)" aspect="product" fit={imageFit} hoverZoom fallbackLabel={title} className="h-full rounded-[32px] border-0 bg-[var(--co-cream)]" />
        </div>
        <div>
          <h3 className="text-[clamp(28px,3vw,44px)] font-bold leading-[0.92] text-[var(--co-brown)]">{title}</h3>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--co-muted)]">{body}</p>
          <span className="mt-5 inline-flex border-b border-current pb-1 text-sm font-bold text-[var(--co-black)]">Shop now</span>
        </div>
      </article>
    </Link>
  );
}

export function BrandMarquee({ words }: { words: string[] }) {
  const repeated = [...words, ...words];

  return (
    <div className="overflow-hidden border-y border-[var(--co-border)] bg-[var(--co-white)] py-5">
      <div className="co-marquee-track flex w-max items-center gap-10">
        {repeated.map((word, index) => (
          <span key={`${word}-${index}`} className="whitespace-nowrap text-[clamp(28px,4vw,60px)] font-bold uppercase leading-none text-[var(--co-brown)]">
            {word}
          </span>
        ))}
      </div>
    </div>
  );
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
          <ProductSwapImage title={title} image={image} hoverImage={hoverImage} sizes="(min-width: 1024px) 44vw, 92vw" />
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
      <BrandImage src={image} alt={title} sizes="(min-width: 768px) 33vw, 92vw" aspect="wide" fit="cover" hoverZoom className="mb-6 rounded-[24px]" />
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
        <BrandImage src={image} alt={title} sizes="(min-width: 1024px) 48vw, 92vw" aspect="portrait" fit="cover" hoverZoom className="h-full min-h-[520px] rounded-[40px] shadow-[0_24px_70px_rgba(58,36,22,0.1)]" />
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
