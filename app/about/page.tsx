import type { Metadata } from "next";
import { AboutJourney } from "@/components/AboutJourney";
import { BrandImage } from "@/components/BrandImage";
import { CTAButton, TrustBadge } from "@/components/brand/BrandPrimitives";
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
      <section className="bg-[var(--co-cream)] pt-8 md:pt-12">
        <div className="co-container">
          <div className="grid min-h-[620px] overflow-hidden rounded-[32px] border border-[var(--co-border)] bg-[var(--co-white)] lg:grid-cols-[0.92fr_1.08fr]">
            <div className="flex flex-col justify-center p-6 md:p-10">
              <h1 className="co-display-section text-[var(--co-ink)]">
                ABOUT
                <br />
                .CO
              </h1>
              <h2 className="mt-6 text-[clamp(26px,3vw,42px)] font-bold leading-tight text-[var(--co-palm)]">
                Real coconut.
                <br />
                Real purpose.
              </h2>
              <p className="mt-6 max-w-[34ch] text-base leading-7 text-[var(--co-muted)] [overflow-wrap:anywhere]">
                We are on a mission to bring the goodness of coconuts from Kerala to everyday life through pure products, honest process, and better choices.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <CTAButton href="/shop">Explore products</CTAButton>
                <CTAButton href="/sustainability" variant="outline">Our commitment</CTAButton>
              </div>
            </div>
            <BrandImage
              src={publicAssets.water.flatLay}
              alt=".CO coconut water with fresh coconut pieces"
              sizes="(min-width: 1024px) 54vw, 92vw"
              aspect="wide"
              fit="cover"
              priority
              hoverZoom
              className="h-full min-h-[430px] rounded-none border-0"
            />
          </div>
          <div className="grid gap-4 border-b border-[var(--co-border)] bg-[var(--co-white)] px-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
            <TrustBadge icon="palm" title="Rooted in Kerala" body="Sourced from farms we know and trust." />
            <TrustBadge icon="drop" title="Clean & Pure" body="Nothing added. Nothing unnecessary." />
            <TrustBadge icon="cold" title="Made with care" body="Thoughtful process for real quality." />
            <TrustBadge icon="leaf" title="Better for all" body="Good for you. Good for the planet." />
          </div>
        </div>
      </section>
      <AboutJourney />
    </>
  );
}
