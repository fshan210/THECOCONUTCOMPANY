"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Bell, Droplets, Handshake, HeartPulse, Leaf, Mail, ShieldCheck, Sparkles, Sprout, Waves } from "lucide-react";
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/MagneticButton";
import { Reveal } from "@/components/Motion";
import { SectionHeader } from "@/components/SectionHeader";
import { CoconutSliceDoodle, FloatingDoodleLayer, PalmLeafDoodle, TenderCoconutDoodle } from "@/components/BrandDoodles";
import { communityNotes, recipes, shopProducts, socialStories, usageDirections } from "@/lib/catalog";
import { CoconutMotion, useCoconutMotionMode } from "@/lib/animations/coconut-motion";

const trustItems = [
  { label: "Kerala-origin sourcing", icon: Sprout },
  { label: "Everyday hydration", icon: Droplets },
  { label: "Clean ingredient mindset", icon: ShieldCheck },
  { label: "Full coconut ecosystem", icon: Leaf }
];

const benefitItems = [
  {
    title: "Hydrates beautifully",
    body: "A chilled coconut ritual for heat, travel, movement, hosting, and mid-day resets.",
    icon: Droplets
  },
  {
    title: "Naturally versatile",
    body: "One ingredient stretches across beverage, dessert, kitchen, care, and wellness occasions.",
    icon: Waves
  },
  {
    title: "Built with origin",
    body: "Palakkad sourcing, village aggregation, and farmer relationships give the brand its spine.",
    icon: Sprout
  },
  {
    title: "Easy to trust",
    body: "Short ingredient thinking, honest launch notes, and no exaggerated coconut claims.",
    icon: HeartPulse
  }
];

const heroCompositions = [
  {
    title: "Poolside hydration",
    body: "The everyday bottle in bright, social, warm-weather moments.",
    image: "/assets/generated/composition-poolside.webp"
  },
  {
    title: "Morning ritual",
    body: "A softer lifestyle scene for homes, cafes, and calm resets.",
    image: "/assets/generated/composition-morning.webp"
  },
  {
    title: "Shelf-ready pack",
    body: "The tetra format shows where the coconut water system can stretch.",
    image: "/assets/generated/composition-tetra.webp"
  }
];

export function TrustStrip() {
  return (
    <section className="relative z-10 -mt-1 overflow-hidden bg-coconut px-5 py-5 text-paper md:px-8">
      <div className="co-wave-pattern pointer-events-none absolute inset-y-0 left-0 w-72 opacity-[0.08]" />
      <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {trustItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="co-glass-dark flex min-h-16 items-center gap-3 px-4 py-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-paper/10 text-sun">
                <Icon size={18} />
              </span>
              <p className="text-xs uppercase tracking-editorial text-paper/78">{item.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function HeroCompositionSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fffdf8_0%,#F5EBD7_46%,rgba(168,176,123,0.42)_100%)] px-5 py-16 md:px-8 md:py-24">
      <FloatingDoodleLayer density="light" />
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
        <Reveal>
          <p className="mb-5 text-[0.72rem] uppercase tracking-editorial text-grove">Fresh by design</p>
          <h2 className="font-display text-5xl leading-[0.98] text-ink md:text-7xl">
            Real product moments, not empty brand space.
          </h2>
          <p className="mt-7 max-w-xl text-base leading-8 text-muted md:text-lg md:leading-9">
            The .CO world moves from coconut to bottle to everyday scenes: poolside hydration, morning resets, shelves, cafes, and home rituals.
          </p>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {heroCompositions.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.07}>
              <article className="co-glass co-soft-depth-hover relative h-full overflow-hidden p-3">
                <div className="relative aspect-[4/5] overflow-hidden bg-[linear-gradient(160deg,#fffdf8,#F5EBD7_58%,rgba(74,111,74,0.16))]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 90vw"
                    className="object-contain p-3"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-3xl leading-tight text-ink">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{item.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MadeForLivingVisual() {
  const { shouldReduce } = useCoconutMotionMode();

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#3E2E1F_0%,#4A6F4A_54%,#F5EBD7_100%)] px-0 py-12 md:px-8 md:py-24">
      <div className="co-wave-pattern pointer-events-none absolute inset-y-0 right-0 hidden w-[32vw] opacity-[0.16] md:block" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(216,192,122,0.2),transparent_26%),radial-gradient(circle_at_84%_40%,rgba(245,235,215,0.18),transparent_30%)]" />
      <div className="mx-auto max-w-7xl px-5 md:px-0">
        <div className="mx-auto mb-8 max-w-3xl text-center text-paper">
          <p className="mb-4 text-[0.72rem] uppercase tracking-editorial text-paper/62">The conclusion</p>
          <h2 className="font-display text-4xl leading-tight md:text-6xl">From coconut to product, made for living.</h2>
        </div>
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, y: 36, clipPath: "inset(10% 6% 10% 6%)" }}
          whileInView={shouldReduce ? undefined : { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="co-glass relative overflow-hidden bg-paper/90 shadow-[0_26px_90px_rgba(62,46,31,0.18)]"
        >
          <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_12%_18%,rgba(168,176,123,0.16),transparent_30%),linear-gradient(90deg,rgba(255,253,248,0.22),transparent_18%,transparent_82%,rgba(255,253,248,0.24))]" />
          <motion.div
            aria-hidden="true"
            animate={shouldReduce ? undefined : { x: ["-18%", "18%", "-18%"], opacity: [0.12, 0.22, 0.12] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -inset-y-10 left-0 z-10 w-2/3 rotate-[-6deg] bg-[linear-gradient(100deg,transparent,rgba(74,111,74,0.18),transparent)] blur-xl"
          />
          <PalmLeafDoodle className="co-brand-doodle absolute -bottom-8 left-8 z-20 hidden w-44 rotate-[-8deg] text-coconut md:block" />
          <motion.div
            animate={shouldReduce ? undefined : { scale: [1, 1.012, 1] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            className="relative aspect-[1983/793]"
          >
            <Image
              src="/optimized/assets-coconut-made-for-living-reference.webp"
              alt="Made for Living brand statement with soft palm shadow and .CO coconut mark"
              fill
              sizes="100vw"
              className="object-contain mix-blend-multiply"
              priority={false}
            />
          </motion.div>
        </motion.div>
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
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#2d2d2d_0%,#3e2e1f_48%,#4A6F4A_100%)] px-5 py-24 text-paper md:px-8 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_26%,rgba(245,235,215,0.08),transparent_32%),linear-gradient(90deg,rgba(255,253,248,0.03),transparent_45%)]" />
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

export function BenefitsSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fffdf8_0%,#F5EBD7_54%,rgba(168,176,123,0.38)_100%)] px-5 py-16 md:px-8 md:py-24">
      <PalmLeafDoodle className="co-brand-doodle absolute left-5 top-10 hidden w-44 text-grove md:block" />
      <SectionHeader
        kicker="Coconut benefits"
        title="Simple reasons people come back to coconut."
        body="Consumer-friendly benefits that stay grounded: hydration, versatility, origin, and daily ease."
      />
      <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {benefitItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Reveal key={item.title} delay={index * 0.05}>
              <article className="co-neu co-soft-depth-hover h-full p-6">
                <span className="mb-8 grid h-12 w-12 place-items-center rounded-full bg-grove text-paper">
                  <Icon size={20} />
                </span>
                <h3 className="font-display text-3xl leading-tight text-ink">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-muted">{item.body}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

export function ProductHighlight() {
  const water = shopProducts[0];

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fffdf8_0%,rgba(168,176,123,0.2)_50%,#F5EBD7_100%)] px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.05fr_0.95fr] md:items-center">
      <Reveal className="co-glass relative aspect-[4/5] overflow-hidden md:aspect-[5/4]">
        <div className="co-wave-pattern pointer-events-none absolute inset-y-0 right-0 w-44 opacity-[0.1]" />
        <div className="absolute inset-x-14 bottom-12 h-12 rounded-full bg-coconut/14 blur-2xl" />
        <Image src={water.image} alt={`${water.name} product highlight`} fill sizes="(min-width: 768px) 52vw, 100vw" className="object-contain p-8 drop-shadow-[0_28px_48px_rgba(62,46,31,0.2)]" />
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mb-5 text-[0.72rem] uppercase tracking-editorial text-grove">First release</p>
        <h2 className="font-display text-5xl leading-tight text-ink md:text-7xl">{water.name}</h2>
        <p className="mt-6 text-lg leading-9 text-muted">{water.shortDescription}</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {water.benefits.map((benefit) => (
            <div key={benefit} className="co-neu-inset px-4 py-3 text-sm leading-6 text-coconut">
              {benefit}
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-4">
          <MagneticButton>
            <Link href="/shop/co-water" className="inline-flex min-h-12 items-center gap-3 bg-ink px-6 py-4 text-sm text-paper">
              Notify Me <Bell size={16} />
            </Link>
          </MagneticButton>
          <MagneticButton>
            <Link href="/shop" className="inline-flex min-h-12 items-center gap-3 border border-shell px-6 py-4 text-sm text-coconut">
              View catalogue <ArrowUpRight size={16} />
            </Link>
          </MagneticButton>
        </div>
      </Reveal>
      </div>
    </section>
  );
}

export function CataloguePreview() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#F5EBD7_0%,#fffdf8_64%,rgba(74,111,74,0.12)_100%)] px-5 py-16 md:px-8 md:py-24">
      <CoconutSliceDoodle className="co-brand-doodle absolute left-4 top-10 hidden w-32 md:block" />
      <SectionHeader
        kicker="Pre-launch catalogue"
        title="Coconut products without the cart noise."
        body="A commerce foundation for discovery, early access, and distributor conversations before checkout goes live."
      />
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">
        {shopProducts.map((product, index) => (
          <Link
            key={product.slug}
            href={`/shop/${product.slug}`}
            data-analytics="product_interest_click"
            data-analytics-label={product.name}
            className={`group co-neu co-soft-depth-hover relative overflow-hidden p-4 ${index === 0 ? "md:col-span-2 lg:col-span-1" : ""}`}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_12%,rgba(74,111,74,0.12),transparent_34%)] opacity-0 transition duration-500 group-hover:opacity-100" />
            <div className="relative mb-6 aspect-[4/5] overflow-hidden">
              <div className="absolute inset-x-8 bottom-7 h-8 rounded-full bg-coconut/12 blur-xl" />
              <Image src={product.image} alt={product.name} fill sizes="(min-width: 768px) 25vw, 90vw" className="object-contain p-4 drop-shadow-[0_22px_30px_rgba(62,46,31,0.18)] transition duration-700 group-hover:scale-[1.03]" />
            </div>
            <p className="mb-3 text-[0.65rem] uppercase tracking-editorial text-grove">{product.category}</p>
            <h3 className="font-display text-3xl text-ink">{product.name}</h3>
            <p className="mt-3 text-sm leading-7 text-muted">{product.shortDescription}</p>
            <p className="mt-5 text-[0.65rem] uppercase tracking-editorial text-coconut">Coming soon</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function RecipesPreview() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fffdf8_0%,#F5EBD7_58%,rgba(216,192,122,0.22)_100%)] px-5 py-16 md:px-8 md:py-24">
      <TenderCoconutDoodle className="co-brand-doodle absolute right-6 top-8 hidden w-28 text-grove md:block" />
      <SectionHeader
        kicker="Recipes"
        title="Everyday coconut rituals."
        body="Simple drinks, desserts, and kitchen ideas designed for the .CO ecosystem."
      />
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
        {recipes.slice(0, 3).map((recipe) => (
          <motion.article key={recipe.slug} {...CoconutMotion.RecipeReveal} className="co-glass co-soft-depth-hover p-4">
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
        <Link href="/recipes" className="inline-flex min-h-12 items-center gap-3 border border-shell px-6 py-4 text-sm text-coconut">
          Explore recipes <ArrowUpRight size={16} />
        </Link>
      </div>
    </section>
  );
}

export function WellnessUsageSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fffdf8_0%,rgba(74,111,74,0.1)_48%,#F5EBD7_100%)] px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <p className="mb-5 text-[0.72rem] uppercase tracking-editorial text-grove">Future expressions</p>
          <h2 className="font-display text-5xl leading-tight text-ink md:text-7xl">Future expressions of coconut living.</h2>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {usageDirections.map((item) => (
            <Reveal key={item.title}>
              <div className="co-neu h-full p-6">
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
    <section className="relative overflow-hidden px-5 py-16 md:px-8 md:py-24">
      <SectionHeader kicker="Community notes" title="Built with early tasters, buyers, and believers." body="Signals from the people closest to the launch: hospitality partners, founder community, and early tasting circles." />
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
        {communityNotes.map((note) => (
          <motion.article key={note.label} {...CoconutMotion.TestimonialFade} className="co-glass co-soft-depth-hover p-7">
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
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#F5EBD7_0%,#fffdf8_48%,rgba(168,176,123,0.28)_100%)] px-5 py-16 md:px-8 md:py-24">
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
              <div className="co-glass co-soft-depth-hover min-h-40 p-6">
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
    <section className="px-5 py-16 md:px-8 md:py-24">
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
          <Link href="/shop" className="inline-flex min-h-12 items-center gap-3 bg-paper px-6 py-4 text-sm text-ink">
            Distributor Enquiry <Handshake size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function NewsletterSignupSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fffdf8,#F5EBD7)] px-5 py-20 md:px-8">
      <CoconutSliceDoodle className="co-brand-doodle absolute right-6 top-8 hidden w-36 text-grove md:block" />
      <div className="co-glass mx-auto grid max-w-7xl gap-8 p-6 md:grid-cols-[0.9fr_1.1fr] md:p-10">
        <div>
          <p className="mb-5 text-[0.72rem] uppercase tracking-editorial text-grove">Launch notes</p>
          <h2 className="font-display text-4xl leading-tight text-ink md:text-6xl">Fresh drops, recipes, and early access.</h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-muted">
            Join the .CO circle for launch timing, product tastings, recipe rituals, and distributor updates.
          </p>
        </div>
        <form className="grid content-end gap-3 sm:grid-cols-[1fr_auto]" data-analytics-form="newsletter">
          <label className="sr-only" htmlFor="newsletter-email">
            Email
          </label>
          <input
            id="newsletter-email"
            type="email"
            placeholder="you@example.com"
            className="co-neu-inset min-h-14 px-4 text-sm text-ink outline-none focus:border-coconut"
          />
          <button type="button" className="co-button-soft inline-flex min-h-14 items-center justify-center gap-3 bg-coconut px-6 text-sm text-paper">
            Notify Me <Mail size={16} />
          </button>
          <p className="text-xs leading-6 text-muted sm:col-span-2">Pre-launch only. No checkout or payment is active yet.</p>
        </form>
      </div>
    </section>
  );
}
