"use client";

import { BentoCard, BillboardWord, CTAButton, IngredientBadge, MotionSection, ProductMarquee, ProductTile, RitualCard, SplitStoryPanel } from "@/components/brand/BrandPrimitives";
import { BrandImage } from "@/components/BrandImage";
import { recipes, shopProducts } from "@/lib/catalog";
import { publicAssets } from "@/lib/public-assets";

const rituals = [
  {
    label: "Breakfast",
    title: "Morning chill",
    body: "A cold coconut water start for fruit bowls, quick commutes, and first-light kitchens.",
    image: publicAssets.recipes.bowl
  },
  {
    label: "Gym",
    title: "Post-sweat reset",
    body: "Clean refreshment after movement, made simple enough to keep in the fridge.",
    image: publicAssets.water.lifestyle
  },
  {
    label: "Work",
    title: "Desk bottle",
    body: "A better beverage cue for the workday: cold, light, and easy to return to.",
    image: publicAssets.water.flatLay
  },
  {
    label: "Beach",
    title: "Heat relief",
    body: "Coconut water language built for sun, salt, and warm-day rituals.",
    image: publicAssets.generated.compositionPoolside
  },
  {
    label: "Cafe",
    title: "Coconut coffee",
    body: "A cafe-style coconut coffee chill for a product world that reaches beyond the bottle.",
    image: publicAssets.recipes.coffee
  }
];

export function ProductBentoSection() {
  const water = shopProducts[0];
  const melt = shopProducts[1];

  return (
    <section className="co-section bg-[var(--co-cream)]">
      <div className="co-container">
        <MotionSection className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="co-label mb-5">Product shelf</p>
            <h2 className="co-h2 max-w-4xl text-[var(--co-ink)]">Two hero products. One coconut house.</h2>
          </div>
          <CTAButton href="/shop" variant="outline">View shelf</CTAButton>
        </MotionSection>
        <div className="co-grid-12">
          <MotionSection className="lg:col-span-7">
            <ProductTile
              title={water.name}
              eyebrow="Coconut water"
              body={water.shortDescription}
              image={water.image}
              hoverImage={water.hoverImage}
              href="/shop/co-water"
              word="WATER"
              trust={["Serve chilled", "Tender coconut", "Daily fridge"]}
            />
          </MotionSection>
          <MotionSection delay={0.08} className="mt-4 lg:col-span-5 lg:mt-0">
            <ProductTile
              title="MELT.CO"
              eyebrow="Coconut frozen dessert"
              body={melt.shortDescription}
              image={melt.image}
              hoverImage={melt.hoverImage}
              href="/shop/melt-co-mango-coconut"
              word="MELT"
              trust={["Coconut-led", "Mango bright", "Keep frozen"]}
            />
          </MotionSection>
        </div>
      </div>
    </section>
  );
}

export function TrustCueStrip() {
  return (
    <section className="border-y border-[var(--co-border)] bg-[var(--co-white)] py-5">
      <div className="co-container grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["01", "Tender coconut taste", "Built around a cold, clean drinking ritual."],
          ["02", "No loud claims", "Simple product language shoppers can trust."],
          ["03", "Coconut family", "Water, dessert, kitchen, care, and living."],
          ["04", "Shelf ready", "Packshot-first visuals with clear use moments."]
        ].map(([number, title, body]) => (
          <div key={title} className="rounded-[28px] border border-[var(--co-border)] bg-[var(--co-cream)] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--co-palm)]">{number}</p>
            <h2 className="mt-5 text-3xl font-bold leading-none text-[var(--co-brown)]">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--co-muted)]">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function OriginStorySection() {
  return (
    <section className="co-section bg-[var(--co-white)]">
      <SplitStoryPanel
        eyebrow="Origin system"
        title="From Kerala grove to a colder, clearer coconut moment."
        body="The story is practical: coconut source, village collection, clean processing, bottling, and a cold consumer ritual. Premium does not need to feel distant."
        image={publicAssets.journey.grove}
        word="GROVE"
      />
      <div className="co-container mt-6 grid gap-4 md:grid-cols-4">
        {[
          ["Kerala source", publicAssets.brand.harvest],
          ["Village collection", publicAssets.journey.aggregation],
          ["Processing", publicAssets.journey.processing],
          ["Bottling", publicAssets.water.floating]
        ].map(([title, image], index) => (
          <MotionSection key={title} delay={index * 0.04}>
            <BentoCard className="co-press h-full">
              <BrandImage src={image} alt={title} sizes="(min-width: 768px) 25vw, 92vw" aspect="landscape" fit={title === "Bottling" ? "contain" : "cover"} hoverZoom className="mb-5 rounded-[28px]" />
              <p className="co-label">0{index + 1}</p>
              <h3 className="mt-3 text-3xl font-bold text-[var(--co-brown)]">{title}</h3>
            </BentoCard>
          </MotionSection>
        ))}
      </div>
    </section>
  );
}

export function TasteRitualGrid() {
  return (
    <section className="co-section bg-[var(--co-cream)]">
      <div className="co-container">
        <MotionSection className="mb-10">
          <BillboardWord word="CHILL" className="co-display-section text-[var(--co-brown)]/[0.09]" />
          <h2 className="co-h2 -mt-4 max-w-5xl text-[var(--co-ink)]">Rituals that sell the product before the claim.</h2>
        </MotionSection>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rituals.map((ritual, index) => (
            <MotionSection key={ritual.title} delay={index * 0.04} className={index === 0 ? "lg:col-span-2" : ""}>
              <RitualCard {...ritual} className="h-full" />
            </MotionSection>
          ))}
        </div>
      </div>
    </section>
  );
}

export function IngredientHonestySection() {
  return (
    <section className="co-section bg-[var(--co-black)] text-[var(--co-white)]">
      <div className="co-container">
        <MotionSection className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="co-label mb-5 text-[var(--co-sun)]">Ingredient honesty</p>
            <h2 className="co-display-section max-w-5xl text-[var(--co-white)]">Coconut first. Cold always.</h2>
          </div>
          <p className="text-lg leading-8 text-white/68">
            No loud claims. Just clear product language around coconut water, clean processing, cold refreshment, and shelf-worthy design.
          </p>
        </MotionSection>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            ["Coconut-first", "Product ideas start with a coconut ritual people already understand."],
            ["Clean processing", "The consumer sees clarity: taste, coldness, format, and use."],
            ["Retail ready", "Packshot, shelf logic, and easy purchase intent guide the shelf."],
          ].map(([title, body], index) => (
            <MotionSection key={title} delay={index * 0.05}>
              <BentoCard tone={index === 1 ? "sun" : "dark"} className="h-full">
                <p className="text-[clamp(56px,8vw,112px)] font-bold leading-none opacity-20">0{index + 1}</p>
                <h3 className="mt-8 text-4xl font-bold leading-none">{title}</h3>
                <p className={`mt-5 text-base leading-7 ${index === 1 ? "text-[var(--co-brown)]/72" : "text-white/68"}`}>{body}</p>
              </BentoCard>
            </MotionSection>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RetailDistributorCTA() {
  return (
    <section className="co-section bg-[var(--co-white)]">
      <div className="co-container">
        <BentoCard className="grid gap-8 p-6 md:p-10 lg:grid-cols-[1fr_0.72fr] lg:items-center">
          <div>
            <p className="co-label mb-5">Retail / distributor</p>
            <h2 className="co-h2 max-w-4xl text-[var(--co-brown)]">Built for cold shelves, modern aisles, and everyday repeat.</h2>
            <p className="co-body mt-7 max-w-2xl">For customers, it is a better coconut moment. For trade partners, it is a focused product world with clear consumer use cases.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CTAButton href="/register">Join early access</CTAButton>
              <CTAButton href="/products" variant="outline">See product family</CTAButton>
            </div>
          </div>
          <BrandImage src={publicAssets.water.flatLay} alt=".CO coconut water retail flat lay" sizes="(min-width: 1024px) 34vw, 92vw" aspect="landscape" fit="cover" hoverZoom className="rounded-[36px]" />
        </BentoCard>
      </div>
    </section>
  );
}

export function BrandWorldTeaser() {
  return (
    <section className="co-section bg-[var(--co-cream)]">
      <div className="co-container">
        <MotionSection className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="co-label mb-5">Brand world</p>
            <h2 className="co-h2 max-w-4xl text-[var(--co-ink)]">Recipes and lifestyle make the product repeatable.</h2>
          </div>
          <CTAButton href="/recipes" variant="outline">Open recipes</CTAButton>
        </MotionSection>
        <div className="grid gap-4 md:grid-cols-3">
          {recipes.map((recipe, index) => (
            <MotionSection key={recipe.slug} delay={index * 0.05}>
              <RitualCard title={recipe.title} body={recipe.description} image={recipe.image} label={recipe.category} className="h-full" />
            </MotionSection>
          ))}
        </div>
      </div>
      <div className="mt-16">
        <ProductMarquee words={["COCONUT", "WATER", "MELT", "GROVE", "CHILL"]} />
      </div>
    </section>
  );
}
