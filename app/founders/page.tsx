import type { Metadata } from "next";
import { BrandImage } from "@/components/BrandImage";
import { BentoCard, CTAButton, MotionSection, TrustBadge } from "@/components/brand/BrandPrimitives";
import { JournalGrid } from "@/components/JournalGrid";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";
import { publicAssets } from "@/lib/public-assets";

const founders = [
  {
    name: "Fazil Shersha",
    role: "Co-founder",
    image: publicAssets.social.founderFazil,
    bio: "Driven by purpose. Focused on real impact through better coconut products and everyday rituals."
  },
  {
    name: "Afsala Muthali",
    role: "Co-founder",
    image: publicAssets.social.founderAfsala,
    bio: "Rooted in care. Committed to quality in every detail, from product feeling to consumer experience."
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
            <div className="grid gap-0 sm:grid-cols-2">
              <BrandImage
                src={publicAssets.social.founderFazil}
                alt="Fazil Shersha, .CO co-founder"
                sizes="(min-width: 1024px) 28vw, 92vw"
                aspect="portrait"
                fit="cover"
                position="84% center"
                priority
                hoverZoom
                className="h-full min-h-[430px] rounded-none border-0"
              />
              <BrandImage
                src={publicAssets.social.founderAfsala}
                alt="Afsala Muthali, .CO co-founder"
                sizes="(min-width: 1024px) 28vw, 92vw"
                aspect="portrait"
                fit="cover"
                position="84% center"
                priority
                hoverZoom
                className="h-full min-h-[430px] rounded-none border-0"
              />
            </div>
          </div>

          <div className="grid gap-4 border-b border-[var(--co-border)] bg-[var(--co-white)] px-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
            <TrustBadge icon="palm" title="Rooted in Kerala" body="A coconut story close to home." />
            <TrustBadge icon="drop" title="Product first" body="Taste before noise." />
            <TrustBadge icon="leaf" title="Made with care" body="Useful products, warmer details." />
            <TrustBadge icon="wave" title="Made for Living" body="Built for everyday rituals." />
          </div>
        </div>
      </section>

      <section id="founder-cards" className="co-section bg-[var(--co-white)]">
        <div className="co-container grid gap-4 md:grid-cols-2">
          {founders.map((founder, index) => (
            <MotionSection key={founder.name} delay={index * 0.08}>
              <BentoCard className="h-full">
                <BrandImage src={founder.image} alt={`${founder.name} founder portrait`} sizes="(min-width: 768px) 46vw, 92vw" aspect="landscape" fit="cover" position="62% 36%" hoverZoom className="mb-7 rounded-[24px]" />
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
