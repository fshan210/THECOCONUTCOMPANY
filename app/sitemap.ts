import type { MetadataRoute } from "next";
import { getProducts, getRecipes } from "@/lib/content/server";

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
  "/recipes",
  "/faqs",
  "/shipping-delivery",
  "/returns",
  "/refund-policy",
  "/privacy-policy",
  "/cookie-policy",
  "/terms-and-conditions",
  "/careers",
  "/community",
  "/support"
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, recipes] = await Promise.all([getProducts(), getRecipes()]);
  const productRoutes = products.map((product) => `/shop/${product.slug}`);
  const recipeRoutes = recipes.map((recipe) => `/recipes/${recipe.slug}`);
  return [...routes, ...productRoutes, ...recipeRoutes].map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : ["/shop","/recipes","/journal"].includes(route) ? 0.9 : route.startsWith("/shop/") || route.startsWith("/recipes/") ? 0.8 : 0.7,
    lastModified: new Date()
  }));
}
