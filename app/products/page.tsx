import type { Metadata } from "next";
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

export default function ProductsPage() {
  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Products", path: "/products" }]} />
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8">
        <Reveal className="max-w-5xl">
          <p className="mb-8 text-[0.72rem] uppercase tracking-editorial text-grove">Products</p>
          <h1 className="font-display text-6xl leading-none text-ink md:text-8xl">
            Five verticals, one coconut standard.
          </h1>
        </Reveal>
      </section>

      <section className="bg-paper px-5 py-24 md:px-8">
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
