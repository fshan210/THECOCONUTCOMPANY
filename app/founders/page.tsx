import Image from "next/image";
import type { Metadata } from "next";
import { JournalGrid } from "@/components/JournalGrid";
import { Reveal } from "@/components/Motion";
import { SectionHeader } from "@/components/SectionHeader";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";

const founders = [
  {
    name: "Fazil Shersha",
    role: "Founder / Brand and growth",
    image: "/optimized/images-social-media-mockup-2.webp",
    bio: "Leads the company's global positioning, commercial architecture, and premium coconut house vision from Palakkad outward."
  },
  {
    name: "Afsala Muthali",
    role: "Co-founder / Product and culture",
    image: "/optimized/images-social-media-mockups-1.webp",
    bio: "Shapes the product sensibility, everyday ritual lens, and human warmth that keeps .CO grounded as it scales."
  }
];

export const metadata: Metadata = createPageMetadata({
  title: "Founders",
  description: "Meet Fazil Shersha and Afsala Muthali, the founders building .CO from Palakkad to a global coconut house.",
  path: "/founders"
});

export default function FoundersPage() {
  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Founders", path: "/founders" }]} />
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8">
        <Reveal className="max-w-5xl">
          <p className="mb-8 text-[0.72rem] uppercase tracking-editorial text-grove">Founders</p>
          <h1 className="font-display text-6xl leading-none text-ink md:text-8xl">
            Built by founders close to the origin.
          </h1>
        </Reveal>
      </section>

      <section className="bg-paper px-5 py-24 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2">
          {founders.map((founder, index) => (
            <Reveal key={founder.name} delay={index * 0.1}>
              <article className="bg-porcelain">
                <div className="relative aspect-[4/3] overflow-hidden bg-shell">
                  <Image src={founder.image} alt={founder.name} fill sizes="(min-width: 768px) 46vw, 90vw" className="object-cover" />
                </div>
                <div className="p-8 md:p-10">
                  <p className="mb-4 text-[0.7rem] uppercase tracking-editorial text-grove">{founder.role}</p>
                  <h2 className="font-display text-5xl text-ink">{founder.name}</h2>
                  <p className="mt-6 text-base leading-8 text-muted">{founder.bio}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-5 py-24 md:px-8">
        <SectionHeader kicker="Journal" title="Notes from the founders' desk." />
        <div className="mx-auto max-w-7xl">
          <JournalGrid />
        </div>
      </section>
    </>
  );
}
