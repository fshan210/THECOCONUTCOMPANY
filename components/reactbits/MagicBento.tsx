"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { FoldText } from "@/components/reactbits/FoldText";

export type MagicBentoCard = { eyebrow: string; title: string; copy: string; href: string; desktop: string; mobile?: string; alt: string };

export function MagicBento({ cards, className }: { cards: MagicBentoCard[]; className?: string }) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduced || !fine) return undefined;
    const cleanups = Array.from(grid.querySelectorAll<HTMLElement>("[data-magic-card]")).map((card) => {
      const x = gsap.quickTo(card, "x", { duration: .55, ease: "power3.out" });
      const y = gsap.quickTo(card, "y", { duration: .55, ease: "power3.out" });
      const rx = gsap.quickTo(card, "rotationX", { duration: .55, ease: "power3.out" });
      const ry = gsap.quickTo(card, "rotationY", { duration: .55, ease: "power3.out" });
      const move = (event: PointerEvent) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        x((px - .5) * 16); y((py - .5) * 12); rx((.5 - py) * 7); ry((px - .5) * 7);
        card.style.setProperty("--spot-x", `${px * 100}%`); card.style.setProperty("--spot-y", `${py * 100}%`);
      };
      const leave = () => { x(0); y(0); rx(0); ry(0); };
      card.addEventListener("pointermove", move); card.addEventListener("pointerleave", leave);
      return () => { card.removeEventListener("pointermove", move); card.removeEventListener("pointerleave", leave); };
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return <section className={`co-magic-bento-section${className ? ` ${className}` : ""}`} aria-labelledby="co-bento-title">
    <div className="co-experience-container">
      <p className="co-experience-eyebrow">One coconut. Many lives.</p>
      <h2 id="co-bento-title" className="co-experience-title"><FoldText>FROM ORIGIN TO EVERYDAY LIVING.</FoldText></h2>
      <p className="co-bento-intro">Five considered expressions of one coconut ecosystem—source, hydration, nourishment, care and slow indulgence.</p>
      <div ref={gridRef} className="co-magic-bento-grid">
        {cards.map((card, index) => <Link key={card.title} href={card.href} data-magic-card className={`co-magic-bento-card co-magic-bento-card--${index + 1}`}>
          <ResponsiveImage src={card.desktop} mobileSrc={card.mobile} alt={card.alt} fill sizes="(min-width: 900px) 42vw, 92vw" className="object-cover" />
          <span className="co-magic-bento-shade" aria-hidden="true" />
          <span className="co-magic-bento-copy"><small>0{index + 1} · {card.eyebrow}</small><strong>{card.title}</strong><span>{card.copy}</span></span>
          <span className="co-magic-bento-action" aria-hidden="true"><ArrowUpRight size={16} /></span>
        </Link>)}
      </div>
    </div>
  </section>;
}
