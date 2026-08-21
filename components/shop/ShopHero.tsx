"use client";

import { Search, Sprout, Waves, PackageCheck, HeartHandshake, X } from "lucide-react";
import { ResponsiveImage as Image } from "@/components/media/ResponsiveImage";
import type { ShopViewProduct } from "./shop-types";

const heroOrder = [
  "co-water",
  "co-kitchen-coconut-oil",
  "co-kitchen-coconut-flour",
  "melt-co-mango-coconut",
  "co-kitchen-coconut-milk",
];

const heroAssetName: Record<string, string> = {
  "co-water": "co-coconut-water-v1.webp",
  "co-kitchen-coconut-oil": "co-kitchen-coconut-oil-v1.webp",
  "co-kitchen-coconut-flour": "co-kitchen-coconut-flour-v1.webp",
  "melt-co-mango-coconut": "co-melt-coconut-mango-v1.webp",
  "co-kitchen-coconut-milk": "co-kitchen-coconut-milk-v1.webp",
};

const heroAsset = (slug: string, cartSlug: string, viewport: "desktop" | "mobile") =>
  `/assets/products/shop-hero/v1/${viewport}/${heroAssetName[slug] ?? heroAssetName[cartSlug]}`;
const transparentPixel = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

export function ShopHero({
  products,
  search,
  onSearch,
}: {
  products: ShopViewProduct[];
  search: string;
  onSearch: (value: string) => void;
}) {
  const heroProducts = heroOrder
    .map((slug) => products.find((product) => product.slug === slug || product.cartSlug === slug))
    .filter(Boolean) as ShopViewProduct[];

  return (
    <section className="relative overflow-hidden bg-[#23130c] px-4 pb-9 pt-28 text-[#f8e8d2] md:px-8 md:pb-12 md:pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_34%,rgba(177,93,42,.34),transparent_34%),radial-gradient(circle_at_22%_72%,rgba(114,60,31,.23),transparent_38%),linear-gradient(135deg,#170c08_0%,#32180d_54%,#1c0f0a_100%)]" />
      <div className="absolute inset-0 opacity-20 [background-image:repeating-linear-gradient(115deg,transparent_0_64px,rgba(255,228,194,.08)_65px,transparent_67px)]" />
      <div className="relative mx-auto grid min-h-[650px] max-w-[1440px] items-center gap-10 lg:grid-cols-[.72fr_1.28fr]">
        <div className="relative z-20 max-w-[560px]">
          <p className="text-[10px] font-semibold uppercase tracking-[.24em] text-[#d8a66f]">Shop coconut essentials</p>
          <h1 className="mt-5 font-['Cormorant_Garamond'] text-[clamp(3.2rem,5.2vw,5.2rem)] font-normal leading-[.84] tracking-[-.045em]">
            <span className="block whitespace-nowrap">Shop coconut</span>
            <span className="block whitespace-nowrap">essentials for</span>
            <em className="block whitespace-nowrap font-normal text-[#e3b77f]">everyday living.</em>
          </h1>
          <p className="mt-6 max-w-[43ch] text-sm leading-7 text-[#dec6ad]/78">
            Coconut water, kitchen staples, care and frozen rituals—built from the real .CO product shelf.
          </p>
          <label className="mt-7 flex min-h-14 max-w-[470px] items-center gap-3 rounded-full border border-[#f5d4ae]/20 bg-[#59311f]/48 px-5 shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_18px_50px_rgba(0,0,0,.18)] backdrop-blur-xl">
            <Search size={18} aria-hidden="true" />
            <span className="sr-only">Search products</span>
            <input
              type="search"
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Search products, categories…"
              className="min-w-0 flex-1 bg-transparent text-sm text-[#fff5e8] outline-none placeholder:text-[#d9bea2]/58"
            />
            {search ? <button type="button" onClick={() => onSearch("")} aria-label="Clear search" className="grid size-9 shrink-0 place-items-center rounded-full bg-white/8"><X size={15} /></button> : null}
          </label>
          <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4">
            {[
              [Waves, "Coconut-led"],
              [Sprout, "Sourcing story"],
              [PackageCheck, "Approved packs"],
              [HeartHandshake, "Made for living"],
            ].map(([Icon, label]) => {
              const Marker = Icon as typeof Waves;
              return (
                <div key={String(label)} className="flex items-center gap-2 text-[9px] leading-4 text-[#ead7c0]/74">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-[#f3d0a8]/18 bg-[#6c3a25]/38"><Marker size={15} /></span>
                  <span>{String(label)}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative mt-20 min-h-[410px] lg:mt-0 lg:min-h-[590px]" aria-label=".CO product ecosystem">
          <div className="absolute inset-x-[3%] bottom-[8%] h-[30%] rounded-[50%] bg-[linear-gradient(155deg,#825536,#4b2a1b_55%,#26130d)] shadow-[inset_0_7px_18px_rgba(255,221,178,.13),0_42px_70px_rgba(0,0,0,.46)] before:absolute before:inset-x-[4%] before:top-0 before:h-[24%] before:rounded-[50%] before:bg-[#9c6a45]/45" />
          <div className="absolute bottom-[21%] left-[2%] size-28 rounded-full bg-[radial-gradient(circle_at_42%_38%,#7f4729_0_10%,#3d2014_46%,#160b07_70%)] shadow-[0_20px_40px_rgba(0,0,0,.35)] md:size-36" aria-hidden="true" />
          <div
            className="absolute inset-x-[2%] bottom-[20%] top-[2%] bg-contain bg-bottom bg-no-repeat md:hidden"
            style={{ backgroundImage: "url('/assets/products/shop-hero/v1/mobile/co-product-ecosystem-v1.webp')" }}
            aria-hidden="true"
          />
          <div className="absolute inset-x-[7%] bottom-[20%] top-[2%] hidden items-end justify-center gap-0 sm:gap-2 md:flex">
            {heroProducts.map((product, index) => (
              <div
                key={product.slug}
                className="relative h-[58%] min-w-0 flex-1 drop-shadow-[0_24px_18px_rgba(0,0,0,.28)] sm:h-[68%]"
                style={{ transform: `translateY(${index % 2 ? 4 : -8}px)` }}
              >
                <Image
                  src={heroAsset(product.slug, product.cartSlug, "desktop")}
                  mobileSrc={transparentPixel}
                  alt={product.name}
                  fill
                  priority={index < 2}
                  sizes="(min-width:1024px) 13vw, 20vw"
                  className="object-contain object-bottom"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
