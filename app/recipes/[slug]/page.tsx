import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecipeDetailPage } from "@/components/recipes/RecipeDetailPage";
import { recipes } from "@/components/recipes/recipe-data";
import { createPageMetadata } from "@/lib/seo/metadata";

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
  return <RecipeDetailPage recipe={recipe} />;
}
