import type { Metadata } from "next";
import { ReferenceRecipesPage } from "@/components/recipes/ReferenceRecipesPage";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";
import { collectionPageSchema } from "@/lib/seo/structured-data";
import { getRecipes, getSeoMetadata } from "@/lib/content/server";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("/recipes");
  return createPageMetadata({ title: seo?.title || "Recipes", description: seo?.description || "Coconut water drinks, smoothie bowls, and simple everyday recipes using .CO products.", path: seo?.canonicalPath || "/recipes", index: !seo?.noindex, ogImage: seo?.ogImage });
}

export default async function RecipesPage() {
  const recipes = await getRecipes();

  return (
    <>
      <StructuredData
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Recipes", path: "/recipes" }]}
        extra={[collectionPageSchema({
          name: ".CO coconut recipes",
          description: "Coconut water drinks, smoothie bowls, and simple everyday recipes using .CO products.",
          path: "/recipes",
          items: recipes.map((recipe) => ({
            name: recipe.title,
            description: recipe.description,
            image: recipe.image,
            path: `/recipes/${recipe.slug}`,
          })),
        })]}
      />
      <ReferenceRecipesPage />
    </>
  );
}
