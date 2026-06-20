import type { Metadata } from "next";
import { AboutJourney } from "@/components/AboutJourney";
import { FounderStory } from "@/components/FounderStory";
import { Appear } from "@/components/motion/Appear";
import { DoodleImage, PublicSection } from "@/components/PublicDesign";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";
import { publicAssets } from "@/lib/public-assets";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description: "The roots, coconut rituals, and Made for Living philosophy behind .CO | The Coconut Company.",
  path: "/about"
});

export default function AboutPage() {
  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "About", path: "/about" }]} />
      <PublicSection className="pt-28 md:pt-32">
        <DoodleImage src={publicAssets.doodles.rawCoconut} className="right-8 top-20 h-36 w-36 md:h-56 md:w-56" />
        <Appear className="mx-auto max-w-7xl">
          <p className="mb-8 text-[0.72rem] font-medium uppercase tracking-editorial text-grove">About .CO</p>
          <h1 className="max-w-5xl font-display text-6xl font-light leading-none text-coconut md:text-8xl">
            Coconut products for real everyday rituals.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-9 text-coconut/70">
            We are building .CO around the warmth of coconut: clean taste, simple ingredients, useful formats, and a brand that feels at home.
          </p>
        </Appear>
      </PublicSection>
      <AboutJourney />
      <FounderStory />
    </>
  );
}
