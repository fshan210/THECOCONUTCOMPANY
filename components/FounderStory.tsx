"use client";

import { BentoCard, BillboardWord, CTAButton, MotionSection } from "@/components/brand/BrandPrimitives";
import { BrandImage } from "@/components/BrandImage";
import { publicAssets } from "@/lib/public-assets";

export function FounderStory() {
  return (
    <section className="co-section bg-[var(--co-cream)]">
      <div className="co-container">
        <div className="co-grid-12 items-stretch">
          <MotionSection className="lg:col-span-5">
            <BrandImage src={publicAssets.brand.madeForLiving} alt=".CO Made for Living brand banner" sizes="(min-width: 1024px) 40vw, 92vw" aspect="portrait" fit="cover" hoverZoom className="h-full min-h-[540px] rounded-[48px]" />
          </MotionSection>
          <MotionSection delay={0.08} className="mt-4 lg:col-span-7 lg:mt-0">
            <BentoCard className="flex h-full min-h-[540px] flex-col justify-between">
              <BillboardWord word="LIVING" className="text-[clamp(72px,11vw,150px)] text-[var(--co-brown)]/[0.08]" />
              <div>
                <p className="co-label mb-5">Founder story</p>
                <h2 className="co-h2 max-w-4xl text-[var(--co-brown)]">Warm enough for home. Sharp enough for a premium shelf.</h2>
                <p className="co-body mt-7 max-w-2xl">
                  .CO is founder-led, but the products stay at the center. The packshot, the ritual, and the coconut world do the selling.
                </p>
                <div className="mt-8">
                  <CTAButton href="/founders" variant="outline">Meet the founders</CTAButton>
                </div>
              </div>
            </BentoCard>
          </MotionSection>
        </div>
      </div>
    </section>
  );
}
