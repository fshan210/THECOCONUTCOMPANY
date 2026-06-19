"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Bell, Droplets, Handshake, Leaf, ShieldCheck, Sparkles, Sprout, Waves } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { CoconutSliceDoodle, PalmLeafDoodle, TenderCoconutDoodle } from "@/components/BrandDoodles";
import { Appear } from "@/components/motion/Appear";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeader } from "@/components/SectionHeader";
import { recipes, shopProducts, socialStories } from "@/lib/catalog";
import { products } from "@/lib/content";
import { useCoconutMotionMode } from "@/lib/animations/coconut-motion";

const trustItems = [
  { label: "Kerala-origin sourcing", icon: Sprout },
  { label: "Naturally hydrating", icon: Droplets },
  { label: "Clean ingredient mindset", icon: ShieldCheck },
  { label: "Full coconut ecosystem", icon: Leaf }
];

const ecosystem = [
  {
    label: "Kitchen",
    title: ".CO Kitchen",
    body: "Pantry-ready coconut formats for cooking, finishing, cafes, and daily home rituals.",
    image: "/assets/generated/product-kitchen-oil.webp"
  },
  {
    label: "Botanica",
    title: ".CO Botanica",
    body: "Body, hair, and care directions shaped by restrained coconut-origin formulations.",
    image: "/assets/transparent/coconut-care.webp"
  },
  {
    label: "Wellness",
    title: ".CO Wellness",
    body: "Hydration rituals and future wellness formats with simple, accountable claims.",
    image: "/assets/transparent/co-water-tetra-pack.webp"
  },
  {
    label: "Lifestyle",
    title: ".CO Lifestyle",
    body: "Gifting, hospitality, and brand-world objects for everyday coconut living.",
    image: "/assets/transparent/co-social-media-pack.webp"
  }
];

function ParallaxImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { shouldReduce, isMobile } = useCoconutMotionMode();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], shouldReduce || isMobile ? [0, 0] : [22, -22]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 44vw, 92vw" className="object-contain p-6 drop-shadow-[0_30px_54px_rgba(62,46,31,0.16)]" />
    </motion.div>
  );
}

export function TrustStrip() {
  return (
    <section className="border-b border-coconut/10 bg-paper px-5 py-6 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-px border border-coconut/10 bg-coconut/10 sm:grid-cols-2 lg:grid-cols-4">
        {trustItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Appear key={item.label} delay={index * 0.04}>
              <div className="flex min-h-20 items-center gap-4 bg-paper px-5 py-4">
                <Icon size={18} className="text-grove" />
                <p className="text-[0.72rem] font-medium uppercase tracking-editorial text-coconut/70">{item.label}</p>
              </div>
            </Appear>
          );
        })}
      </div>
    </section>
  );
}

export function ProductHighlight() {
  const water = shopProducts[0];

  return (
    <section className="relative overflow-hidden bg-paper px-5 py-20 md:px-8 md:py-28">
      <PalmLeafDoodle className="co-brand-doodle absolute right-6 top-12 hidden w-44 text-grove md:block" />
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <Appear className="relative min-h-[460px] border border-coconut/10 bg-[#fff8ea] md:min-h-[620px]">
          <div className="absolute left-8 top-8 h-px w-32 bg-coconut/14" />
          <div className="absolute bottom-8 right-8 h-px w-40 bg-coconut/14" />
          <ParallaxImage src={water.image} alt={`${water.name} bottle`} className="absolute inset-0" />
          <div className="co-wave-pattern absolute inset-y-0 right-0 w-52 opacity-[0.08]" />
        </Appear>
        <Appear delay={0.08}>
          <p className="mb-5 text-[0.72rem] font-medium uppercase tracking-editorial text-grove">Product highlight</p>
          <h2 className="font-display text-5xl font-light leading-tight text-coconut md:text-7xl">{water.name}</h2>
          <p className="mt-7 max-w-xl text-lg leading-9 text-coconut/70">{water.shortDescription}</p>
          <div className="mt-9 grid gap-px border border-coconut/10 bg-coconut/10 sm:grid-cols-3">
            {water.benefits.map((benefit) => (
              <span key={benefit} className="bg-paper px-4 py-4 text-sm leading-6 text-coconut/72">{benefit}</span>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/shop/co-water" className="inline-flex min-h-12 items-center gap-3 bg-coconut px-6 py-4 text-sm font-medium text-paper transition hover:bg-grove">
              Notify Me <Bell size={16} />
            </Link>
            <Link href="/shop" className="inline-flex min-h-12 items-center gap-3 border border-coconut/14 px-6 py-4 text-sm font-medium text-coconut transition hover:border-grove hover:text-grove">
              View catalogue <ArrowUpRight size={16} />
            </Link>
          </div>
        </Appear>
      </div>
    </section>
  );
}

export function ProductEcosystem() {
  return (
    <section className="relative overflow-hidden border-y border-coconut/10 bg-[#fff8ea] px-5 py-20 md:px-8 md:py-28">
      <CoconutSliceDoodle className="co-brand-doodle absolute left-5 top-12 hidden w-36 text-coconut md:block" />
      <SectionHeader
        kicker="Product ecosystem"
        title="A coconut house, edited into four modern worlds."
        body="Kitchen, Botanica, Wellness, and Lifestyle give .CO room to grow while keeping one clear origin story."
      />
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">
        {ecosystem.map((item, index) => (
          <Appear key={item.title} delay={index * 0.06}>
            <article className="group relative h-full overflow-hidden border border-coconut/10 bg-paper p-4 shadow-[0_18px_48px_rgba(62,46,31,0.06)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_24px_64px_rgba(62,46,31,0.1)]">
              <div className="relative mb-7 aspect-[4/5] overflow-hidden border border-coconut/8 bg-[#fffaf0]">
                <Image src={item.image} alt={item.title} fill sizes="(min-width: 1024px) 23vw, (min-width: 768px) 46vw, 92vw" className="object-contain p-5 transition duration-700 group-hover:scale-[1.03]" />
              </div>
              <p className="mb-3 text-[0.65rem] font-medium uppercase tracking-editorial text-grove">{item.label}</p>
              <h3 className="font-display text-3xl font-light leading-tight text-coconut">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-coconut/68">{item.body}</p>
            </article>
          </Appear>
        ))}
      </div>
    </section>
  );
}

export function MeltCoHighlight() {
  const product = shopProducts[1];

  return (
    <section className="relative overflow-hidden bg-paper px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
        <Appear>
          <p className="mb-5 text-[0.72rem] font-medium uppercase tracking-editorial text-grove">Frozen dessert highlight</p>
          <h2 className="font-display text-5xl font-light leading-tight text-coconut md:text-7xl">MELT.CO brings coconut into dessert.</h2>
          <p className="mt-7 max-w-xl text-lg leading-9 text-coconut/70">{product.shortDescription}</p>
          <Link href="/shop/melt-co-mango-coconut" className="mt-9 inline-flex min-h-12 items-center gap-3 border border-coconut/14 px-6 py-4 text-sm font-medium text-coconut transition hover:border-grove hover:text-grove">
            Preview MELT.CO <ArrowUpRight size={16} />
          </Link>
        </Appear>
        <Appear delay={0.08} className="relative min-h-[440px] border border-coconut/10 bg-[#fff8ea] md:min-h-[560px]">
          <ParallaxImage src="/assets/generated/composition-icecream.webp" alt="MELT.CO coconut frozen dessert composition" className="absolute inset-0" />
        </Appear>
      </div>
    </section>
  );
}

export function HonestProductSection() {
  const cards = [
    ["No artificial noise", "Short ingredient thinking and restrained claims across every launch expression."],
    ["Origin-led sourcing", "Palakkad relationships, village aggregation, and traceable process direction."],
    ["Everyday formats", "Products built for homes, cafes, retail, hospitality, travel, and warm-weather rituals."]
  ];

  return (
    <section className="relative overflow-hidden border-y border-coconut/10 bg-coconut px-5 py-20 text-paper md:px-8 md:py-28">
      <div className="co-wave-pattern absolute inset-y-0 right-0 w-[34vw] opacity-[0.08]" />
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <Appear>
          <p className="mb-5 text-[0.72rem] font-medium uppercase tracking-editorial text-paper/64">Honest product</p>
          <h2 className="font-display text-5xl font-light leading-tight text-paper md:text-7xl">Premium does not need to shout.</h2>
          <p className="mt-7 max-w-xl text-base leading-8 text-paper/70 md:text-lg md:leading-9">
            .CO keeps the product language clear: coconut first, clean usage, visible sourcing, and no exaggerated wellness theater.
          </p>
        </Appear>
        <div className="grid gap-px border border-paper/12 bg-paper/12">
          {cards.map(([title, body], index) => (
            <Appear key={title} delay={index * 0.06}>
              <article className="grid gap-4 bg-coconut px-6 py-7 md:grid-cols-[0.45fr_1fr] md:px-8">
                <h3 className="font-display text-3xl font-light leading-tight text-paper">{title}</h3>
                <p className="text-sm leading-7 text-paper/68">{body}</p>
              </article>
            </Appear>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BrandManifestoBanner() {
  return (
    <section className="relative overflow-hidden bg-paper px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl border-y border-coconut/12 py-8">
        <Appear className="relative overflow-hidden border border-coconut/10 bg-[#fff8ea]">
          <PalmLeafDoodle className="co-brand-doodle absolute -bottom-8 left-7 z-10 hidden w-44 text-grove md:block" />
          <div className="co-wave-pattern pointer-events-none absolute inset-y-0 right-0 z-10 w-64 opacity-[0.07]" />
          <div className="relative aspect-[1983/793]">
            <Image
              src="/assets/coconut/made-for-living-banner.jpg"
              alt="Made for Living .CO brand manifesto"
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        </Appear>
      </div>
    </section>
  );
}

export function RecipesPreview() {
  return (
    <section className="relative overflow-hidden bg-paper px-5 py-20 md:px-8 md:py-28">
      <TenderCoconutDoodle className="co-brand-doodle absolute right-6 top-8 hidden w-28 text-grove md:block" />
      <SectionHeader kicker="Recipes" title="Everyday coconut rituals." body="Simple drinks, desserts, and kitchen ideas designed for the .CO ecosystem." />
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
        {recipes.slice(0, 3).map((recipe, index) => (
          <Appear key={recipe.slug} delay={index * 0.06}>
            <article className="group h-full border border-coconut/10 bg-[#fff8ea] p-4 transition duration-500 hover:-translate-y-1">
              <div className="relative mb-6 aspect-[4/3] overflow-hidden bg-paper">
                <Image src={recipe.image} alt={recipe.title} fill sizes="(min-width: 768px) 33vw, 92vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" />
              </div>
              <p className="mb-3 text-[0.65rem] font-medium uppercase tracking-editorial text-grove">{recipe.time} / {recipe.difficulty}</p>
              <h3 className="font-display text-3xl font-light text-coconut">{recipe.title}</h3>
              <p className="mt-4 text-sm leading-7 text-coconut/68">{recipe.description}</p>
            </article>
          </Appear>
        ))}
      </div>
    </section>
  );
}

export function FounderJourneyPreview() {
  return (
    <section className="relative overflow-hidden border-y border-coconut/10 bg-[#fff8ea] px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Appear>
          <p className="mb-5 text-[0.72rem] font-medium uppercase tracking-editorial text-grove">Founder journey</p>
          <h2 className="font-display text-5xl font-light leading-tight text-coconut md:text-7xl">Building .CO from Palakkad to the world.</h2>
          <p className="mt-7 max-w-xl text-lg leading-9 text-coconut/70">
            Founder-led, origin-aware, and designed for modern retail without losing the warmth of coconut country.
          </p>
        </Appear>
        <div className="grid gap-4 sm:grid-cols-2">
          {socialStories.slice(0, 4).map((story, index) => (
            <Appear key={story} delay={index * 0.05}>
              <article className="min-h-36 border border-coconut/10 bg-paper p-6">
                <Sparkles className="mb-8 text-sun" size={18} />
                <h3 className="font-display text-3xl font-light leading-tight text-coconut">{story}</h3>
              </article>
            </Appear>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SustainabilityPreview() {
  return (
    <section className="relative overflow-hidden bg-paper px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <Appear className="relative min-h-[420px] overflow-hidden border border-coconut/10 bg-[#fff8ea] md:min-h-[540px]">
          <Image src="/assets/farms/coconut-harvesting.jpg" alt="Coconut harvesting for .CO sourcing" fill sizes="(min-width: 1024px) 52vw, 92vw" className="object-cover" />
        </Appear>
        <Appear delay={0.08}>
          <p className="mb-5 text-[0.72rem] font-medium uppercase tracking-editorial text-grove">Sustainability</p>
          <h2 className="font-display text-5xl font-light leading-tight text-coconut md:text-7xl">Village-first growth, practical by design.</h2>
          <p className="mt-7 max-w-xl text-lg leading-9 text-coconut/70">
            The sourcing system is built around farms, village aggregation, responsible processing, and whole-coconut value.
          </p>
          <Link href="/sustainability" className="mt-9 inline-flex min-h-12 items-center gap-3 border border-coconut/14 px-6 py-4 text-sm font-medium text-coconut transition hover:border-grove hover:text-grove">
            Read the sourcing story <ArrowUpRight size={16} />
          </Link>
        </Appear>
      </div>
    </section>
  );
}

export function DistributorPartnershipCta() {
  return (
    <section className="bg-paper px-5 pb-24 pt-6 md:px-8 md:pb-32">
      <Appear className="relative mx-auto grid max-w-7xl gap-8 overflow-hidden border border-coconut/10 bg-coconut p-7 text-paper md:grid-cols-[1fr_0.72fr] md:p-12">
        <div className="co-wave-pattern pointer-events-none absolute inset-y-0 right-0 w-72 opacity-[0.08]" />
        <div className="relative">
          <p className="mb-5 text-[0.72rem] font-medium uppercase tracking-editorial text-paper/64">Distribution / early access</p>
          <h2 className="font-display text-5xl font-light leading-tight md:text-7xl">Bring .CO into retail, hospitality, and new markets.</h2>
        </div>
        <div className="relative self-end">
          <p className="mb-8 text-base leading-8 text-paper/72">Distributor, hospitality, and GCC conversations are open before the full rollout.</p>
          <Link href="/shop" className="inline-flex min-h-12 items-center gap-3 bg-paper px-6 py-4 text-sm font-medium text-coconut transition hover:bg-sun">
            Start a conversation <Handshake size={16} />
          </Link>
        </div>
      </Appear>
    </section>
  );
}

export function ProductHouseList() {
  return (
    <section className="relative overflow-hidden bg-paper px-5 py-20 md:px-8 md:py-28">
      <SectionHeader
        kicker="House universe"
        title="Coconut, edited into modern rituals."
        body="A focused portfolio with no clutter: fresh, reserve, creamery, botanica, and kitchen systems designed to scale without losing origin."
      />
      <div className="mx-auto grid max-w-7xl gap-5">
        {products.map((product, index) => (
          <Appear key={product.name} delay={index * 0.05}>
            <ProductCard {...product} />
          </Appear>
        ))}
      </div>
    </section>
  );
}
