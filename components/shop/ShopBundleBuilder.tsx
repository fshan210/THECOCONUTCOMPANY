"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Gift, Plus, X } from "lucide-react";
import { useState } from "react";
import { ResponsiveImage as Image } from "@/components/media/ResponsiveImage";
import { useCart } from "@/lib/cart/cart-context";
import { cn } from "@/lib/utils";
import type { ShopViewProduct } from "./shop-types";

const curatedSpecs = [
  { title: "Morning Hydration", slugs: ["co-water", "co-kitchen-coconut-flour"] },
  { title: "Kitchen Starter", slugs: ["co-kitchen-coconut-oil", "co-kitchen-coconut-flour", "co-kitchen-coconut-milk"] },
  { title: "BOTANiCA Ritual", slugs: ["co-botanica-shampoo", "co-botanica-face-wash", "co-botanica-body-moisturizer"] },
  { title: "MELT Treat", slugs: ["melt-co-mango-coconut"] },
] as const;

export function ShopBundleBuilder({ products }: { products: ShopViewProduct[] }) {
  const cart = useCart();
  const reducedMotion = useReducedMotion();
  const [selected, setSelected] = useState<string[]>([]);
  const [added, setAdded] = useState(false);
  const maxSlots = 5;
  const selectedProducts = selected.map((slug) => products.find((product) => product.slug === slug)!).filter(Boolean);
  const total = selectedProducts.reduce((sum, product) => sum + product.price, 0);

  const toggle = (slug: string) => {
    setAdded(false);
    setSelected((current) => current.includes(slug) ? current.filter((item) => item !== slug) : current.length < maxSlots ? [...current, slug] : current);
  };
  const addBundle = () => {
    selectedProducts.forEach((product) => cart.addItem(product.cartSlug));
    setAdded(Boolean(selectedProducts.length));
  };

  return (
    <section id="bundle-builder" className="relative overflow-hidden bg-[#21120c] px-4 py-12 text-[#f5dfc5] md:px-8 md:py-16" aria-labelledby="bundle-title">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_26%,rgba(174,91,44,.25),transparent_32%),linear-gradient(180deg,#28150d,#1a0e09)]" />
      <div className="relative mx-auto max-w-[1340px]">
        <div className="grid gap-7 rounded-[34px] border border-[#e2a86f]/20 bg-[#4a2819]/38 p-5 shadow-[inset_0_1px_0_rgba(255,238,218,.07),0_28px_70px_rgba(0,0,0,.25)] md:grid-cols-[.72fr_1.28fr] md:p-8">
          <div className="flex flex-col justify-center">
            <p className="text-[9px] font-semibold uppercase tracking-[.22em] text-[#d99c62]">Build your ritual</p>
            <h2 id="bundle-title" className="mt-4 max-w-[9ch] font-['Cormorant_Garamond'] text-[clamp(3rem,5vw,5rem)] font-normal leading-[.84] tracking-[-.04em]">Build a .CO Bundle that&apos;s yours.</h2>
            <p className="mt-5 max-w-[42ch] text-sm leading-7 text-[#ddc4aa]/72">Pick up to five real catalog products. The total is the exact product sum; no unconfigured discount is implied.</p>
            <div className="mt-6 space-y-3 text-[11px] text-[#ead2b7]/82">
              {["Choose from the current product preview", "See the running catalog total", "Add every selected item to your cart"].map((item) => <p key={item} className="flex items-center gap-3"><span className="grid size-6 place-items-center rounded-full border border-[#d99c62]/32"><Check size={12} /></span>{item}</p>)}
            </div>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-[#e2a86f]/22 bg-[#321a11] p-3 shadow-[inset_0_0_0_5px_rgba(111,56,31,.28),0_25px_60px_rgba(0,0,0,.28)] md:p-5">
            <div className="grid min-h-[250px] grid-cols-5 gap-2 rounded-[22px] border border-[#dd9c60]/16 bg-[linear-gradient(150deg,#58331f,#2a160e)] p-3 md:min-h-[330px] md:gap-3 md:p-5">
              {Array.from({ length: maxSlots }).map((_, index) => {
                const product = selectedProducts[index];
                return (
                  <div key={product?.slug ?? `slot-${index}`} className="relative min-w-0 overflow-hidden rounded-[18px] border border-dashed border-[#e4ad77]/28 bg-[#1b0e09]/22">
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
              <button type="button" onClick={addBundle} disabled={!selected.length} className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#8b4f30] px-6 text-[10px] font-semibold uppercase text-white transition hover:bg-[#a45d38] disabled:cursor-not-allowed disabled:opacity-40">{added ? "Added to cart" : "Add bundle to cart"}<ArrowRight size={14} /></button>
            </div>
            <p className="mt-3 flex items-center gap-2 text-[9px] text-[#d8b99a]/60"><Gift size={13} /> Gift fulfilment is not collected until a supported flow exists.</p>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-[9px] font-semibold uppercase tracking-[.22em] text-[#d99c62]">Curated from the real catalog</p>
          <h3 className="mt-3 font-['Cormorant_Garamond'] text-4xl font-normal md:text-5xl">Thoughtful sets, without invented savings.</h3>
          <div className="mt-5 flex snap-x gap-3 overflow-x-auto pb-3 [scrollbar-width:none] md:grid md:grid-cols-4">
            {curatedSpecs.map((spec) => {
              const setProducts = spec.slugs.map((slug) => products.find((product) => product.slug === slug || product.cartSlug === slug)).filter(Boolean) as ShopViewProduct[];
              const setTotal = setProducts.reduce((sum, product) => sum + product.price, 0);
              return (
                <article key={spec.title} className="min-w-[78vw] snap-start rounded-[24px] border border-[#dca269]/18 bg-[#54301e]/38 p-4 sm:min-w-[340px] md:min-w-0">
                  <div className="flex h-44 items-end justify-center gap-1 rounded-[18px] bg-[#2b170f]/48 p-3">
                    {setProducts.map((product) => <span key={product.slug} className="relative h-full min-w-0 flex-1"><Image src={product.image} alt={product.name} fill sizes="(min-width:768px) 8vw, 28vw" className="object-contain object-bottom" /></span>)}
                  </div>
                  <h4 className="mt-4 font-['Cormorant_Garamond'] text-2xl">{spec.title}</h4>
                  <p className="mt-1 text-[10px] text-[#d9bea3]/68">{setProducts.length} catalog {setProducts.length === 1 ? "product" : "products"} · ₹{setTotal.toLocaleString("en-IN")}</p>
                  <button type="button" onClick={() => { setSelected(setProducts.slice(0,maxSlots).map((product) => product.slug)); setAdded(false); document.getElementById("bundle-builder")?.scrollIntoView({ behavior: "smooth" }); }} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-[#dca269]/22 bg-[#7d452a]/42 text-[9px] font-semibold uppercase">Build this set <ArrowRight size={13} /></button>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
