import type { Metadata } from "next";
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

export default function SustainabilityPage() {
  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Sustainability", path: "/sustainability" }]} />
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8">
        <Reveal className="max-w-5xl">
          <p className="mb-8 text-[0.72rem] uppercase tracking-editorial text-grove">Sustainability</p>
          <h1 className="font-display text-6xl leading-none text-ink md:text-8xl">
            Direct farm systems, village-first growth.
          </h1>
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

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-24 md:grid-cols-[1fr_1fr] md:px-8">
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
