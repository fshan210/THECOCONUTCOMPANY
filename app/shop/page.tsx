import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Bell, Droplets, Leaf, Sparkles, Waves } from "lucide-react";
import { Appear } from "@/components/motion/Appear";
import { DoodleImage, HoverImageFrame, PublicHeader, PublicSection } from "@/components/PublicDesign";
import { StructuredData } from "@/components/seo/StructuredData";
import { productCategories, shopProducts } from "@/lib/catalog";
import { createPageMetadata } from "@/lib/seo/metadata";
import { publicAssets } from "@/lib/public-assets";

export const metadata: Metadata = createPageMetadata({
  title: "Shop",
  description: "Explore .CO coconut water, ice cream, kitchen, botanica, wellness and lifestyle previews.",
  path: "/shop"
});

const categoryIcons = [Droplets, Sparkles, Leaf, Waves, Droplets, Sparkles];

export default function ShopPage() {
  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Shop", path: "/shop" }]} />
      <PublicSection className="pt-28 md:pt-32">
        <DoodleImage src={publicAssets.doodles.bottle} className="right-8 top-20 h-36 w-36 md:h-56 md:w-56" />
        <PublicHeader
          kicker="Shop"
          title="The .CO product shelf."
          body="Explore the products, save your favourites, and join early access for tasting notes and first drops."
        />
        <div className="mx-auto mb-10 grid max-w-7xl gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {productCategories.map((category, index) => {
            const Icon = categoryIcons[index % categoryIcons.length];
            return (
              <span key={category} className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-coconut/10 bg-[#fff8ea] px-4 py-3 text-center text-xs font-medium uppercase tracking-editorial text-coconut/68">
                <Icon size={15} className="text-grove" /> {category}
              </span>
            );
          })}
        </div>
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">
          {shopProducts.map((product, index) => (
            <Appear key={product.slug} delay={index * 0.05}>
              <Link href={`/shop/${product.slug}`} data-analytics="product_interest_click" data-analytics-label={product.name} className="group block h-full rounded-3xl border border-coconut/10 bg-[#fff8ea] p-4 shadow-[0_18px_48px_rgba(62,46,31,0.06)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_24px_64px_rgba(62,46,31,0.1)]">
                <HoverImageFrame src={product.image} hoverSrc={product.hoverImage} alt={product.name} sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 92vw" className="mb-6 aspect-[4/5]" />
                <p className="mb-3 text-[0.65rem] font-medium uppercase tracking-editorial text-grove">{product.category}</p>
                <h2 className="font-display text-3xl font-light text-coconut">{product.name}</h2>
                <p className="mt-3 text-sm leading-7 text-coconut/68">{product.shortDescription}</p>
                <span className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-2xl border border-coconut/12 px-3 text-xs font-medium uppercase tracking-editorial text-coconut transition group-hover:border-grove group-hover:bg-grove group-hover:text-paper">
                  Notify Me <Bell size={14} />
                </span>
              </Link>
            </Appear>
          ))}
        </div>
      </PublicSection>
      <PublicSection tone="warm" className="py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 overflow-hidden rounded-3xl border border-coconut/10 bg-paper p-6 shadow-[0_18px_48px_rgba(62,46,31,0.06)] md:grid-cols-[1fr_0.55fr_auto] md:items-center md:p-8">
          <div>
            <p className="mb-3 text-[0.72rem] font-medium uppercase tracking-editorial text-grove">Early access</p>
            <h2 className="font-display text-4xl font-light text-coconut md:text-5xl">Want the first taste note?</h2>
          </div>
          <div className="relative hidden aspect-[4/3] overflow-hidden rounded-2xl md:block">
            <Image src={publicAssets.water.flatLay} alt=".CO coconut water flat lay" fill sizes="24vw" className="object-cover" />
          </div>
          <Link href="/shop/co-water" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-2xl bg-coconut px-6 py-4 text-sm font-medium text-paper transition hover:bg-grove">
            Join early access
          </Link>
        </div>
      </PublicSection>
    </>
  );
}
