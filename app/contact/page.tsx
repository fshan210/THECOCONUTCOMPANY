import type { Metadata } from "next";
import { BrandImage } from "@/components/BrandImage";
import { BentoCard, CTAButton, DoodleIcon, IngredientBadge, MotionSection } from "@/components/brand/BrandPrimitives";
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
      <section className="bg-[var(--co-cream)] pt-8 md:pt-12">
        <div className="co-container">
          <div className="grid min-h-[560px] overflow-hidden rounded-[32px] border border-[var(--co-border)] bg-[var(--co-black)] text-[var(--co-white)] lg:grid-cols-[0.92fr_1.08fr]">
            <div className="flex flex-col justify-center p-6 md:p-10">
              <p className="co-label mb-5 text-[var(--co-sun)]">For business</p>
              <h1 className="text-[clamp(44px,8vw,118px)] font-bold uppercase leading-[0.84]">
                Retail, cafe, and coconut shelf conversations.
              </h1>
              <p className="mt-6 max-w-md text-base leading-7 text-white/72">
                Talk to .CO about product interest, cold shelf placement, hospitality use, distributor notes, and everyday coconut questions.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <CTAButton href="mailto:hello@cothecoconutcompany.com" variant="light">Email .CO</CTAButton>
                <CTAButton href="/shop" variant="outline" className="border-white/50 text-white hover:border-[var(--co-sun)] hover:bg-[var(--co-sun)] hover:text-[var(--co-black)]">
                  See product shelf
                </CTAButton>
              </div>
            </div>
            <MotionSection delay={0.08} className="min-h-[430px]">
              <BrandImage
                src={publicAssets.campaign.retailBusiness}
                alt=".CO product and coconut water business shelf visual"
                sizes="(min-width: 1024px) 54vw, 92vw"
                aspect="wide"
                fit="cover"
                priority
                hoverZoom
                className="h-full min-h-[430px] rounded-none border-0"
              />
            </MotionSection>
          </div>
        </div>
      </section>

      <section className="co-section bg-[var(--co-white)]">
        <div className="co-container grid gap-4 md:grid-cols-3">
          {[
            { title: "Product interest", body: "Questions about .CO Water, MELT.CO, or the wider coconut product family.", icon: "bottle" as const, badge: "Shopper" },
            { title: "Retail / distributor", body: "A clear route for cold shelf, cafe, hospitality, and trade conversations.", icon: "palm" as const, badge: "Trade" },
            { title: "Recipes / journal", body: "Share recipe ideas, tasting notes, or coconut rituals worth documenting.", icon: "wave" as const, badge: "Brand world" }
          ].map(({ title, body, icon, badge }, index) => (
            <MotionSection key={title} delay={index * 0.05}>
              <BentoCard className="h-full">
                <DoodleIcon name={icon} className="mb-8 h-10 w-10 text-[var(--co-palm)]" />
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
