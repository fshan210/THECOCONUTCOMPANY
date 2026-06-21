import type { Metadata } from "next";
import { BrandImage } from "@/components/BrandImage";
import { BentoCard, BillboardWord, CTAButton, MotionSection } from "@/components/brand/BrandPrimitives";
import { JournalGrid } from "@/components/JournalGrid";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";
import { publicAssets } from "@/lib/public-assets";

const founders = [
  {
    name: "Fazil Shersha",
    role: "Founder / Brand",
    image: publicAssets.social.founderJourney,
    bio: "Shapes the product story, the visual system, and the idea that coconut can feel premium without feeling cold."
  },
  {
    name: "Afsala Muthali",
    role: "Co-founder / Product warmth",
    image: publicAssets.water.flatLay,
    bio: "Keeps the lens close to home: taste, routines, recipes, and the human side of everyday coconut products."
  }
];

export const metadata: Metadata = createPageMetadata({
  title: "Founders",
  description: "Meet the founders building .CO around coconut rituals, taste, and Made for Living warmth.",
  path: "/founders"
});

export default function FoundersPage() {
  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Founders", path: "/founders" }]} />
      <section className="co-section bg-[var(--co-cream)] pt-24 md:pt-32">
        <div className="co-container">
          <MotionSection>
            <BillboardWord word="FOUNDERS" className="co-display-section text-[var(--co-brown)]/[0.08]" />
          </MotionSection>
          <MotionSection className="mt-4 max-w-5xl md:-mt-3">
            <h1 className="text-[clamp(36px,9vw,132px)] font-bold leading-[0.84] text-[var(--co-ink)]">
              Founder-led, product-first.
            </h1>
            <p className="co-body mt-7 max-w-2xl">The founders matter because they keep the coconut world warm. The products stay close to home, taste, and everyday use.</p>
          </MotionSection>
        </div>
      </section>

      <section className="co-section bg-[var(--co-white)]">
        <div className="co-container grid gap-4 md:grid-cols-2">
          {founders.map((founder, index) => (
            <MotionSection key={founder.name} delay={index * 0.08}>
              <BentoCard className="h-full">
                <BrandImage src={founder.image} alt={`${founder.name} founder story`} sizes="(min-width: 768px) 46vw, 92vw" aspect="landscape" fit="cover" hoverZoom className="mb-7 rounded-[36px]" />
                <p className="co-label mb-4">{founder.role}</p>
                <h2 className="text-[clamp(42px,6vw,82px)] font-bold leading-[0.88] text-[var(--co-brown)]">{founder.name}</h2>
                <p className="co-body mt-6">{founder.bio}</p>
              </BentoCard>
            </MotionSection>
          ))}
        </div>
      </section>

      <section className="co-section bg-[var(--co-cream)]">
        <div className="co-container">
          <BentoCard tone="dark" className="mb-6 grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <h2 className="co-h2">Notes from the people building the coconut world.</h2>
            <CTAButton href="/journal" variant="light">Read journal</CTAButton>
          </BentoCard>
          <JournalGrid />
        </div>
      </section>
    </>
  );
}
