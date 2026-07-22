"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Droplets, HandHeart, Heart, Package, Sprout, TreePalm } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motionEase, useMotionQuality } from "@/lib/motion";

const milestones = [
  { year: "2020", title: "It all started", body: "A simple idea: build a coconut company around considered products and everyday living.", icon: Sprout },
  { year: "2021", title: "Building the foundation", body: "Early product work turned the idea into a practical sourcing and production plan.", icon: TreePalm },
  { year: "2022", title: "First product direction", body: "The coconut-water ecosystem became the anchor for the wider .CO brand world.", icon: Droplets },
  { year: "2023", title: "Growing the ecosystem", body: "Kitchen, Creamery and Botanica directions expanded the brand beyond one bottle.", icon: Heart },
  { year: "2024", title: "Rooted partnerships", body: "A Pollachi contract-farm anchor and Kerala operating base shaped the sourcing model.", icon: HandHeart },
  { year: "Next", title: "Made for living", body: "Phase-one UHT production and a measured VAP network are the next execution milestones.", icon: Package },
] as const;

export function JourneyScrollStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const quality = useMotionQuality();
  const [active, setActive] = useState(0);
  const [desktop, setDesktop] = useState(false);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (!desktop || quality !== "full") return;
    setActive(Math.min(milestones.length - 1, Math.floor(value * milestones.length)));
  });
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const sync = () => setDesktop(media.matches);
    sync(); media.addEventListener("change", sync); return () => media.removeEventListener("change", sync);
  }, []);

  if (!desktop || quality !== "full") {
    return (
      <section id="our-journey" className="px-3 pb-7 md:px-8 md:pb-8" aria-labelledby="journey-title">
        <div className="mx-auto max-w-[1320px] rounded-[28px] border border-[#35271e]/7 bg-white/42 p-5 shadow-[0_18px_55px_rgba(53,39,30,.045)] md:p-7">
          <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#305a34]">03 <span className="ml-3">Timeline</span></p>
          <h2 id="journey-title" className="mt-3 font-['Cormorant_Garamond'] text-[34px] leading-none md:text-[42px]">Our Journey So Far</h2>
          <div className="relative mt-7 space-y-3 before:absolute before:bottom-8 before:left-5 before:top-8 before:w-px before:bg-[#305a34]/18">
            {milestones.map((item) => { const Icon = item.icon; return <article key={item.year} className="relative grid grid-cols-[42px_1fr] gap-4 rounded-[20px] bg-white/34 p-3"><span className="relative z-10 grid size-[42px] place-items-center rounded-full border border-[#305a34]/25 bg-[#f9f6ee] text-[#305a34]"><Icon size={18} /></span><div><p className="text-[10px] font-semibold uppercase text-[#305a34]">{item.year}</p><h3 className="mt-1 font-['Cormorant_Garamond'] text-2xl">{item.title}</h3><p className="mt-2 text-[11px] leading-5 text-[#625950]">{item.body}</p></div></article>; })}
          </div>
        </div>
      </section>
    );
  }

  const current = milestones[active];
  const CurrentIcon = current.icon;
  return (
    <section ref={sectionRef} id="our-journey" className="relative px-8" style={{ height: `${milestones.length * 88}vh` }} aria-labelledby="journey-title">
      <div className="sticky top-0 mx-auto grid min-h-screen max-w-[1320px] grid-cols-[.72fr_1.28fr] items-center gap-10 py-24">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#305a34]">03 <span className="ml-3">Timeline</span></p>
          <h2 id="journey-title" className="mt-3 font-['Cormorant_Garamond'] text-[48px] leading-[.92]">Our Journey<br />So Far</h2>
          <ol className="relative mt-8 space-y-2 before:absolute before:bottom-5 before:left-5 before:top-5 before:w-px before:bg-[#305a34]/14">
            {milestones.map((item, index) => { const Icon = item.icon; const selected = index === active; return <li key={item.year}><button type="button" onClick={() => setActive(index)} className="relative z-10 grid w-full grid-cols-[42px_1fr] items-center gap-4 rounded-[18px] p-2 text-left" aria-current={selected ? "step" : undefined}><motion.span animate={{ backgroundColor: selected ? "#305a34" : "#f9f6ee", color: selected ? "#fff" : "#305a34", scale: selected ? 1.08 : 1 }} className="grid size-[42px] place-items-center rounded-full border border-[#305a34]/24"><Icon size={17} /></motion.span><span><span className="block text-[9px] font-semibold uppercase tracking-[.12em] text-[#305a34]">{item.year}</span><span className="mt-1 block text-[12px] font-semibold">{item.title}</span></span></button></li>; })}
          </ol>
        </div>
        <div className="relative min-h-[520px] overflow-hidden rounded-[34px] border border-white/70 bg-[linear-gradient(145deg,rgba(255,255,255,.72),rgba(238,232,217,.52))] p-9 shadow-[0_28px_80px_rgba(53,39,30,.1)] backdrop-blur-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(163,190,145,.3),transparent_32%)]" />
          <AnimatePresence mode="wait">
            <motion.article key={current.year} className="relative flex min-h-[440px] flex-col justify-between" initial={{ opacity: 0, y: 22, filter: "blur(7px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -16, filter: "blur(5px)" }} transition={{ duration: .54, ease: motionEase }}>
              <div className="flex items-start justify-between"><span className="grid size-16 place-items-center rounded-full bg-[#305a34] text-white shadow-[0_16px_38px_rgba(48,90,52,.22)]"><CurrentIcon size={27} strokeWidth={1.35} /></span><span className="font-['Space_Grotesk'] text-[72px] font-medium leading-none text-[#305a34]/12">0{active + 1}</span></div>
              <div><p className="text-[11px] font-semibold uppercase tracking-[.16em] text-[#305a34]">{current.year}</p><h3 className="mt-3 max-w-xl font-['Cormorant_Garamond'] text-[54px] leading-[.9]">{current.title}</h3><p className="mt-5 max-w-lg text-[14px] leading-7 text-[#625950]">{current.body}</p></div>
              <div className="h-1 overflow-hidden rounded-full bg-[#305a34]/10"><motion.div className="h-full origin-left rounded-full bg-[#305a34]" animate={{ scaleX: (active + 1) / milestones.length }} transition={{ duration: .45, ease: motionEase }} /></div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
