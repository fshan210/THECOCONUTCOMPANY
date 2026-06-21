import type { Metadata } from "next";
import { BrandImage } from "@/components/BrandImage";
import { BentoCard, CTAButton, DoodleIcon, MotionSection, TrustBadge } from "@/components/brand/BrandPrimitives";
import type { DoodleName } from "@/components/brand/BrandPrimitives";
import { StructuredData } from "@/components/seo/StructuredData";
import { recipes } from "@/lib/catalog";
import { publicAssets } from "@/lib/public-assets";
import { createPageMetadata } from "@/lib/seo/metadata";
import { recipeSchema } from "@/lib/seo/structured-data";

export const metadata: Metadata = createPageMetadata({
  title: "Recipes",
  description: "Coconut water drinks, smoothie bowls, and simple everyday recipes using .CO products.",
  path: "/recipes"
});

export default function RecipesPage() {
  const featured = recipes[0];
  const browseItems: Array<{ label: string; icon: DoodleName }> = [
    { label: "Breakfast", icon: "bowl" },
    { label: "Lunch", icon: "leaf" },
    { label: "Dinner", icon: "coconut" },
    { label: "Drinks", icon: "drop" },
    { label: "Desserts", icon: "cold" },
    { label: "Snacks", icon: "wave" }
  ];

  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Recipes", path: "/recipes" }]} extra={recipes.map(recipeSchema)} />
      <section className="bg-[var(--co-cream)] pt-8 md:pt-12">
        <div className="co-container">
          <div className="grid min-h-[560px] overflow-hidden rounded-[32px] border border-[var(--co-border)] bg-[var(--co-white)] lg:grid-cols-[0.9fr_1.1fr]">
            <div className="flex flex-col justify-center p-6 md:p-10">
              <h1 className="co-display-section text-[var(--co-ink)]">RECIPES</h1>
              <h2 className="mt-5 text-[clamp(26px,3vw,42px)] font-bold leading-tight text-[var(--co-palm)]">
                Goodness you can taste.
              </h2>
              <p className="mt-6 max-w-[34ch] text-base leading-7 text-[var(--co-muted)] [overflow-wrap:anywhere]">
                Simple, delicious recipes made better with real coconut. For every moment, every mood.
              </p>
              <div className="mt-8">
                <CTAButton href="#featured-recipe">Explore recipes</CTAButton>
              </div>
            </div>
            <BrandImage
              src={publicAssets.water.hero}
              alt=".CO coconut water with fresh coconut for recipes"
              sizes="(min-width: 1024px) 54vw, 92vw"
              aspect="wide"
              fit="cover"
              position="center"
              priority
              hoverZoom
              className="h-full min-h-[430px] rounded-none border-0"
            />
          </div>

          <div className="grid gap-4 border-b border-[var(--co-border)] bg-[var(--co-white)] px-4 py-6 sm:grid-cols-3 lg:grid-cols-6">
            {browseItems.map(({ label, icon }) => (
              <div key={label} className="flex flex-col items-center gap-3 text-center">
                <DoodleIcon name={icon} className="h-9 w-9 text-[var(--co-palm)]" />
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--co-brown)]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="featured-recipe" className="co-section bg-[var(--co-cream)]">
        <div className="co-container">
          <div className="grid gap-4 lg:grid-cols-[0.78fr_1.22fr]">
            <MotionSection>
              <BentoCard className="flex h-full min-h-[360px] flex-col justify-between bg-[var(--co-white)]">
                <div>
                  <p className="co-label mb-4">Featured recipe</p>
                  <h2 className="co-h2 text-[var(--co-brown)]">{featured.title}</h2>
                  <p className="mt-5 max-w-xl text-base leading-7 text-[var(--co-muted)]">{featured.description}</p>
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <TrustBadge icon="drop" title={featured.product} body="Product used" />
                  <TrustBadge icon="cold" title={featured.time} body="Easy prep" />
                </div>
              </BentoCard>
            </MotionSection>
            <MotionSection delay={0.08}>
              <BrandImage
                src={featured.image}
                alt={`${featured.title} with coconut water`}
                sizes="(min-width: 1024px) 58vw, 92vw"
                aspect="wide"
                fit="cover"
                position="center"
                hoverZoom
                className="h-full min-h-[360px] rounded-[32px]"
              />
            </MotionSection>
          </div>
        </div>
      </section>

      <section className="co-section bg-[var(--co-white)]">
        <div className="co-container">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="co-label mb-4">Recipe shelf</p>
              <h2 className="co-h2 text-[var(--co-brown)]">Cold coconut ideas that sell the ritual.</h2>
            </div>
            <CTAButton href="/shop/co-water" variant="outline">Shop .CO Water</CTAButton>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {recipes.map((recipe, index) => (
              <MotionSection key={recipe.slug} delay={index * 0.05}>
                <article id={recipe.slug} className="co-press h-full overflow-hidden rounded-[24px] border border-[var(--co-border)] bg-[var(--co-white)]">
                  <BrandImage
                    src={recipe.image}
                    alt={`${recipe.title} recipe`}
                    sizes="(min-width: 768px) 31vw, 92vw"
                    aspect="landscape"
                    fit="cover"
                    hoverZoom
                    className="rounded-none border-0"
                  />
                  <div className="p-5">
                    <p className="co-label mb-4">{recipe.category} / {recipe.time}</p>
                    <h3 className="text-[clamp(30px,3.5vw,46px)] font-bold leading-[0.92] text-[var(--co-brown)]">{recipe.title}</h3>
                    <p className="mt-4 text-sm leading-6 text-[var(--co-muted)]">{recipe.description}</p>
                  </div>
                </article>
              </MotionSection>
            ))}
          </div>
        </div>
      </section>

      <section className="co-section bg-[var(--co-cream)]">
        <div className="co-container">
          <BentoCard tone="dark" className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="co-label mb-5 text-[var(--co-sun)]">Product used</p>
              <h2 className="co-h2">Every recipe points back to a cold .CO moment.</h2>
            </div>
            <CTAButton href="/shop/co-water" variant="light">Shop .CO Water</CTAButton>
          </BentoCard>
        </div>
      </section>
    </>
  );
}
