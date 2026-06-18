import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Bell, Droplets, Leaf, Sparkles, Waves } from "lucide-react";
import { TenderCoconutDoodle } from "@/components/BrandDoodles";
import { Reveal } from "@/components/Motion";
import { SectionHeader } from "@/components/SectionHeader";
import { StructuredData } from "@/components/seo/StructuredData";
import { productCategories, shopProducts } from "@/lib/catalog";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Shop",
  description: "Explore .CO pre-launch coconut water, frozen dessert, kitchen, botanica, wellness and lifestyle products.",
  path: "/shop"
});

const categoryIcons = [Droplets, Sparkles, Leaf, Waves, Droplets, Sparkles];

export default function ShopPage() {
  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Shop", path: "/shop" }]} />
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fffdf8_0%,#F5EBD7_48%,rgba(168,176,123,0.3)_100%)] px-5 py-16 md:px-8 md:py-24">
        <TenderCoconutDoodle className="co-brand-doodle absolute right-5 top-10 hidden w-36 text-grove md:block" />
        <SectionHeader
          kicker="Pre-launch shop"
          title="The .CO product house."
          body="A calm catalogue for discovery, early access and distributor enquiries. Checkout will follow in a future commerce phase."
        />
        <div className="mx-auto mb-10 grid max-w-7xl gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {productCategories.map((category, index) => {
            const Icon = categoryIcons[index % categoryIcons.length];
            return (
              <span key={category} className="co-neu co-soft-depth-hover flex min-h-14 items-center justify-center gap-2 px-4 py-3 text-center text-xs uppercase tracking-editorial text-muted">
                <Icon size={15} className="text-grove" /> {category}
              </span>
            );
          })}
        </div>
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">
          {shopProducts.map((product, index) => (
            <Reveal key={product.slug} delay={index * 0.05}>
              <Link
                href={`/shop/${product.slug}`}
                data-analytics="product_interest_click"
                data-analytics-label={product.name}
                className="group co-neu co-soft-depth-hover relative block h-full overflow-hidden p-4"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_12%,rgba(74,111,74,0.12),transparent_34%),linear-gradient(180deg,rgba(255,253,248,0),rgba(216,192,122,0.12))] opacity-0 transition duration-500 group-hover:opacity-100" />
                <div className="relative mb-6 aspect-[4/5] overflow-hidden">
                  <div className="absolute inset-x-8 bottom-7 h-8 rounded-full bg-coconut/12 blur-xl" />
                  <Image src={product.image} alt={product.name} fill sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw" className="object-contain p-4 drop-shadow-[0_22px_30px_rgba(62,46,31,0.18)] transition duration-700 group-hover:scale-[1.03]" />
                </div>
                <p className="mb-3 text-[0.65rem] uppercase tracking-editorial text-grove">{product.category}</p>
                <h2 className="font-display text-3xl text-ink">{product.name}</h2>
                <p className="mt-3 text-sm leading-7 text-muted">{product.shortDescription}</p>
                <span className="mt-6 inline-flex min-h-10 items-center gap-2 border border-coconut/12 px-3 text-xs uppercase tracking-editorial text-coconut transition group-hover:border-coconut/28 group-hover:bg-coconut group-hover:text-paper">
                  Notify Me <Bell size={14} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="bg-[linear-gradient(180deg,#F5EBD7,#fffdf8)] px-5 py-16 md:px-8 md:py-20">
        <div className="co-glass mx-auto grid max-w-7xl gap-6 overflow-hidden p-6 md:grid-cols-[1fr_0.55fr_auto] md:items-center md:p-8">
          <div>
            <p className="mb-3 text-[0.72rem] uppercase tracking-editorial text-grove">Trade and distribution</p>
            <h2 className="font-display text-4xl text-ink md:text-5xl">Interested in carrying .CO?</h2>
          </div>
          <div className="relative hidden aspect-[4/3] overflow-hidden md:block">
            <Image src="/assets/generated/composition-flatlay.webp" alt=".CO coconut water lifestyle flat lay" fill sizes="24vw" className="object-contain" />
          </div>
          <Link href="/shop/co-water" className="co-button-soft inline-flex min-h-12 items-center justify-center gap-3 bg-ink px-6 py-4 text-sm text-paper">
            Distributor Enquiry <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
