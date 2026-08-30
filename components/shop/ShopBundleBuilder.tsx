"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Gift, Plus, X } from "lucide-react";
import { useState } from "react";
import { ResponsiveImage as Image } from "@/components/media/ResponsiveImage";
import { useCart } from "@/lib/cart/cart-context";
import { cn } from "@/lib/utils";
import type { ShopViewProduct } from "./shop-types";

const curatedSpecs = [
  { title: "Morning Hydration", copy: "A light shelf for slow starts.", scene: "sunrise", slugs: ["co-water", "co-kitchen-coconut-flour"] },
  { title: "Kitchen Starter", copy: "Everyday coconut pantry staples.", scene: "pantry", slugs: ["co-kitchen-coconut-oil", "co-kitchen-coconut-flour", "co-kitchen-coconut-milk"] },
  { title: "BOTANiCA Ritual", copy: "A calm coconut-led care edit.", scene: "botanica", slugs: ["co-botanica-shampoo", "co-botanica-face-wash", "co-botanica-body-moisturizer"] },
  { title: "MELT Treat Box", copy: "Coconut indulgence for later.", scene: "melt", slugs: ["melt-co-mango-coconut"] },
] as const;

export function ShopBundleBuilder({ products }: { products: ShopViewProduct[] }) {
  const cart = useCart();
  const reducedMotion = useReducedMotion();
  const [selected, setSelected] = useState<string[]>([
    "co-water",
    "co-kitchen-coconut-oil",
    "co-botanica-shampoo",
  ]);
  const [added, setAdded] = useState(false);
  const minItems = 3;
  const maxSlots = 5;
  const selectedProducts = selected.map((slug) => products.find((product) => product.slug === slug)!).filter(Boolean);
  const total = selectedProducts.reduce((sum, product) => sum + product.price, 0);

  const toggle = (slug: string) => {
    setAdded(false);
    setSelected((current) => current.includes(slug) ? current.filter((item) => item !== slug) : current.length < maxSlots ? [...current, slug] : current);
  };
  const addBundle = () => {
    if (selectedProducts.length < minItems) return;
    selectedProducts.forEach((product) => cart.addItem(product.cartSlug));
    setAdded(true);
  };

  return (
    <>
      <section id="bundle-builder" className="co-shop-ritual" aria-labelledby="bundle-title">
        <div className="co-shop-ritual__dissolve" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1340px]">
        <div className="co-shop-bundle-builder grid gap-7 rounded-[30px] p-5 md:grid-cols-[.68fr_1.32fr] md:p-7">
          <div className="flex flex-col justify-center">
            <p className="text-[9px] font-semibold uppercase tracking-[.22em] text-[#d99c62]">Build your ritual</p>
            <h2 id="bundle-title" className="mt-4 max-w-[10ch] font-['Cormorant_Garamond'] text-[clamp(2.75rem,4vw,4.25rem)] font-normal leading-[.86] tracking-[-.04em]">Build a .CO Bundle that&apos;s <em>yours.</em></h2>
            <p className="mt-5 max-w-[42ch] text-xs leading-6 text-[#ddc4aa]/72">Handpick your favourites and compose an everyday coconut shelf around your own rituals.</p>
            <div className="mt-6 space-y-3 text-[11px] text-[#ead2b7]/82">
              {["Pick 3 or more products", "See the exact catalog total", "Thoughtfully packed. Beautifully you."].map((item) => <p key={item} className="flex items-center gap-3"><span className="grid size-6 place-items-center rounded-full border border-[#d99c62]/32"><Check size={12} /></span>{item}</p>)}
            </div>
          </div>

          <div className="co-shop-bundle-slab overflow-hidden rounded-[28px] p-3 md:p-5">
            <div className="co-shop-bundle-slots grid min-h-[250px] grid-cols-5 gap-2 rounded-[22px] p-3 md:min-h-[300px] md:gap-3 md:p-5">
              {Array.from({ length: maxSlots }).map((_, index) => {
                const product = selectedProducts[index];
                return (
                  <div key={product?.slug ?? `slot-${index}`} className="co-shop-bundle-slot relative min-w-0 overflow-hidden rounded-[18px]">
                    <AnimatePresence mode="wait">
                      {product ? (
                        <motion.div key={product.slug} initial={reducedMotion ? false : { opacity: 0, y: 14, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reducedMotion ? undefined : { opacity: 0, y: 12, scale: .97 }} transition={{ duration: reducedMotion ? 0 : .46, ease: [0.16,1,0.3,1] }} className="absolute inset-0 drop-shadow-[0_20px_12px_rgba(0,0,0,.38)]">
                          <Image src={product.image} alt={product.name} fill sizes="(min-width:768px) 10vw, 18vw" className="object-contain p-1.5 md:p-3" />
                          <button type="button" onClick={() => toggle(product.slug)} aria-label={`Remove ${product.name} from bundle`} className="absolute right-1 top-1 grid size-8 place-items-center rounded-full bg-[#f5e7d7]/88 text-[#321a11]"><X size={13} /></button>
                        </motion.div>
                      ) : <div className="absolute inset-0 grid place-items-center text-[#d8a36f]/58"><Plus size={24} strokeWidth={1.4} /><span className="sr-only">Empty bundle slot</span></div>}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex snap-x gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
              {products.map((product) => {
                const active = selected.includes(product.slug);
                return (
                  <button type="button" key={product.slug} onClick={() => toggle(product.slug)} aria-pressed={active} className={cn("flex min-w-[150px] snap-start items-center gap-2 rounded-[16px] border px-2 py-2 text-left transition", active ? "border-[#dba16b] bg-[#8a4c2d]/52" : "border-[#e4b384]/15 bg-[#fff]/[.035]") }>
                    <span className="relative size-12 shrink-0"><Image src={product.image} alt="" fill sizes="48px" className="object-contain" /></span>
                    <span className="min-w-0"><strong className="line-clamp-2 block text-[9px] leading-4">{product.name}</strong><small className="text-[8px] text-[#d7b89a]/70">₹{product.price.toLocaleString("en-IN")}</small></span>
                  </button>
                );
              })}
            </div>
            <div className="mt-2 grid gap-3 rounded-[18px] border border-[#e0a66d]/14 bg-[#1d0f0a]/38 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="flex items-end justify-between gap-5 sm:justify-start"><span><small className="block text-[8px] uppercase tracking-[.14em] text-[#cfad8d]/65">Selected</small><strong className="mt-1 block text-sm">{selected.length} / {maxSlots} products</strong></span><span><small className="block text-[8px] uppercase tracking-[.14em] text-[#cfad8d]/65">Catalog total</small><strong className="mt-1 block text-2xl tabular-nums">₹{total.toLocaleString("en-IN")}</strong></span></div>
              <button type="button" onClick={addBundle} disabled={selected.length < minItems} className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#8b4f30] px-6 text-[10px] font-semibold uppercase text-white transition hover:bg-[#a45d38] disabled:cursor-not-allowed disabled:opacity-40">{added ? "Added to cart" : selected.length < minItems ? `Choose ${minItems - selected.length} more` : "Create bundle"}<ArrowRight size={14} /></button>
            </div>
            <p className="mt-3 flex items-center gap-2 text-[9px] text-[#d8b99a]/60"><Gift size={13} /> Gift fulfilment is not collected until a supported flow exists.</p>
          </div>
        </div>

        </div>
      </section>

      <section className="co-shop-curated-section" aria-labelledby="curated-bundles-title">
        <div className="relative mx-auto max-w-[1340px]">
        <div className="co-shop-curated">
          <div className="co-shop-curated__heading"><div><p className="text-[9px] font-semibold uppercase tracking-[.22em] text-[#d99c62]">Curated for you</p>
          <h3 id="curated-bundles-title" className="mt-3 font-['Cormorant_Garamond'] text-4xl font-normal leading-[.9] md:text-5xl">Thoughtful bundles.<br />Beautifully crafted.</h3></div></div>
          <div className="co-shop-curated__rail mt-5 flex snap-x gap-3 overflow-x-auto pb-3 [scrollbar-width:none] md:grid md:grid-cols-4">
            {curatedSpecs.map((spec) => {
              const setProducts = spec.slugs.map((slug) => products.find((product) => product.slug === slug || product.cartSlug === slug)).filter(Boolean) as ShopViewProduct[];
              const setTotal = setProducts.reduce((sum, product) => sum + product.price, 0);
              return (
                <article key={spec.title} className="co-shop-curated-card min-w-[86vw] snap-start rounded-[22px] p-3 sm:min-w-[340px] md:min-w-0">
                  <div className={`co-shop-curated-card__scene co-shop-curated-card__scene--${spec.scene} flex h-44 items-end justify-center gap-1 rounded-[16px] p-3`}>
                    {setProducts.map((product) => <span key={product.slug} className="co-shop-curated-card__product relative h-full min-w-0 flex-1"><Image src={product.image} alt={product.name} fill sizes="(min-width:768px) 8vw, 28vw" className="object-contain object-bottom" /></span>)}
                  </div>
                  <h4 className="mt-4 font-['Cormorant_Garamond'] text-2xl">{spec.title}</h4>
                  <p className="mt-1 text-[10px] leading-4 text-[#d9bea3]/68">{spec.copy}<br />{setProducts.length} catalog {setProducts.length === 1 ? "product" : "products"} · ₹{setTotal.toLocaleString("en-IN")}</p>
                  <button type="button" onClick={() => { setSelected(setProducts.slice(0,maxSlots).map((product) => product.slug)); setAdded(false); document.getElementById("bundle-builder")?.scrollIntoView({ behavior: "smooth" }); }} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-[#dca269]/22 bg-[#7d452a]/42 text-[9px] font-semibold uppercase">Build this set <ArrowRight size={13} /></button>
                </article>
              );
            })}
          </div>
        </div>
        </div>
      </section>
    </>
  );
}
