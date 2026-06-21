import type { Metadata } from "next";
import { AboutJourney } from "@/components/AboutJourney";
import { FounderStory } from "@/components/FounderStory";
import { BrandImage } from "@/components/BrandImage";
import { BentoCard, BillboardWord, CTAButton } from "@/components/brand/BrandPrimitives";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";
import { publicAssets } from "@/lib/public-assets";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description: "The coconut source, product discipline, and Made for Living philosophy behind .CO | The Coconut Company.",
  path: "/about"
});

export default function AboutPage() {
  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "About", path: "/about" }]} />
      <section className="co-section bg-[var(--co-cream)] pt-24 md:pt-32">
        <div className="co-container">
          <BillboardWord word="ABOUT" className="co-display-section text-[var(--co-brown)]/[0.1]" />
          <div className="co-grid-12 mt-4 items-end md:-mt-4">
            <div className="lg:col-span-7">
              <h1 className="text-[clamp(36px,9vw,132px)] font-bold leading-[0.84] text-[var(--co-ink)]">
                Coconut products with modern shelf discipline.
              </h1>
              <p className="co-body mt-7 max-w-2xl">
                .CO is built as a premium consumer coconut brand: product first, origin clear, and everyday rituals easy to understand.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <CTAButton href="/products">Explore products</CTAButton>
                <CTAButton href="/sustainability" variant="outline">Source mindset</CTAButton>
              </div>
            </div>
            <div className="mt-5 lg:col-span-5 lg:mt-0">
              <BentoCard>
                <BrandImage src={publicAssets.brand.tenderCoconut} alt="Tender coconut source for .CO" sizes="(min-width: 1024px) 40vw, 92vw" aspect="portrait" fit="cover" priority hoverZoom className="rounded-[36px]" />
              </BentoCard>
            </div>
          </div>
        </div>
      </section>
      <AboutJourney />
      <FounderStory />
    </>
  );
}
