import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { CinematicWords } from "@/components/CinematicWords";
import { CoconutEcosystem } from "@/components/CoconutEcosystem";
import { MagneticButton } from "@/components/MagneticButton";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Motion";
import { SectionHeader } from "@/components/SectionHeader";
import { StructuredData } from "@/components/seo/StructuredData";
import { products } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: ".CO | The Coconut Company",
  description: "A modern coconut-origin lifestyle brand from Palakkad, Kerala. Made for Living.",
  path: "/"
});

export default function HomePage() {
  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }]} />
      <CoconutEcosystem />

      <section className="editorial-rule mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 md:grid-cols-[1fr_0.86fr] md:px-8">
        <Reveal>
          <p className="mb-8 text-[0.72rem] uppercase tracking-editorial text-grove">Palakkad, Kerala / Global by design</p>
          <CinematicWords />
          <p className="mt-8 max-w-2xl text-lg leading-9 text-muted">
            .CO is a premium coconut house shaping everyday hydration, creamery craft, botanical care, and kitchen rituals from Kerala&apos;s coconut country.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <MagneticButton>
              <Link
                href="/products"
                data-analytics="cta_click"
                data-analytics-label="home_view_products"
                className="inline-flex items-center gap-3 bg-ink px-6 py-4 text-sm text-paper"
              >
                View products <ArrowUpRight size={16} />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link
                href="/sustainability"
                data-analytics="cta_click"
                data-analytics-label="home_farm_network"
                className="inline-flex items-center gap-3 border border-shell px-6 py-4 text-sm text-coconut"
              >
                Farm network <ArrowUpRight size={16} />
              </Link>
            </MagneticButton>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="border-l border-shell pl-8">
          <p className="font-display text-4xl leading-tight text-ink md:text-6xl">
            One ingredient moving through hydration, food, care, and culture.
          </p>
        </Reveal>
      </section>

      <section className="bg-paper px-5 py-24 md:px-8">
        <SectionHeader
          kicker="House universe"
          title="Coconut, edited into modern rituals."
          body="A focused portfolio with no clutter: fresh, reserve, creamery, botanica, and kitchen systems designed to scale without losing origin."
        />
        <div className="mx-auto grid max-w-7xl gap-5">
          {products.map((product, index) => (
            <Reveal key={product.name} delay={index * 0.08}>
              <ProductCard {...product} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-24 md:grid-cols-[0.85fr_1.15fr] md:px-8">
        <Reveal>
          <p className="mb-5 text-[0.72rem] uppercase tracking-editorial text-grove">Brand posture</p>
          <h2 className="font-display text-5xl leading-tight text-ink md:text-7xl">Quiet luxury, accountable origin.</h2>
        </Reveal>
        <Reveal delay={0.12} className="grid gap-6 md:grid-cols-2">
          {["Direct aggregation", "Cold-chain discipline", "Minimal formulation", "Hospitality-ready design"].map((item) => (
            <div key={item} className="border-t border-shell pt-6">
              <h3 className="mb-4 font-display text-3xl text-ink">{item}</h3>
              <p className="text-sm leading-7 text-muted">
                Built for repeat trust: clean sourcing, measured quality, and understated design that belongs in refined everyday spaces.
              </p>
            </div>
          ))}
        </Reveal>
      </section>
    </>
  );
}
