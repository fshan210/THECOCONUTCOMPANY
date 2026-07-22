"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ShoppingBag } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ResponsiveImage as Image } from "@/components/media/ResponsiveImage";
import { useCart } from "@/lib/cart/cart-context";
import { motionEase } from "@/lib/motion";
import { availableProcessing, findVariant, isOptionAvailable } from "./availability";
import { trackConfigurator } from "./configurator-analytics";
import type { ProcessingMethod, ProductConfiguration, ProductSize, PulpOption } from "./configurator-types";

const optionClass = "min-h-11 rounded-full border px-4 text-[10px] font-semibold uppercase transition disabled:cursor-not-allowed disabled:opacity-35";

export function ProductConfigurator() {
  const cart = useCart();
  const [selected, setSelected] = useState<ProductConfiguration>({ sizeMl: 200, processing: "UHT", pulp: "without-pulp" });
  const [displayed, setDisplayed] = useState(selected);
  const request = useRef(0);
  const variant = useMemo(() => findVariant(displayed), [displayed]);
  const pendingVariant = useMemo(() => findVariant(selected), [selected]);

  useEffect(() => {
    if (!pendingVariant) return;
    const currentRequest = ++request.current;
    const preload = new window.Image();
    preload.src = pendingVariant.image;
    const commit = () => { if (request.current !== currentRequest) return; setDisplayed(selected); trackConfigurator("configurator_change", pendingVariant); };
    if (preload.complete) commit(); else { preload.onload = commit; preload.onerror = commit; }
  }, [pendingVariant, selected]);

  const updateSize = (sizeMl: ProductSize) => { const nextProcessing = availableProcessing(sizeMl, selected.pulp).includes(selected.processing) ? selected.processing : "UHT"; setSelected({ ...selected, sizeMl, processing: nextProcessing }); };
  const add = () => { if (!variant?.available) return; cart.addItem("co-water", { sku: variant.sku, unitPrice: variant.price, variantLabel: `${variant.sizeMl}ml · ${variant.processing} · ${variant.pulp === "with-pulp" ? "With pulp" : "Without pulp"}` }); trackConfigurator("configurator_add_to_cart", variant); };

  return (
    <section className="px-4 py-8 md:px-8 md:py-12" aria-labelledby="configurator-heading">
      <div className="mx-auto grid max-w-[1320px] gap-7 overflow-hidden rounded-[30px] border border-white/75 bg-[linear-gradient(145deg,rgba(255,255,255,.74),rgba(239,231,216,.54))] p-5 shadow-[0_24px_70px_rgba(42,27,19,.08)] backdrop-blur-xl md:grid-cols-[.9fr_1.1fr] md:p-8">
        <div className="relative min-h-[360px] overflow-hidden rounded-[26px] bg-[#f2e9dc] md:min-h-[510px]">
          <AnimatePresence mode="popLayout" initial={false}>{variant ? <motion.div key={variant.sku} className="absolute inset-0" initial={{ opacity: 0, scale: 1.025, filter: "blur(7px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, scale: .985, filter: "blur(5px)" }} transition={{ duration: .46, ease: motionEase }}><Image src={variant.image} alt={`${variant.title}, ${variant.processing}, ${variant.pulp.replace("-", " ")}`} fill sizes="(min-width:768px) 45vw, 92vw" className="object-contain p-8 md:p-12" /></motion.div> : null}</AnimatePresence>
          <span className="absolute bottom-4 left-4 rounded-full bg-white/70 px-4 py-2 text-[9px] font-semibold uppercase text-[#214d2b] backdrop-blur">Configuration preview</span>
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-[10px] font-semibold uppercase tracking-[.15em] text-[#214d2b]">Build your .CO</p>
          <h2 id="configurator-heading" className="mt-3 font-['Cormorant_Garamond'] text-[40px] leading-[.92] md:text-[56px]">Coconut water,<br />your way.</h2>
          <p className="mt-4 max-w-lg text-xs leading-6 text-[#625950]">Explore the currently planned format combinations. Unavailable options stay visible so the production constraint is clear.</p>
          <fieldset className="mt-6"><legend className="text-[10px] font-semibold uppercase">Size</legend><div className="mt-3 flex flex-wrap gap-2">{([100,200,500] as ProductSize[]).map((sizeMl) => <button key={sizeMl} type="button" aria-pressed={selected.sizeMl === sizeMl} onClick={() => updateSize(sizeMl)} className={`${optionClass} ${selected.sizeMl===sizeMl?"border-[#214d2b] bg-[#214d2b] text-white":"border-black/10 bg-white/45"}`}>{sizeMl}ml</button>)}</div></fieldset>
          <fieldset className="mt-5"><legend className="text-[10px] font-semibold uppercase">Processing</legend><div className="mt-3 flex gap-2">{(["UHT","RAW"] as ProcessingMethod[]).map((processing) => <button key={processing} type="button" disabled={!isOptionAvailable({ ...selected, processing })} aria-pressed={selected.processing===processing} onClick={() => setSelected({ ...selected, processing })} className={`${optionClass} ${selected.processing===processing?"border-[#214d2b] bg-[#214d2b] text-white":"border-black/10 bg-white/45"}`}>{processing}</button>)}</div></fieldset>
          <fieldset className="mt-5"><legend className="text-[10px] font-semibold uppercase">Tender coconut pulp</legend><div className="mt-3 flex flex-wrap gap-2">{(["without-pulp","with-pulp"] as PulpOption[]).map((pulp) => <button key={pulp} type="button" disabled={!isOptionAvailable({ ...selected, pulp })} aria-pressed={selected.pulp===pulp} onClick={() => setSelected({ ...selected, pulp })} className={`${optionClass} ${selected.pulp===pulp?"border-[#214d2b] bg-[#214d2b] text-white":"border-black/10 bg-white/45"}`}>{pulp === "with-pulp" ? "With pulp" : "Without pulp"}</button>)}</div></fieldset>
          {pendingVariant && !pendingVariant.available ? <p className="mt-4 rounded-[16px] bg-[#8a4c3a]/8 px-4 py-3 text-[10px] text-[#754132]">{pendingVariant.availabilityNote}</p> : null}
          {variant ? <motion.div key={variant.sku} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-6 border-t border-black/8 pt-5"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold">{variant.title}</p><p className="mt-1 text-[10px] text-[#625950]">SKU {variant.sku}</p><p className="mt-2 flex items-center gap-2 text-[10px] text-[#214d2b]"><Check size={13} /> Variant selection synchronized</p></div><p className="font-['Space_Grotesk'] text-2xl font-semibold">₹{variant.price}</p></div><button type="button" onClick={add} disabled={!variant.available} className="co-primary-cta mt-5 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-[#214d2b] text-[11px] font-semibold uppercase text-white disabled:opacity-40"><ShoppingBag size={16} /> Add configured product</button></motion.div> : null}
        </div>
      </div>
    </section>
  );
}
