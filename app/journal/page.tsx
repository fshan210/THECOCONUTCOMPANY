import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { FloatingDoodleLayer } from "@/components/BrandDoodles";
import { JournalGrid } from "@/components/JournalGrid";
import { Reveal } from "@/components/Motion";
import { SectionHeader } from "@/components/SectionHeader";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Journal",
  description: "Editorial notes on coconut culture, product thinking, origin, and the future of .CO.",
  path: "/journal"
});

export default function JournalPage() {
  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Journal", path: "/journal" }]} />
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fffdf8_0%,#F5EBD7_52%,rgba(74,111,74,0.16)_100%)] px-5 py-20 md:px-8 md:py-24">
        <FloatingDoodleLayer density="light" />
        <Reveal className="mx-auto max-w-7xl">
          <p className="mb-8 text-[0.72rem] uppercase tracking-editorial text-grove">Journal</p>
          <h1 className="max-w-5xl font-display text-6xl leading-none text-ink md:text-8xl">
            Field notes, product thinking, and coconut culture.
          </h1>
        </Reveal>
      </section>

      <section className="bg-[linear-gradient(180deg,#F5EBD7,#fffdf8)] px-5 py-20 md:px-8 md:py-24">
        <SectionHeader
          kicker="Magazine"
          title="Editorial blocks for a growing brand world."
          body="Designed for essays, founder letters, field reports, product launches, and hospitality stories without feeling like a generic blog."
        />
        <div className="mx-auto max-w-7xl">
          <JournalGrid />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-20 md:grid-cols-[1.1fr_0.9fr] md:px-8 md:py-24">
        <Reveal className="co-glass overflow-hidden p-4">
          <div className="relative aspect-[16/10] overflow-hidden bg-shell">
            <Image src="/assets/generated/composition-morning.webp" alt=".CO morning coconut water editorial scene" fill sizes="(min-width: 768px) 54vw, 92vw" className="object-contain p-3" />
          </div>
        </Reveal>
        <Reveal delay={0.1} className="border-t border-shell pt-8">
          <p className="mb-6 text-[0.72rem] uppercase tracking-editorial text-grove">Featured essay</p>
          <h2 className="font-display text-5xl leading-tight text-ink md:text-7xl">The coconut is not a trend. It is infrastructure.</h2>
          <p className="mt-7 text-lg leading-9 text-muted">
            In Kerala, coconut belongs to kitchen, ceremony, care, work, and memory. The .CO journal treats that breadth as a modern editorial system.
          </p>
          <Link href="/about" className="mt-8 inline-flex min-h-12 items-center gap-3 border border-shell px-5 text-sm text-coconut">
            Read the origin story <ArrowUpRight size={16} />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
