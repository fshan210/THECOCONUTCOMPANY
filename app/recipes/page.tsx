import type { Metadata } from "next";
import { BentoCard, BillboardWord, CTAButton, IngredientBadge, MotionSection, RitualCard } from "@/components/brand/BrandPrimitives";
import { StructuredData } from "@/components/seo/StructuredData";
import { recipes } from "@/lib/catalog";
import { createPageMetadata } from "@/lib/seo/metadata";
import { recipeSchema } from "@/lib/seo/structured-data";

export const metadata: Metadata = createPageMetadata({
  title: "Recipes",
  description: "Coconut water drinks, smoothie bowls, and simple everyday recipes using .CO products.",
  path: "/recipes"
});

export default function RecipesPage() {
  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Recipes", path: "/recipes" }]} extra={recipes.map(recipeSchema)} />
      <section className="co-section bg-[var(--co-cream)] pt-24 md:pt-32">
        <div className="co-container">
          <MotionSection>
            <BillboardWord word="RECIPES" className="co-display-section text-[var(--co-brown)]/[0.08]" />
          </MotionSection>
          <MotionSection className="mt-4 max-w-5xl md:-mt-3">
            <h1 className="text-[clamp(36px,9vw,132px)] font-bold leading-[0.84] text-[var(--co-ink)]">
              Make the product repeatable.
            </h1>
            <p className="co-body mt-7 max-w-2xl">Simple coconut rituals for breakfast, heat, cafe-style drinks, and small hosting moments.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {["Coconut water", "Smoothies", "Dessert", "Cold coffee"].map((tag, index) => (
                <IngredientBadge key={tag} tone={index === 0 ? "sun" : "cream"}>{tag}</IngredientBadge>
              ))}
            </div>
          </MotionSection>
        </div>
      </section>

      <section className="co-section bg-[var(--co-white)]">
        <div className="co-container grid gap-4 md:grid-cols-3">
          {recipes.map((recipe, index) => (
            <MotionSection key={recipe.slug} delay={index * 0.05}>
              <div id={recipe.slug}>
                <RitualCard title={recipe.title} body={recipe.description} image={recipe.image} label={`${recipe.category} / ${recipe.time}`} className="h-full" />
              </div>
            </MotionSection>
          ))}
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
