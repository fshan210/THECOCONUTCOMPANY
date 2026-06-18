import Image from "next/image";
import type { Metadata } from "next";
import { CoconutSliceDoodle, FloatingDoodleLayer } from "@/components/BrandDoodles";
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
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fffdf8_0%,#F5EBD7_52%,rgba(216,192,122,0.22)_100%)] px-5 py-20 md:px-8 md:py-24">
        <FloatingDoodleLayer density="light" />
        <CoconutSliceDoodle className="co-brand-doodle absolute left-5 top-10 hidden w-36 text-coconut md:block" />
        <SectionHeader
          kicker="Recipes"
          title="Coconut rituals for modern living."
          body="Editorial recipe ideas for drinks, desserts, everyday kitchen use and gentle wellness rituals."
        />
        <div className="mx-auto mb-10 flex max-w-7xl flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <span key={category} className="co-neu co-soft-depth-hover px-4 py-3 text-xs uppercase tracking-editorial text-muted">
              {category}
            </span>
          ))}
        </div>
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe, index) => (
            <Reveal key={recipe.slug} delay={index * 0.04}>
              <article id={recipe.slug} className="co-glass co-soft-depth-hover h-full p-4">
                <div className="relative mb-6 aspect-[4/3] overflow-hidden bg-shell">
                  <Image src={recipe.image} alt={recipe.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-700 hover:scale-[1.03]" />
                </div>
                <p className="mb-3 text-[0.65rem] uppercase tracking-editorial text-grove">
                  {recipe.category} / {recipe.time} / {recipe.difficulty}
                </p>
                <h2 className="font-display text-3xl text-ink">{recipe.title}</h2>
                <p className="mt-4 text-sm leading-7 text-muted">{recipe.description}</p>
                <div className="mt-6 border-t border-shell pt-5">
                  <p className="mb-3 text-[0.62rem] uppercase tracking-editorial text-grove">Ingredients</p>
                  <div className="flex flex-wrap gap-2">
                    {recipe.ingredients.map((ingredient) => (
                      <span key={ingredient} className="co-neu-inset px-3 py-2 text-xs text-coconut">
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mt-6 text-xs uppercase tracking-editorial text-coconut">Product used: {recipe.product}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
