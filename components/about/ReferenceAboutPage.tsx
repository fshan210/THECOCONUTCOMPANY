"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CircleX,
  Droplets,
  HandHeart,
  Headphones,
  Heart,
  Leaf,
  LockKeyhole,
  Package,
  PackageCheck,
  Play,
  Plus,
  Recycle,
  RotateCcw,
  Shell,
  Sparkles,
  Sprout,
  TreePalm,
  Truck,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { NewsletterSection, ReferenceFooter, ReferenceHeader } from "@/components/home/ReferenceHomePage";
import { getScrollTrigger, prefersReducedMotion } from "@/lib/animation/gsap-scrolltrigger";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;
const blurDataURL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0MCcgaGVpZ2h0PSczMCc+PHJlY3Qgd2lkdGg9JzEwMCUnIGhlaWdodD0nMTAwJScgZmlsbD0nI2Y3ZjJlOCcvPjwvc3ZnPg==";

const statItems = [
  { target: 50, suffix: "+", label: "Partner Farms", icon: Leaf },
  { target: 100, suffix: "%", label: "Sustainable Packaging", icon: Package },
  { target: 1, suffix: "M+", label: "Coconuts Saved", icon: Droplets },
  { target: 100, suffix: "%", label: "Love from our Community", icon: Heart },
];

const zeroWasteParts = [
  { id: "coir", title: "Coir / Husk", description: "Turns into coir fibres, biodegradable packaging and nutrient-rich mulch.", uses: ["Packaging", "Mulch", "Natural fibre"], icon: Recycle, position: "left-[39%] top-[43%]" },
  { id: "shell", title: "Shell", description: "Transformed into activated charcoal, durable bowls and useful crafts.", uses: ["Activated charcoal", "Bowls", "Crafts"], icon: Shell, position: "left-[42%] top-[58%]" },
  { id: "meat", title: "Coconut Meat", description: "Made into food, coconut milk, desserts and creamy Melt.CO recipes.", uses: ["Food", "Ice cream", "Milk"], icon: Sparkles, position: "left-[42%] top-[76%]" },
  { id: "water", title: "Coconut Water", description: "Bottled as clean hydration with nothing unnecessary added.", uses: ["Beverages", "Hydration", "Electrolytes"], icon: Droplets, position: "right-[20%] top-[39%]" },
  { id: "fibre", title: "Coconut Fibre", description: "Strong natural strands become durable, lower-waste everyday materials.", uses: ["Coir", "Brushes", "Natural materials"], icon: Leaf, position: "right-[18%] top-[70%]" },
];

const timelineItems = [
  { year: "2020", title: "It all started", body: "A simple idea to create better coconut products.", icon: Sprout },
  { year: "2021", title: "Building the Foundation", body: "Partnered with farmers and developed our first products.", icon: TreePalm },
  { year: "2021", title: "Sharing the Goodness", body: "Launched .CO to bring pure coconut goodness to more people.", icon: Heart },
  { year: "2022", title: "Growing Together", body: "Expanded our product range and our community.", icon: Droplets },
  { year: "2023", title: "Stronger Impact", body: "Deepening our commitment to sustainability.", icon: HandHeart },
  { year: "2024+", title: "A Future Rooted in Purpose", body: "Continuing to grow, innovate and make a positive impact.", icon: Package },
];

const values = [
  { title: "Real Ingredients", body: "No shortcuts, just honesty.", icon: Shell },
  { title: "Conscious Choices", body: "Good for you, good for the planet.", icon: Leaf },
  { title: "Community First", body: "Stronger together, better forever.", icon: Users },
  { title: "Ethical Impact", body: "Fair for farmers, kind to ecosystems.", icon: HandHeart },
  { title: "Better Every Day", body: "Small steps, big change.", icon: Sprout },
];

function SectionLabel({ number, children }: { number: string; children?: React.ReactNode }) {
  return <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#305a34]">{number}{children ? <span className="ml-3">{children}</span> : null}</p>;
}

function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 24, filter: "blur(8px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.72, delay, ease }}>
      {children}
    </motion.div>
  );
}

function AboutCounter({ target, suffix, label, icon: Icon }: (typeof statItems)[number]) {
  const ref = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current || !numberRef.current) return undefined;
    if (prefersReducedMotion()) {
      numberRef.current.textContent = String(target);
      return undefined;
    }
    const { gsap, ScrollTrigger } = getScrollTrigger();
    const state = { value: 0 };
    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: "top 72%",
      once: true,
      onEnter: () => gsap.to(state, { value: target, duration: 2.25, ease: "expo.out", onUpdate: () => { if (numberRef.current) numberRef.current.textContent = String(Math.round(state.value)); } }),
    });
    return () => trigger.kill();
  }, [target]);

  return (
    <div ref={ref} className="flex flex-col items-center px-2 text-center md:min-h-[132px] md:justify-center md:border-r md:border-[#35271e]/8 md:last:border-r-0">
      <span className="grid size-9 place-items-center rounded-full bg-[#f0ede5] text-[#305a34]"><Icon size={17} strokeWidth={1.45} /></span>
      <p className="mt-3 font-['Cormorant_Garamond'] text-[33px] leading-none md:text-[39px]"><span ref={numberRef}>0</span>{suffix}</p>
      <p className="mt-2 max-w-[100px] text-[9px] leading-4 text-[#5f574f] md:text-[10px]">{label}</p>
    </div>
  );
}

function AboutHero() {
  const heroRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current || !imageRef.current || prefersReducedMotion()) return undefined;
    const { gsap } = getScrollTrigger();
    const context = gsap.context(() => {
      gsap.fromTo("[data-about-reveal]", { opacity: 0, y: 26, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, stagger: 0.1, ease: "power3.out" });
      gsap.to(imageRef.current, { yPercent: 5, scale: 1.025, ease: "none", scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: 0.8 } });
    }, heroRef);
    return () => context.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative isolate min-h-[520px] overflow-hidden bg-[#f7f2e8] md:min-h-[565px]">
      <div ref={imageRef} className="absolute inset-0">
        <Image src="/assets/about/co-about-hero-editorial-4k.avif" alt=".CO coconut water and Melt.CO with fresh coconut in morning light" fill priority sizes="100vw" quality={95} placeholder="blur" blurDataURL={blurDataURL} className="object-cover object-[65%_center] md:object-center" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(247,242,232,.98)_0%,rgba(247,242,232,.9)_47%,rgba(247,242,232,.08)_78%)] md:bg-[linear-gradient(90deg,rgba(247,242,232,.98)_0%,rgba(247,242,232,.88)_45%,rgba(247,242,232,.05)_76%)]" />
      <div className="relative z-10 mx-auto max-w-[1500px] px-5 pb-8 pt-7 md:px-[clamp(48px,6vw,92px)] md:py-16">
        <div className="max-w-[520px]">
          <p data-about-reveal className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#305a34]">Our Story</p>
          <h1 data-about-reveal className="mt-3 max-w-[8ch] font-['Cormorant_Garamond'] text-[38px] leading-[.92] tracking-[-.035em] text-[#17120e] md:mt-4 md:max-w-[12ch] md:text-[68px] md:leading-[.88]">Rooted in nature.<br />Made for <em className="font-normal text-[#305a34]">living.</em></h1>
          <p data-about-reveal className="mt-5 max-w-[165px] text-[11px] leading-5 text-[#37302a] md:mt-6 md:max-w-[380px] md:text-[15px] md:leading-7">At .CO, we craft premium coconut products that nourish you and care for our planet. Pure, simple, honest—just as nature intended.</p>
          <div data-about-reveal className="mt-7 flex flex-wrap gap-3">
            <Link href="#our-journey" className="co-primary-cta group inline-flex min-h-11 items-center gap-4 rounded-full bg-[#304f2c] px-5 text-[9px] font-semibold text-white shadow-[0_14px_32px_rgba(48,79,44,.22)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(48,79,44,.3)] md:min-h-12 md:gap-5 md:px-6 md:text-[10px]">Our Journey <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /></Link>
            <Link href="#our-promise" className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-[#35271e]/20 bg-white/34 px-4 text-[9px] font-semibold backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/60 md:min-h-12 md:gap-3 md:px-5 md:text-[10px]"><span className="grid size-7 place-items-center rounded-full border border-[#35271e]/20"><Play size={11} fill="currentColor" /></span> Watch our story</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsAndQuote() {
  return (
    <section className="relative z-20 -mt-2 px-3 md:-mt-12 md:px-8">
      <div className="mx-auto max-w-[1320px] overflow-hidden rounded-[27px] border border-white/70 bg-[rgba(255,255,255,.72)] p-3 shadow-[0_20px_60px_rgba(53,39,30,.1)] backdrop-blur-xl md:grid md:grid-cols-[1.5fr_.72fr] md:gap-3 md:p-3">
        <div className="grid grid-cols-4 gap-1 rounded-[22px] bg-white/38 px-1 py-5 md:py-1">
          {statItems.map((stat) => <AboutCounter key={stat.label} {...stat} />)}
        </div>
        <QuoteCard />
      </div>
    </section>
  );
}

function QuoteCard() {
  return (
    <Reveal className="relative mt-3 min-h-[180px] overflow-hidden rounded-[22px] text-white md:mt-0 md:min-h-[150px]">
      <Image src="/assets/backgrounds/kerala-groves/co-kerala-grove-editorial-4k.avif" alt="Kerala coconut groves" fill sizes="(min-width:768px) 32vw, 94vw" quality={90} placeholder="blur" blurDataURL={blurDataURL} className="object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,39,15,.86),rgba(18,39,15,.38))]" />
      <blockquote className="relative z-10 flex min-h-[180px] flex-col justify-center p-6 font-['Cormorant_Garamond'] text-[24px] leading-[1.08] md:min-h-[150px] md:text-[25px]">“Coconuts are our origin.<br />Sustainability is our path.<br />Wellness is our promise.”<cite className="mt-4 font-['Inter'] text-[9px] not-italic uppercase tracking-[.08em] text-white/72">— The .CO Way</cite></blockquote>
    </Reveal>
  );
}

function ZeroWasteCard({ part, active, onActivate }: { part: (typeof zeroWasteParts)[number]; active: boolean; onActivate: () => void }) {
  const Icon = part.icon;
  return (
    <motion.button type="button" aria-pressed={active} onMouseEnter={onActivate} onFocus={onActivate} onClick={onActivate} animate={{ borderColor: active ? "rgba(48,79,44,.34)" : "rgba(53,39,30,.08)", y: active ? -2 : 0 }} className="group grid w-full grid-cols-[52px_1fr_32px] items-center gap-3 rounded-[19px] border bg-white/54 p-3 text-left shadow-[0_10px_30px_rgba(53,39,30,.045)] transition-shadow hover:shadow-[0_16px_38px_rgba(53,39,30,.09)]">
      <span className="grid size-12 place-items-center rounded-full bg-[#f0ede4] text-[#305a34]"><Icon size={21} strokeWidth={1.4} /></span>
      <span><span className="block font-['Cormorant_Garamond'] text-[19px] leading-none">{part.title}</span><span className="mt-2 block text-[10px] leading-4 text-[#625950]">{part.description}</span></span>
      <span className={cn("grid size-7 place-items-center rounded-full transition-colors", active ? "bg-[#305a34] text-white" : "bg-[#edf0e8] text-[#305a34]")}><Plus size={14} className={cn("transition-transform", active && "rotate-45")} /></span>
    </motion.button>
  );
}

function ZeroWasteTree() {
  const [activeId, setActiveId] = useState("coir");
  const active = zeroWasteParts.find((part) => part.id === activeId) ?? zeroWasteParts[0];

  return (
    <section className="px-3 py-7 md:px-8 md:py-8">
      <div className="mx-auto max-w-[1320px] rounded-[28px] border border-[#35271e]/7 bg-white/42 p-4 shadow-[0_18px_55px_rgba(53,39,30,.045)] md:p-6">
        <SectionLabel number="01" />
        <h2 className="mt-3 font-['Cormorant_Garamond'] text-[34px] leading-none md:text-[39px]">The “Zero-Waste” Coconut</h2>
        <p className="mt-3 text-[11px] leading-5 text-[#625950]">Explore how we use every part of the coconut.<br className="hidden md:block" /> Nothing goes to waste.</p>

        <div className="mt-6 grid gap-5 md:grid-cols-[.8fr_1.25fr_.8fr] md:items-center">
          <div className="order-2 space-y-3 md:order-1">
            {zeroWasteParts.slice(0, 3).map((part) => <ZeroWasteCard key={part.id} part={part} active={activeId === part.id} onActivate={() => setActiveId(part.id)} />)}
            <Link href="/sustainability" className="flex min-h-12 items-center justify-center gap-3 rounded-full border border-[#305a34]/22 bg-white/48 text-[9px] font-semibold md:hidden">Our Sustainability Approach <ArrowRight size={13} /></Link>
          </div>

          <div className="relative order-1 mx-auto aspect-square w-full max-w-[520px] overflow-hidden rounded-[24px] md:order-2 md:aspect-[941/1672] md:overflow-visible md:rounded-none">
            <Image src="/assets/about/co-zero-waste-palm-editorial-4k.avif" alt="A coconut palm showing how every part becomes useful food, drink and natural materials" fill sizes="94vw" quality={95} placeholder="blur" blurDataURL={blurDataURL} className="rounded-[24px] object-cover md:hidden" />
            <Image src="/assets/about/co-zero-waste-coconut-split.png" alt="A deconstructed coconut showing how every layer becomes useful food, drink and natural materials" fill sizes="42vw" quality={95} placeholder="blur" blurDataURL={blurDataURL} className="hidden rounded-[24px] object-cover md:block" />
            <div className="absolute inset-0 rounded-[24px] ring-1 ring-inset ring-white/60" />
            <svg aria-hidden="true" viewBox="0 0 100 125" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 z-[5] h-full w-full text-[#305a34]/28">
              <path d="M0 54 H39" stroke="currentColor" strokeWidth=".35" strokeDasharray="1 1" />
              <path d="M0 73 H42" stroke="currentColor" strokeWidth=".35" strokeDasharray="1 1" />
              <path d="M0 95 H42" stroke="currentColor" strokeWidth=".35" strokeDasharray="1 1" />
              <path d="M80 49 H100" stroke="currentColor" strokeWidth=".35" strokeDasharray="1 1" />
              <path d="M82 88 H100" stroke="currentColor" strokeWidth=".35" strokeDasharray="1 1" />
            </svg>
            {zeroWasteParts.map((part) => (
              <motion.button key={part.id} type="button" aria-label={`Explore ${part.title}`} aria-pressed={activeId === part.id} onMouseEnter={() => setActiveId(part.id)} onFocus={() => setActiveId(part.id)} onClick={() => setActiveId(part.id)} animate={{ scale: activeId === part.id ? 1.22 : 1 }} className={cn("absolute z-10 grid size-7 place-items-center rounded-full border-2 border-white bg-[#305a34] text-white shadow-[0_8px_22px_rgba(31,62,29,.28)]", part.position)}>
                <span className="size-1.5 rounded-full bg-white" />
              </motion.button>
            ))}
            <AnimatePresence mode="wait">
              <motion.div key={active.id} initial={{ opacity: 0, y: 12, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.32, ease }} className="absolute inset-x-3 bottom-3 rounded-[18px] border border-white/70 bg-[rgba(247,242,232,.82)] p-4 shadow-[0_18px_45px_rgba(53,39,30,.14)] backdrop-blur-xl md:hidden">
                <p className="font-['Cormorant_Garamond'] text-xl">{active.title}</p><p className="mt-1 text-[10px] leading-4 text-[#625950]">{active.description}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="order-3 hidden space-y-3 md:block">
            {zeroWasteParts.slice(3).map((part) => <ZeroWasteCard key={part.id} part={part} active={activeId === part.id} onActivate={() => setActiveId(part.id)} />)}
            <motion.div layout className="hidden rounded-[19px] bg-[linear-gradient(145deg,#f0eee6,#faf8f2)] p-5 md:block">
              <p className="text-[10px] font-semibold uppercase tracking-[.1em] text-[#305a34]">{active.title} becomes</p>
              <div className="mt-3 flex flex-wrap gap-2">{active.uses.map((use) => <span key={use} className="rounded-full border border-[#305a34]/14 bg-white/65 px-3 py-2 text-[9px]">{use}</span>)}</div>
              <p className="mt-5 text-[11px] leading-5 text-[#625950]">We believe in full-circle innovation that respects nature and creates lasting impact.</p>
              <Link href="/sustainability" className="mt-4 inline-flex items-center gap-3 rounded-full border border-[#305a34]/22 px-4 py-3 text-[9px] font-semibold">Our Sustainability Approach <ArrowRight size={13} /></Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

const conventionalItems = [
  ["Added Sugar", "High Fructose Corn Syrup"],
  ["Artificial Preservatives", "Sodium Benzoate (E211)"],
  ["Synthetic Antioxidants", "BHA (E320)"],
  ["High Emission Shipping", "Long-haul, fossil fuel based"],
  ["Complex Processing", "Heat treated, refined, diluted"],
];

const cleanItems = [
  ["100% Raw Coconut", "Nothing added. Nothing removed."],
  ["Sustained Energy", "Naturally hydrating & replenishing"],
  ["Zero Additives", "No sugar, no preservatives"],
  ["Low Impact", "Ethical sourcing, minimal emissions"],
  ["Clean Processing", "Careful handling retains goodness"],
];

function IngredientList({ items, clean }: { items: string[][]; clean?: boolean }) {
  return (
    <div className="space-y-3">
      {items.map(([title, body]) => (
        <div key={title} className="grid grid-cols-[20px_1fr] gap-2">
          <span className={cn("mt-0.5 grid size-4 place-items-center rounded-full text-white", clean ? "bg-[#305a34]" : "bg-[#884233]")}>{clean ? <Check size={10} /> : <CircleX size={10} />}</span>
          <span><span className="block text-[9px] font-semibold md:text-[10px]">{title}</span><span className="mt-0.5 block text-[8px] leading-3.5 text-[#635b53] md:text-[9px]">{body}</span></span>
        </div>
      ))}
    </div>
  );
}

function IngredientPeeler() {
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  const updatePosition = (clientX: number) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition(Math.max(15, Math.min(85, ((clientX - rect.left) / rect.width) * 100)));
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    updatePosition(event.clientX);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragging) updatePosition(event.clientX);
  };

  return (
    <section className="px-3 pb-7 md:px-8 md:pb-8">
      <div className="mx-auto max-w-[1320px] rounded-[28px] border border-[#35271e]/7 bg-white/42 p-4 shadow-[0_18px_55px_rgba(53,39,30,.045)] md:p-6">
        <SectionLabel number="02" />
        <h2 className="mt-3 font-['Cormorant_Garamond'] text-[32px] leading-[.95] md:text-[39px]">The “Pure vs. Processed” Ingredient Peeler</h2>
        <p className="mt-3 text-[11px] text-[#625950]">See the difference. Choose what&apos;s real.</p>

        <div ref={frameRef} role="slider" aria-label="Compare conventional and .CO ingredients" aria-valuemin={15} aria-valuemax={85} aria-valuenow={Math.round(position)} tabIndex={0} onKeyDown={(event) => { if (event.key === "ArrowLeft") setPosition((value) => Math.max(15, value - 3)); if (event.key === "ArrowRight") setPosition((value) => Math.min(85, value + 3)); }} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={() => setDragging(false)} onPointerCancel={() => setDragging(false)} className="relative mt-5 min-h-[610px] touch-none select-none overflow-hidden rounded-[23px] border border-white/70 bg-[#ddd] md:min-h-[430px]">
          <div className="absolute inset-0 bg-[#dedfdd]">
            <div className="absolute inset-y-0 left-0 z-10 w-[47%] p-4 md:w-[31%] md:p-6">
              <h3 className="font-['Cormorant_Garamond'] text-[23px] leading-none md:text-[28px]">Conventional Brand</h3>
              <p className="mt-2 text-[9px] text-[#554f4a] md:text-[10px]">Hidden ingredients. Heavy impact.</p>
              <div className="mt-5 max-w-[220px]"><IngredientList items={conventionalItems} /></div>
            </div>
            <div className="absolute bottom-[-2%] left-[34%] h-[74%] w-[34%] -translate-x-1/2 md:left-[44%] md:h-[90%] md:w-[21%]">
              <Image src="/assets/about/generic-coconut-water-comparison.png" alt="Generic sweetened coconut water bottle" fill sizes="(min-width:768px) 22vw, 33vw" quality={95} placeholder="blur" blurDataURL={blurDataURL} className="object-contain object-bottom drop-shadow-[0_24px_30px_rgba(42,46,47,.2)]" />
            </div>
          </div>

          <div className="absolute inset-0 overflow-hidden bg-[#f5f2e9]" style={{ clipPath: `inset(0 0 0 ${position}%)` }}>
            <div className="absolute inset-y-0 right-0 z-10 w-[47%] p-4 md:w-[31%] md:p-6">
              <h3 className="font-['Cormorant_Garamond'] text-[23px] leading-none md:text-[28px]">.CO Brand</h3>
              <p className="mt-2 text-[9px] text-[#554f4a] md:text-[10px]">Pure ingredients. Real impact.</p>
              <div className="mt-5 max-w-[220px]"><IngredientList items={cleanItems} clean /></div>
            </div>
            <div className="absolute bottom-[-2%] left-[64%] h-[66%] w-[30%] -translate-x-1/2 md:left-[56%] md:h-[82%] md:w-[19%]">
              <Image src="/assets/transparent/co-water-bottle.png" alt=".CO pure coconut water" fill sizes="(min-width:768px) 20vw, 29vw" quality={95} placeholder="blur" blurDataURL={blurDataURL} className="object-contain drop-shadow-[0_24px_30px_rgba(53,39,30,.18)]" />
            </div>
          </div>

          <div className="absolute inset-y-0 z-30 w-px bg-white/90 shadow-[0_0_18px_rgba(53,39,30,.24)]" style={{ left: `${position}%` }}>
            <motion.div animate={{ scale: dragging ? 1.08 : 1 }} className="absolute left-1/2 top-[58%] grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#35271e]/12 bg-[rgba(255,255,255,.92)] shadow-[0_12px_28px_rgba(53,39,30,.16)] backdrop-blur-md md:top-1/2">
              <span className="font-['Space_Grotesk'] text-[15px] text-[#305a34]">‹ ›</span>
            </motion.div>
          </div>
          <span className="absolute bottom-2 left-1/2 z-40 -translate-x-1/2 rounded-full bg-[rgba(247,242,232,.86)] px-3 py-1.5 text-[8px] font-medium shadow-sm backdrop-blur-md">Drag to compare</span>
        </div>
      </div>
    </section>
  );
}

function JourneyTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !lineRef.current || prefersReducedMotion()) return undefined;
    const { gsap } = getScrollTrigger();
    const context = gsap.context(() => {
      gsap.fromTo(lineRef.current, { scaleX: 0, scaleY: 0 }, { scaleX: 1, scaleY: 1, ease: "none", transformOrigin: "top left", scrollTrigger: { trigger: sectionRef.current, start: "top 72%", end: "bottom 48%", scrub: 0.8 } });
      gsap.from("[data-timeline-node]", { opacity: 0, y: 18, stagger: 0.12, duration: 0.65, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 68%", once: true } });
    }, sectionRef);
    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} id="our-journey" className="px-3 pb-7 md:px-8 md:pb-8">
      <div className="mx-auto max-w-[1320px] rounded-[28px] border border-[#35271e]/7 bg-white/42 p-5 shadow-[0_18px_55px_rgba(53,39,30,.045)] md:p-6">
        <SectionLabel number="03">Timeline</SectionLabel>
        <h2 className="mt-3 font-['Cormorant_Garamond'] text-[34px] leading-none md:text-[38px]">Our Journey So Far</h2>
        <div className="relative mt-7 md:grid md:grid-cols-6 md:gap-5">
          <div className="absolute bottom-2 left-[20px] top-3 w-px bg-[#305a34]/12 md:left-[4.5%] md:right-[4.5%] md:top-[21px] md:h-px md:w-auto">
            <div ref={lineRef} className="h-full w-full bg-[#305a34]/55" />
          </div>
          {timelineItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <article data-timeline-node key={`${item.year}-${item.title}`} className="relative grid grid-cols-[42px_1fr] gap-4 pb-7 last:pb-0 md:block md:pb-0">
                <span className="relative z-10 grid size-[42px] place-items-center rounded-full border border-[#305a34]/28 bg-[#f9f6ee] text-[#305a34] md:mx-auto"><Icon size={18} strokeWidth={1.45} /></span>
                <div className="md:mt-4">
                  <p className="text-[11px] font-semibold">{item.year}</p>
                  <h3 className="mt-1 text-[10px] font-semibold leading-4 md:min-h-[34px]">{item.title}</h3>
                  <p className="mt-2 text-[9px] leading-4 text-[#625950]">{item.body}</p>
                </div>
                <span className="sr-only">Step {index + 1}</span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ValuesSection() {
  return (
    <section className="px-3 pb-7 md:px-8 md:pb-8">
      <div className="mx-auto max-w-[1320px] overflow-hidden rounded-[28px] border border-[#35271e]/7 bg-white/42 p-5 shadow-[0_18px_55px_rgba(53,39,30,.045)] md:grid md:grid-cols-[260px_1fr] md:gap-4 md:p-6">
        <div>
          <SectionLabel number="04">Our Values</SectionLabel>
          <h2 className="mt-3 font-['Cormorant_Garamond'] text-[34px] leading-[.96] md:text-[38px]">Our values guide<br />everything we do.</h2>
        </div>
        <div className="mt-6 grid gap-2 md:mt-0 md:grid-cols-5">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.article key={value.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: index * 0.07, ease }} whileHover={{ y: -4, scale: 1.015 }} className="group grid grid-cols-[48px_1fr] items-center gap-3 rounded-[20px] border border-white/65 bg-[linear-gradient(145deg,rgba(255,255,255,.7),rgba(241,238,228,.55))] p-3 shadow-[0_10px_30px_rgba(53,39,30,.045)] md:block md:min-h-[145px] md:text-center">
                <span className="grid size-11 place-items-center rounded-full bg-[#edf0e8] text-[#305a34] transition group-hover:bg-[#305a34] group-hover:text-white md:mx-auto"><Icon size={20} strokeWidth={1.35} /></span>
                <div className="md:mt-3"><h3 className="text-[10px] font-semibold">{value.title}</h3><p className="mt-1 text-[9px] leading-4 text-[#625950]">{value.body}</p></div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PromiseAndMovement() {
  return (
    <section id="our-promise" className="px-3 pb-7 md:px-8 md:pb-8">
      <div className="mx-auto grid max-w-[1320px] gap-4 md:grid-cols-2">
        <Reveal className="overflow-hidden rounded-[28px] border border-[#35271e]/7 bg-white/48 p-5 shadow-[0_18px_55px_rgba(53,39,30,.05)] md:grid md:grid-cols-[.86fr_1.14fr] md:gap-5 md:p-6">
          <div>
            <SectionLabel number="05">Our Promise</SectionLabel>
            <h2 className="mt-4 font-['Cormorant_Garamond'] text-[34px] leading-[.95] md:text-[38px]">This is more than<br />a brand. It&apos;s a <em className="font-normal text-[#305a34]">belief.</em></h2>
            <p className="mt-5 text-[11px] leading-5 text-[#625950]">We believe in coconuts.<br />In people. In a better tomorrow.</p>
            <p className="mt-6 font-['Cormorant_Garamond'] text-xl italic text-[#305a34]">Fazil &amp; Afsala</p>
            <p className="mt-1 text-[8px] uppercase tracking-[.08em] text-[#6a6158]">Founders, .CO</p>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2 md:mt-0">
            <div className="relative min-h-[240px] overflow-hidden rounded-[20px]"><Image src="/assets/social/fazil-founder-clean.png" alt="Fazil, founder of .CO" fill sizes="(min-width:768px) 18vw, 45vw" quality={90} placeholder="blur" blurDataURL={blurDataURL} className="object-cover object-[42%_center] transition duration-700 hover:scale-[1.035]" /></div>
            <div className="relative min-h-[240px] overflow-hidden rounded-[20px]"><Image src="/assets/social/afsala-founder-clean.png" alt="Afsala, founder of .CO" fill sizes="(min-width:768px) 18vw, 45vw" quality={90} placeholder="blur" blurDataURL={blurDataURL} className="object-cover object-[43%_center] transition duration-700 hover:scale-[1.035]" /></div>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="relative min-h-[390px] overflow-hidden rounded-[28px] bg-[#1d3919] text-white shadow-[0_20px_60px_rgba(30,50,24,.16)] md:min-h-[330px]">
          <Image src="/assets/about/co-about-hero-editorial-4k.avif" alt="Fresh coconut products in natural morning light" fill sizes="(min-width:768px) 50vw, 94vw" quality={90} placeholder="blur" blurDataURL={blurDataURL} className="object-cover object-[68%_center]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(22,49,19,.92),rgba(22,49,19,.54)_52%,rgba(22,49,19,.1))]" />
          <div className="relative z-10 flex min-h-[390px] max-w-[58%] flex-col p-6 md:min-h-[330px] md:p-7">
            <SectionLabel number="06">Be part of the change</SectionLabel>
            <h2 className="mt-4 font-['Cormorant_Garamond'] text-[37px] leading-[.95] md:text-[42px]">Join the .CO movement.</h2>
            <p className="mt-5 text-sm leading-7 text-white/82">When you choose .CO,<br />you choose better for<br />yourself and the planet.</p>
            <Link href="/sustainability" className="group mt-6 inline-flex min-h-12 w-fit items-center gap-5 rounded-full bg-[#f7f2e8] px-5 text-[9px] font-semibold text-[#305a34] transition hover:-translate-y-0.5">Our Sustainability <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" /></Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function MobileServiceList() {
  const services = [[Truck, "Free Delivery", "On orders over ₹699"], [Headphones, "24/7 Support", "We're here anytime"], [RotateCcw, "Hassle-free Returns", "14-day easy returns"], [LockKeyhole, "Secure Payments", "100% safe & secure"], [PackageCheck, "Sustainable Packaging", "Good for you, good for Earth"]] as const;
  return (
    <section className="mx-3 mb-7 rounded-[24px] border border-[#35271e]/7 bg-white/42 px-4 md:hidden">
      {services.map(([Icon, title, body]) => <div key={title} className="grid grid-cols-[44px_1fr] items-center gap-3 border-b border-[#35271e]/7 py-4 last:border-0"><span className="grid size-10 place-items-center rounded-full border border-[#305a34]/15 text-[#305a34]"><Icon size={18} strokeWidth={1.4} /></span><span><span className="block text-[10px] font-semibold uppercase text-[#305a34]">{title}</span><span className="mt-1 block text-[10px] text-[#625950]">{body}</span></span></div>)}
    </section>
  );
}

export function ReferenceAboutPage() {
  return (
    <div className="co-about-page min-h-screen overflow-hidden bg-[#f7f2e8] font-['Inter'] text-[#35271e]">
      <ReferenceHeader />
      <AboutHero />
      <StatsAndQuote />
      <ZeroWasteTree />
      <IngredientPeeler />
      <JourneyTimeline />
      <ValuesSection />
      <PromiseAndMovement />
      <NewsletterSection />
      <MobileServiceList />
      <ReferenceFooter />
    </div>
  );
}
