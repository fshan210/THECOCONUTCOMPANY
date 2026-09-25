import type { Metadata } from "next";
import { ReferenceHomePage } from "@/components/home/ReferenceHomePage";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getHomepageContent, getProducts, getRecipes, getTestimonials } from "@/lib/content/server";

export async function generateMetadata(): Promise<Metadata> {
  const started = performance.now();
  const { seo } = await getHomepageContent();
  if (process.env.VERCEL_ENV === "preview" || process.env.NODE_ENV === "development") {
    console.info("co-home-timing", JSON.stringify({ phase: "metadata", durationMs: Math.round((performance.now() - started) * 10) / 10 }));
  }
  return createPageMetadata({
    title: seo.title,
    description: seo.description,
    path: "/",
    absoluteTitle: true,
    index: !seo.noindex,
    ogImage: seo.ogImage
  });
}

export default async function HomePage() {
  const started = performance.now();
  const durations: Record<string, number> = {};
  const timed = async <T,>(name: string, promise: Promise<T>) => {
    const began = performance.now();
    const result = await promise;
    durations[name] = Math.round((performance.now() - began) * 10) / 10;
    return result;
  };
  const [homepage, products, recipes, testimonials] = await Promise.all([
    timed("homepage", getHomepageContent()), timed("products", getProducts()),
    timed("recipes", getRecipes()), timed("testimonials", getTestimonials())
  ]);
  if (process.env.VERCEL_ENV === "preview" || process.env.NODE_ENV === "development") {
    console.info("co-home-timing", JSON.stringify({ phase: "data", ...durations, totalMs: Math.round((performance.now() - started) * 10) / 10 }));
  }

  return (
    <>
      <StructuredData includeGlobal />
      <ReferenceHomePage homepage={homepage} products={products} recipes={recipes} testimonials={testimonials} />
    </>
  );
}
