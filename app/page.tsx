import type { Metadata } from "next";
import { ReferenceHomePage } from "@/components/home/ReferenceHomePage";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";
import { faqSchema } from "@/lib/seo/structured-data";
import { homeFaqItems } from "@/lib/seo/public-content";
import { getHomepageContent, getProducts, getRecipes, getTestimonials } from "@/lib/content/server";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getHomepageContent();
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
  const [homepage, products, recipes, testimonials] = await Promise.all([getHomepageContent(), getProducts(), getRecipes(), getTestimonials()]);

  return (
    <>
      <StructuredData
        includeGlobal
        extra={[faqSchema(homeFaqItems.map(([question, answer]) => ({ question, answer })))]}
      />
      <ReferenceHomePage homepage={homepage} products={products} recipes={recipes} testimonials={testimonials} />
    </>
  );
}
