import type { Metadata } from "next";
import { Droplets, Leaf, Sparkles, Waves } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Appear } from "@/components/motion/Appear";
import { DoodleImage, PublicHeader, PublicSection } from "@/components/PublicDesign";
import { BrandImage } from "@/components/BrandImage";
import { StructuredData } from "@/components/seo/StructuredData";
import { products } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo/metadata";
import { publicAssets } from "@/lib/public-assets";

export const metadata: Metadata = createPageMetadata({
  title: "Products",
  description: "Explore the .CO coconut ecosystem: coconut water, ice cream, kitchen, botanica, wellness and lifestyle.",
  path: "/products"
});

const rituals = [
  { title: "Drink", body: "Cold coconut water for warm days and easy resets.", icon: Droplets },
  { title: "Scoop", body: "Coconut-led dessert for small sweet rituals.", icon: Sparkles },
  { title: "Cook", body: "Kitchen notes for everyday food.", icon: Leaf },
  { title: "Care", body: "Gentle coconut-inspired shelf rituals.", icon: Waves }
];

export default function ProductsPage() {
  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Products", path: "/products" }]} />
      <PublicSection className="pt-28 md:pt-32">
        <DoodleImage src={publicAssets.doodles.tetra} className="right-8 top-20 h-36 w-36 md:h-56 md:w-56" />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <Appear>
            <p className="mb-8 text-[0.72rem] font-medium uppercase tracking-editorial text-grove">Products</p>
            <h1 className="max-w-5xl font-display text-6xl font-light leading-none text-coconut md:text-8xl">
              One coconut world, edited for daily life.
            </h1>
          </Appear>
          <Appear delay={0.1} className="relative">
            <div className="absolute -left-8 -top-10 z-10 rounded-full bg-sun px-5 py-3 text-[0.68rem] font-medium uppercase tracking-editorial text-coconut shadow-[0_18px_40px_rgba(62,46,31,0.12)]">
              Drink / Scoop / Cook / Care
            </div>
            <BrandImage src={publicAssets.water.flatLay} alt=".CO product ecosystem flat lay" sizes="(min-width: 1024px) 48vw, 92vw" aspect="wide" fit="cover" hoverZoom priority className="shadow-[0_28px_90px_rgba(62,46,31,0.1)]" />
          </Appear>
        </div>
      </PublicSection>

      <PublicSection tone="warm" className="py-14 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rituals.map((item) => {
            const Icon = item.icon;
            return (
              <Appear key={item.title}>
                <article className="h-full rounded-3xl border border-coconut/10 bg-paper p-6 shadow-[0_14px_40px_rgba(62,46,31,0.05)]">
                  <Icon className="mb-8 text-grove" size={24} />
                  <h2 className="font-display text-3xl font-light text-coconut">{item.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-coconut/68">{item.body}</p>
                </article>
              </Appear>
            );
          })}
        </div>
      </PublicSection>

      <PublicSection>
        <PublicHeader kicker="Portfolio" title="A focused product house without the noise." body="Each product line has a clear role in the coconut ritual: drink, scoop, cook, care, or live with it." />
        <div className="mx-auto grid max-w-7xl gap-5">
          {products.map((product, index) => (
            <Appear key={product.name} delay={index * 0.06}>
              <ProductCard {...product} />
            </Appear>
          ))}
        </div>
      </PublicSection>
    </>
  );
}
