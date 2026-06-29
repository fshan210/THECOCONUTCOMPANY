import type { MetadataRoute } from "next";

const siteUrl = "https://cothecoconutcompany.com";

const routes = [
  "",
  "/about",
  "/sustainability",
  "/founders",
  "/journal",
  "/contact",
  "/shop",
  "/shop/co-water",
  "/shop/melt-co-mango-coconut",
  "/shop/co-kitchen-coconut-oil",
  "/shop/co-botanica-coconut-care",
  "/shop/co-lifestyle",
  "/recipes"
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8
  }));
}
