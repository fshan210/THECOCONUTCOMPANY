import type { Metadata } from "next";
import { Mail, MapPin, Store } from "lucide-react";
import { BrandImage } from "@/components/BrandImage";
import { BentoCard, BillboardWord, CTAButton, IngredientBadge, MotionSection } from "@/components/brand/BrandPrimitives";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";
import { publicAssets } from "@/lib/public-assets";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description: "Contact .CO for product interest, retail conversations, and coconut brand updates.",
  path: "/contact"
});

export default function ContactPage() {
  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]} />
      <section className="co-section bg-[var(--co-cream)] pt-24 md:pt-32">
        <div className="co-container">
          <BillboardWord word="CONTACT" className="co-display-section text-[var(--co-brown)]/[0.1]" />
          <div className="co-grid-12 mt-4 items-stretch md:-mt-3">
            <div className="lg:col-span-7">
              <BentoCard className="flex h-full min-h-[560px] flex-col justify-between">
                <div>
                  <p className="co-label mb-5">Talk coconut</p>
                  <h1 className="max-w-full text-[clamp(36px,9vw,132px)] font-bold leading-[0.84] text-[var(--co-ink)] [overflow-wrap:anywhere]">
                    Product interest, retail notes, and everyday coconut questions.
                  </h1>
                  <p className="co-body mt-7 max-w-full [overflow-wrap:anywhere] md:max-w-2xl">
                    Reach out for .CO Water, MELT.CO, product availability, recipe ideas, or distributor conversations.
                  </p>
                </div>
                <div className="mt-9 flex flex-wrap gap-3">
                  <CTAButton href="mailto:hello@cothecoconutcompany.com">Email .CO</CTAButton>
                  <CTAButton href="/shop" variant="outline">See product shelf</CTAButton>
                </div>
              </BentoCard>
            </div>
            <MotionSection delay={0.08} className="mt-4 lg:col-span-5 lg:mt-0">
              <BrandImage
                src={publicAssets.water.flatLay}
                alt=".CO coconut water contact product flat lay"
                sizes="(min-width: 1024px) 40vw, 92vw"
                aspect="portrait"
                fit="cover"
                priority
                hoverZoom
                className="h-full min-h-[560px] rounded-[48px]"
              />
            </MotionSection>
          </div>
        </div>
      </section>

      <section className="co-section bg-[var(--co-white)]">
        <div className="co-container grid gap-4 md:grid-cols-3">
          {[
            { title: "Product interest", body: "Questions about .CO Water, MELT.CO, or the coconut product family.", icon: Store, badge: "Shopper" },
            { title: "Retail / distributor", body: "A clear route for cold shelf, cafe, hospitality, and trade conversations.", icon: MapPin, badge: "Trade" },
            { title: "Recipes / journal", body: "Share recipe ideas, tasting notes, or coconut rituals worth documenting.", icon: Mail, badge: "Brand world" }
          ].map(({ title, body, icon: Icon, badge }, index) => (
            <MotionSection key={title} delay={index * 0.05}>
              <BentoCard className="h-full">
                <Icon className="mb-8 text-[var(--co-palm)]" size={28} />
                <IngredientBadge tone={index === 1 ? "sun" : "cream"}>{badge}</IngredientBadge>
                <h2 className="mt-8 text-4xl font-bold leading-none text-[var(--co-brown)]">{title}</h2>
                <p className="co-body mt-5">{body}</p>
              </BentoCard>
            </MotionSection>
          ))}
        </div>
      </section>
    </>
  );
}
