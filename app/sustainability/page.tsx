import type { Metadata } from "next";
import { BrandImage } from "@/components/BrandImage";
import { BentoCard, BillboardWord, CTAButton, MotionSection, SplitStoryPanel } from "@/components/brand/BrandPrimitives";
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
      <section className="co-section bg-[var(--co-cream)] pt-24 md:pt-32">
        <div className="co-container">
          <MotionSection>
            <BillboardWord word="SOURCE" className="co-display-section text-[var(--co-brown)]/[0.08]" />
          </MotionSection>
          <div className="co-grid-12 mt-4 items-end md:-mt-3">
            <MotionSection className="lg:col-span-7">
              <h1 className="text-[clamp(36px,9vw,132px)] font-bold leading-[0.84] text-[var(--co-ink)]">
                Respect starts before the bottle.
              </h1>
              <p className="co-body mt-7 max-w-2xl">No heavy corporate language. Just coconut respect: thoughtful sourcing, clean processing, simple labels, and less wasteful thinking.</p>
            </MotionSection>
            <MotionSection delay={0.08} className="mt-5 lg:col-span-5 lg:mt-0">
              <BrandImage src={publicAssets.brand.grove} alt="Kerala coconut grove" sizes="(min-width: 1024px) 40vw, 92vw" aspect="portrait" fit="cover" priority hoverZoom className="rounded-[48px]" />
            </MotionSection>
          </div>
        </div>
      </section>

      <section className="bg-[var(--co-white)] py-8">
        <SplitStoryPanel
          eyebrow="Whole coconut mindset"
          title="The ingredient should earn its place across the product world."
          body="Water, dessert, kitchen, care, and lifestyle should feel connected by a useful coconut logic, not by exaggerated claims."
          image={publicAssets.brand.harvest}
          word="TRUST"
        />
      </section>

      <section className="co-section bg-[var(--co-cream)]">
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
