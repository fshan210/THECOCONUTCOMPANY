import type { Metadata } from "next";
import { BrandImage } from "@/components/BrandImage";
import { BentoCard, CTAButton, FeatureStrip, MotionSection, TrustBadge } from "@/components/brand/BrandPrimitives";
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
              <h1 className="co-display-section text-[var(--co-ink)]">
                <span className="block sm:inline">SUSTAIN</span><span className="block sm:inline">ABILITY</span>
              </h1>
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
            <div className="min-h-[430px] p-4 md:p-5">
              <BrandImage
                src={publicAssets.brand.coconutRespect}
                alt="Fresh green coconut held with care"
                sizes="(min-width: 1024px) 54vw, 92vw"
                aspect="wide"
                fit="cover"
                position="center"
                priority
                hoverZoom
                className="h-full min-h-[430px] rounded-[32px] border-0"
              />
            </div>
          </div>

          <FeatureStrip className="sm:grid-cols-2 lg:grid-cols-4">
            <TrustBadge icon="palm" title="Responsible sourcing" body="Work with local farmers and support communities." />
            <TrustBadge icon="drop" title="Clean processing" body="Minimal processing. Maximum goodness retained." />
            <TrustBadge icon="wave" title="Less waste" body="Reuse, reduce, and recycle at every step." />
            <TrustBadge icon="leaf" title="Planet first" body="Sustainable today for a better tomorrow." />
          </FeatureStrip>
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
              <CTAButton href="/shop" variant="outline" className="mt-8 w-fit">See products</CTAButton>
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
        <div className="co-container">
          <div className="mb-8 max-w-3xl">
            <p className="co-label mb-4">Making an impact</p>
            <h2 className="co-h2 text-[var(--co-brown)]">Care should be visible.</h2>
            <p className="co-body mt-5 max-w-2xl">The work is practical and ongoing: listen to growers, handle coconuts thoughtfully, make processing easier to understand, and keep learning.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Close to growers",
                body: "Relationships begin in coconut country, with the people who understand the fruit best.",
                image: publicAssets.campaign.farmerPortrait,
                alt: "Kerala coconut grower holding a freshly harvested coconut"
              },
              {
                title: "Community handling",
                body: "Village aggregation can make collection calmer, clearer, and closer to the source.",
                image: publicAssets.campaign.vapOrigin,
                alt: "Village coconut aggregation point in Kerala"
              },
              {
                title: "Thoughtful processing",
                body: "Clean equipment and disciplined handling help protect the simple experience people expect.",
                image: publicAssets.campaign.processingBottling,
                alt: "Clean coconut beverage processing and bottling facility"
              },
              {
                title: "Regeneration mindset",
                body: "The long view is to support coconut landscapes, use resources carefully, and waste less.",
                image: publicAssets.campaign.sustainabilityHands,
                alt: "Hands holding a coconut seedling as a symbol of regeneration"
              }
            ].map((story, index) => (
              <MotionSection key={story.title} delay={index * 0.055}>
                <article className="co-press h-full overflow-hidden rounded-[32px] border border-[var(--co-border)] bg-white">
                  <BrandImage src={story.image} alt={story.alt} sizes="(min-width: 1024px) 24vw, (min-width: 640px) 46vw, 92vw" aspect="portrait" fit="cover" hoverZoom className="rounded-[32px] border-0" />
                  <div className="p-5 md:p-6">
                    <p className="co-label">0{index + 1}</p>
                    <h3 className="mt-4 text-[clamp(28px,3vw,40px)] font-bold leading-[0.95] text-[var(--co-brown)]">{story.title}</h3>
                    <p className="mt-4 text-sm leading-6 text-[var(--co-muted)]">{story.body}</p>
                  </div>
                </article>
              </MotionSection>
            ))}
          </div>
        </div>
        <div className="co-container mt-6">
          <BentoCard tone="green" className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <h2 className="co-h2">Better coconut products start with simpler choices.</h2>
            <CTAButton href="/shop" variant="light">See products</CTAButton>
          </BentoCard>
        </div>
      </section>
    </>
  );
}
