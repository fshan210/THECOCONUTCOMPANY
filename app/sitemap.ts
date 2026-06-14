import type { MetadataRoute } from "next";

const siteUrl = "https://cothecoconutcompany.com";

const routes = [
  "",
  "/about",
  "/products",
  "/sustainability",
  "/founders",
  "/journal",
  "/shop",
  "/shop/co-water",
  "/shop/melt-co-mango-coconut",
  "/shop/co-kitchen-coconut-oil",
  "/shop/co-botanica-coconut-care",
  "/recipes",
  "/sign-in",
  "/sign-up",
  "/account"
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8
  }));
}
