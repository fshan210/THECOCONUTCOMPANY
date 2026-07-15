import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecipeDetailPage } from "@/components/recipes/RecipeDetailPage";
import { recipes } from "@/components/recipes/recipe-data";
import { createPageMetadata } from "@/lib/seo/metadata";
import { StructuredData } from "@/components/seo/StructuredData";
import { recipeSchema } from "@/lib/seo/structured-data";

export function generateStaticParams() {
  return recipes.map((recipe) => ({ slug: recipe.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const recipe = recipes.find((item) => item.slug === slug);
  if (!recipe) return {};
  return createPageMetadata({ title: recipe.title, description: recipe.description, path: `/recipes/${recipe.slug}`, ogImage: recipe.image });
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = recipes.find((item) => item.slug === slug);
  if (!recipe) notFound();
  return (
    <>
      <StructuredData
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Recipes", path: "/recipes" }, { name: recipe.title, path: `/recipes/${recipe.slug}` }]}
        extra={[recipeSchema({
          title: recipe.title,
          description: recipe.description,
          image: recipe.image,
          time: String(recipe.time),
          difficulty: recipe.difficulty,
          category: recipe.category,
          product: recipe.products.map((product) => product.name).join(", "),
          slug: recipe.slug,
          ingredients: recipe.ingredients,
          steps: recipe.steps,
          prepTime: String(recipe.time),
          cookTime: "",
          servings: "",
          nutrition: recipe.nutrition.join(", ")
        })]}
      />
      <RecipeDetailPage recipe={recipe} />
    </>
  );
}
