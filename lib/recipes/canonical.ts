import { recipes as canonicalRecipes, type RecipeItem } from "@/components/recipes/recipe-data";
import type { ContentRecipe } from "@/lib/content/types";

export type RecipeIdentity = {
  recipeId: string;
  slug: string;
};

export const canonicalRecipeIdentities: RecipeIdentity[] = canonicalRecipes.map((recipe) => ({
  recipeId: recipe.slug,
  slug: recipe.slug,
}));

const canonicalByIdentity = new Map(
  canonicalRecipeIdentities.flatMap((identity) => [
    [identity.recipeId, identity] as const,
    [identity.slug, identity] as const,
  ]),
);

export function resolveRecipeIdentity(value: string): RecipeIdentity | null {
  return canonicalByIdentity.get(value) ?? null;
}

export function asContentRecipe(recipe: RecipeItem, featured = false): ContentRecipe {
  const time = `${recipe.time} min`;
  const product = recipe.products[0]?.name ?? ".CO Coconut Water";
  return {
    id: recipe.slug,
    slug: recipe.slug,
    title: recipe.title,
    category: recipe.category,
    description: recipe.description,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    prepTime: time,
    cookTime: "",
    servings: "",
    time,
    difficulty: recipe.difficulty,
    nutrition: recipe.nutrition.join(", "),
    image: recipe.image,
    relatedProduct: product,
    product,
    seo: {
      title: recipe.title,
      description: recipe.description,
      canonicalPath: `/recipes/${recipe.slug}`,
      ogImage: recipe.image,
    },
    publicationStatus: "published",
    featured,
  };
}

export function mergeCanonicalRecipes(recipes: ContentRecipe[]): ContentRecipe[] {
  const merged = new Map(recipes.map((recipe) => [recipe.slug, recipe]));
  canonicalRecipes.forEach((recipe, index) => merged.set(recipe.slug, asContentRecipe(recipe, index === 0)));
  return Array.from(merged.values());
}

export function resolveSavedRecipe(
  persistedId: string,
  recipes: ContentRecipe[],
): { persistedId: string; recipe: ContentRecipe } | null {
  const identity = resolveRecipeIdentity(persistedId);
  const canonicalSlug = identity?.slug ?? persistedId;
  const recipe = recipes.find((candidate) => candidate.slug === canonicalSlug || candidate.id === canonicalSlug);
  return recipe ? { persistedId, recipe } : null;
}
