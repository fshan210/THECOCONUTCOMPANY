"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Gift, LockKeyhole, PackageCheck, Plus, RotateCcw, Truck, X } from "lucide-react";
import { useState } from "react";
import { ResponsiveImage as Image } from "@/components/media/ResponsiveImage";
import { useCart } from "@/lib/cart/cart-context";
import type { ShopViewProduct } from "./shop-types";

const curatedSpecs = [
  { title: "Morning Hydration", copy: "A light shelf for slow starts.", scene: "/assets/redesign/shop/curated/morning-hydration.webp", slugs: ["co-water", "co-kitchen-coconut-flour"] },
  { title: "Kitchen Starter", copy: "Everyday coconut pantry staples.", scene: "/assets/redesign/shop/curated/kitchen-starter.webp", slugs: ["co-kitchen-coconut-oil", "co-kitchen-coconut-flour", "co-kitchen-coconut-milk"] },
  { title: "BOTANiCA Ritual", copy: "A calm coconut-led care edit.", scene: "/assets/redesign/shop/curated/botanica-ritual.webp", slugs: ["co-botanica-shampoo", "co-botanica-face-wash", "co-botanica-body-moisturizer"] },
  { title: "MELT Treat Box", copy: "Coconut indulgence for later.", scene: "/assets/redesign/shop/curated/melt-treat.webp", slugs: ["melt-co-mango-coconut"] },
] as const;

const ritualBenefits = [
  [Truck, "Free shipping", "Orders above ₹999"],
  [RotateCcw, "Easy returns", "30-day policy"],
  [LockKeyhole, "Secure checkout", "Protected payments"],
  [PackageCheck, ".CO Rewards", "Earn & redeem points"],
] as const;

export function ShopBundleBuilder({ products }: { products: ShopViewProduct[] }) {
  const cart = useCart();
  const reducedMotion = useReducedMotion();
  const [selected, setSelected] = useState<string[]>(["co-water", "co-kitchen-coconut-oil", "co-botanica-shampoo"]);
  const [added, setAdded] = useState(false);
  const minItems = 3;
  const maxSlots = 5;
  const selectedProducts = selected.map((slug) => products.find((product) => product.slug === slug)).filter(Boolean) as ShopViewProduct[];
  const total = selectedProducts.reduce((sum, product) => sum + product.price, 0);

  const remove = (slug: string) => {
    setAdded(false);
    setSelected((current) => current.filter((item) => item !== slug));
  };
  const addNext = () => {
    const next = products.find((product) => !selected.includes(product.slug));
    if (!next || selected.length >= maxSlots) return;
    setAdded(false);
    setSelected((current) => [...current, next.slug]);
  };
  const addBundle = () => {
    if (selectedProducts.length < minItems) return;
    selectedProducts.forEach((product) => cart.addItem(product.cartSlug, undefined, { openDrawer: false }));
    setAdded(true);
  };

  return (
    <>
      <section id="bundle-builder" className="co-shop-ritual" aria-labelledby="bundle-title">
        <div className="co-shop-ritual__canvas mx-auto max-w-[1672px]">
          <div className="co-shop-ritual__copy">
            <p>Build your ritual</p>
            <h2 id="bundle-title">Build a .CO Bundle that&apos;s <em>yours.</em></h2>
            <p>Handpick your favourites and create a personalised bundle for gifting or elevating your everyday.</p>
            <div className="co-shop-ritual__promises">
              {["Pick 3 or more products", "See the exact Catalog total", "Thoughtfully packed. Beautifully you."].map((item) => <span key={item}><Check size={13} />{item}</span>)}
            </div>
          </div>

          <div className="co-shop-ritual__slots" aria-label="Bundle products">
            {Array.from({ length: maxSlots }).map((_, index) => {
              const product = selectedProducts[index];
              return (
                <div className="co-shop-ritual__slot" key={product?.slug ?? `empty-${index}`}>
                  <AnimatePresence mode="wait">
                    {product ? (
                      <motion.div
                        key={product.slug}
                        initial={reducedMotion ? false : { opacity: 0, y: 18, scale: .96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={reducedMotion ? undefined : { opacity: 0, y: 12, scale: .96 }}
                        transition={{ duration: reducedMotion ? 0 : .46, ease: [0.16, 1, 0.3, 1] }}
                        className="co-shop-ritual__product"
                        data-category={product.category}
                      >
                        <Image src={product.image} alt={product.name} fill sizes="(min-width:768px) 11vw, 22vw" className="object-contain" />
                        <button type="button" onClick={() => remove(product.slug)} aria-label={`Remove ${product.name} from bundle`}><X size={13} /></button>
                      </motion.div>
                    ) : (
                      <button type="button" className="co-shop-ritual__add" onClick={addNext} aria-label="Add next product to bundle"><Plus size={26} strokeWidth={1.3} /></button>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="co-shop-ritual__summary">
            <span><small>Selected</small><strong>{selected.length} / {maxSlots} products</strong></span>
            <span><small>Catalog total</small><strong>₹{total.toLocaleString("en-IN")}</strong></span>
            <button type="button" onClick={addBundle} disabled={selected.length < minItems}>{added ? "Added to cart" : selected.length < minItems ? `Choose ${minItems - selected.length} more` : "Create bundle"}<ArrowRight size={15} /></button>
            <p><Gift size={13} /> Gift fulfilment is not collected until a supported flow exists.</p>
          </div>

          <div className="co-shop-ritual__benefits" aria-label="Bundle service benefits">
            {ritualBenefits.map(([Icon, title, copy]) => <div key={title}><Icon size={22} strokeWidth={1.35} /><span><strong>{title}</strong><small>{copy}</small></span></div>)}
          </div>
        </div>
      </section>

      <section className="co-shop-curated-section" aria-labelledby="curated-bundles-title">
        <div className="relative mx-auto max-w-[1450px]">
          <div className="co-shop-curated__heading">
            <div><p>Curated for you</p><h3 id="curated-bundles-title">Thoughtful bundles.<br /><em>Beautifully crafted.</em></h3></div>
          </div>
          <div className="co-shop-curated__rail">
            {curatedSpecs.map((spec) => {
              const setProducts = spec.slugs.map((slug) => products.find((product) => product.slug === slug || product.cartSlug === slug)).filter(Boolean) as ShopViewProduct[];
              const setTotal = setProducts.reduce((sum, product) => sum + product.price, 0);
              return (
                <article key={spec.title} className="co-shop-curated-card">
                  <div className="co-shop-curated-card__scene"><Image src={spec.scene} alt={`${spec.title} product bundle in a warm Kerala-inspired setting`} fill sizes="(min-width:768px) 25vw, 86vw" className="object-cover" /></div>
                  <h4>{spec.title}</h4>
                  <p>{spec.copy}<br />{setProducts.length} catalogue {setProducts.length === 1 ? "product" : "products"} · ₹{setTotal.toLocaleString("en-IN")}</p>
                  <button type="button" onClick={() => { setSelected(setProducts.slice(0, maxSlots).map((product) => product.slug)); setAdded(false); document.getElementById("bundle-builder")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" }); }}>Build this set <ArrowRight size={13} /></button>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
