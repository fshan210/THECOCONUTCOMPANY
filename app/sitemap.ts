import type { MetadataRoute } from "next";
import { recipes } from "@/components/recipes/recipe-data";
import { getProducts } from "@/lib/content/server";

const siteUrl = "https://cothecoconutcompany.com";

const routes = [
  "",
  "/about",
  "/sustainability",
  "/founders",
  "/journal",
  "/journal/social-cocreation-hub",
  "/contact",
  "/shop",
  "/recipes"
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productRoutes = (await getProducts()).map((product) => `/shop/${product.slug}`);
  const recipeRoutes = recipes.map((recipe) => `/recipes/${recipe.slug}`);
  return [...routes, ...productRoutes, ...recipeRoutes].map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8
  }));
}
