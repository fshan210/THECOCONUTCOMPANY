"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, Droplets, Leaf, Shell, Sparkles, Sprout, TreePalm } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { JourneyScrollStory } from "@/components/about/JourneyScrollStory";
import { NewsletterSection, ReferenceFooter, ReferenceHeader } from "@/components/home/ReferenceHomePage";
import { BrandSlidingPuzzle } from "@/components/interactive/BrandSlidingPuzzle";
import { ResponsiveImage as Image } from "@/components/media/ResponsiveImage";
import { transparentProductAssets } from "@/lib/website-assets";

const ease = [0.22, 0.8, 0.22, 1] as const;
const blurDataURL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovLzIwMDAvc3ZnJyB3aWR0aD0nNDAnIGhlaWdodD0nMzAnPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbGw9JyMyYjBkMDYnLz48L3N2Zz4=";

const coconutParts = [
  { title: "Water", copy: "Naturally hydrating and refreshing.", icon: Droplets, className: "about-part--water" },
  { title: "Flesh", copy: "Wholesome, rich and nourishing.", icon: Sparkles, className: "about-part--flesh" },
  { title: "Oil", copy: "Pure, versatile and essential.", icon: Droplets, className: "about-part--oil" },
  { title: "Shell", copy: "Strong, useful and enduring.", icon: Shell, className: "about-part--shell" },
  { title: "Husk", copy: "Natural fibre returned to earth.", icon: Leaf, className: "about-part--husk" },
] as const;

const brands = [
  { id: "water", name: ".CO Water", tagline: "Pure hydration. Straight from nature.", href: "/shop?category=Coconut%20Water", products: [transparentProductAssets.water.src], tone: "water" },
  { id: "kitchen", name: ".CO Kitchen", tagline: "Wholesome ingredients for better cooking.", href: "/shop?category=Food", products: [transparentProductAssets["kitchen-oil"].src, transparentProductAssets["kitchen-flour"].src, transparentProductAssets["kitchen-milk"].src], tone: "kitchen" },
  { id: "botanica", name: "BOTANiCA", tagline: "Plant-powered care for real people.", href: "/shop?category=Cosmetics", products: [transparentProductAssets["botanica-face-wash"].src, transparentProductAssets["botanica-shampoo"].src], tone: "botanica" },
  { id: "melt", name: "MELT", tagline: "Natural indulgence, made to melt hearts.", href: "/shop?category=Ice%20Cream", products: [transparentProductAssets.melt.src], tone: "melt" },
] as const;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="about-eyebrow">{children}</p>;
}

function AboutHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const coconutY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const coconutScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section ref={ref} className="about-hero" aria-labelledby="about-title">
      <div className="about-hero__light" aria-hidden="true" />
      <motion.div className="about-hero__copy" style={{ y: copyY, opacity: copyOpacity }}>
        <Eyebrow>Our story</Eyebrow>
        <h1 id="about-title">More than<br />a brand.<br /><em>A way of living.</em></h1>
        <p>We exist to bring the goodness of coconut to everyday life—honestly, consciously and beautifully.</p>
        <Link className="about-button" href="#coconut-story">Our story <ArrowRight size={14} /></Link>
      </motion.div>
      <motion.div className="about-hero__coconut" style={{ y: coconutY, scale: coconutScale }}>
        <Image src="/assets/about/floating-coconut-water-splash.png" alt="An opened mature coconut surrounded by a dynamic splash of coconut water" fill priority sizes="(min-width: 900px) 64vw, 96vw" className="object-contain" />
      </motion.div>
      <div className="about-seal" aria-label="Rooted in nature. Made for living.">
        <svg viewBox="0 0 120 120" aria-hidden="true"><defs><path id="about-seal-path" d="M60,60 m-43,0 a43,43 0 1,1 86,0 a43,43 0 1,1 -86,0" /></defs><text><textPath href="#about-seal-path">ROOTED IN NATURE · MADE FOR LIVING · </textPath></text></svg>
        <TreePalm aria-hidden="true" />
      </div>
      <a href="#coconut-story" className="about-scroll-cue"><ArrowDown size={15} /> Scroll to explore</a>
    </section>
  );
}

function CoconutStory() {
  return (
    <section id="coconut-story" className="about-coconut-story" aria-labelledby="coconut-title">
      <div className="about-coconut-story__heading">
        <Eyebrow>Every part. Every purpose.</Eyebrow>
        <h2 id="coconut-title">From one coconut,<br /><em>a world of goodness.</em></h2>
        <p>We honour every part of the coconut. Nothing wasted. Everything crafted with care.</p>
      </div>
      <div className="about-anatomy">
        <div className="about-anatomy__visual"><Image src="/assets/about/floating-coconut-water-splash.png" alt="Opened mature coconut showing shell, flesh and coconut water" fill sizes="(min-width: 900px) 50vw, 90vw" className="object-contain" /></div>
        {coconutParts.map((part, index) => { const Icon = part.icon; return <motion.article key={part.title} className={`about-part ${part.className}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .45 }} transition={{ duration: .65, delay: index * .07, ease }}><Icon /><h3>{part.title}</h3><p>{part.copy}</p></motion.article>; })}
      </div>
    </section>
  );
}

function PuzzleEnvironment() {
  return (
    <section className="about-puzzle-environment" aria-labelledby="puzzle-context-title">
      <div className="about-puzzle-environment__leaf" aria-hidden="true" />
      <div className="about-puzzle-context">
        <div><Eyebrow>Piece by piece</Eyebrow><h2 id="puzzle-context-title">The bigger<br />picture.</h2><p>Move the pieces and see how individual choices become a complete ecosystem.</p></div>
        <aside><Sprout /><span>From village to you.</span><small>Real people. Honest processes. A whole coconut story.</small></aside>
      </div>
      <BrandSlidingPuzzle initialShuffleMoves={64} />
    </section>
  );
}

function CompanyStory() {
  const metrics = [["Kerala", "Operating base"], ["450", "Contract-farm trees"], ["10K", "Phase 1 UHT MOQ"], ["0", "Preservatives in brief"]];
  return (
    <section className="about-company" aria-labelledby="company-title">
      <div className="about-company__copy"><Eyebrow>About the company</Eyebrow><h2 id="company-title">We are .CO</h2><h3>Born in Kerala.<br />Inspired by tradition.<br />Built for the future.</h3><p>.CO The Coconut Company is building a modern coconut ecosystem around disciplined sourcing, considered products and a fuller use of every coconut.</p><Link href="/founders" className="about-button">Our journey <ArrowRight size={14} /></Link></div>
      <div className="about-company__image"><Image src="/assets/backgrounds/kerala-groves/co-kerala-grove-editorial-4k.avif" alt="Coconut groves in Kerala in warm late-afternoon light" fill sizes="(min-width: 900px) 58vw, 94vw" placeholder="blur" blurDataURL={blurDataURL} className="object-cover" /><div className="about-company__image-wash" /></div>
      <div className="about-company__metrics">{metrics.map(([value, label]) => <div key={label}><b>{value}</b><span>{label}</span></div>)}</div>
      <blockquote>Rooted in nature.<br /><em>Built around the whole coconut.</em></blockquote>
    </section>
  );
}

function BrandWorlds() {
  const [active, setActive] = useState("water");
  return (
    <section className="about-brands" aria-labelledby="brands-title">
      <div className="about-interrupt" aria-hidden="true"><span>ONE COCONUT.</span><em>MANY WAYS TO LIVE.</em></div>
      <div className="about-brands__heading"><Eyebrow>Our brands</Eyebrow><h2 id="brands-title">Different needs.<br /><em>One promise.</em></h2><p>Thoughtfully made for every part of your life.</p></div>
      <div className="about-brand-grid">
        {brands.map((brand) => { const selected = active === brand.id; return (
          <article key={brand.id} className={`about-brand about-brand--${brand.tone} ${selected ? "is-active" : ""}`} onMouseEnter={() => setActive(brand.id)} onFocus={() => setActive(brand.id)}>
            <button type="button" aria-pressed={selected} onClick={() => setActive(brand.id)} className="about-brand__activate"><span className="about-brand__wordmark">{brand.name}</span><span>{brand.tagline}</span></button>
            <div className="about-brand__products" aria-hidden={!selected}>{brand.products.map((src, index) => <motion.div key={src} animate={{ opacity: selected ? 1 : 0, y: selected ? 0 : 12, scale: selected ? 1 : .96 }} transition={{ duration: .52, delay: index * .06, ease }}><Image src={src} alt="" fill sizes="220px" className="object-contain" /></motion.div>)}</div>
            <Link href={brand.href} className="about-brand__link">Explore <ArrowRight size={13} /></Link>
          </article>
        ); })}
      </div>
    </section>
  );
}

function FoundersNote() {
  return (
    <section className="about-founders" aria-labelledby="founders-title">
      <div className="about-founders__copy"><Eyebrow>From the founders</Eyebrow><h2 id="founders-title">Made for living.<br /><em>Made with love.</em></h2><p>We are not building a brand for a season. We are building a way of living we believe in.</p><Link className="about-button" href="/founders">Our notes <ArrowRight size={14} /></Link></div>
      <div className="about-founders__image"><Image src="/assets/founders/refined/fazil-afsala-founder-hero.png" alt=".CO co-founders Fazil and Afsala" fill sizes="(min-width: 900px) 52vw, 96vw" className="object-contain object-bottom" /></div>
      <blockquote>“We grew up seeing the coconut in everything. Today, we are building a company that honours it.”<cite>— Fazil &amp; Afsala, co-founders</cite></blockquote>
    </section>
  );
}

export function ReferenceAboutPage() {
  return (
    <div className="co-about-page about-cinematic min-h-screen overflow-x-clip font-['Inter']">
      <ReferenceHeader />
      <main><AboutHero /><CoconutStory /><PuzzleEnvironment /><CompanyStory /><BrandWorlds /><JourneyScrollStory /><FoundersNote /><section className="about-newsletter" aria-label="Join the journey"><NewsletterSection /></section></main>
      <ReferenceFooter />
    </div>
  );
}
