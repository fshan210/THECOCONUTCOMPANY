import type { Metadata } from "next";
import { BrandImage } from "@/components/BrandImage";
import { BentoCard, CTAButton, FeatureStrip, TrustBadge } from "@/components/brand/BrandPrimitives";
import { FounderProfiles } from "@/components/FounderProfiles";
import { JournalGrid } from "@/components/JournalGrid";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";
import { publicAssets } from "@/lib/public-assets";

export const metadata: Metadata = createPageMetadata({
  title: "Founders",
  description: "Meet the founders building .CO around coconut rituals, taste, and Made for Living warmth.",
  path: "/founders"
});

export default function FoundersPage() {
  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Founders", path: "/founders" }]} />
      <section className="bg-[var(--co-cream)] pt-8 md:pt-12">
        <div className="co-container">
          <div className="grid min-h-[560px] overflow-hidden rounded-[32px] border border-[var(--co-border)] bg-[var(--co-white)] lg:grid-cols-[0.92fr_1.08fr]">
            <div className="flex flex-col justify-center p-6 md:p-10">
              <h1 className="co-display-section text-[var(--co-ink)]">FOUNDERS</h1>
              <h2 className="mt-5 text-[clamp(26px,3vw,42px)] font-bold leading-tight text-[var(--co-palm)]">
                The people behind
                <br />
                .CO.
              </h2>
              <p className="mt-6 max-w-[34ch] text-base leading-7 text-[var(--co-muted)] [overflow-wrap:anywhere]">
                A founder-led coconut company built around real taste, useful products, and a warm everyday brand world.
              </p>
              <div className="mt-8">
                <CTAButton href="#founder-cards">Meet the founders</CTAButton>
              </div>
            </div>
            <div className="min-h-[430px] p-4 md:p-5">
              <BrandImage
                src={publicAssets.campaign.groveOrigin}
                alt="Kerala coconut grove that inspires the .CO founder story"
                sizes="(min-width: 1024px) 54vw, 92vw"
                aspect="wide"
                fit="cover"
                position="center"
                priority
                hoverZoom
                className="h-full min-h-[430px] rounded-[32px]"
              />
            </div>
          </div>

          <FeatureStrip className="sm:grid-cols-2 lg:grid-cols-4">
            <TrustBadge icon="palm" title="Rooted in Kerala" body="A coconut story close to home." />
            <TrustBadge icon="drop" title="Product first" body="Taste before noise." />
            <TrustBadge icon="leaf" title="Made with care" body="Useful products, warmer details." />
            <TrustBadge icon="wave" title="Made for Living" body="Built for everyday rituals." />
          </FeatureStrip>
        </div>
      </section>

      <section id="founder-cards" className="co-section bg-[var(--co-white)]">
        <div className="co-container"><FounderProfiles /></div>
      </section>

      <section className="co-section bg-[var(--co-cream)]">
        <div className="co-container">
          <BentoCard tone="dark" className="mb-6 grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <h2 className="co-h2">Notes from the people building the coconut world.</h2>
            <CTAButton href="/journal" variant="light">Read journal</CTAButton>
          </BentoCard>
          <JournalGrid compact />
        </div>
      </section>
    </>
  );
}
