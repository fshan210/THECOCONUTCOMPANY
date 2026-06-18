import type { Metadata } from "next";
import { AboutJourney } from "@/components/AboutJourney";
import { CoconutSliceDoodle, FloatingDoodleLayer } from "@/components/BrandDoodles";
import { FounderStory } from "@/components/FounderStory";
import { Reveal } from "@/components/Motion";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description: "The roots, sourcing journey, and global vision behind .CO | The Coconut Company from Palakkad, Kerala.",
  path: "/about"
});

export default function AboutPage() {
  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "About", path: "/about" }]} />
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fffdf8_0%,#F5EBD7_52%,rgba(74,111,74,0.16)_100%)] px-5 py-20 md:px-8 md:py-24">
        <FloatingDoodleLayer density="light" />
        <div className="mx-auto max-w-7xl">
        <CoconutSliceDoodle className="co-brand-doodle absolute right-8 top-12 hidden w-40 text-coconut md:block" />
        <Reveal className="max-w-4xl">
          <p className="mb-8 text-[0.72rem] uppercase tracking-editorial text-grove">About .CO</p>
          <h1 className="font-display text-6xl leading-none text-ink md:text-8xl">
            From Palakkad roots to a global coconut house.
          </h1>
        </Reveal>
        </div>
      </section>

      <AboutJourney />
      <FounderStory />

      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fffdf8,#F5EBD7)] px-5 py-20 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
        {["Origin", "Design", "Scale"].map((title) => (
          <Reveal key={title}>
            <div className="co-glass h-full p-8">
              <h2 className="mb-5 font-display text-4xl text-ink">{title}</h2>
              <p className="text-sm leading-7 text-muted">
                The company balances Kerala sourcing intelligence with a globally legible brand system: precise, warm, and built for long horizons.
              </p>
            </div>
          </Reveal>
        ))}
        </div>
      </section>
    </>
  );
}
