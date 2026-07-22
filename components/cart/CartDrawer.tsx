"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, GripHorizontal, Minus, PackageCheck, Plus, ShoppingBag, Sparkles, Trash2, X } from "lucide-react";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import { getCartPreviewPrice, useCart } from "@/lib/cart/cart-context";
import { useBodyScrollLock } from "@/lib/ui/use-body-scroll-lock";
import { StatePanel } from "@/components/launch/StatePanel";

const spring = { type: "spring", stiffness: 330, damping: 30, mass: 0.82 } as const;

export function CartButton({ showZero = false, className = "" }: { showZero?: boolean; className?: string } = {}) {
  const cart = useCart();
  const count = cart.totalQuantity;

  return (
    <button
      type="button"
      onClick={() => cart.setOpen(true)}
      className={`co-press relative grid h-10 w-10 place-items-center rounded-[16px] border border-[var(--co-border)] bg-[var(--co-white)] text-[var(--co-ink)] lg:h-11 lg:w-11 ${className}`}
      aria-label={`${count} ${count === 1 ? "item" : "items"} in cart, open cart`}
    >
      <ShoppingBag size={showZero ? 22 : 16} strokeWidth={showZero ? 2.1 : 2} />
      {count || showZero ? <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--co-black)] px-1 text-[0.62rem] font-bold text-[var(--co-white)]">{count}</span> : null}
    </button>
  );
}

export function CartDrawer() {
  const cart = useCart();
  const router = useRouter();
  const dragControls = useDragControls();
  const drawerRef = useRef<HTMLElement>(null);
  const recentlyAdded = useMemo(() => cart.products.find((product) => product.cartKey === cart.recentlyAddedSlug) || null, [cart.products, cart.recentlyAddedSlug]);
  useBodyScrollLock(cart.open);

  useEffect(() => {
    if (!cart.open) return;
    drawerRef.current?.focus();
    const handleKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") cart.setOpen(false);
      if (event.key !== "Tab" || !drawerRef.current) return;
      const focusable = Array.from(drawerRef.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handleKeys);
    return () => document.removeEventListener("keydown", handleKeys);
  }, [cart, cart.open]);

  const close = () => cart.setOpen(false);
  const lineSubtotal = recentlyAdded ? (recentlyAdded.unitPrice ?? getCartPreviewPrice(recentlyAdded.slug)) * recentlyAdded.quantity : cart.subtotal;

  return (
    <AnimatePresence>
      {cart.open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close cart"
            className="fixed inset-0 z-[300] bg-[#211812]/30 backdrop-blur-[7px]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}
          />
          <motion.aside
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            aria-describedby="cart-drawer-description"
            tabIndex={-1}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={(_, info) => { if (info.offset.y > 112 || info.velocity.y > 520) close(); }}
            initial={{ opacity: 0, scale: 0.96, x: 34, y: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, x: 34, y: 18 }}
            transition={spring}
            className="fixed inset-x-0 bottom-0 z-[310] flex max-h-[min(86dvh,760px)] flex-col overflow-hidden rounded-t-[32px] border border-white/75 bg-[linear-gradient(145deg,rgba(255,255,255,.86),rgba(248,244,236,.93)_44%,rgba(234,242,228,.82))] pb-[calc(14px+env(safe-area-inset-bottom))] text-[#2a1b13] shadow-[0_-24px_90px_rgba(31,22,15,.25)] backdrop-blur-3xl focus:outline-none md:inset-x-auto md:bottom-auto md:right-5 md:top-[max(106px,calc(env(safe-area-inset-top)+88px))] md:max-h-[calc(100dvh-126px)] md:w-[420px] md:rounded-[28px] md:pb-0 md:shadow-[-24px_28px_90px_rgba(31,22,15,.24)]"
          >
            <div className="flex justify-center pt-2 md:hidden">
              <button type="button" aria-label="Drag down to close cart" onPointerDown={(event) => dragControls.start(event)} onClick={close} className="grid h-7 w-16 cursor-grab place-items-center rounded-full text-[#7a6e64] active:cursor-grabbing">
                <GripHorizontal size={25} />
              </button>
            </div>
            <div className="flex items-start justify-between border-b border-white/70 px-5 pb-4 pt-3 md:p-5">
              <div>
                <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="co-label flex items-center gap-2 text-[#214d2b]"><Sparkles size={12}/>Your .CO shelf</motion.p>
                <h2 id="cart-drawer-title" className="mt-2 font-['Cormorant_Garamond'] text-[2.25rem] leading-none tracking-[-.04em] text-[#2a1b13]">{recentlyAdded ? "Added to cart." : "Your cart."}</h2>
                <p id="cart-drawer-description" className="mt-2 text-xs leading-5 text-[#6a5f56]">{recentlyAdded ? "A thoughtful choice, ready when you are." : "Your coconut favourites, all in one calm place."}</p>
              </div>
              <button type="button" aria-label="Close cart" onClick={close} className="grid size-10 shrink-0 place-items-center rounded-full border border-[#35271e]/10 bg-white/60 text-[#2a1b13] shadow-[0_7px_18px_rgba(58,36,22,.06)] transition hover:scale-105 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#214d2b]"><X size={17} /></button>
            </div>

            <p role="status" aria-live="polite" className="sr-only">{recentlyAdded ? `${recentlyAdded.name} added to cart.` : "Cart opened."}</p>

            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 [scrollbar-gutter:stable] [touch-action:pan-y]">
              {recentlyAdded ? <RecentlyAddedCard product={recentlyAdded} /> : null}
              {cart.products.length ? (
                <div className={recentlyAdded ? "mt-5" : ""}>
                  <div className="mb-3 flex items-center justify-between"><p className="text-[10px] font-semibold uppercase tracking-[.13em] text-[#6d6259]">{recentlyAdded ? "Also on your shelf" : "Saved products"}</p><span className="rounded-full bg-white/64 px-2.5 py-1 text-[10px] font-semibold text-[#214d2b]">{cart.totalQuantity} {cart.totalQuantity === 1 ? "item" : "items"}</span></div>
                  <div className="space-y-2.5">
                    {cart.products.filter((product) => product.cartKey !== recentlyAdded?.cartKey).map((product) => <CartLine key={product.cartKey} product={product} />)}
                  </div>
                </div>
              ) : <StatePanel compact kind="empty" eyebrow="Your shelf" title="Nothing saved yet." body="Add a coconut favourite and it will wait here for you." onPrimary={{ label: "Browse products", action: () => { close(); router.push("/shop"); } }} />}
            </div>

            <div className="border-t border-white/70 px-5 pt-4">
              <motion.div key={cart.subtotal} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="rounded-[18px] border border-white/70 bg-white/52 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,.72)]">
                <div className="flex items-center justify-between text-xs text-[#6a5f56]"><span>Estimated subtotal</span><motion.strong key={cart.subtotal} initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} className="text-base text-[#2a1b13]">₹{cart.subtotal.toLocaleString("en-IN")}</motion.strong></div>
                {recentlyAdded ? <p className="mt-1 text-[10px] text-[#6a5f56]">Latest selection subtotal: ₹{lineSubtotal.toLocaleString("en-IN")}</p> : null}
              </motion.div>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                <button type="button" onClick={close} className="min-h-11 rounded-full border border-[#214d2b]/20 bg-white/62 px-4 text-[10px] font-semibold uppercase tracking-[.06em] text-[#214d2b] shadow-[0_7px_18px_rgba(58,36,22,.045)] transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#214d2b]">Continue shopping</button>
                <Link href="/cart" onClick={close} className="group flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#214d2b] px-4 text-[10px] font-semibold uppercase tracking-[.06em] text-white shadow-[0_12px_26px_rgba(33,77,43,.24)] transition hover:-translate-y-0.5 hover:bg-[#183b20] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#214d2b]">View cart <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" /></Link>
              </div>
              <button type="button" disabled aria-label="Checkout coming soon" className="mt-2.5 flex min-h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-[#214d2b]/15 bg-[linear-gradient(100deg,#f4efe1,#e7f0df)] px-4 text-[10px] font-semibold uppercase tracking-[.06em] text-[#214d2b]/70 shadow-[0_8px_22px_rgba(33,77,43,.08)]"><PackageCheck size={15}/>Checkout coming soon</button>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function RecentlyAddedCard({ product }: { product: ReturnType<typeof useCart>["products"][number] }) {
  const cart = useCart();
  const price = product.unitPrice ?? getCartPreviewPrice(product.slug);
  return <motion.article initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="overflow-hidden rounded-[24px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,.8),rgba(232,241,225,.72))] p-3 shadow-[0_14px_34px_rgba(58,36,22,.07)]"><div className="flex items-start gap-3"><motion.div initial={{ scale: .88, rotate: -3 }} animate={{ scale: [0.88, 1.05, 1], rotate: [-3, 1, 0] }} transition={{ duration: .55, ease: [0.22, 1, 0.36, 1] }} className="relative size-[88px] shrink-0 overflow-hidden rounded-[20px] bg-[#f6f0e7]"><Image src={product.image} alt={product.name} fill sizes="88px" loading="lazy" className="object-contain p-2" /></motion.div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div><span className="inline-flex items-center gap-1 rounded-full bg-[#214d2b] px-2 py-1 text-[8px] font-semibold uppercase tracking-[.1em] text-white"><Check size={11}/>Added</span><h3 className="mt-2 font-['Cormorant_Garamond'] text-[1.55rem] leading-[.94] text-[#2a1b13]">{product.name}</h3></div><p className="shrink-0 text-sm font-semibold text-[#214d2b]">₹{price.toLocaleString("en-IN")}</p></div><p className="mt-2 text-[10px] font-medium uppercase tracking-[.1em] text-[#71655b]">{product.variantLabel ?? product.category} · {product.quantity === 1 ? "1 item" : `${product.quantity} items`}</p><QuantityControl product={product} compact /></div></div></motion.article>;
}

function CartLine({ product }: { product: ReturnType<typeof useCart>["products"][number] }) {
  const cart = useCart();
  const price = product.unitPrice ?? getCartPreviewPrice(product.slug);
  return <motion.article layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .96 }} className="grid grid-cols-[58px_1fr_auto] gap-3 rounded-[19px] border border-white/70 bg-white/49 p-2.5"><div className="relative aspect-square overflow-hidden rounded-[15px] bg-[#f6f0e7]"><Image src={product.image} alt={product.name} fill sizes="58px" loading="lazy" className="object-contain p-1.5" /></div><div className="min-w-0"><h3 className="truncate text-xs font-semibold text-[#2a1b13]">{product.name}</h3><p className="mt-1 text-[10px] text-[#6b6057]">{product.variantLabel ?? product.category}</p><QuantityControl product={product} /></div><div className="flex flex-col items-end justify-between"><p className="text-xs font-semibold text-[#214d2b]">₹{(price * product.quantity).toLocaleString("en-IN")}</p><button type="button" onClick={() => cart.removeItem(product.cartKey)} aria-label={`Remove ${product.name}`} className="grid size-7 place-items-center rounded-full text-[#87584d] transition hover:bg-[#f5e5df] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#214d2b]"><Trash2 size={13}/></button></div></motion.article>;
}

function QuantityControl({ product, compact = false }: { product: ReturnType<typeof useCart>["products"][number]; compact?: boolean }) {
  const cart = useCart();
  return <div className={`${compact ? "mt-3" : "mt-2"} flex items-center gap-1.5`}>
    <button type="button" onClick={() => cart.updateQuantity(product.cartKey, product.quantity - 1)} aria-label={`Decrease ${product.name}`} className="grid size-7 place-items-center rounded-full border border-[#35271e]/10 bg-white/70 text-[#2a1b13] transition hover:scale-105 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#214d2b]"><Minus size={13}/></button>
    <motion.span key={product.quantity} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="grid h-7 min-w-7 place-items-center text-xs font-semibold text-[#2a1b13]">{product.quantity}</motion.span>
    <button type="button" onClick={() => cart.updateQuantity(product.cartKey, product.quantity + 1)} aria-label={`Increase ${product.name}`} className="grid size-7 place-items-center rounded-full bg-[#214d2b] text-white shadow-[0_5px_12px_rgba(33,77,43,.2)] transition hover:scale-105 hover:bg-[#183b20] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#214d2b]"><Plus size={13}/></button>
  </div>;
}
