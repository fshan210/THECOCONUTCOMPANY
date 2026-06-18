import type { Metadata } from "next";
import { Droplets, Leaf, Sparkles, Waves } from "lucide-react";
import { FloatingDoodleLayer, PalmLeafDoodle } from "@/components/BrandDoodles";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Motion";
import { SectionHeader } from "@/components/SectionHeader";
import { StructuredData } from "@/components/seo/StructuredData";
import { products } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Products",
  description: "Explore the .CO coconut ecosystem: Pure, Reserve, Creamery, Botanica, and Kitchen.",
  path: "/products"
});

const rituals = [
  { title: "Drink", body: "Tender coconut water for daily hydration and hospitality chillers.", icon: Droplets },
  { title: "Scoop", body: "Coconut-led desserts for cafe counters and home freezers.", icon: Sparkles },
  { title: "Cook", body: "Kitchen formats for sauces, finishing, pantry, and chef use.", icon: Leaf },
  { title: "Care", body: "Future body, hair, and wellness rituals with restrained claims.", icon: Waves }
];

export default function ProductsPage() {
  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Products", path: "/products" }]} />
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fffdf8_0%,#F5EBD7_52%,rgba(168,176,123,0.28)_100%)] px-5 py-16 md:px-8 md:py-24">
        <FloatingDoodleLayer density="light" />
        <div className="mx-auto max-w-7xl">
        <PalmLeafDoodle className="co-brand-doodle absolute right-6 top-12 hidden w-44 text-grove md:block" />
        <Reveal className="max-w-5xl">
          <p className="mb-8 text-[0.72rem] uppercase tracking-editorial text-grove">Products</p>
          <h1 className="font-display text-6xl leading-none text-ink md:text-8xl">
            Five verticals, one coconut standard.
          </h1>
        </Reveal>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#F5EBD7,#fffdf8)] px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rituals.map((item) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title}>
                <article className="co-neu co-soft-depth-hover h-full p-6">
                  <Icon className="mb-8 text-grove" size={24} />
                  <h2 className="font-display text-3xl text-ink">{item.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-muted">{item.body}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="co-wave-edge relative overflow-hidden bg-[linear-gradient(135deg,#F5EBD7_0%,#fffdf8_58%,rgba(74,111,74,0.14)_100%)] px-5 py-16 md:px-8 md:py-24">
        <SectionHeader
          kicker="Portfolio"
          title="No cart. No noise. Just the house system."
          body="Each product line is designed as a story module for brand education, hospitality conversations, and premium retail discovery."
        />
        <div className="mx-auto max-w-7xl">
          {products.map((product, index) => (
            <Reveal key={product.name} delay={index * 0.06}>
              <ProductCard {...product} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
