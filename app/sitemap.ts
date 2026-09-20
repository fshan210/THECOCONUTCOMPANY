import type { MetadataRoute } from "next";
import { getProducts, getRecipes } from "@/lib/content/server";
import { buildSitemapUrls } from "@/lib/seo/routes";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, recipes] = await Promise.all([getProducts(), getRecipes()]);
  return buildSitemapUrls(products, recipes);
}
