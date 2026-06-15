import type { Metadata } from "next";
import Image from "next/image";
import { Leaf, Route, Sprout } from "lucide-react";
import { impactMetrics } from "@/lib/content";
import { Reveal } from "@/components/Motion";
import { SectionHeader } from "@/components/SectionHeader";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";
import { AnimatedMetric } from "./sustainability-metric";

export const metadata: Metadata = createPageMetadata({
  title: "Sustainability",
  description: "Direct farm systems, village aggregation, and responsible coconut sourcing from Kerala.",
  path: "/sustainability"
});

const commitments = [
  { title: "Village-first procurement", body: "Build practical aggregation around farmer access, harvest timing, and lower handling loss.", icon: Sprout },
  { title: "Traceable batch thinking", body: "Move every launch product toward clearer origin, process, and route visibility.", icon: Route },
  { title: "Whole coconut value", body: "Develop water, food, kitchen, care, and lifestyle formats from the same agricultural base.", icon: Leaf }
];

export default function SustainabilityPage() {
  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Sustainability", path: "/sustainability" }]} />
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-[0.95fr_1.05fr] md:items-center md:px-8 md:py-24">
        <Reveal className="max-w-5xl">
          <p className="mb-8 text-[0.72rem] uppercase tracking-editorial text-grove">Sustainability</p>
          <h1 className="font-display text-6xl leading-none text-ink md:text-8xl">
            Direct farm systems, village-first growth.
          </h1>
        </Reveal>
        <Reveal delay={0.1} className="co-glass relative aspect-[4/3] overflow-hidden">
          <Image src="/optimized/assets-farming-coconut-grove.webp" alt="Coconut grove supporting .CO village-first sourcing" fill priority sizes="(min-width: 768px) 48vw, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-coconut/55 via-transparent to-paper/10" />
          <div className="absolute bottom-5 left-5 right-5 text-paper">
            <p className="text-[0.65rem] uppercase tracking-editorial text-paper/70">Origin system</p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-paper/82">Sourcing architecture starts with farms, villages, and process discipline before scale.</p>
          </div>
        </Reveal>
      </section>

      <section className="bg-paper px-5 py-24 md:px-8">
        <SectionHeader
          kicker="Aggregation metrics"
          title="Visible impact from the start."
          body="The launch framework prioritizes traceable village clusters, predictable farmer relationships, and local processing pathways before scale."
        />
        <div className="mx-auto grid max-w-7xl gap-px bg-shell md:grid-cols-4">
          {impactMetrics.map((metric, index) => (
            <AnimatedMetric key={metric.label} metric={metric} delay={index * 0.1} />
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-16 md:grid-cols-3 md:px-8 md:py-24">
        {commitments.map((item, index) => {
          const Icon = item.icon;
          return (
            <Reveal key={item.title} delay={index * 0.08}>
              <article className="co-neu h-full p-7">
                <Icon className="mb-8 text-grove" size={24} />
                <h2 className="font-display text-3xl leading-tight text-ink">{item.title}</h2>
                <p className="mt-4 text-sm leading-7 text-muted">{item.body}</p>
              </article>
            </Reveal>
          );
        })}
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 md:grid-cols-[1fr_1fr] md:px-8 md:pb-24">
        <Reveal>
          <h2 className="font-display text-5xl leading-tight text-ink md:text-7xl">A supply chain with names, villages, and memory.</h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="text-lg leading-9 text-muted">
            .CO&apos;s sustainability stance begins with procurement architecture: direct aggregation where possible, transparent batch data, lower handling loss, and village-level participation in value creation.
          </p>
        </Reveal>
      </section>
    </>
  );
}
