import Image from "next/image";
import type { Metadata } from "next";
import { Appear } from "@/components/motion/Appear";
import { DoodleImage, PublicHeader, PublicSection } from "@/components/PublicDesign";
import { StructuredData } from "@/components/seo/StructuredData";
import { recipes } from "@/lib/catalog";
import { createPageMetadata } from "@/lib/seo/metadata";
import { recipeSchema } from "@/lib/seo/structured-data";
import { publicAssets } from "@/lib/public-assets";

export const metadata: Metadata = createPageMetadata({
  title: "Recipes",
  description: "Coconut water drinks, smoothie bowls, and simple everyday recipes using .CO products.",
  path: "/recipes"
});

export default function RecipesPage() {
  const categories = ["Coconut water drinks", "Smoothies", "Desserts", "Everyday kitchen"];

  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Recipes", path: "/recipes" }]} extra={recipes.map(recipeSchema)} />
      <PublicSection className="pt-28 md:pt-32">
        <DoodleImage src={publicAssets.doodles.rawCoconut} className="left-5 top-24 h-32 w-32 md:h-52 md:w-52" />
        <PublicHeader kicker="Recipes" title="Coconut rituals for modern living." body="Simple, bright ideas for drinks, bowls, and small hosting moments." />
        <div className="mx-auto mb-10 flex max-w-7xl flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <span key={category} className="rounded-2xl border border-coconut/10 bg-[#fff8ea] px-4 py-3 text-xs font-medium uppercase tracking-editorial text-coconut/68">
              {category}
            </span>
          ))}
        </div>
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe, index) => (
            <Appear key={recipe.slug} delay={index * 0.04}>
              <article id={recipe.slug} className="h-full overflow-hidden rounded-3xl border border-coconut/10 bg-[#fff8ea] p-4 shadow-[0_18px_48px_rgba(62,46,31,0.06)] transition duration-500 hover:-translate-y-1">
                <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-2xl bg-paper">
                  <Image src={recipe.image} alt={recipe.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 92vw" className="object-cover transition duration-700 hover:scale-[1.03]" />
                </div>
                <p className="mb-3 text-[0.65rem] font-medium uppercase tracking-editorial text-grove">
                  {recipe.category} / {recipe.time} / {recipe.difficulty}
                </p>
                <h2 className="font-display text-3xl font-light text-coconut">{recipe.title}</h2>
                <p className="mt-4 text-sm leading-7 text-coconut/68">{recipe.description}</p>
                <div className="mt-6 border-t border-coconut/10 pt-5">
                  <p className="mb-3 text-[0.62rem] font-medium uppercase tracking-editorial text-grove">Ingredients</p>
                  <div className="flex flex-wrap gap-2">
                    {recipe.ingredients.map((ingredient) => (
                      <span key={ingredient} className="rounded-2xl border border-coconut/10 bg-paper px-3 py-2 text-xs text-coconut/72">
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mt-6 text-xs font-medium uppercase tracking-editorial text-coconut">Product used: {recipe.product}</p>
              </article>
            </Appear>
          ))}
        </div>
      </PublicSection>
    </>
  );
}
