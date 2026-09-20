import { TrackingSurface } from "@/components/commerce/TrackingSurface";
import { commerceProductImage } from "@/lib/commerce-assets";
import { InformationSurface } from "@/components/commerce/InformationSurface";
import { CheckoutSurface } from "@/components/commerce/CheckoutSurface";
import {
  SearchSurface,
  type SearchEntry,
} from "@/components/commerce/SearchSurface";
import { getProducts, getRecipes, getJournalPosts } from "@/lib/content/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UtilityPage } from "@/components/launch/UtilityPage";
import { launchPages, launchPageSlugs, visibleFaqItemsForPage } from "@/lib/launch-pages";
import { createPageMetadata } from "@/lib/seo/metadata";
import { StructuredData } from "@/components/seo/StructuredData";
import { faqSchema } from "@/lib/seo/structured-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return launchPageSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = launchPages[slug];
  if (!page) notFound();
  const index = !["cart", "checkout", "track-order", "search", "payment"].includes(slug);
  return createPageMetadata({
    title: page.title,
    description: page.intro,
    path: `/${slug}`,
    index,
    follow: slug === "search",
  });
}

export default async function LaunchUtilityRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = launchPages[slug];
  if (!page) notFound();
  const indexable = !["cart", "checkout", "track-order", "search", "payment"].includes(slug);
  const schemas = indexable ? (
    <StructuredData
      breadcrumbs={[{ name: "Home", path: "/" }, { name: page.eyebrow, path: `/${slug}` }]}
      extra={slug === "faqs" || slug === "support" ? [faqSchema(
        visibleFaqItemsForPage(slug).map(({ title, body }) => ({ question: title, answer: body })),
        `/${slug}`,
      )] : []}
    />
  ) : null;
  if (slug === "track-order") return <TrackingSurface />;
  if (slug === "checkout") return <CheckoutSurface />;
  if (
    [
      "support",
      "faqs",
      "shipping-delivery",
      "returns",
      "refund-policy",
      "privacy-policy",
      "cookie-policy",
      "terms-and-conditions",
      "terms",
    ].includes(slug)
  )
    return <>{schemas}<InformationSurface slug={slug} /></>;
  if (slug === "search") {
    const [products, recipes, journal] = await Promise.all([
      getProducts(),
      getRecipes(),
      getJournalPosts(),
    ]);
    const entries: SearchEntry[] = [
      ...products.map((p) => ({
        id: `product:${p.slug}`,
        title: p.name,
        description: p.shortDescription,
        kind: "Products" as const,
        category: p.category,
        image: commerceProductImage(p.slug, p.image),
        href: `/shop/${p.slug}`,
        price: p.price,
        cartSlug: p.availabilityStatus === "out-of-stock" ? undefined : p.slug,
        availabilityStatus: p.availabilityStatus,
      })),
      ...recipes.map((r) => ({
        id: `recipe:${r.slug}`,
        title: r.title,
        description: r.description,
        kind: "Recipes" as const,
        category: r.category,
        image: r.image,
        href: `/recipes/${r.slug}`,
      })),
      ...journal.map((j) => ({
        id: `journal:${j.slug}`,
        title: j.title,
        description: j.excerpt,
        kind: "Journal" as const,
        category: j.category,
        image: j.image,
        href: `/journal?story=${encodeURIComponent(j.slug)}`,
      })),
    ];
    return <SearchSurface entries={entries} />;
  }
  return <>{schemas}<UtilityPage page={page} /></>;
}
