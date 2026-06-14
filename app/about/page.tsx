import type { Metadata } from "next";
import { AboutJourney } from "@/components/AboutJourney";
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
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8">
        <Reveal className="max-w-4xl">
          <p className="mb-8 text-[0.72rem] uppercase tracking-editorial text-grove">About .CO</p>
          <h1 className="font-display text-6xl leading-none text-ink md:text-8xl">
            From Palakkad roots to a global coconut house.
          </h1>
        </Reveal>
      </section>

      <AboutJourney />
      <FounderStory />

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-24 md:grid-cols-3 md:px-8">
        {["Origin", "Design", "Scale"].map((title) => (
          <Reveal key={title}>
            <div className="border-t border-shell pt-8">
              <h2 className="mb-5 font-display text-4xl text-ink">{title}</h2>
              <p className="text-sm leading-7 text-muted">
                The company balances Kerala sourcing intelligence with a globally legible brand system: precise, warm, and built for long horizons.
              </p>
            </div>
          </Reveal>
        ))}
      </section>
    </>
  );
}
