import type { Metadata } from "next";
import { BrandImage } from "@/components/BrandImage";
import { BentoCard, CTAButton, MotionSection, TrustBadge } from "@/components/brand/BrandPrimitives";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";
import { publicAssets } from "@/lib/public-assets";

export const metadata: Metadata = createPageMetadata({
  title: "Sustainability",
  description: "A simple sustainability mindset for coconut sourcing, ingredients, and everyday product use.",
  path: "/sustainability"
});

export default function SustainabilityPage() {
  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Sustainability", path: "/sustainability" }]} />
      <section className="bg-[var(--co-cream)] pt-8 md:pt-12">
        <div className="co-container">
          <div className="grid min-h-[560px] overflow-hidden rounded-[32px] border border-[var(--co-border)] bg-[var(--co-white)] lg:grid-cols-[0.92fr_1.08fr]">
            <div className="flex flex-col justify-center p-6 md:p-10">
              <h1 className="co-display-section text-[var(--co-ink)]">SUSTAINABILITY</h1>
              <h2 className="mt-5 text-[clamp(26px,3vw,42px)] font-bold leading-tight text-[var(--co-palm)]">
                Good for you.
                <br />
                Good for the planet.
              </h2>
              <p className="mt-6 max-w-[34ch] text-base leading-7 text-[var(--co-muted)] [overflow-wrap:anywhere]">
                A better coconut future starts with responsible sourcing, mindful processing, and less wasteful choices.
              </p>
              <div className="mt-8">
                <CTAButton href="/about">Our commitment</CTAButton>
              </div>
            </div>
            <BrandImage
              src={publicAssets.brand.coconutRespect}
              alt="Fresh green coconut held with care"
              sizes="(min-width: 1024px) 54vw, 92vw"
              aspect="wide"
              fit="cover"
              position="center"
              priority
              hoverZoom
              className="h-full min-h-[430px] rounded-none border-0"
            />
          </div>

          <div className="grid gap-4 border-b border-[var(--co-border)] bg-[var(--co-white)] px-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
            <TrustBadge icon="palm" title="Responsible sourcing" body="Work with local farmers and support communities." />
            <TrustBadge icon="drop" title="Clean processing" body="Minimal processing. Maximum goodness retained." />
            <TrustBadge icon="wave" title="Less waste" body="Reuse, reduce, and recycle at every step." />
            <TrustBadge icon="leaf" title="Planet first" body="Sustainable today for a better tomorrow." />
          </div>
        </div>
      </section>

      <section className="co-section bg-[var(--co-cream)]">
        <div className="co-container grid gap-4 lg:grid-cols-[0.82fr_1.18fr]">
          <MotionSection>
            <BentoCard className="flex h-full min-h-[420px] flex-col justify-between">
              <div>
                <p className="co-label mb-5">Whole coconut mindset</p>
                <h2 className="co-h2 text-[var(--co-brown)]">Respect starts before the bottle.</h2>
                <p className="mt-6 max-w-xl text-base leading-7 text-[var(--co-muted)]">
                  Coconut should feel useful across drink, dessert, kitchen, care, and everyday living. No exaggerated claims, just clearer choices.
                </p>
              </div>
              <CTAButton href="/products" variant="outline" className="mt-8 w-fit">See products</CTAButton>
            </BentoCard>
          </MotionSection>
          <MotionSection delay={0.08}>
            <BrandImage
              src={publicAssets.campaign.groveOrigin}
              alt="Kerala coconut grove and fresh coconuts"
              sizes="(min-width: 1024px) 58vw, 92vw"
              aspect="wide"
              fit="cover"
              hoverZoom
              className="h-full min-h-[420px] rounded-[32px]"
            />
          </MotionSection>
        </div>
      </section>

      <section className="co-section bg-[var(--co-white)]">
        <div className="co-container grid gap-4 md:grid-cols-3">
          {[
            ["Thoughtful sourcing", "Stay close to coconut country and choose ingredient partners with care."],
            ["Clear ingredients", "Make product stories easy to understand at shelf speed."],
            ["Useful formats", "Reduce noise by making products people can actually use."],
          ].map(([title, body], index) => (
            <MotionSection key={title} delay={index * 0.05}>
              <BentoCard className="h-full">
                <p className="text-7xl font-bold leading-none text-[var(--co-brown)]/15">0{index + 1}</p>
                <h2 className="mt-8 text-4xl font-bold leading-none text-[var(--co-brown)]">{title}</h2>
                <p className="co-body mt-5">{body}</p>
              </BentoCard>
            </MotionSection>
          ))}
        </div>
        <div className="co-container mt-6">
          <BentoCard tone="green" className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <h2 className="co-h2">Better coconut products start with simpler choices.</h2>
            <CTAButton href="/products" variant="light">See products</CTAButton>
          </BentoCard>
        </div>
      </section>
    </>
  );
}
