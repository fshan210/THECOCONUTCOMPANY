"use client";

import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { mediaUrl } from "@/lib/media";
import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const scenes = [
  ["coconut_water.png", ".CO coconut water beside a fresh coconut in warm everyday light."],
  ["coconut_oil.png", ".CO Kitchen coconut oil styled for an everyday cooking ritual."],
  ["Melt_icecream.png", "MELT coconut gelato served as a slow afternoon indulgence."],
  ["Face_wash.png", "BOTANiCA face wash in a calm morning care setting."],
  ["coconut_flour.png", ".CO Kitchen coconut flour arranged for home baking."],
  ["hair_serum.png", "BOTANiCA hair serum in an evening hair-care ritual."],
  ["coconut_milk.png", ".CO Kitchen coconut milk ready for an everyday meal."],
  ["Moisturizer.png", "BOTANiCA moisturizer in soft natural light."],
  ["shampoo.png", "BOTANiCA shampoo in a considered bathroom setting."],
] as const;

const galleryScenes = scenes.map(([filename, alt]) => ({
  src: mediaUrl(`/images/website/lifestyle images/${filename}`),
  alt,
}));

const copies = [0, 1] as const;

export function Lifestyle3DGallery() {
  const reducedMotion = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const pointerRef = useRef<{ id: number; x: number; y: number; time: number; offset: number; horizontal: boolean } | null>(null);
  const resumeAtRef = useRef(0);
  const visibleRef = useRef(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const host = hostRef.current;
    if (!host) return undefined;

    const observer = new IntersectionObserver(([entry]) => { visibleRef.current = entry.isIntersecting; }, { rootMargin: "160px" });
    observer.observe(host);
    let frame = 0;
    let previous = performance.now();

    const render = (now: number) => {
      const delta = Math.min(42, now - previous);
      previous = now;
      const width = host.clientWidth;
      const cardWidth = Math.min(330, Math.max(190, width * (width < 700 ? 0.58 : 0.235)));
      const gap = width < 700 ? 18 : 28;
      const step = cardWidth + gap;
      const loopWidth = step * galleryScenes.length;

      if (visibleRef.current && !document.hidden && !pointerRef.current) {
        if (now > resumeAtRef.current) velocityRef.current += (-step / 6200 - velocityRef.current) * 0.025;
        else velocityRef.current *= 0.965;
        offsetRef.current += velocityRef.current * delta;
      }

      offsetRef.current = ((offsetRef.current % loopWidth) + loopWidth) % loopWidth;
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        card.style.position = "absolute";
        const copyIndex = index >= galleryScenes.length ? 1 : 0;
        const sceneIndex = index % galleryScenes.length;
        let x = sceneIndex * step + copyIndex * loopWidth - offsetRef.current;
        while (x < -step) x += loopWidth * 2;
        while (x > width + loopWidth) x -= loopWidth * 2;
        const center = x + cardWidth / 2;
        const normalized = (center - width / 2) / Math.max(width / 2, 1);
        const wave = Math.sin((sceneIndex / galleryScenes.length) * Math.PI * 2 + offsetRef.current / step * 0.72);
        const depth = Math.cos(normalized * Math.PI * 0.72);
        const y = wave * (width < 700 ? 13 : 25);
        const z = -92 + Math.max(0, depth) * 142;
        const rotateY = Math.max(-8, Math.min(8, normalized * -8));
        const rotateX = wave * (width < 700 ? 1.2 : 2.6);
        const scale = width < 700 ? 0.94 + Math.max(0, depth) * 0.055 : 0.9 + Math.max(0, depth) * 0.13;
        card.style.width = `${cardWidth}px`;
        card.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
        card.style.zIndex = String(Math.round(z + 150));
      });
      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <section className="overflow-hidden bg-[#f7f2e8] py-16 md:py-24" aria-labelledby="outside-shelf-title">
        <GalleryHeading />
        <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] md:px-8 [&::-webkit-scrollbar]:hidden">
          {galleryScenes.map((scene) => <GalleryCard key={scene.src} scene={scene} className="w-[68vw] max-w-[310px] shrink-0 snap-center" />)}
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden bg-[#f7f2e8] py-16 md:py-24" aria-labelledby="outside-shelf-title">
      <GalleryHeading />
      <div
        ref={hostRef}
        className={`relative mt-7 h-[390px] select-none overflow-hidden [perspective:1300px] [touch-action:pan-y] md:mt-10 md:h-[520px] ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
        onPointerDown={(event) => {
          pointerRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY, time: performance.now(), offset: offsetRef.current, horizontal: false };
          velocityRef.current = 0;
        }}
        onPointerMove={(event) => {
          const pointer = pointerRef.current;
          if (!pointer || pointer.id !== event.pointerId) return;
          const dx = event.clientX - pointer.x;
          const dy = event.clientY - pointer.y;
          if (!pointer.horizontal && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.15) {
            pointer.horizontal = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            setDragging(true);
          }
          if (!pointer.horizontal) return;
          const now = performance.now();
          const elapsed = Math.max(8, now - pointer.time);
          const nextOffset = pointer.offset - dx;
          velocityRef.current = (nextOffset - offsetRef.current) / elapsed;
          offsetRef.current = nextOffset;
          pointer.time = now;
          pointer.x = event.clientX;
          pointer.offset = offsetRef.current;
        }}
        onPointerUp={(event) => finishDrag(event.currentTarget, event.pointerId, pointerRef, resumeAtRef, setDragging)}
        onPointerCancel={(event) => finishDrag(event.currentTarget, event.pointerId, pointerRef, resumeAtRef, setDragging)}
        aria-label="Automatic lifestyle gallery. Drag horizontally to explore scenes."
      >
        <div className="absolute inset-y-0 left-0 w-full [transform-style:preserve-3d]">
          {copies.flatMap((copy) => galleryScenes.map((scene, sceneIndex) => (
            <article
              key={`${copy}-${scene.src}`}
              ref={(node) => { cardRefs.current[copy * galleryScenes.length + sceneIndex] = node; }}
              aria-hidden={copy === 1 ? "true" : undefined}
              className="absolute left-0 top-[24px] aspect-[4/5] overflow-hidden rounded-[22px] border border-white/65 bg-[#eee6d9] shadow-[0_24px_58px_rgba(53,39,30,.12)] [backface-visibility:hidden] [transform-origin:center_center] [transform-style:preserve-3d] md:top-[36px]"
            >
              <ResponsiveImage src={scene.src} alt={copy === 1 ? "" : scene.alt} fill sizes="(min-width: 768px) 330px, 58vw" className="size-full object-cover" />
            </article>
          )))}
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-[10vw] bg-gradient-to-r from-[#f7f2e8] to-transparent" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-[10vw] bg-gradient-to-l from-[#f7f2e8] to-transparent" />
      </div>
    </section>
  );
}

function GalleryHeading() {
  return (
    <div className="mx-auto flex max-w-[1320px] items-end justify-between gap-6 px-4 md:px-8">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#305a34]">Life, with coconut in it.</p>
        <h2 id="outside-shelf-title" className="mt-3 font-['Cormorant_Garamond'] text-[38px] leading-[.92] tracking-[-.03em] text-[#35271e] md:text-[58px]">.CO OUTSIDE THE SHELF</h2>
      </div>
      <p className="hidden max-w-[24ch] text-right font-['Cormorant_Garamond'] text-2xl text-[#5f554d] md:block">Made for living.</p>
    </div>
  );
}

function GalleryCard({ scene, className }: { scene: (typeof galleryScenes)[number]; className?: string }) {
  return <article className={`aspect-[4/5] overflow-hidden rounded-[22px] border border-white/65 bg-[#eee6d9] ${className ?? ""}`}><ResponsiveImage src={scene.src} alt={scene.alt} fill={false} width={1122} height={1402} sizes="68vw" className="size-full object-cover" /></article>;
}

function finishDrag(
  target: HTMLDivElement,
  pointerId: number,
  pointerRef: React.MutableRefObject<{ id: number; x: number; y: number; time: number; offset: number; horizontal: boolean } | null>,
  resumeAtRef: React.MutableRefObject<number>,
  setDragging: (dragging: boolean) => void,
) {
  if (target.hasPointerCapture(pointerId)) target.releasePointerCapture(pointerId);
  pointerRef.current = null;
  resumeAtRef.current = performance.now() + 2200;
  setDragging(false);
}
