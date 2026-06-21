import type { Metadata } from "next";
import { BrandImage } from "@/components/BrandImage";
import { BillboardWord, CTAButton, MotionSection, SplitStoryPanel } from "@/components/brand/BrandPrimitives";
import { JournalGrid } from "@/components/JournalGrid";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";
import { publicAssets } from "@/lib/public-assets";

export const metadata: Metadata = createPageMetadata({
  title: "Journal",
  description: "Editorial notes on coconut culture, taste, recipes, product thinking, and Made for Living.",
  path: "/journal"
});

export default function JournalPage() {
  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Journal", path: "/journal" }]} />
      <section className="co-section bg-[var(--co-cream)] pt-24 md:pt-32">
        <div className="co-container">
          <MotionSection>
            <BillboardWord word="JOURNAL" className="co-display-section text-[var(--co-brown)]/[0.08]" />
          </MotionSection>
          <div className="co-grid-12 mt-4 items-end md:-mt-3">
            <MotionSection className="lg:col-span-7">
              <h1 className="text-[clamp(36px,9vw,132px)] font-bold leading-[0.84] text-[var(--co-ink)]">
                Coconut culture, written like a brand magazine.
              </h1>
              <p className="co-body mt-7 max-w-2xl">Short, consumer-friendly notes on taste, ritual, product thinking, and the coconut world.</p>
            </MotionSection>
            <MotionSection delay={0.08} className="mt-5 lg:col-span-5 lg:mt-0">
              <BrandImage src={publicAssets.water.flatLay} alt=".CO editorial coconut water flat lay" sizes="(min-width: 1024px) 40vw, 92vw" aspect="landscape" fit="cover" priority hoverZoom className="rounded-[48px]" />
            </MotionSection>
          </div>
        </div>
      </section>

      <section className="co-section bg-[var(--co-white)]">
        <div className="co-container">
          <JournalGrid />
        </div>
      </section>

      <section className="bg-[var(--co-cream)] py-8">
        <SplitStoryPanel
          eyebrow="Featured essay"
          title="The coconut is not a trend. It is a habit."
          body="In Kerala, coconut belongs to food, shade, care, memory, and refreshment. The .CO journal treats that everyday breadth as a consumer brand advantage."
          image={publicAssets.brand.palms}
          reverse
          word="HABIT"
        />
        <div className="co-container mt-6">
          <CTAButton href="/about" variant="outline">Read the origin story</CTAButton>
        </div>
      </section>
    </>
  );
}
