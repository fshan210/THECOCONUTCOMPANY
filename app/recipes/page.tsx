import type { Metadata } from "next";
import { BrandImage } from "@/components/BrandImage";
import { BentoCard, CTAButton, MotionSection, TrustBadge } from "@/components/brand/BrandPrimitives";
import { RecipeExplorer } from "@/components/RecipeExplorer";
import { StructuredData } from "@/components/seo/StructuredData";
import { publicAssets } from "@/lib/public-assets";
import { createPageMetadata } from "@/lib/seo/metadata";
import { recipeSchema } from "@/lib/seo/structured-data";
import { getRecipes, getSeoMetadata } from "@/lib/content/server";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("/recipes");
  return createPageMetadata({ title: seo?.title || "Recipes", description: seo?.description || "Coconut water drinks, smoothie bowls, and simple everyday recipes using .CO products.", path: seo?.canonicalPath || "/recipes", index: !seo?.noindex, ogImage: seo?.ogImage });
}

export default async function RecipesPage() {
  const recipes = await getRecipes();
  const featured = recipes[0];

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
              <div className="mt-8"><CTAButton href="#recipe-shelf">Explore recipes</CTAButton></div>
            </div>
            <div className="min-h-[430px] p-4 md:p-5">
              <BrandImage
                src={publicAssets.water.hero}
                alt=".CO coconut water with fresh coconut for recipes"
                sizes="(min-width: 1024px) 54vw, 92vw"
                aspect="wide"
                fit="cover"
                position="center"
                priority
                hoverZoom
                className="h-full min-h-[430px] rounded-[32px] border-0"
              />
            </div>
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

      <section id="recipe-shelf" className="co-section bg-[var(--co-white)]">
        <div className="co-container">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="co-label mb-4">Recipe shelf</p>
              <h2 className="co-h2 text-[var(--co-brown)]">One coconut. A whole table.</h2>
            </div>
            <CTAButton href="/shop/co-water" variant="outline">Shop .CO Water</CTAButton>
          </div>
          <RecipeExplorer recipes={recipes} />
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
