import { getRecipes } from "@/lib/content/server";
import type { Metadata } from "next";
import { CartPage } from "@/components/cart/CartPage";
import { ResponsiveImage as Image } from "@/components/media/ResponsiveImage";
import { CommerceLink } from "@/components/commerce/Primitives";
import { createPageMetadata } from "@/lib/seo/metadata";
import { Suspense } from "react";

export const metadata: Metadata = createPageMetadata({
  title: "Cart",
  description: "Your .CO cart.",
  path: "/cart",
  index: false,
});

async function CartRecipe() {
  const recipes = await getRecipes();
  const recipe =
    recipes.find((r) => r.relatedProduct === "co-kitchen-coconut-milk") ??
    recipes[0];
  if (!recipe) return null;
  return (
    <section className="cm-panel cm-cart-recipe">
      <div className="cm-recipe-image">
        <Image src={recipe.image} alt={recipe.title} fill sizes="(max-width:600px) 85vw, 260px" className="object-cover" />
      </div>
      <div>
        <p className="cm-eyebrow">From the recipe collection</p>
        <h2>{recipe.title}</h2>
        <p>{recipe.description}</p>
        <CommerceLink href={`/recipes/${recipe.slug}`}>View recipe</CommerceLink>
      </div>
    </section>
  );
}

export default function CartRoute() {
  return <CartPage recipe={<Suspense fallback={null}><CartRecipe /></Suspense>} />;
}
