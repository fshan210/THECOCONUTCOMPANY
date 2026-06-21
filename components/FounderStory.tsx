"use client";

import { BentoCard, BillboardWord, CTAButton, MotionSection } from "@/components/brand/BrandPrimitives";
import { BrandImage } from "@/components/BrandImage";
import { publicAssets } from "@/lib/public-assets";

export function FounderStory() {
  return (
    <section className="co-section bg-[var(--co-cream)]">
      <div className="co-container">
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <MotionSection>
            <div className="grid h-full gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <BrandImage src={publicAssets.social.founderFazil} alt="Fazil Shersha, co-founder of .CO" sizes="(min-width: 1024px) 40vw, 92vw" aspect="landscape" fit="cover" position="62% 36%" hoverZoom className="rounded-[24px]" />
              <BrandImage src={publicAssets.social.founderAfsala} alt="Afsala Muthali, co-founder of .CO" sizes="(min-width: 1024px) 40vw, 92vw" aspect="landscape" fit="cover" position="62% 36%" hoverZoom className="rounded-[24px]" />
            </div>
          </MotionSection>
          <MotionSection delay={0.08}>
            <BentoCard className="flex h-full min-h-[430px] flex-col justify-between rounded-[24px]">
              <BillboardWord word="LIVING" className="text-[clamp(54px,8vw,112px)] text-[var(--co-brown)]/[0.08]" />
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
