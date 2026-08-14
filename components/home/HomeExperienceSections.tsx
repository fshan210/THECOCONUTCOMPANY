"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { FoldText } from "@/components/reactbits/FoldText";

const DayCelestialScene = dynamic(() => import("@/components/home/DayCelestialScene").then((module) => module.DayCelestialScene), { ssr: false });

const dayMoments = [
  {
    time: "07:12", family: "BOTANiCA", title: "Morning routine", image: "/images/website/manual/products/galleries/CO_WEBSITE_PDP_BOTANICA_FACE_WASH_HERO_DESKTOP_MASTER.webp", environment: "/assets/backgrounds/day-with-co/morning-care-v2.png", environmentPosition: "right center", description: "A quiet start with coconut-led care before the day gets moving.",
    environmentOpacity: .38, environmentBrightness: .86, environmentContrast: 1.03, textTone: "ink", foregroundShadow: "0 24px 70px rgb(53 39 30 / .16)", scrim: "linear-gradient(90deg, rgb(255 248 234 / .9) 0%, rgb(255 248 234 / .58) 34%, transparent 62%)"
  },
  {
    time: "10:45", family: ".CO WATER", title: "Between places", image: "/images/website/home/transitions/CO_WEBSITE_TRANSITION_WATER_DESKTOP_MASTER.webp", environment: "/assets/backgrounds/day-with-co/evening-interior.png", environmentPosition: "center center", description: "Cold hydration that moves easily from one place to the next.",
    environmentOpacity: .4, environmentBrightness: 1.03, environmentContrast: .9, textTone: "ink", foregroundShadow: "0 24px 70px rgb(53 39 30 / .16)", scrim: "linear-gradient(90deg, rgb(255 249 237 / .84) 0%, rgb(255 249 237 / .5) 35%, transparent 65%)"
  },
  {
    time: "13:20", family: ".CO KITCHEN", title: "Lunch made simply", image: "/images/website/manual/recipes/CO_WEBSITE_RECIPES_EVERYDAY_COOKING_DESKTOP_MASTER.webp", environment: "/assets/backgrounds/day-with-co/late-afternoon.png", environmentPosition: "left center", description: "Coconut milk, flour and oil folded naturally into an everyday lunch.",
    environmentOpacity: .42, environmentBrightness: 1, environmentContrast: .92, textTone: "ink", foregroundShadow: "0 24px 70px rgb(53 39 30 / .16)", scrim: "linear-gradient(90deg, rgb(255 248 233 / .86) 0%, rgb(255 248 233 / .52) 37%, transparent 67%)"
  },
  {
    time: "18:10", family: "BOTANiCA", title: "Reset", image: "/images/website/manual/products/galleries/CO_WEBSITE_PDP_BOTANICA_HAIR_SERUM_HERO_DESKTOP_MASTER.webp", environment: "/assets/backgrounds/day-with-co/evening-reset-v2.png", environmentPosition: "left center", description: "A small reset when the outside part of the day is done.",
    environmentOpacity: .3, environmentBrightness: .88, environmentContrast: .84, textTone: "light", foregroundShadow: "0 28px 82px rgb(28 17 10 / .3)", scrim: "radial-gradient(90% 130% at 8% 53%, rgb(33 24 17 / .7) 0%, rgb(33 24 17 / .4) 42%, transparent 74%)"
  },
  {
    time: "21:15", family: "MELT", title: "Slow down", image: "/images/website/home/transitions/CO_WEBSITE_TRANSITION_MELT_DESKTOP_MASTER.webp", environment: "/assets/backgrounds/day-with-co/midmorning-road.png", environmentPosition: "left center", description: "Something cold and unhurried before calling it a night.",
    environmentOpacity: .38, environmentBrightness: .82, environmentContrast: .88, textTone: "light", foregroundShadow: "0 24px 70px rgb(20 15 12 / .26)", scrim: "radial-gradient(96% 130% at 7% 52%, rgb(22 18 15 / .75) 0%, rgb(22 18 15 / .46) 45%, transparent 75%)"
  },
] as const;

const dayPalette = [
  { at: 0, colour: [249, 239, 219] }, { at: .2, colour: [247, 244, 230] }, { at: .4, colour: [245, 238, 214] },
  { at: .6, colour: [192, 151, 102] }, { at: .78, colour: [27, 24, 21] }, { at: .9, colour: [247, 242, 232] }, { at: 1, colour: [247, 242, 232] }
];

function sampleColour(point: number) {
  const value = Math.max(0, Math.min(1, point));
  const nextIndex = dayPalette.findIndex((stop) => stop.at >= value);
  const to = dayPalette[Math.max(0, nextIndex)];
  const from = dayPalette[Math.max(0, nextIndex - 1)];
  const blend = from.at === to.at ? 0 : (value - from.at) / (to.at - from.at);
  return from.colour.map((value, index) => Math.round(value + (to.colour[index] - value) * blend));
}

type DayMoment = (typeof dayMoments)[number];

const atmosphereStops = [.22, .4, .58, .76] as const;

function sceneIndexForProgress(progress: number) {
  return atmosphereStops.findIndex((stop) => progress < stop) === -1 ? dayMoments.length - 1 : atmosphereStops.findIndex((stop) => progress < stop);
}

function DayAtmosphere({ progress }: { progress: MotionValue<number> }) {
  const [sceneIndex, setSceneIndex] = useState(() => sceneIndexForProgress(progress.get()));
  const reducedMotion = useReducedMotion();
  const stageOpacity = useTransform(progress, [0, .055, .87, .985], [.62, 1, 1, 0]);
  useMotionValueEvent(progress, "change", (value) => {
    const nextIndex = sceneIndexForProgress(value);
    setSceneIndex((currentIndex) => currentIndex === nextIndex ? currentIndex : nextIndex);
  });
  const moment = dayMoments[sceneIndex];

  return <motion.div className="co-day-atmosphere" aria-hidden="true" style={{ opacity: stageOpacity }}>
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={moment.time} className="co-day-atmosphere__scene" initial={reducedMotion ? false : { opacity: 0, scale: 1.025 }} animate={{ opacity: moment.environmentOpacity, scale: 1.005 }} exit={reducedMotion ? undefined : { opacity: 0, scale: 1.015 }} transition={reducedMotion ? { duration: 0 } : { duration: .38, ease: [0.22, 1, 0.36, 1] }} style={{ filter: `brightness(${moment.environmentBrightness}) contrast(${moment.environmentContrast})` }}>
        <ResponsiveImage src={moment.environment} alt="" fill sizes="100vw" className="object-cover" style={{ objectPosition: moment.environmentPosition }} />
      </motion.div>
    </AnimatePresence>
  </motion.div>;
}

export function DayWithCo() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const updateSurface = (progress: number) => {
      section.style.setProperty("--co-day-base", sampleColour(progress).join(" "));
      section.dataset.dayProgress = progress.toFixed(4);
    };
    updateSurface(scrollYProgress.get());
    return scrollYProgress.on("change", updateSurface);
  }, [scrollYProgress]);

  return <section ref={sectionRef} className="co-day-section" aria-labelledby="co-day-title"><div className="co-day-stage" aria-hidden="true"><DayAtmosphere progress={scrollYProgress} /><DayCelestialScene progress={scrollYProgress} /><div className="co-day-atmosphere-wash" /></div><div className="co-experience-container co-day-content">
    <div className="co-day-intro"><p className="co-experience-eyebrow">A day with .CO</p>
    <h2 id="co-day-title" className="co-experience-title"><FoldText>FIVE SMALL RITUALS. ONE CONSIDERED DAY.</FoldText></h2></div>
    <div className="co-day-list">{dayMoments.map(({ time, family, title, image, description, textTone, scrim, foregroundShadow }) => <article key={time} className="co-day-moment" data-co-reveal data-day-scene={time} data-day-text-tone={textTone} style={{ "--co-day-copy-scrim": scrim, "--co-day-foreground-shadow": foregroundShadow } as CSSProperties}>
      <div className="co-day-media" data-co-parallax="10"><ResponsiveImage src={image} alt={`${family} - ${title}`} fill sizes="(min-width: 900px) 52vw, 92vw" className="object-cover" /></div>
      <div className="co-day-copy"><time>{time}</time><p>{family}</p><h3>{title}</h3><span>{description}</span></div>
    </article>)}</div>
  </div></section>;
}

const journalCards = [
  ["Origins", "The people behind every coconut", "/images/website/manual/journal/CO_WEBSITE_JOURNAL_FEATURED_STORY_DESKTOP_MASTER.webp"],
  ["Recipes", "A quieter kind of breakfast", "/assets/home/refined/recipes-to-inspire-4k.png"],
  ["Rituals", "Coconut care, morning to night", "/images/website/manual/products/galleries/CO_WEBSITE_PDP_BOTANICA_SHAMPOO_HERO_DESKTOP_MASTER.webp"],
  ["Kitchen", "One ingredient, many lives", "/images/website/manual/recipes/CO_WEBSITE_RECIPES_BAKING_DESKTOP_MASTER.webp"],
  ["Living", "Slow afternoons with MELT", "/images/website/home/transitions/CO_WEBSITE_TRANSITION_MELT_DESKTOP_MASTER.webp"],
] as const;

export function HomepageJournalLoop() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const dragging = useRef(false);
  const pointerX = useRef(0);
  const resumeAt = useRef(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const viewport = viewportRef.current; const track = trackRef.current;
    if (!viewport || !track) return undefined;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(media.matches);
    if (media.matches) return undefined;
    let frame = 0; let previous = performance.now(); let visible = true;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { rootMargin: "120px" }); observer.observe(viewport);
    const tick = (now: number) => {
      const dt = Math.min(34, now - previous); previous = now;
      const half = track.scrollWidth / 2;
      if (visible && !dragging.current && now > resumeAt.current && half > 0) offset.current -= dt * .035;
      if (half > 0 && offset.current <= -half) offset.current += half;
      if (offset.current > 0 && half > 0) offset.current -= half;
      track.style.transform = `translate3d(${offset.current}px,0,0)`;
      track.dataset.loopOffset = offset.current.toFixed(2);
      const viewportWidth = viewport.getBoundingClientRect().width;
      track.querySelectorAll<HTMLElement>(".co-journal-loop-card").forEach((card) => {
        const rect = card.getBoundingClientRect();
        const edge = Math.min(1, Math.abs((rect.left + rect.width / 2) - viewportWidth / 2) / (viewportWidth / 2 + rect.width / 2));
        const depth = Math.round(edge * 96);
        card.style.transform = `translateZ(${-depth}px) scale(${(1 - edge * .045).toFixed(3)}) rotateY(${((rect.left + rect.width / 2 < viewportWidth / 2 ? 1 : -1) * edge * 1.5).toFixed(2)}deg)`;
        card.style.opacity = String((1 - edge * .14).toFixed(3));
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, []);

  const pointerDown = (event: React.PointerEvent) => { if (reduced) return; dragging.current = true; pointerX.current = event.clientX; event.currentTarget.setPointerCapture(event.pointerId); };
  const pointerMove = (event: React.PointerEvent) => { if (!dragging.current) return; offset.current += event.clientX - pointerX.current; pointerX.current = event.clientX; };
  const pointerUp = () => { dragging.current = false; resumeAt.current = performance.now() + 1800; };

  return <section className="co-journal-loop-section" aria-labelledby="co-journal-loop-title"><div className="co-experience-container">
    <div className="co-journal-loop-head"><div><p className="co-experience-eyebrow">The .CO Journal</p><h2 id="co-journal-loop-title" className="co-experience-title"><FoldText>STORIES THAT KEEP MOVING.</FoldText></h2></div><Link href="/journal">Read the journal <ArrowRight size={16} /></Link></div>
  </div><div ref={viewportRef} className="co-journal-loop-viewport" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp}>
    <div ref={trackRef} className="co-journal-loop-track">{[0, 1].flatMap((copy) => journalCards.map(([category, title, image], index) => <Link href="/journal" key={`${copy}-${title}`} aria-hidden={copy === 1} tabIndex={copy === 1 ? -1 : undefined} className="co-journal-loop-card"><span className="co-journal-loop-image"><ResponsiveImage src={image} alt={copy === 0 ? title : ""} fill sizes="320px" className="object-cover" /></span><small>{category}</small><strong>{title}</strong><span>0{index + 1}</span></Link>))}</div>
  </div></section>;
}
