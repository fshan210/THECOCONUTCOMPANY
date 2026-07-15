import { getJournalPosts } from "@/lib/content/server";
import { siteUrl } from "@/lib/seo/metadata";

export const revalidate = 3600;

function xml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '\"': "&quot;" })[character] || character);
}

export async function GET() {
  const cutoff = Date.now() - 2 * 24 * 60 * 60 * 1000;
  const recent = (await getJournalPosts()).filter((post) => {
    const time = Date.parse(post.publishedDate);
    return Number.isFinite(time) && time >= cutoff;
  });
  const body = recent.map((post) => `<url><loc>${xml(`${siteUrl}/journal#${post.slug}`)}</loc><news:news><news:publication><news:name>.CO Journal</news:name><news:language>en</news:language></news:publication><news:publication_date>${xml(new Date(post.publishedDate).toISOString())}</news:publication_date><news:title>${xml(post.title)}</news:title></news:news></url>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${body}</urlset>`, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" }
  });
}
