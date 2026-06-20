import type { Metadata } from "next";
import Image from "next/image";
import { JournalGrid } from "@/components/JournalGrid";
import { Appear } from "@/components/motion/Appear";
import { CtaLink, DoodleImage, PublicHeader, PublicSection } from "@/components/PublicDesign";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";
import { publicAssets } from "@/lib/public-assets";

export const metadata: Metadata = createPageMetadata({
  title: "Journal",
  description: "Editorial notes on coconut culture, taste, recipes, product thinking, and Made for Living.",
  path: "/journal"
});

export default function JournalPage() {
  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Journal", path: "/journal" }]} />
      <PublicSection className="pt-28 md:pt-32">
        <DoodleImage src={publicAssets.doodles.rawCoconut} className="right-8 top-20 h-36 w-36 md:h-56 md:w-56" />
        <Appear className="mx-auto max-w-7xl">
          <p className="mb-8 text-[0.72rem] font-medium uppercase tracking-editorial text-grove">Journal</p>
          <h1 className="max-w-5xl font-display text-6xl font-light leading-none text-coconut md:text-8xl">
            Notes on coconut, taste, and living well.
          </h1>
        </Appear>
      </PublicSection>

      <PublicSection tone="warm">
        <PublicHeader kicker="Magazine" title="Small stories from the .CO world." body="Recipes, coconut culture, founder notes, product details, and the everyday moments that make the brand feel alive." />
        <div className="mx-auto max-w-7xl">
          <JournalGrid />
        </div>
      </PublicSection>

      <PublicSection>
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <Appear className="overflow-hidden rounded-3xl border border-coconut/10 bg-[#fff8ea] p-4 shadow-[0_18px_48px_rgba(62,46,31,0.06)]">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-paper">
              <Image src={publicAssets.water.flatLay} alt=".CO coconut water editorial flat lay" fill sizes="(min-width: 768px) 54vw, 92vw" className="object-cover" />
            </div>
          </Appear>
          <Appear delay={0.1}>
            <p className="mb-6 text-[0.72rem] font-medium uppercase tracking-editorial text-grove">Featured essay</p>
            <h2 className="font-display text-5xl font-light leading-tight text-coconut md:text-7xl">The coconut is not a trend. It is a habit.</h2>
            <p className="mt-7 text-lg leading-9 text-coconut/70">
              In Kerala, coconut belongs to food, shade, care, memory, and refreshment. The .CO journal treats that everyday breadth with warmth.
            </p>
            <div className="mt-8">
              <CtaLink href="/about" variant="secondary">Read the origin story</CtaLink>
            </div>
          </Appear>
        </div>
      </PublicSection>
    </>
  );
}
