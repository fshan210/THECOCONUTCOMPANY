"use client";

import { Search, Sprout, Waves, PackageCheck, HeartHandshake, X } from "lucide-react";
import { ResponsiveImage as Image } from "@/components/media/ResponsiveImage";
import type { ShopViewProduct } from "./shop-types";
import { ShopWaterFilm } from "./ShopWaterFilm";

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
  `/assets/products/shop-hero/v2/${viewport}/${heroAssetName[slug] ?? heroAssetName[cartSlug]}`;
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
    <section className="co-shop-hero">
      <div className="co-shop-hero__base" aria-hidden="true" />
      <ShopWaterFilm />
      <div className="co-shop-hero__veil" aria-hidden="true" />
      <div className="co-shop-hero__environment" aria-hidden="true" />
      <div className="co-shop-hero__layout">
        <div className="co-shop-hero__copy">
          <p className="co-shop-eyebrow">Shop coconut essentials</p>
          <h1>
            <span className="block whitespace-nowrap">Shop coconut</span>
            <span className="block whitespace-nowrap">essentials for</span>
            <em className="block whitespace-nowrap">everyday living.</em>
          </h1>
          <p className="co-shop-hero__support">
            Honest, natural and sustainably made—crafted for the daily rituals, from your kitchen to your self-care.
          </p>
          <label className="co-shop-hero__search">
            <Search size={18} aria-hidden="true" />
            <span className="sr-only">Search products</span>
            <input
              type="search"
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Search products, categories…"
              className="min-w-0 flex-1 bg-transparent text-xs text-[#fff5e8] outline-none placeholder:text-[#d9bea2]/58"
            />
            {search ? <button type="button" onClick={() => onSearch("")} aria-label="Clear search" className="grid size-9 shrink-0 place-items-center rounded-full bg-white/8"><X size={15} /></button> : null}
          </label>
          <div className="co-shop-hero__proofs">
            {[
              [Waves, "Coconut-led"],
              [Sprout, "Sourcing story"],
              [PackageCheck, "Approved packs"],
              [HeartHandshake, "Made for living"],
            ].map(([Icon, label]) => {
              const Marker = Icon as typeof Waves;
              return (
                <div key={String(label)}>
                  <span><Marker size={14} /></span>
                  <span>{String(label)}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="co-shop-hero__products" aria-label=".CO product ecosystem">
          <div
            className="co-shop-hero__mobile-products"
            style={{ backgroundImage: "url('/assets/products/shop-hero/v1/mobile/co-product-ecosystem-v1.webp')" }}
            aria-hidden="true"
          />
          <div className="co-shop-hero__desktop-products">
            {heroProducts.map((product, index) => (
              <div
                key={product.slug}
                className={`co-shop-hero__product co-shop-hero__product--${index + 1}`}
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
