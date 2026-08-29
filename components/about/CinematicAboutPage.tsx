"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, Droplets, Leaf, Recycle, Shell, Sparkles, Sprout, UsersRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { MobileBottomNav, ReferenceFooter, ReferenceHeader } from "@/components/home/ReferenceHomePage";
import { BrandSlidingPuzzle } from "@/components/interactive/BrandSlidingPuzzle";
import { NewsletterForm } from "@/components/launch/NewsletterForm";
import { mediaUrl } from "@/lib/media";
import styles from "./CinematicAboutPage.module.css";

const assetRoot = "/assets/redesign/about";
const ease = [0.22, 0.8, 0.22, 1] as const;

const originSteps = [
  { title: "Where it begins.", copy: "In the fertile lands of Pollachi, Tamil Nadu, where generations have nurtured coconut with patience and respect.", image: "where-it-begins.png", alt: "Coconut groves beneath the mountains near Pollachi" },
  { title: "Grown by people, not abstractions.", copy: "From smallholder farms to local communities — real hands, real care, real impact.", image: "grown-by-people.png", alt: "Coconut growers carefully gathering a harvest" },
  { title: "Processed with care.", copy: "Clean practices. Thoughtful processing. Preserving what nature perfected.", image: "process-with-care.png", alt: "Coconuts being carefully processed" },
  { title: "From origin to everyday living.", copy: "Thoughtfully brought to you in forms that fit your life, and values that last.", image: "origin-to-everyday-living.png", alt: ".CO coconut oil in an everyday kitchen" },
] as const;

const values = [
  { title: "Whole coconut thinking", copy: "We look at the whole coconut — every part, every possibility.", image: "where-it-begins.png", icon: Shell },
  { title: "Traceable origin", copy: "From farm to finish, we stay close to where it comes from and who made it.", image: "traceable-origin.png", icon: Sprout },
  { title: "Better use, less waste", copy: "We design for better use so less goes to waste, always.", image: "better-use-less-waste.png", icon: Recycle },
  { title: "Built by people", copy: "We grow with the people who grow with us.", image: "built-by-people.png", icon: UsersRound },
] as const;

const brands = [
  { id: "water", name: ".CO WATER", copy: "Pure hydration. Nothing added.", image: "coconut-water.png", href: "/shop?category=Coconut%20Water" },
  { id: "kitchen", name: ".CO KITCHEN", copy: "Everyday essentials. Made for real life.", image: "kitchen.png", href: "/shop?category=Food" },
  { id: "botanica", name: "BOTANICA", copy: "Rooted in nature. Made to nurture.", image: "botanica.png", href: "/shop?category=Cosmetics" },
  { id: "melt", name: "MELT", copy: "Indulgence, reimagined. Coconut at its creamiest.", image: "melt.png", href: "/shop?category=Ice%20Cream" },
] as const;

const milestones = [
  ["Where it all began", "A simple idea rooted in coconut goodness.", "grown-by-people.png"],
  ["Growing with purpose", "Building better for people and planet.", "where-it-begins.png"],
  ["Bringing goodness home", "Real products for everyday life.", "origin-to-everyday-living.png"],
  ["Expanding our impact", "More possibilities, with the same promise.", "built-by-people.png"],
] as const;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className={styles.eyebrow}>{children}</p>;
}

function SceneTransition() {
  return <span className={styles.sceneTransition} aria-hidden="true" />;
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const reducedMotion = useReducedMotion();
  return <motion.div className={className} initial={reducedMotion ? false : { opacity: 0, y: 28 }} whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.82, ease }}>{children}</motion.div>;
}

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -48]);
  return (
    <section ref={ref} className={`${styles.scene} ${styles.hero}`} aria-labelledby="about-title">
      <motion.div className={styles.heroImage} style={reducedMotion ? undefined : { y: imageY }}><Image src={`${assetRoot}/traceable-origin.png`} alt="A mature coconut in warm light at its place of origin" fill priority sizes="100vw" className={styles.cover} /></motion.div>
      <div className={styles.heroAtmosphere} aria-hidden="true" />
      <motion.div className={styles.heroCopy} style={reducedMotion ? undefined : { y: copyY }}>
        <Eyebrow>Our story</Eyebrow>
        <h1 id="about-title">More than a brand.<br /><em>A way of living.</em></h1>
        <p>We exist to bring the goodness of coconut into everyday life — honestly, consciously and beautifully.</p>
        <a href="#coconut-story" className={styles.textLink}>Discover our story <ArrowRight size={16} /></a>
      </motion.div>
      <div className={styles.seal} aria-label="Rooted in nature. Made for living."><svg viewBox="0 0 150 150" aria-hidden="true"><defs><path id="about-seal-path-cinematic" d="M75,75 m-57,0 a57,57 0 1,1 114,0 a57,57 0 1,1 -114,0" /></defs><text><textPath href="#about-seal-path-cinematic">ROOTED IN NATURE · MADE FOR LIVING · </textPath></text></svg><Leaf /></div>
      <a href="#coconut-story" className={styles.scrollCue}><ArrowDown size={15} /> Scroll to explore</a>
      <SceneTransition />
    </section>
  );
}

function Anatomy() {
  const parts = [
    ["Water", "Naturally hydrating and replenishing.", "water", Droplets],
    ["Flesh", "Nourishing, versatile and naturally delicious.", "flesh", Sparkles],
    ["Milk", "Creamy and rich, derived from fresh flesh.", "milk", Droplets],
    ["Oil", "Pure and multi-purpose, pressed with care.", "oil", Droplets],
    ["Husk + shell", "Naturally protective, renewable and useful.", "husk", Shell],
  ] as const;
  return (
    <section id="coconut-story" className={`${styles.scene} ${styles.anatomy}`} aria-labelledby="anatomy-title">
      <div className={styles.anatomyBackground}><Image src={`${assetRoot}/backgrounds/1.png`} alt="" fill sizes="100vw" className={styles.cover} /></div>
      <Reveal className={styles.centerHeading}><Eyebrow>Every part. Every purpose.</Eyebrow><h2 id="anatomy-title">From one coconut,<br /><em>a world of goodness.</em></h2><p>We honour every part of the coconut. Nothing wasted. Everything considered.</p></Reveal>
      <div className={styles.anatomyStage}>
        <div className={styles.splitCoconut}><Image src="/assets/about/about-scraped-coconut-split.png" alt="A split coconut showing its shell and flesh" fill sizes="(min-width: 900px) 52vw, 88vw" className={styles.contain} /></div>
        {parts.map(([title, copy, position, Icon]) => <article key={title} className={`${styles.anatomyLabel} ${styles[`part_${position}`]}`}><span><Icon size={20} /></span><div><h3>{title}</h3><p>{copy}</p></div><i aria-hidden="true" /></article>)}
      </div>
      <SceneTransition />
    </section>
  );
}

function Puzzle() {
  return (
    <section className={`${styles.scene} ${styles.puzzle}`} aria-labelledby="puzzle-heading">
      <div className={styles.puzzleBackground}><Image src={`${assetRoot}/backgrounds/5.png`} alt="" fill sizes="100vw" className={styles.cover} /></div>
      <Reveal className={styles.centerHeading}><Eyebrow>Piece by piece</Eyebrow><h2 id="puzzle-heading">The bigger picture.</h2><p>Move the pieces and discover how every part becomes something bigger.</p></Reveal>
      <BrandSlidingPuzzle imageSrc={`${assetRoot}/where-it-begins.png`} imageAlt="A coconut-growing landscape in Pollachi" initialShuffleMoves={48} className={styles.puzzleGame} />
      <p className={styles.connects}><Sprout size={17} /> Everything connects.</p>
      <SceneTransition />
    </section>
  );
}

function OriginStory() {
  return (
    <section id="journey" className={`${styles.scene} ${styles.origin}`} aria-labelledby="origin-title">
      <div className={styles.originIntro}><Eyebrow>Our origin</Eyebrow><h2 id="origin-title">Before .CO,<br /><em>there is the coconut.</em></h2></div>
      <div className={styles.originRows}>
        {originSteps.map((step, index) => <Reveal key={step.title} className={styles.originRow}><div className={styles.originText}><span>0{index + 1}</span><h3>{step.title}</h3><p>{step.copy}</p></div><div className={styles.originImage}><Image src={`${assetRoot}/${step.image}`} alt={step.alt} fill sizes="(min-width: 900px) 72vw, 100vw" className={styles.cover} /></div></Reveal>)}
      </div>
      <div className={styles.mapIntro}><Eyebrow>From here to everywhere</Eyebrow><h2>Rooted locally,<br /><em>reaching thoughtfully.</em></h2></div>
      <SceneTransition />
    </section>
  );
}

function MapAndCompany() {
  return (
    <>
      <section className={`${styles.scene} ${styles.map}`} aria-labelledby="map-title">
        <Image src={`${assetRoot}/locally-rooted-built-to-travel.png`} alt="A topographic map of South India with routes from Pollachi" fill sizes="100vw" className={styles.cover} />
        <div className={styles.mapShade} />
        <Reveal className={styles.mapCopy}><Eyebrow>From here to everywhere</Eyebrow><h2 id="map-title">Rooted locally.<br /><em>Built to travel.</em></h2><div className={styles.mapLegend}><span><i /> Current</span><span><i /> Target / future</span></div></Reveal>
        <div className={styles.mapCard}><b>Pollachi</b><span>Coconut growing region</span><small>Tamil Nadu, India</small></div>
        <SceneTransition />
      </section>
      <section className={`${styles.scene} ${styles.company}`} aria-labelledby="company-title">
        <Image src={`${assetRoot}/we-are-co.png`} alt="A coconut grounded in the landscape where .CO began" fill sizes="100vw" className={styles.cover} />
        <div className={styles.companyShade} />
        <Reveal className={styles.companyCopy}><Eyebrow>About the company</Eyebrow><h2 id="company-title">We are .CO</h2><h3>Born in Kerala. Inspired by tradition. Built for what comes next.</h3><p>We work with nature, not against it. From the hands that harvest to the choices we make, every step is grounded in respect, craft, and long-term thinking.</p><p>We exist to bring the goodness of coconut into everyday life — honestly, consciously and beautifully.</p></Reveal>
        <SceneTransition />
      </section>
    </>
  );
}

function Values() {
  const [active, setActive] = useState(1);
  return (
    <section className={`${styles.scene} ${styles.values}`} aria-labelledby="values-title">
      <Image src={`${assetRoot}/backgrounds/3.png`} alt="" fill sizes="100vw" className={styles.cover} />
      <div className={styles.valuesShade} />
      <Reveal className={styles.valuesHeading}><Eyebrow>What guides us</Eyebrow><h2 id="values-title">Values should show up<br />in what <em>you do.</em></h2></Reveal>
      <div className={styles.valueGrid}>{values.map((value, index) => { const Icon = value.icon; return <article key={value.title} tabIndex={0} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} className={active === index ? styles.activeValue : ""}><Image src={`${assetRoot}/${value.image}`} alt="" fill sizes="(min-width: 900px) 25vw, 90vw" className={styles.cover} /><div><Icon size={22} /><h3>{value.title}</h3><p>{value.copy}</p><span><ArrowRight size={15} /></span></div></article>; })}</div>
      <SceneTransition />
    </section>
  );
}

function BrandEcosystem() {
  const [active, setActive] = useState("kitchen");
  return (
    <section className={`${styles.scene} ${styles.brands}`} aria-labelledby="brands-title">
      <Image src={`${assetRoot}/backgrounds/5.png`} alt="" fill sizes="100vw" className={styles.cover} />
      <div className={styles.brandShade} />
      <Reveal className={styles.centerHeading}><Eyebrow>Our brands</Eyebrow><h2 id="brands-title">Different needs. <em>One promise.</em></h2><p>Thoughtfully created for different parts of everyday life.</p></Reveal>
      <div className={styles.sourceCoconut}><Image src={`${assetRoot}/traceable-origin.png`} alt="A coconut at the centre of the .CO brand ecosystem" fill sizes="280px" className={styles.cover} /></div>
      <svg className={styles.brandLines} viewBox="0 0 1200 300" preserveAspectRatio="none" aria-hidden="true"><path d="M600 10 C600 115 132 72 132 292" /><path d="M600 10 C600 120 442 88 442 292" /><path d="M600 10 C600 120 758 88 758 292" /><path d="M600 10 C600 115 1068 72 1068 292" /></svg>
      <div className={styles.orbGrid}>{brands.map((brand) => { const selected = brand.id === active; return <article key={brand.id} className={selected ? styles.activeOrb : ""} onMouseEnter={() => setActive(brand.id)} onFocus={() => setActive(brand.id)}><button type="button" aria-pressed={selected} onClick={() => setActive(brand.id)}><span className={styles.orbImage}><Image src={`${assetRoot}/${brand.image}`} alt={`${brand.name} product range`} fill sizes="(min-width: 900px) 24vw, 82vw" className={styles.cover} /></span><span className={styles.orbGlass} aria-hidden="true" /></button><h3>{brand.name}</h3><p>{brand.copy}</p><Link href={brand.href} aria-label={`Explore ${brand.name}`}><ArrowRight size={17} /></Link></article>; })}</div>
      <SceneTransition />
    </section>
  );
}

function Journey() {
  return (
    <section className={`${styles.scene} ${styles.timeline}`} aria-labelledby="timeline-title">
      <Image src={`${assetRoot}/backgrounds/3.png`} alt="" fill sizes="100vw" className={styles.cover} />
      <div className={styles.timelineShade} />
      <Reveal className={styles.centerHeading}><Eyebrow>Our journey</Eyebrow><h2 id="timeline-title">Small moments. <em>Big meaning.</em></h2><p>Every milestone reminds us where we started — and where we are going.</p></Reveal>
      <div className={styles.timelineStage}><svg viewBox="0 0 1200 260" preserveAspectRatio="none" aria-hidden="true"><path className={styles.timelineGhost} d="M0 144 C140 72 232 205 352 138 S560 75 690 154 S910 205 1200 98" /><motion.path className={styles.timelineCurrent} d="M0 144 C140 72 232 205 352 138 S560 75 690 154 S910 205 1200 98" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true, amount: .4 }} transition={{ duration: 2.4, ease }} /></svg>{milestones.map(([title, copy, image], index) => <article key={title} className={styles[`milestone_${index + 1}`]}><div><Image src={`${assetRoot}/${image}`} alt="" fill sizes="120px" className={styles.cover} /></div><span><b>{title}</b><p>{copy}</p></span></article>)}</div>
      <SceneTransition />
    </section>
  );
}

function FoundersAndClosing() {
  const notes = [
    ["What we grew up with.", "Coconuts were part of everyday life — simple, natural, and deeply nourishing."],
    ["What we saw differently.", "We saw how much was wasted, and how much more good could be shared."],
    ["What we are building.", "Thoughtfully crafted products that honour the coconut and the communities behind it."],
  ] as const;
  return (
    <>
      <section className={`${styles.scene} ${styles.founders}`} aria-labelledby="founders-title">
        <div className={styles.foundersImage}><Image src="/assets/founders/refined/fazil-afsala-founder-hero.png" alt=".CO co-founders Fazil and Afsala" fill sizes="100vw" className={styles.cover} /></div><div className={styles.foundersShade} />
        <Reveal className={styles.foundersCopy}><Eyebrow>From the founders</Eyebrow><h2 id="founders-title">Made for living.<br /><em>Made with love.</em></h2><div className={styles.founderNotes}>{notes.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div><blockquote>“We believe the best things in life should be simple, honest, and good for the world around us.”</blockquote></Reveal>
        <SceneTransition />
      </section>
      <section className={`${styles.scene} ${styles.closing}`} aria-labelledby="closing-title"><Image src={`${assetRoot}/backgrounds/2.png`} alt="" fill sizes="100vw" className={styles.cover} /><div className={styles.closingCoconut}><Image src={`${assetRoot}/traceable-origin.png`} alt="A whole coconut grounded in warm light" fill sizes="(min-width: 900px) 52vw, 100vw" className={styles.cover} /></div><Reveal className={styles.closingCopy}><h2 id="closing-title">One coconut.<br />More possibilities<br />than we imagined.</h2><p>And we’re only getting started.</p><Link href="/shop">Explore our products <ArrowRight size={15} /></Link><Link href="/sustainability">See our sustainability story <ArrowRight size={15} /></Link></Reveal><SceneTransition /></section>
    </>
  );
}

function Newsletter() {
  const reducedMotion = useReducedMotion();
  const [failed, setFailed] = useState(false);
  return (
    <section className={`${styles.scene} ${styles.newsletter}`} aria-labelledby="about-newsletter-title">
      {!reducedMotion && !failed ? <video autoPlay muted loop playsInline preload="metadata" onError={() => setFailed(true)} aria-hidden="true"><source src={mediaUrl("/assets/video/homepage-v2/co-home-farm-1080p-v1.mp4")} type="video/mp4" /></video> : null}
      <div className={styles.newsletterShade} />
      <Reveal className={styles.newsletterCopy}><Eyebrow>Stay in the loop</Eyebrow><h2 id="about-newsletter-title">Be part of our journey.</h2><p>New products. Real stories. Honest updates.</p></Reveal>
      <NewsletterForm compact className={styles.newsletterForm} />
      <SceneTransition />
    </section>
  );
}

export function CinematicAboutPage() {
  return (
    <div className={styles.page}>
      <ReferenceHeader />
      <main><Hero /><Anatomy /><Puzzle /><OriginStory /><MapAndCompany /><Values /><BrandEcosystem /><Journey /><FoundersAndClosing /><Newsletter /></main>
      <ReferenceFooter />
      <MobileBottomNav />
    </div>
  );
}
