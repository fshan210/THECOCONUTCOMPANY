import Image from "next/image";
import type { Metadata } from "next";
import { Globe2, Sprout, Store } from "lucide-react";
import { FloatingDoodleLayer } from "@/components/BrandDoodles";
import { JournalGrid } from "@/components/JournalGrid";
import { Reveal } from "@/components/Motion";
import { SectionHeader } from "@/components/SectionHeader";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";

const founders = [
  {
    name: "Fazil Shersha",
    role: "Founder / Brand and growth",
    image: "/assets/transparent/co-social-media-pack.webp",
    bio: "Leads the company's global positioning, commercial architecture, and premium coconut house vision from Palakkad outward."
  },
  {
    name: "Afsala Muthali",
    role: "Co-founder / Product and culture",
    image: "/optimized/images-social-media-mockups-1.webp",
    bio: "Shapes the product sensibility, everyday ritual lens, and human warmth that keeps .CO grounded as it scales."
  }
];

const journey = [
  { title: "Palakkad", body: "Start close to coconut country, farmer relationships, and everyday Kerala rituals.", icon: Sprout },
  { title: "India launch", body: "Build a focused product house for modern retail, hospitality, and homes.", icon: Store },
  { title: "Global route", body: "Carry the brand into GCC and international markets without losing origin.", icon: Globe2 }
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
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fffdf8_0%,#F5EBD7_52%,rgba(168,176,123,0.28)_100%)] px-5 py-16 md:px-8 md:py-24">
        <FloatingDoodleLayer density="light" />
        <Reveal className="mx-auto max-w-7xl">
          <p className="mb-8 text-[0.72rem] uppercase tracking-editorial text-grove">Founders</p>
          <h1 className="max-w-5xl font-display text-6xl leading-none text-ink md:text-8xl">
            Built by founders close to the origin.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-9 text-muted">
            A founder-led coconut house shaped by Palakkad memory, international retail discipline, and products designed for everyday use.
          </p>
        </Reveal>
      </section>

      <section className="bg-[linear-gradient(180deg,#F5EBD7,#fffdf8)] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2">
          {founders.map((founder, index) => (
            <Reveal key={founder.name} delay={index * 0.1}>
              <article className="co-glass co-soft-depth-hover h-full overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden bg-shell">
                  <Image src={founder.image} alt={founder.name} fill sizes="(min-width: 768px) 46vw, 90vw" className="object-cover transition duration-700 hover:scale-[1.03]" />
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

      <section className="relative overflow-hidden px-5 py-16 md:px-8 md:py-24">
        <div className="co-wave-pattern pointer-events-none absolute inset-y-0 right-0 w-80 opacity-[0.08]" />
        <div className="mx-auto mb-16 grid max-w-7xl gap-5 md:grid-cols-3">
          {journey.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={index * 0.08}>
                <article className="co-neu h-full p-7">
                  <Icon className="mb-8 text-grove" size={24} />
                  <h2 className="font-display text-3xl text-ink">{item.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-muted">{item.body}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
        <SectionHeader kicker="Journal" title="Notes from the founders' desk." />
        <div className="mx-auto max-w-7xl">
          <JournalGrid />
        </div>
      </section>
    </>
  );
}
