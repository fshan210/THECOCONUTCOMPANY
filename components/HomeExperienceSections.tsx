"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, Droplets, Heart, Leaf, Mail, ShieldCheck, Sparkles, Sprout, Waves } from "lucide-react";
import { Appear } from "@/components/motion/Appear";
import { CtaLink, DoodleImage, HoverImageFrame, ParallaxFrame, PublicHeader, PublicSection } from "@/components/PublicDesign";
import { ProductCard } from "@/components/ProductCard";
import { recipes, shopProducts, socialStories } from "@/lib/catalog";
import { products } from "@/lib/content";
import { publicAssets } from "@/lib/public-assets";

const trustItems = [
  { label: "Coconut-first products", icon: Leaf },
  { label: "Clean everyday taste", icon: Droplets },
  { label: "Simple ingredient mindset", icon: ShieldCheck },
  { label: "Made for Living", icon: Heart }
];

const ecosystem = [
  {
    label: "Kitchen",
    title: ".CO Kitchen",
    body: "Coconut pantry notes for cooking, finishing, and warm home food.",
    image: publicAssets.ecosystem.kitchenHero,
    hoverImage: publicAssets.ecosystem.kitchenAlt
  },
  {
    label: "Botanica",
    title: ".CO Botanica",
    body: "Gentle coconut-inspired care for everyday shelf and shower rituals.",
    image: publicAssets.ecosystem.botanicaHero,
    hoverImage: publicAssets.ecosystem.botanicaAlt
  },
  {
    label: "Wellness",
    title: ".CO Wellness",
    body: "Hydration-led rituals that stay simple, useful, and easy to understand.",
    image: publicAssets.ecosystem.wellness,
    hoverImage: publicAssets.water.flatLay
  },
  {
    label: "Lifestyle",
    title: ".CO Lifestyle",
    body: "Objects, recipes, and warm details that make coconut feel at home.",
    image: publicAssets.ecosystem.lifestyle,
    hoverImage: publicAssets.water.hero
  }
];

export function TrustStrip() {
  return (
    <section className="border-b border-coconut/10 bg-paper px-5 py-6 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {trustItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Appear key={item.label} delay={index * 0.04}>
              <div className="flex min-h-20 items-center gap-4 rounded-2xl border border-coconut/10 bg-[#fff8ea] px-5 py-4 shadow-[0_12px_36px_rgba(62,46,31,0.045)]">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-grove/10 text-grove">
                  <Icon size={17} />
                </span>
                <p className="text-[0.72rem] font-medium uppercase tracking-editorial text-coconut/70">{item.label}</p>
              </div>
            </Appear>
          );
        })}
      </div>
    </section>
  );
}

export function BrandManifestoBanner() {
  return (
    <PublicSection className="py-16 md:py-24">
      <DoodleImage src={publicAssets.doodles.rawCoconut} className="left-6 top-8 h-32 w-32 md:h-48 md:w-48" />
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
        <Appear>
          <p className="mb-5 text-[0.72rem] font-medium uppercase tracking-editorial text-grove">Manifesto</p>
          <h2 className="font-display text-5xl font-light leading-tight text-coconut md:text-7xl">Made for Living, not saving for later.</h2>
          <p className="mt-7 max-w-xl text-lg leading-9 text-coconut/70">
            .CO belongs in the small moments: a cold bottle after heat, a spoonful after dinner, a coconut note in the kitchen, a calmer shelf.
          </p>
        </Appear>
        <Appear delay={0.08} className="relative min-h-[300px] overflow-hidden rounded-3xl border border-coconut/10 bg-[#fff8ea] shadow-[0_28px_80px_rgba(62,46,31,0.1)] md:min-h-[430px]">
          <Image src={publicAssets.brand.madeForLiving} alt="Made for Living .CO manifesto" fill sizes="(min-width: 1024px) 62vw, 92vw" className="object-cover object-center" />
          <div className="pointer-events-none absolute inset-4 rounded-[1.35rem] border border-paper/40" />
        </Appear>
      </div>
    </PublicSection>
  );
}

export function ProductHighlight() {
  const water = shopProducts[0];

  return (
    <PublicSection className="py-20 md:py-28">
      <DoodleImage src={publicAssets.doodles.bottle} className="right-8 top-12 h-36 w-36 md:h-56 md:w-56" />
      <div className="pointer-events-none absolute left-1/2 top-8 hidden -translate-x-1/2 whitespace-nowrap font-display text-[14vw] font-light leading-none text-coconut/[0.045] lg:block">
        .CO WATER
      </div>
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <Appear className="relative min-h-[460px] md:min-h-[620px]">
          <ParallaxFrame src={water.image} hoverSrc={water.hoverImage} alt={`${water.name} bottle`} className="absolute inset-0" />
        </Appear>
        <Appear delay={0.08}>
          <p className="mb-5 text-[0.72rem] font-medium uppercase tracking-editorial text-grove">Coconut water feature</p>
          <h2 className="font-display text-5xl font-light leading-tight text-coconut md:text-7xl">{water.name}</h2>
          <p className="mt-7 max-w-xl text-lg leading-9 text-coconut/70">{water.shortDescription}</p>
          <div className="mt-8 grid grid-cols-3 overflow-hidden rounded-3xl border border-coconut/10 bg-coconut text-paper shadow-[0_22px_70px_rgba(62,46,31,0.14)]">
            {["Tender", "Coconut", "Water"].map((word) => (
              <span key={word} className="border-r border-paper/10 px-4 py-5 text-center font-display text-2xl font-light last:border-r-0 md:text-4xl">
                {word}
              </span>
            ))}
          </div>
          <div className="mt-9 grid gap-3 sm:grid-cols-3">
            {water.benefits.map((benefit) => (
              <span key={benefit} className="rounded-2xl border border-coconut/10 bg-[#fff8ea] px-4 py-4 text-sm leading-6 text-coconut/72">{benefit}</span>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <CtaLink href="/shop/co-water">Join early access</CtaLink>
            <CtaLink href="/recipes" variant="secondary">Try recipes</CtaLink>
          </div>
        </Appear>
      </div>
    </PublicSection>
  );
}

export function MeltCoHighlight() {
  const product = shopProducts[1];

  return (
    <PublicSection tone="warm">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
        <Appear>
          <p className="mb-5 text-[0.72rem] font-medium uppercase tracking-editorial text-grove">MELT.CO ice cream</p>
          <h2 className="font-display text-5xl font-light leading-tight text-coconut md:text-7xl">Coconut creaminess, made spoonable.</h2>
          <p className="mt-7 max-w-xl text-lg leading-9 text-coconut/70">{product.shortDescription}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <CtaLink href="/shop/melt-co-mango-coconut">Preview flavor</CtaLink>
            <CtaLink href="/products" variant="secondary">See the ecosystem</CtaLink>
          </div>
        </Appear>
        <Appear delay={0.08} className="relative min-h-[440px] md:min-h-[580px]">
          <ParallaxFrame src={product.image} hoverSrc={product.hoverImage} alt="MELT.CO coconut frozen dessert" className="absolute inset-0" />
        </Appear>
      </div>
    </PublicSection>
  );
}

export function ProductEcosystem() {
  return (
    <PublicSection>
      <DoodleImage src={publicAssets.doodles.tetra} className="left-4 top-16 h-32 w-32 md:h-52 md:w-52" />
      <PublicHeader
        kicker="Product ecosystem"
        title="One coconut world, many everyday rituals."
        body="Kitchen, Botanica, Wellness, and Lifestyle extend the coconut story without making it complicated."
      />
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">
        {ecosystem.map((item, index) => (
          <Appear key={item.title} delay={index * 0.06}>
            <article className="group h-full rounded-3xl border border-coconut/10 bg-[#fff8ea] p-4 shadow-[0_18px_48px_rgba(62,46,31,0.06)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(62,46,31,0.11)]">
              <HoverImageFrame
                src={item.image}
                hoverSrc={item.hoverImage}
                alt={item.title}
                sizes="(min-width: 1024px) 23vw, (min-width: 768px) 46vw, 92vw"
                className="mb-7 aspect-[4/5]"
                imageClassName={item.label === "Wellness" ? "object-cover" : "object-contain p-6"}
              />
              <p className="mb-3 inline-flex rounded-full bg-palm/18 px-3 py-2 text-[0.65rem] font-medium uppercase tracking-editorial text-grove">{item.label}</p>
              <h3 className="font-display text-3xl font-light leading-tight text-coconut">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-coconut/68">{item.body}</p>
            </article>
          </Appear>
        ))}
      </div>
    </PublicSection>
  );
}

export function RecipesPreview() {
  return (
    <PublicSection tone="warm">
      <PublicHeader kicker="Recipes" title="Coconut rituals for ordinary days." body="Simple drinks and bowls that make .CO useful at breakfast, after heat, and during small hosting moments." />
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
        {recipes.map((recipe, index) => (
          <Appear key={recipe.slug} delay={index * 0.06}>
            <article className="group h-full overflow-hidden rounded-3xl border border-coconut/10 bg-paper p-4 shadow-[0_18px_48px_rgba(62,46,31,0.06)] transition duration-500 hover:-translate-y-1">
              <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-2xl bg-[#fff8ea]">
                <Image src={recipe.image} alt={recipe.title} fill sizes="(min-width: 768px) 33vw, 92vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" />
              </div>
              <p className="mb-3 text-[0.65rem] font-medium uppercase tracking-editorial text-grove">{recipe.time} / {recipe.difficulty}</p>
              <h3 className="font-display text-3xl font-light text-coconut">{recipe.title}</h3>
              <p className="mt-4 text-sm leading-7 text-coconut/68">{recipe.description}</p>
            </article>
          </Appear>
        ))}
      </div>
    </PublicSection>
  );
}

export function HonestProductSection() {
  const cards = [
    ["Coconut first", "Every product starts with a coconut ritual people already understand."],
    ["Clean experience", "Taste, texture, and clarity matter more than noisy claims."],
    ["Useful formats", "Drink, scoop, cook, care, and share: each format earns its place."]
  ];

  return (
    <PublicSection tone="brown">
      <div className="co-wave-pattern absolute inset-y-0 right-0 w-[34vw] opacity-[0.08]" />
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <Appear>
          <p className="mb-5 text-[0.72rem] font-medium uppercase tracking-editorial text-paper/64">Honest product principles</p>
          <h2 className="font-display text-5xl font-light leading-tight text-paper md:text-7xl">Simple products with enough soul.</h2>
          <p className="mt-7 max-w-xl text-base leading-8 text-paper/70 md:text-lg md:leading-9">
            .CO keeps the language clear: coconut taste, useful rituals, warm design, and no exaggerated promises.
          </p>
        </Appear>
        <div className="grid gap-4">
          <Appear>
            <div className="rounded-3xl border border-paper/12 bg-paper p-6 text-coconut md:p-8">
              <p className="text-[0.68rem] font-medium uppercase tracking-editorial text-grove">Ingredient grammar</p>
              <p className="mt-5 font-display text-5xl font-light leading-none md:text-7xl">Coconut. Water. Cream. Care.</p>
            </div>
          </Appear>
          {cards.map(([title, body], index) => (
            <Appear key={title} delay={index * 0.06}>
              <article className="grid gap-4 rounded-3xl border border-paper/12 bg-paper/5 px-6 py-7 backdrop-blur-sm md:grid-cols-[0.44fr_1fr] md:px-8">
                <h3 className="font-display text-3xl font-light leading-tight text-paper">{title}</h3>
                <p className="text-sm leading-7 text-paper/70">{body}</p>
              </article>
            </Appear>
          ))}
        </div>
      </div>
    </PublicSection>
  );
}

export function SustainabilityPreview() {
  return (
    <PublicSection>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <Appear className="relative min-h-[420px] md:min-h-[540px]">
          <HoverImageFrame src={publicAssets.brand.harvest} hoverSrc={publicAssets.brand.grove} alt="Coconut sourcing and harvest" sizes="(min-width: 1024px) 52vw, 92vw" className="absolute inset-0" imageClassName="object-cover" />
        </Appear>
        <Appear delay={0.08}>
          <p className="mb-5 text-[0.72rem] font-medium uppercase tracking-editorial text-grove">Sustainability</p>
          <h2 className="font-display text-5xl font-light leading-tight text-coconut md:text-7xl">Respect for the coconut, from tree to table.</h2>
          <p className="mt-7 max-w-xl text-lg leading-9 text-coconut/70">
            We keep sustainability simple and visible: thoughtful sourcing, less waste, clear ingredients, and care for the everyday value of coconut.
          </p>
          <div className="mt-9">
            <CtaLink href="/sustainability" variant="secondary">Read more</CtaLink>
          </div>
        </Appear>
      </div>
    </PublicSection>
  );
}

export function FounderJourneyPreview() {
  return (
    <PublicSection tone="warm">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Appear>
          <p className="mb-5 text-[0.72rem] font-medium uppercase tracking-editorial text-grove">Founder warmth</p>
          <h2 className="font-display text-5xl font-light leading-tight text-coconut md:text-7xl">Built close to the rituals we grew up with.</h2>
          <p className="mt-7 max-w-xl text-lg leading-9 text-coconut/70">
            .CO is a founder-led coconut company shaped by Kerala memory, family kitchens, simple taste, and products that feel easy to live with.
          </p>
        </Appear>
        <div className="grid gap-4 sm:grid-cols-2">
          {socialStories.map((story, index) => (
            <Appear key={story} delay={index * 0.05}>
              <article className="min-h-36 rounded-3xl border border-coconut/10 bg-paper p-6 shadow-[0_14px_40px_rgba(62,46,31,0.05)]">
                <Sparkles className="mb-8 text-sun" size={18} />
                <h3 className="font-display text-3xl font-light leading-tight text-coconut">{story}</h3>
              </article>
            </Appear>
          ))}
        </div>
      </div>
    </PublicSection>
  );
}

export function NewsletterSignupSection() {
  return (
    <PublicSection className="pb-24 md:pb-32">
      <Appear className="relative mx-auto grid max-w-7xl gap-8 overflow-hidden rounded-3xl border border-coconut/10 bg-coconut p-7 text-paper shadow-[0_28px_80px_rgba(62,46,31,0.15)] md:grid-cols-[1fr_0.82fr] md:p-12">
        <DoodleImage src={publicAssets.doodles.rawCoconut} className="right-8 top-8 h-36 w-36 invert md:h-52 md:w-52" />
        <div className="relative">
          <p className="mb-5 text-[0.72rem] font-medium uppercase tracking-editorial text-paper/64">Newsletter / early access</p>
          <h2 className="font-display text-5xl font-light leading-tight md:text-7xl">Fresh drops, recipes, and first taste notes.</h2>
        </div>
        <form className="relative grid content-end gap-3 sm:grid-cols-[1fr_auto]" data-analytics-form="newsletter">
          <label className="sr-only" htmlFor="newsletter-email">Email</label>
          <input id="newsletter-email" type="email" placeholder="you@example.com" className="min-h-14 rounded-2xl border border-paper/14 bg-paper px-4 text-sm text-coconut outline-none placeholder:text-coconut/45 focus:border-sun" />
          <button type="button" className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-paper px-6 text-sm font-medium text-coconut transition hover:bg-sun">
            Notify Me <Mail size={16} />
          </button>
          <p className="text-xs leading-6 text-paper/64 sm:col-span-2">No spam. Just product notes, recipes, and early access updates.</p>
        </form>
      </Appear>
    </PublicSection>
  );
}

export function ProductHouseList() {
  return (
    <PublicSection>
      <PublicHeader kicker="Products" title="Coconut, edited into everyday rituals." body="A focused product world with a drink, a scoop, a kitchen note, a care ritual, and a warm way of living." />
      <div className="mx-auto grid max-w-7xl gap-5">
        {products.map((product, index) => (
          <Appear key={product.name} delay={index * 0.05}>
            <ProductCard {...product} />
          </Appear>
        ))}
      </div>
    </PublicSection>
  );
}
