import { getProducts, getRecipes } from "@/lib/content/server";
import { siteUrl } from "@/lib/seo/metadata";

export const revalidate = 3600;

function xml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '\"': "&quot;" })[character] || character);
}

function absolute(path: string) {
  return path.startsWith("http") ? path : `${siteUrl}${path}`;
}

export async function GET() {
  const [products, recipes] = await Promise.all([getProducts(), getRecipes()]);
  const entries = [
    ...products.map((product) => ({ page: `/shop/${product.slug}`, image: product.image, title: product.name })),
    ...recipes.map((recipe) => ({ page: `/recipes/${recipe.slug}`, image: recipe.image, title: recipe.title }))
  ];
  const body = entries.map((entry) => `<url><loc>${xml(`${siteUrl}${entry.page}`)}</loc><image:image><image:loc>${xml(absolute(entry.image))}</image:loc><image:title>${xml(entry.title)}</image:title></image:image></url>`).join("");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${body}</urlset>`, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" }
  });
}
