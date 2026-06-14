import Image from "next/image";
import type { Metadata } from "next";
import { Reveal } from "@/components/Motion";
import { SectionHeader } from "@/components/SectionHeader";
import { StructuredData } from "@/components/seo/StructuredData";
import { recipes } from "@/lib/catalog";
import { createPageMetadata } from "@/lib/seo/metadata";
import { recipeSchema } from "@/lib/seo/structured-data";

export const metadata: Metadata = createPageMetadata({
  title: "Recipes",
  description: "Coconut water drinks, smoothies, desserts, kitchen ideas and wellness rituals using .CO products.",
  path: "/recipes"
});

export default function RecipesPage() {
  const categories = ["Coconut water drinks", "Smoothies", "Desserts", "Everyday kitchen", "Wellness rituals"];

  return (
    <>
      <StructuredData
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Recipes", path: "/recipes" }]}
        extra={recipes.map(recipeSchema)}
      />
      <section className="px-5 py-24 md:px-8">
        <SectionHeader
          kicker="Recipes"
          title="Coconut rituals for modern living."
          body="Editorial recipe ideas for drinks, desserts, everyday kitchen use and gentle wellness rituals."
        />
        <div className="mx-auto mb-10 flex max-w-7xl flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <span key={category} className="border border-shell bg-paper px-4 py-3 text-xs uppercase tracking-editorial text-muted">
              {category}
            </span>
          ))}
        </div>
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe, index) => (
            <Reveal key={recipe.slug} delay={index * 0.04}>
              <article id={recipe.slug} className="border border-shell bg-porcelain p-4">
                <div className="relative mb-6 aspect-[4/3] overflow-hidden bg-shell">
                  <Image src={recipe.image} alt={recipe.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover" />
                </div>
                <p className="mb-3 text-[0.65rem] uppercase tracking-editorial text-grove">
                  {recipe.category} / {recipe.time} / {recipe.difficulty}
                </p>
                <h2 className="font-display text-3xl text-ink">{recipe.title}</h2>
                <p className="mt-4 text-sm leading-7 text-muted">{recipe.description}</p>
                <p className="mt-6 text-xs uppercase tracking-editorial text-coconut">Product used: {recipe.product}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
