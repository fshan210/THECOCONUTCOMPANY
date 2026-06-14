import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Bell } from "lucide-react";
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

export default function ShopPage() {
  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Shop", path: "/shop" }]} />
      <section className="px-5 py-24 md:px-8">
        <SectionHeader
          kicker="Pre-launch shop"
          title="The .CO product house."
          body="A calm catalogue for discovery, early access and distributor enquiries. Checkout will follow in a future commerce phase."
        />
        <div className="mx-auto mb-10 flex max-w-7xl flex-wrap justify-center gap-3">
          {productCategories.map((category) => (
            <span key={category} className="border border-shell bg-paper px-4 py-3 text-xs uppercase tracking-editorial text-muted">
              {category}
            </span>
          ))}
        </div>
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">
          {shopProducts.map((product, index) => (
            <Reveal key={product.slug} delay={index * 0.05}>
              <Link
                href={`/shop/${product.slug}`}
                data-analytics="product_interest_click"
                data-analytics-label={product.name}
                className="group block border border-shell bg-porcelain p-4 transition duration-500 hover:-translate-y-1 hover:shadow-soft"
              >
                <div className="relative mb-6 aspect-[4/5] overflow-hidden bg-shell">
                  <Image src={product.image} alt={product.name} fill sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" />
                </div>
                <p className="mb-3 text-[0.65rem] uppercase tracking-editorial text-grove">{product.category}</p>
                <h2 className="font-display text-3xl text-ink">{product.name}</h2>
                <p className="mt-3 text-sm leading-7 text-muted">{product.shortDescription}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-editorial text-coconut">
                  Notify Me <Bell size={14} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="bg-paper px-5 py-20 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="mb-3 text-[0.72rem] uppercase tracking-editorial text-grove">Trade and distribution</p>
            <h2 className="font-display text-4xl text-ink md:text-5xl">Interested in carrying .CO?</h2>
          </div>
          <Link href="/shop/co-water" className="inline-flex items-center gap-3 bg-ink px-6 py-4 text-sm text-paper">
            Distributor Enquiry <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
