"use client";

import Link from "next/link";
import { BrandImage } from "@/components/BrandImage";
import {
  BentoCard,
  BentoGrid,
  BrandMarquee,
  CTAButton,
  DoodleIcon,
  MotionSection,
  ProductCard,
  SectionShell,
  TrustBadge
} from "@/components/brand/BrandPrimitives";
import { recipes } from "@/lib/catalog";
import { publicAssets } from "@/lib/public-assets";

const originSteps: Array<{
  title: string;
  image: string;
  fit: "cover" | "contain";
  position?: string;
}> = [
  { title: "Kerala Groves", image: publicAssets.journey.grove, fit: "cover" },
  { title: "Farmers", image: publicAssets.journey.farmers, fit: "cover" },
  { title: "Village Aggregation", image: publicAssets.journey.aggregation, fit: "cover" },
  { title: "Processing", image: publicAssets.journey.processing, fit: "cover" },
  { title: "Bottling", image: publicAssets.water.flatLay, fit: "cover" },
  { title: "To You", image: publicAssets.journey.ritual, fit: "cover" }
];

const rituals = [
  {
    title: "Breakfast Ritual",
    body: "Hydrate. Clean start.",
    image: publicAssets.campaign.breakfastRitual,
    position: "center"
  },
  {
    title: "Post Workout Refresh",
    body: "Replenish. Recover.",
    image: publicAssets.campaign.workoutRitual,
    position: "center 42%"
  },
  {
    title: "Tropical Indulgence",
    body: "Scoop. Savor. Smile.",
    image: publicAssets.melt.lifestyle,
    position: "center"
  }
];

export function ProductBentoSection() {
  return (
    <section className="relative z-10 bg-[var(--co-cream)] pb-4">
      <div className="co-container -mt-8 rounded-[32px] border border-[var(--co-border)] bg-[var(--co-white)] p-3 shadow-[0_8px_20px_rgba(58,36,22,0.08)] md:-mt-14 md:p-4">
        <BentoGrid className="md:grid-cols-[0.82fr_1.18fr_1.18fr]">
          <MotionSection>
            <BentoCard className="flex h-full min-h-[230px] flex-col justify-between bg-[var(--co-cream)] md:min-h-[290px]">
              <h2 className="text-[clamp(40px,5vw,70px)] font-bold uppercase leading-[0.86] text-[var(--co-ink)]">
                Real coconut.
                <br />
                Real goodness.
              </h2>
              <CTAButton href="/products" variant="outline" className="mt-8 w-fit">Explore products</CTAButton>
            </BentoCard>
          </MotionSection>
          <MotionSection delay={0.06}>
            <ProductCard
              title=".CO Water"
              badge="Bestseller"
              body="Pure. Hydrating. Everyday."
              image={publicAssets.water.hero}
              href="/shop/co-water"
              imageFit="cover"
              className="h-full"
            />
          </MotionSection>
          <MotionSection delay={0.12}>
            <ProductCard
              title="MELT.CO"
              body="Coconut ice cream. Tropical indulgence."
              image={publicAssets.melt.hero}
              href="/shop/melt-co-mango-coconut"
              imageFit="cover"
              accent
              className="h-full"
            />
          </MotionSection>
        </BentoGrid>
      </div>
    </section>
  );
}

export function OriginStorySection() {
  return (
    <SectionShell className="bg-[var(--co-cream)] pt-8">
      <div className="rounded-[32px] border border-[var(--co-border)] bg-[var(--co-white)] p-3 md:p-4">
        <div className="grid gap-4 md:grid-cols-[0.78fr_2.22fr]">
          <MotionSection>
            <BentoCard className="flex h-full min-h-[310px] flex-col justify-between bg-[var(--co-cream)]">
              <div>
                <h2 className="text-[clamp(34px,4.5vw,62px)] font-bold uppercase leading-[0.9] text-[var(--co-ink)]">
                  From grove to goodness
                </h2>
                <p className="mt-5 max-w-sm text-base leading-7 text-[var(--co-muted)]">
                  A journey rooted in care, tradition, and quality.
                </p>
              </div>
              <Link href="/about" className="mt-8 w-fit border-b border-current pb-1 text-sm font-bold text-[var(--co-black)]">
                Our story
              </Link>
            </BentoCard>
          </MotionSection>
          <div className="relative grid gap-3 md:grid-cols-6">
            <div className="pointer-events-none absolute left-8 right-8 top-[46px] hidden border-t border-dashed border-[var(--co-border)] md:block" />
            {originSteps.map((step, index) => (
              <MotionSection key={step.title} delay={index * 0.045} className="relative">
                <article className="relative z-10 h-full rounded-[24px] bg-[var(--co-white)] p-3">
                  <div className="mb-3 flex items-center gap-2 md:block">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--co-cream)] text-xs font-bold text-[var(--co-brown)] md:mb-2 md:h-6 md:w-6 md:text-[0.62rem] lg:mb-0 lg:h-7 lg:w-7 lg:text-xs">0{index + 1}</span>
                    <h3 className="text-sm font-bold uppercase leading-tight text-[var(--co-ink)] md:text-[0.68rem] lg:text-sm">{step.title}</h3>
                  </div>
                  <BrandImage
                    src={step.image}
                    alt={`${step.title} stage in the .CO coconut journey`}
                    sizes="(min-width: 1280px) 14vw, (min-width: 768px) 30vw, 92vw"
                    aspect="landscape"
                    fit={step.fit}
                    position={step.position ?? "center"}
                    hoverZoom
                    className="rounded-[14px]"
                  />
                </article>
              </MotionSection>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

export function TasteRitualGrid() {
  return (
    <SectionShell className="bg-[var(--co-cream)] pt-0">
      <BentoGrid className="md:grid-cols-3">
        {rituals.map((ritual, index) => (
          <MotionSection key={ritual.title} delay={index * 0.06}>
            <article className="group relative min-h-[280px] overflow-hidden rounded-[24px] border border-[var(--co-border)] bg-[var(--co-brown)]">
              <BrandImage
                src={ritual.image}
                alt={ritual.title}
                sizes="(min-width: 768px) 31vw, 92vw"
                aspect="landscape"
                fit="cover"
                position={ritual.position}
                hoverZoom
                className="h-full min-h-[280px] rounded-none border-0"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(21,17,13,0.44)_0%,rgba(21,17,13,0.08)_45%,rgba(21,17,13,0.36)_100%)]" />
              <div className="absolute left-5 top-5 max-w-xs text-[var(--co-white)]">
                <h3 className="text-[clamp(28px,3.5vw,46px)] font-bold uppercase leading-[0.88]">{ritual.title}</h3>
                <p className="mt-3 text-sm font-medium">{ritual.body}</p>
              </div>
            </article>
          </MotionSection>
        ))}
      </BentoGrid>
    </SectionShell>
  );
}

export function IngredientHonestySection() {
  return (
    <SectionShell className="bg-[var(--co-cream)] pt-0">
      <div className="grid overflow-hidden rounded-[32px] border border-[var(--co-border)] bg-[var(--co-white)] lg:grid-cols-[1fr_1.05fr]">
        <MotionSection className="p-6 md:p-9">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.08em] text-[var(--co-palm)]">Clean product promise</p>
          <h2 className="co-h2 max-w-3xl text-[var(--co-brown)]">Clean and pure, without making it complicated.</h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--co-muted)]">
            The product story stays simple: real coconut taste, natural hydration language, careful sourcing, and a format that belongs in the fridge.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <TrustBadge icon="leaf" title="Clean & Pure" body="Nothing added, ever." />
            <TrustBadge icon="drop" title="Naturally Hydrating" body="Fresh coconut ritual." />
            <TrustBadge icon="palm" title="Sustainably Sourced" body="Good for you, good for the planet." />
            <TrustBadge icon="cold" title="Fridge Shelf Ready" body="Cold shelf, daily repeat." />
          </div>
        </MotionSection>
        <MotionSection delay={0.08} className="min-h-[360px]">
          <BrandImage
            src={publicAssets.water.ingredients}
            alt=".CO coconut water ingredient composition"
            sizes="(min-width: 1024px) 48vw, 92vw"
            aspect="wide"
            fit="cover"
            hoverZoom
            className="h-full min-h-[360px] rounded-none border-0"
          />
        </MotionSection>
      </div>
    </SectionShell>
  );
}

export function RetailDistributorCTA() {
  return (
    <SectionShell className="bg-[var(--co-cream)] pt-0">
      <MotionSection>
        <BentoCard tone="dark" className="grid min-h-[220px] gap-5 rounded-[24px] p-5 md:grid-cols-[0.55fr_1fr] md:p-7">
          <div className="flex flex-col justify-between">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.08em] text-[var(--co-sun)]">For businesses</p>
              <h2 className="text-[clamp(34px,5vw,76px)] font-bold leading-[0.9]">Partner with .CO for healthy growth.</h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/72">
                Retail, distributor, cafe, hospitality, and product interest conversations start here.
              </p>
            </div>
            <div className="mt-8">
              <CTAButton href="/contact" variant="light">Learn more</CTAButton>
            </div>
            <DoodleIcon name="palm" className="absolute bottom-6 right-7 h-28 w-28 text-white/10" />
          </div>
          <BrandImage
            src={publicAssets.campaign.processingBottling}
            alt=".CO coconut water bottling line for business partners"
            sizes="(min-width: 768px) 54vw, 92vw"
            aspect="wide"
            fit="cover"
            position="center"
            hoverZoom
            className="min-h-[180px] rounded-[18px] border-white/10 bg-[var(--co-black)]"
          />
        </BentoCard>
      </MotionSection>
    </SectionShell>
  );
}

export function BrandWorldTeaser() {
  return (
    <section className="bg-[var(--co-cream)] pb-12">
      <BrandMarquee words={[".CO THE COCONUT COMPANY", "MADE FOR LIVING", "FROM KERALA", "COLD COCONUT WATER"]} />
      <div className="co-container mt-4 rounded-[24px] border border-[var(--co-border)] bg-[var(--co-white)] p-5 md:p-6">
        <div className="grid gap-5 md:grid-cols-[0.8fr_1fr_0.8fr] md:items-center">
          <h2 className="text-[clamp(28px,3vw,44px)] font-bold uppercase leading-[0.92] text-[var(--co-brown)]">
            Real coconut.
            <br />
            Real company.
          </h2>
          <DoodleIcon name="palm" className="mx-auto h-20 w-20 text-[var(--co-palm)]" />
          <div>
            <p className="text-base leading-7 text-[var(--co-muted)]">We are building a coconut brand from the heart of Kerala.</p>
            <Link href="/about" className="mt-4 inline-flex border-b border-current pb-1 text-sm font-bold text-[var(--co-black)]">
              About .CO
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TrustCueStrip() {
  return (
    <SectionShell className="bg-[var(--co-white)] py-0">
      <div className="grid gap-4 rounded-[24px] border border-[var(--co-border)] bg-[var(--co-white)] p-5 sm:grid-cols-2 md:grid-cols-4 md:p-7">
        <TrustBadge icon="leaf" title="Clean & Pure" body="Nothing added, ever." className="md:border-r md:pr-5" />
        <TrustBadge icon="drop" title="Naturally Hydrating" body="Rich in electrolytes." className="md:border-r md:pr-5" />
        <TrustBadge icon="palm" title="Sustainably Sourced" body="Good for you, good for the planet." className="md:border-r md:pr-5" />
        <TrustBadge icon="cold" title="Fridge Shelf Ready" body="Chilled. Fresh. Ready anytime." />
      </div>
    </SectionShell>
  );
}

export function RecipePreviewSection() {
  return (
    <SectionShell className="bg-[var(--co-cream)] pt-0">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="co-h2 text-[var(--co-brown)]">Simple recipes, made with real coconut.</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--co-muted)]">Fast coconut rituals for breakfast, cafe drinks, and tropical dessert moments.</p>
        </div>
        <CTAButton href="/recipes" variant="outline">Explore recipes</CTAButton>
      </div>
      <BentoGrid className="md:grid-cols-3">
        {recipes.map((recipe, index) => (
          <MotionSection key={recipe.slug} delay={index * 0.05}>
            <Link href={`/recipes#${recipe.slug}`} className="group block h-full">
              <article className="co-press h-full overflow-hidden rounded-[24px] border border-[var(--co-border)] bg-[var(--co-white)]">
                <BrandImage src={recipe.image} alt={recipe.title} sizes="(min-width: 768px) 31vw, 92vw" aspect="landscape" fit="cover" hoverZoom className="rounded-none border-0" />
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--co-palm)]">{recipe.category} / {recipe.time}</p>
                  <h3 className="mt-3 text-3xl font-bold leading-[0.95] text-[var(--co-brown)]">{recipe.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--co-muted)]">{recipe.description}</p>
                </div>
              </article>
            </Link>
          </MotionSection>
        ))}
      </BentoGrid>
    </SectionShell>
  );
}
