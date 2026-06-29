import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/content/server";

const siteUrl = "https://cothecoconutcompany.com";

const routes = [
  "",
  "/about",
  "/sustainability",
  "/founders",
  "/journal",
  "/contact",
  "/shop",
  "/recipes"
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productRoutes = (await getProducts()).map((product) => `/shop/${product.slug}`);
  return [...routes, ...productRoutes].map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8
  }));
}
