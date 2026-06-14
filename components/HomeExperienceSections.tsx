"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Bell, Handshake, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/MagneticButton";
import { Reveal } from "@/components/Motion";
import { SectionHeader } from "@/components/SectionHeader";
import { CoconutSliceDoodle, PalmLeafDoodle, TenderCoconutDoodle } from "@/components/BrandDoodles";
import { communityNotes, recipes, shopProducts, socialStories, usageDirections } from "@/lib/catalog";
import { CoconutMotion, useCoconutMotionMode } from "@/lib/animations/coconut-motion";

export function MadeForLivingVisual() {
  const { shouldReduce } = useCoconutMotionMode();

  return (
    <section className="bg-porcelain px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          {...CoconutMotion.NatureFade}
          className="co-wave-edge relative overflow-hidden border border-shell bg-[#fbf4e8] shadow-soft"
        >
          <PalmLeafDoodle className="co-brand-doodle absolute -bottom-7 left-7 z-10 hidden w-40 rotate-[-8deg] md:block" />
          <motion.div
            animate={shouldReduce ? undefined : { y: [0, -5, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            className="relative aspect-[1983/793]"
          >
            <Image
              src="/optimized/assets-coconut-made-for-living-reference.webp"
              alt="Made for Living brand statement with soft palm shadow and .CO coconut mark"
              fill
              sizes="100vw"
              className="object-contain"
              priority={false}
            />
          </motion.div>
        </motion.div>
        <Reveal className="mx-auto mt-8 max-w-3xl text-center">
          <p className="mb-4 text-[0.72rem] uppercase tracking-editorial text-grove">Brand statement</p>
          <p className="text-lg leading-9 text-muted">
            A coconut-origin lifestyle brand built for everyday rituals, modern wellness, and global living.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function HonestTruthSection() {
  const cards = [
    {
      title: "Cold processed where possible",
      badge: "Where possible",
      body: "Heat can change natural character. Our process direction is designed to preserve freshness, taste and integrity."
    },
    {
      title: "No artificial shortcuts",
      badge: "Zero",
      body: "No unnecessary fillers, no artificial preservatives, no overcomplicated ingredient lists."
    },
    {
      title: "Direct sourcing mindset",
      badge: "Always",
      body: "We work toward closer relationships with coconut farmers and traceable origin systems."
    },
    {
      title: "Plant-first by nature",
      badge: "Future",
      body: "From beverages to skincare, our ecosystem is built around one of nature's most versatile resources."
    }
  ];

  return (
    <section className="relative overflow-hidden bg-[#17260f] px-5 py-24 text-paper md:px-8 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_26%,rgba(247,243,236,0.08),transparent_32%),linear-gradient(90deg,rgba(255,253,248,0.03),transparent_45%)]" />
      <div className="co-wave-pattern pointer-events-none absolute inset-y-0 right-0 w-[28vw] min-w-52 opacity-[0.08]" />
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <Reveal className="relative">
          <p className="mb-7 text-[0.72rem] uppercase tracking-editorial text-paper/58">The honest truth</p>
          <h2 className="max-w-2xl font-display text-5xl leading-[0.98] text-paper md:text-7xl">
            Most coconut products aren&apos;t what they say they are.
          </h2>
          <p className="mt-8 max-w-2xl text-base leading-8 text-paper/62 md:text-lg md:leading-9">
            We are building .CO differently, with traceable sourcing, clean processing, honest ingredients and products designed around every meaningful part
            of the coconut.
          </p>
          <Link
            href="/shop"
            className="mt-10 inline-flex items-center justify-center bg-clay px-7 py-4 text-sm text-paper transition hover:bg-paper hover:text-ink"
          >
            Explore catalogue
          </Link>
        </Reveal>
        <div className="relative grid gap-4">
          {cards.map((card, index) => (
            <motion.article
              key={card.title}
              {...CoconutMotion.ProductLift}
              className="group relative overflow-hidden border border-paper/10 bg-[#101f0b]/78 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_24px_70px_rgba(0,0,0,0.12)] backdrop-blur md:p-8"
            >
              {index === 2 ? <div className="absolute inset-y-0 left-[42%] w-28 bg-clay/10 blur-2xl" /> : null}
              <div className="relative flex items-start justify-between gap-6">
                <div>
                  <h3 className="font-sans text-2xl leading-tight text-paper md:text-3xl">{card.title}</h3>
                  <p className="mt-4 max-w-2xl text-base leading-8 text-paper/58 md:text-lg">{card.body}</p>
                </div>
                <span className="shrink-0 rounded-full border border-paper/10 bg-paper/[0.06] px-4 py-2 text-xs text-paper/50">{card.badge}</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductHighlight() {
  const water = shopProducts[0];

  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-5 py-24 md:grid-cols-[1.05fr_0.95fr] md:items-center md:px-8">
      <Reveal className="relative aspect-[4/5] overflow-hidden bg-shell md:aspect-[5/4]">
        <Image src={water.image} alt={`${water.name} product highlight`} fill sizes="(min-width: 768px) 52vw, 100vw" className="object-cover" />
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mb-5 text-[0.72rem] uppercase tracking-editorial text-grove">First release</p>
        <h2 className="font-display text-5xl leading-tight text-ink md:text-7xl">{water.name}</h2>
        <p className="mt-6 text-lg leading-9 text-muted">{water.shortDescription}</p>
        <div className="mt-8 grid gap-3 text-sm text-muted">
          <p>{water.category}</p>
          <p>{water.format}</p>
          <p>{water.availability}</p>
        </div>
        <div className="mt-10 flex flex-wrap gap-4">
          <MagneticButton>
            <Link href="/shop/co-water" className="inline-flex items-center gap-3 bg-ink px-6 py-4 text-sm text-paper">
              Notify Me <Bell size={16} />
            </Link>
          </MagneticButton>
          <MagneticButton>
            <Link href="/shop" className="inline-flex items-center gap-3 border border-shell px-6 py-4 text-sm text-coconut">
              View catalogue <ArrowUpRight size={16} />
            </Link>
          </MagneticButton>
        </div>
      </Reveal>
    </section>
  );
}

export function CataloguePreview() {
  return (
    <section className="relative overflow-hidden bg-paper px-5 py-24 md:px-8">
      <CoconutSliceDoodle className="co-brand-doodle absolute left-4 top-10 hidden w-32 md:block" />
      <SectionHeader
        kicker="Pre-launch catalogue"
        title="Coconut products without the cart noise."
        body="A commerce foundation for discovery, early access, and distributor conversations before checkout goes live."
      />
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-4">
        {shopProducts.map((product) => (
          <Link
            key={product.slug}
            href={`/shop/${product.slug}`}
            data-analytics="product_interest_click"
            data-analytics-label={product.name}
            className="group co-soft-depth co-soft-depth-hover border border-shell bg-porcelain p-4"
          >
            <div className="relative mb-6 aspect-[4/5] overflow-hidden bg-shell">
              <Image src={product.image} alt={product.name} fill sizes="(min-width: 768px) 25vw, 90vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" />
            </div>
            <p className="mb-3 text-[0.65rem] uppercase tracking-editorial text-grove">{product.category}</p>
            <h3 className="font-display text-3xl text-ink">{product.name}</h3>
            <p className="mt-3 text-sm leading-7 text-muted">{product.format}</p>
            <p className="mt-5 text-[0.65rem] uppercase tracking-editorial text-coconut">Coming soon</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function RecipesPreview() {
  return (
    <section className="relative overflow-hidden px-5 py-24 md:px-8">
      <TenderCoconutDoodle className="co-brand-doodle absolute right-6 top-8 hidden w-28 text-grove md:block" />
      <SectionHeader
        kicker="Recipes"
        title="Everyday coconut rituals."
        body="Simple drinks, desserts, and kitchen ideas designed for the .CO ecosystem."
      />
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
        {recipes.slice(0, 3).map((recipe) => (
          <motion.article key={recipe.slug} {...CoconutMotion.RecipeReveal} className="co-soft-depth border border-shell bg-porcelain p-4">
            <div className="relative mb-6 aspect-[4/3] overflow-hidden bg-shell">
              <Image src={recipe.image} alt={recipe.title} fill sizes="(min-width: 768px) 33vw, 90vw" className="object-cover" />
            </div>
            <p className="mb-3 text-[0.65rem] uppercase tracking-editorial text-grove">
              {recipe.time} / {recipe.difficulty}
            </p>
            <h3 className="font-display text-3xl text-ink">{recipe.title}</h3>
            <p className="mt-4 text-sm leading-7 text-muted">{recipe.description}</p>
          </motion.article>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link href="/recipes" className="inline-flex items-center gap-3 border border-shell px-6 py-4 text-sm text-coconut">
          Explore recipes <ArrowUpRight size={16} />
        </Link>
      </div>
    </section>
  );
}

export function WellnessUsageSection() {
  return (
    <section className="bg-porcelain px-5 py-24 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <p className="mb-5 text-[0.72rem] uppercase tracking-editorial text-grove">Future expressions</p>
          <h2 className="font-display text-5xl leading-tight text-ink md:text-7xl">Future expressions of coconut living.</h2>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {usageDirections.map((item) => (
            <Reveal key={item.title}>
              <div className="border-t border-shell pt-6">
                <h3 className="font-display text-3xl text-ink">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-muted">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section className="px-5 py-24 md:px-8">
      <SectionHeader
        kicker="Community notes"
        title="Early feedback, clearly marked."
        body="Placeholder notes for launch planning. These are not customer reviews and will be replaced with verified feedback."
      />
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
        {communityNotes.map((note) => (
          <motion.article key={note.label} {...CoconutMotion.TestimonialFade} className="co-soft-depth co-soft-depth-hover border border-shell bg-paper p-7">
            <p className="mb-6 text-[0.65rem] uppercase tracking-editorial text-grove">{note.label}</p>
            <p className="font-display text-3xl leading-tight text-ink">“{note.note}”</p>
            <p className="mt-8 text-xs uppercase tracking-editorial text-muted">{note.source}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export function SocialFounderBanners() {
  return (
    <section className="relative overflow-hidden bg-paper px-5 py-24 md:px-8">
      <PalmLeafDoodle className="co-brand-doodle absolute bottom-8 right-8 hidden w-44 md:block" />
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <p className="mb-5 text-[0.72rem] uppercase tracking-editorial text-grove">Founder journey</p>
          <h2 className="font-display text-5xl leading-tight text-ink md:text-7xl">Two founders. One vision. Building .CO from India to the world.</h2>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-coconut">
            <Link href="https://www.instagram.com/cothecoconutcompany" className="inline-flex items-center gap-2 border border-shell px-4 py-3">
              Instagram <ArrowUpRight size={14} />
            </Link>
            <Link href="https://www.linkedin.com/company/dotcolife" className="inline-flex items-center gap-2 border border-shell px-4 py-3">
              LinkedIn <ArrowUpRight size={14} />
            </Link>
          </div>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {socialStories.map((story, index) => (
            <Reveal key={story} delay={index * 0.04}>
              <div className="co-soft-depth co-soft-depth-hover min-h-40 border border-shell bg-porcelain p-6">
                <Sparkles className="mb-8 text-clay" size={18} />
                <h3 className="font-display text-3xl text-ink">{story}</h3>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DistributorPartnershipCta() {
  return (
    <section className="px-5 py-24 md:px-8">
      <div className="relative mx-auto grid max-w-7xl gap-8 overflow-hidden bg-ink p-8 text-paper md:grid-cols-[1fr_0.8fr] md:p-12">
        <div className="co-wave-pattern pointer-events-none absolute inset-y-0 right-0 w-72 opacity-[0.07]" />
        <div>
          <p className="mb-5 text-[0.72rem] uppercase tracking-editorial text-paper/60">Partnerships</p>
          <h2 className="font-display text-5xl leading-tight md:text-7xl">Bring .CO into retail, hospitality, and new markets.</h2>
        </div>
        <div className="self-end">
          <p className="mb-8 text-base leading-8 text-paper/72">
            We are preparing distributor, hospitality, and GCC conversations before the full product rollout.
          </p>
          <Link href="/shop" className="inline-flex items-center gap-3 bg-paper px-6 py-4 text-sm text-ink">
            Distributor Enquiry <Handshake size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
