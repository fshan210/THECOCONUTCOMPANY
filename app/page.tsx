import type { Metadata } from "next";
import { ReferenceHomePage } from "@/components/home/ReferenceHomePage";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";
import { faqSchema } from "@/lib/seo/structured-data";
import { getHomepageContent, getProducts, getRecipes, getTestimonials } from "@/lib/content/server";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getHomepageContent();
  return createPageMetadata({
    title: seo.title,
    description: seo.description,
    path: seo.canonicalPath,
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
        breadcrumbs={[{ name: "Home", path: "/" }]}
        extra={[faqSchema([
          { question: "Are your products 100% natural?", answer: "Our product pages clearly state ingredients and product-specific information so customers can make an informed choice." },
          { question: "Do you offer international shipping?", answer: "Shipping availability is confirmed at checkout or through the current shipping information page." },
          { question: "What is your return policy?", answer: "Return eligibility and the current process are explained on our returns page." },
          { question: "How should I store coconut water?", answer: "Follow the storage instructions on the product label and serve chilled where recommended." }
        ])]}
      />
      <ReferenceHomePage homepage={homepage} products={products} recipes={recipes} testimonials={testimonials} />
    </>
  );
}
