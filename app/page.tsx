import type { Metadata } from "next";
import { CoconutEcosystem } from "@/components/CoconutEcosystem";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Motion";
import { SectionHeader } from "@/components/SectionHeader";
import { StructuredData } from "@/components/seo/StructuredData";
import {
  CataloguePreview,
  DistributorPartnershipCta,
  HonestTruthSection,
  MadeForLivingVisual,
  NewsletterSignupSection,
  ProductHighlight,
  RecipesPreview,
  SocialFounderBanners,
  TestimonialsSection,
  WellnessUsageSection
} from "@/components/HomeExperienceSections";
import { products } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: ".CO | The Coconut Company",
  description: "A modern coconut-origin lifestyle brand from Palakkad, Kerala. Made for Living.",
  path: "/"
});

export default function HomePage() {
  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }]} />
      <CoconutEcosystem />
      <MadeForLivingVisual />

      <section className="bg-paper px-5 py-24 md:px-8">
        <SectionHeader
          kicker="House universe"
          title="Coconut, edited into modern rituals."
          body="A focused portfolio with no clutter: fresh, reserve, creamery, botanica, and kitchen systems designed to scale without losing origin."
        />
        <div className="mx-auto grid max-w-7xl gap-5">
          {products.map((product, index) => (
            <Reveal key={product.name} delay={index * 0.08}>
              <ProductCard {...product} />
            </Reveal>
          ))}
        </div>
      </section>

      <HonestTruthSection />
      <ProductHighlight />
      <CataloguePreview />
      <RecipesPreview />
      <WellnessUsageSection />
      <TestimonialsSection />
      <SocialFounderBanners />
      <DistributorPartnershipCta />
      <NewsletterSignupSection />
    </>
  );
}
