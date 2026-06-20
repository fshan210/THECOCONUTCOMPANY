"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { Appear } from "@/components/motion/Appear";
import { BrandImage } from "@/components/BrandImage";
import { useCoconutMotionMode } from "@/lib/animations/coconut-motion";

export function PublicSection({
  children,
  className = "",
  tone = "paper"
}: {
  children: ReactNode;
  className?: string;
  tone?: "paper" | "warm" | "brown" | "green";
}) {
  const tones = {
    paper: "bg-paper text-coconut",
    warm: "bg-[#fff8ea] text-coconut",
    brown: "bg-coconut text-paper",
    green: "bg-grove text-paper"
  };

  return <section className={`relative overflow-hidden px-5 py-16 md:px-8 md:py-24 lg:py-28 ${tones[tone]} ${className}`}>{children}</section>;
}

export function PublicHeader({ kicker, title, body, align = "center" }: { kicker: string; title: string; body?: string; align?: "left" | "center" }) {
  return (
    <Appear className={`${align === "center" ? "mx-auto text-center" : ""} mb-12 max-w-4xl md:mb-16`}>
      <p className="mb-5 text-[0.72rem] font-medium uppercase tracking-editorial text-grove">{kicker}</p>
      <h2 className="font-display text-4xl font-light leading-tight text-coconut md:text-6xl lg:text-7xl">{title}</h2>
      {body ? <p className={`${align === "center" ? "mx-auto" : ""} mt-6 max-w-2xl text-base leading-8 text-coconut/70 md:text-lg md:leading-9`}>{body}</p> : null}
    </Appear>
  );
}

export function CtaLink({ href, children, variant = "primary" }: { href: string; children: ReactNode; variant?: "primary" | "secondary" | "light" }) {
  const styles = {
    primary: "bg-coconut text-paper hover:bg-grove",
    secondary: "border border-coconut/15 text-coconut hover:border-grove hover:text-grove",
    light: "bg-paper text-coconut hover:bg-sun"
  };

  return (
    <Link href={href} className={`inline-flex min-h-12 items-center gap-3 rounded-2xl px-6 py-4 text-sm font-medium transition ${styles[variant]}`}>
      {children} <ArrowUpRight size={16} />
    </Link>
  );
}

export function HoverImageFrame({
  src,
  hoverSrc,
  alt,
  sizes,
  className = "",
  imageClassName = "object-contain p-6"
}: {
  src: string;
  hoverSrc?: string;
  alt: string;
  sizes: string;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <div className={`group/frame relative overflow-hidden rounded-3xl border border-coconut/10 bg-[#fff8ea] shadow-[0_22px_68px_rgba(62,46,31,0.08)] ${className}`}>
      <BrandImage src={src} alt={alt} sizes={sizes} aspect="square" fit={imageClassName.includes("object-cover") ? "cover" : "contain"} className="absolute inset-0 border-0 shadow-none" imageClassName={`${imageClassName} drop-shadow-[0_28px_46px_rgba(62,46,31,0.16)] transition duration-700 ease-out group-hover/frame:scale-[1.03]`} />
      {hoverSrc ? (
        <Image
          src={hoverSrc}
          alt=""
          aria-hidden="true"
          fill
          sizes={sizes}
          className={`${imageClassName} opacity-0 drop-shadow-[0_28px_46px_rgba(62,46,31,0.16)] transition duration-700 ease-out group-hover/frame:scale-[1.03] group-hover/frame:opacity-100`}
        />
      ) : null}
      <div className="pointer-events-none absolute inset-x-8 bottom-7 h-10 rounded-full bg-coconut/10 blur-2xl" />
    </div>
  );
}

export function ParallaxFrame({
  src,
  hoverSrc,
  alt,
  className = "",
  imageClassName
}: {
  src: string;
  hoverSrc?: string;
  alt: string;
  className?: string;
  imageClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { shouldReduce, isMobile } = useCoconutMotionMode();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], shouldReduce || isMobile ? [0, 0] : [20, -20]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      <HoverImageFrame src={src} hoverSrc={hoverSrc} alt={alt} sizes="(min-width: 1024px) 46vw, 92vw" className="absolute inset-0" imageClassName={imageClassName} />
    </motion.div>
  );
}

export function DoodleImage({ src, className }: { src: string; className: string }) {
  return (
    <motion.div
      aria-hidden="true"
      animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
      transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      className={`pointer-events-none absolute opacity-[0.14] mix-blend-multiply ${className}`}
    >
      <Image src={src} alt="" fill sizes="220px" className="object-contain" />
    </motion.div>
  );
}
