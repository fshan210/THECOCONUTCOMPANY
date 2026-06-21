import type { Metadata } from "next";
import { HeroStoryCanvas } from "@/components/HeroStoryCanvas";
import { StructuredData } from "@/components/seo/StructuredData";
import {
  BrandWorldTeaser,
  OriginStorySection,
  ProductBentoSection,
  RetailDistributorCTA,
  TasteRitualGrid,
  TrustCueStrip
} from "@/components/HomeExperienceSections";
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
      <ProductBentoSection />
      <OriginStorySection />
      <TasteRitualGrid />
      <TrustCueStrip />
      <RetailDistributorCTA />
      <BrandWorldTeaser />
    </>
  );
}
