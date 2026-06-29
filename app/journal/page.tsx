import type { Metadata } from "next";
import { BrandImage } from "@/components/BrandImage";
import { BentoCard, CTAButton, FeatureStrip, MotionSection, TrustBadge } from "@/components/brand/BrandPrimitives";
import { JournalGrid } from "@/components/JournalGrid";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";
import { collectionPageSchema } from "@/lib/seo/structured-data";
import { publicAssets } from "@/lib/public-assets";
import { getJournalPosts, getSeoMetadata } from "@/lib/content/server";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("/journal");
  return createPageMetadata({ title: seo?.title || "Journal", description: seo?.description || "Editorial notes on coconut culture, taste, recipes, product thinking, and Made for Living.", path: seo?.canonicalPath || "/journal", index: !seo?.noindex, ogImage: seo?.ogImage });
}

export default async function JournalPage() {
  const journalEntries = await getJournalPosts();
  return (
    <>
      <StructuredData
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Journal", path: "/journal" }]}
        extra={[
          collectionPageSchema({
            name: ".CO Journal",
            description: "Editorial notes on coconut culture, taste, recipes, product thinking, and Made for Living.",
            path: "/journal",
            items: journalEntries.map((entry) => ({
              name: entry.title,
              description: entry.excerpt,
              image: entry.image
            }))
          })
        ]}
      />
      <section className="bg-[var(--co-cream)] pt-8 md:pt-12">
        <div className="co-container">
          <div className="grid min-h-[560px] overflow-hidden rounded-[32px] border border-[var(--co-border)] bg-[var(--co-white)] lg:grid-cols-[0.9fr_1.1fr]">
            <div className="flex flex-col justify-center p-6 md:p-10">
              <h1 className="co-display-section text-[var(--co-ink)]">JOURNAL</h1>
              <h2 className="mt-5 text-[clamp(26px,3vw,42px)] font-bold leading-tight text-[var(--co-palm)]">
                Stories, tips and inspiration
                <br />
                from coconut.
              </h2>
              <p className="mt-6 max-w-[34ch] text-base leading-7 text-[var(--co-muted)] [overflow-wrap:anywhere]">
                From wellness and nutrition to sustainability and behind-the-scenes stories.
              </p>
              <div className="mt-8">
                <CTAButton href="#latest-articles">Explore all articles</CTAButton>
              </div>
            </div>
            <div className="min-h-[430px] p-4 md:p-5">
              <BrandImage
                src={publicAssets.generated.compositionMorning}
                alt=".CO journal coconut water morning ritual"
                sizes="(min-width: 1024px) 54vw, 92vw"
                aspect="wide"
                fit="cover"
                priority
                hoverZoom
                className="h-full min-h-[430px] rounded-[32px] border-0"
              />
            </div>
          </div>

          <FeatureStrip className="sm:grid-cols-2 lg:grid-cols-4">
            <TrustBadge icon="drop" title="Product notes" body="What makes coconut refreshing." />
            <TrustBadge icon="leaf" title="Recipes" body="Simple ways to use .CO." />
            <TrustBadge icon="palm" title="Origins" body="Stories close to coconut country." />
            <TrustBadge icon="wave" title="Living" body="Everyday rituals worth keeping." />
          </FeatureStrip>
        </div>
      </section>

      <section id="latest-articles" className="co-section bg-[var(--co-white)]">
        <div className="co-container">
          <p className="co-label mb-5">Latest articles</p>
          <JournalGrid entries={journalEntries} />
        </div>
      </section>

      <section className="co-section bg-[var(--co-cream)]">
        <div className="co-container">
          <BentoCard tone="dark" className="grid gap-8 md:grid-cols-[1fr_0.48fr] md:items-center">
            <div>
              <p className="co-label mb-5 text-[var(--co-sun)]">Featured note</p>
              <h2 className="co-h2">The coconut is not a trend. It is a habit.</h2>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/72">
                In Kerala, coconut belongs to food, shade, care, memory, and refreshment. .CO keeps that everyday breadth close to the product.
              </p>
              <div className="mt-8">
                <CTAButton href="/about" variant="light">Read the origin story</CTAButton>
              </div>
            </div>
            <BrandImage
              src={publicAssets.brand.palms}
              alt="Kerala coconut brand world"
              sizes="(min-width: 768px) 34vw, 92vw"
              aspect="landscape"
              fit="cover"
              hoverZoom
              className="rounded-[24px] border-white/15 bg-white/10"
            />
          </BentoCard>
        </div>
      </section>
    </>
  );
}
