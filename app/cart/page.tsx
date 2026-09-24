import { getRecipes } from "@/lib/content/server";
import type { Metadata } from "next";
import { CartPage } from "@/components/cart/CartPage";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Cart",
  description: "Your .CO cart.",
  path: "/cart",
  index: false,
});

export default async function CartRoute() {
  const recipes = await getRecipes();
  const recipe =
    recipes.find((r) => r.relatedProduct === "co-kitchen-coconut-milk") ??
    recipes[0];
  return (
    <CartPage
      recipe={
        recipe
          ? {
              title: recipe.title,
              description: recipe.description,
              image: recipe.image,
              slug: recipe.slug,
            }
          : undefined
      }
    />
  );
}
