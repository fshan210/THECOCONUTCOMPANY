"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart/cart-context";

export function CartButton({ showZero = false, className = "" }: { showZero?: boolean; className?: string } = {}) {
  const cart = useCart();
  const count = cart.totalQuantity;

  return (
    <button
      type="button"
      onClick={() => cart.setOpen(true)}
      className={`co-press relative grid h-10 w-10 place-items-center rounded-[16px] border border-[var(--co-border)] bg-[var(--co-white)] text-[var(--co-ink)] lg:h-11 lg:w-11 ${className}`}
      aria-label="Open cart"
    >
      <ShoppingBag size={showZero ? 22 : 16} strokeWidth={showZero ? 2.1 : 2} />
      {count || showZero ? (
        <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--co-black)] px-1 text-[0.62rem] font-bold text-[var(--co-white)]">
          {count}
        </span>
      ) : null}
    </button>
  );
}

export function CartDrawer() {
  const cart = useCart();

  return (
    <AnimatePresence>
      {cart.open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close cart"
            className="fixed inset-0 z-[80] bg-ink/24 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => cart.setOpen(false)}
          />
          <motion.aside
            initial={{ opacity: 0, scale: 0.98, x: 24 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.98, x: 24 }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-3 top-3 z-[90] flex max-h-[calc(100vh-24px)] w-[calc(100vw-24px)] max-w-md flex-col overflow-hidden rounded-[32px] border border-[var(--co-border)] bg-[var(--co-white)] shadow-[0_28px_90px_rgba(58,36,22,0.18)] md:right-5 md:top-5 md:max-h-[calc(100vh-40px)]"
          >
            <div className="flex items-center justify-between border-b border-[var(--co-border)] p-5">
              <div>
                <p className="co-label">Saved shelf</p>
                <h2 className="mt-2 text-4xl font-bold leading-none text-[var(--co-brown)]">Saved products</h2>
              </div>
              <button type="button" onClick={() => cart.setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-[var(--co-border)] text-[var(--co-ink)]">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {cart.products.length ? (
                <div className="space-y-4">
                  {cart.products.map((product) => (
                    <article key={product.slug} className="grid grid-cols-[84px_1fr] gap-4 rounded-[24px] border border-[var(--co-border)] bg-[var(--co-cream)] p-3">
                      <div className="relative aspect-square overflow-hidden rounded-[24px] bg-[var(--co-white)]">
                        <Image src={product.image} alt={product.name} fill sizes="84px" className="object-contain p-2" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold leading-none text-[var(--co-ink)]">{product.name}</h3>
                        <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--co-muted)]">{product.category}</p>
                        <div className="mt-4 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => cart.updateQuantity(product.slug, product.quantity - 1)}
                            className="grid h-8 w-8 place-items-center rounded-full border border-[var(--co-border)] bg-[var(--co-white)] text-[var(--co-brown)]"
                            aria-label={`Decrease ${product.name}`}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="grid h-8 min-w-8 place-items-center rounded-full border border-[var(--co-border)] bg-[var(--co-white)] text-sm font-bold text-[var(--co-ink)]">{product.quantity}</span>
                          <button
                            type="button"
                            onClick={() => cart.updateQuantity(product.slug, product.quantity + 1)}
                            className="grid h-8 w-8 place-items-center rounded-full border border-[var(--co-border)] bg-[var(--co-black)] text-[var(--co-white)]"
                            aria-label={`Increase ${product.name}`}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-[24px] border border-[var(--co-border)] bg-[var(--co-cream)] p-6">
                  <p className="text-sm leading-7 text-[var(--co-muted)]">Your saved shelf is empty. Add products you want to remember.</p>
                </div>
              )}
            </div>
            <div className="border-t border-[var(--co-border)] p-5">
              <p className="mb-4 text-xs leading-6 text-[var(--co-muted)]">We will share product notes and availability through early access.</p>
              <Link href="/sign-up" onClick={() => cart.setOpen(false)} className="block rounded-full bg-[var(--co-black)] px-6 py-4 text-center text-sm font-bold text-[var(--co-white)] transition hover:bg-[var(--co-palm)]">
                Join early access
              </Link>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
