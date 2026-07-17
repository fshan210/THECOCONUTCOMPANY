import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecipeDetailPage } from "@/components/recipes/RecipeDetailPage";
import { recipes as referenceRecipes, type RecipeItem } from "@/components/recipes/recipe-data";
import { createPageMetadata } from "@/lib/seo/metadata";
import { StructuredData } from "@/components/seo/StructuredData";
import { recipeSchema } from "@/lib/seo/structured-data";
import { getRecipes } from "@/lib/content/server";
import type { ContentRecipe } from "@/lib/content/types";

function asReferenceRecipe(recipe: ContentRecipe): RecipeItem {
  const minutes = Number.parseInt(recipe.time || recipe.prepTime || "10", 10) || 10;
  return {
    slug: recipe.slug, title: recipe.title, category: recipe.category, time: minutes, difficulty: recipe.difficulty,
    image: recipe.image, description: recipe.description,
    products: [{ name: recipe.relatedProduct || recipe.product || ".CO Coconut Water", detail: "Made for living", image: "/assets/shop/products/IndividualProduct_CO-Water.png", slug: "co-water" }],
    variations: [{ name: "Plant-forward", detail: "Adjust ingredients to your dietary needs." }],
    ingredients: recipe.ingredients, steps: recipe.steps, nutrition: [recipe.nutrition].filter(Boolean)
  };
}

async function findRecipe(slug: string) {
  const reference = referenceRecipes.find((item) => item.slug === slug);
  if (reference) return reference;
  const content = (await getRecipes()).find((item) => item.slug === slug);
  return content ? asReferenceRecipe(content) : null;
}

export async function generateStaticParams() {
  const content = await getRecipes();
  return Array.from(new Set([...referenceRecipes.map((r)=>r.slug), ...content.map((r)=>r.slug)])).map((slug)=>({slug}));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const recipe = await findRecipe((await params).slug);
  return recipe ? createPageMetadata({ title: recipe.title, description: recipe.description, path: `/recipes/${recipe.slug}`, ogImage: recipe.image }) : {};
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const recipe = await findRecipe((await params).slug);
  if (!recipe) notFound();
  return <><StructuredData breadcrumbs={[{name:"Home",path:"/"},{name:"Recipes",path:"/recipes"},{name:recipe.title,path:`/recipes/${recipe.slug}`}]} extra={[recipeSchema({ title:recipe.title,description:recipe.description,image:recipe.image,time:String(recipe.time),difficulty:recipe.difficulty,category:recipe.category,product:recipe.products.map((p)=>p.name).join(", "),slug:recipe.slug,ingredients:recipe.ingredients,steps:recipe.steps,prepTime:String(recipe.time),cookTime:"",servings:"",nutrition:recipe.nutrition.join(", ") })]}/><RecipeDetailPage recipe={recipe}/></>;
}
