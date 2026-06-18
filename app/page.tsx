import type { Metadata } from "next";
import { HeroStoryCanvas } from "@/components/HeroStoryCanvas";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Motion";
import { SectionHeader } from "@/components/SectionHeader";
import { StructuredData } from "@/components/seo/StructuredData";
import {
  CataloguePreview,
  BenefitsSection,
  DistributorPartnershipCta,
  HeroCompositionSection,
  HonestTruthSection,
  MadeForLivingVisual,
  NewsletterSignupSection,
  ProductHighlight,
  RecipesPreview,
  SocialFounderBanners,
  TestimonialsSection,
  TrustStrip,
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
      <HeroStoryCanvas />
      <MadeForLivingVisual />
      <TrustStrip />
      <HeroCompositionSection />

      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#F5EBD7_0%,#fffdf8_48%,rgba(74,111,74,0.16)_100%)] px-5 py-20 md:px-8 md:py-28">
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
      <BenefitsSection />
      <RecipesPreview />
      <WellnessUsageSection />
      <TestimonialsSection />
      <SocialFounderBanners />
      <DistributorPartnershipCta />
      <NewsletterSignupSection />
    </>
  );
}
