"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart/cart-context";

export function CartButton() {
  const cart = useCart();

  return (
    <button
      type="button"
      onClick={() => cart.setOpen(true)}
      className="co-neu relative grid h-10 w-10 place-items-center rounded-2xl text-coconut transition hover:-translate-y-0.5"
      aria-label="Open cart"
    >
      <ShoppingBag size={16} />
      {cart.totalQuantity ? (
        <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-coconut px-1 text-[0.62rem] text-paper">
          {cart.totalQuantity}
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
            className="co-glass fixed right-3 top-3 z-[90] flex max-h-[calc(100vh-24px)] w-[calc(100vw-24px)] max-w-md flex-col md:right-5 md:top-5 md:max-h-[calc(100vh-40px)]"
          >
            <div className="flex items-center justify-between border-b border-shell p-5">
              <div>
                <p className="text-[0.65rem] uppercase tracking-editorial text-grove">Saved shelf</p>
                <h2 className="font-display text-3xl text-coconut">Saved products</h2>
              </div>
              <button type="button" onClick={() => cart.setOpen(false)} className="grid h-10 w-10 place-items-center rounded-2xl border border-coconut/10 text-coconut">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {cart.products.length ? (
                <div className="space-y-4">
                  {cart.products.map((product) => (
                    <article key={product.slug} className="co-neu grid grid-cols-[84px_1fr] gap-4 p-3">
                      <div className="relative aspect-square overflow-hidden rounded-2xl bg-paper">
                        <Image src={product.image} alt={product.name} fill sizes="84px" className="object-contain p-2" />
                      </div>
                      <div>
                        <h3 className="font-display text-2xl text-ink">{product.name}</h3>
                        <p className="mt-1 text-xs uppercase tracking-editorial text-muted">{product.category}</p>
                        <div className="mt-4 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => cart.updateQuantity(product.slug, product.quantity - 1)}
                            className="co-neu-inset grid h-8 w-8 place-items-center text-coconut"
                            aria-label={`Decrease ${product.name}`}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="co-neu-inset grid h-8 min-w-8 place-items-center text-sm text-ink">{product.quantity}</span>
                          <button
                            type="button"
                            onClick={() => cart.updateQuantity(product.slug, product.quantity + 1)}
                            className="co-neu grid h-8 w-8 place-items-center text-coconut"
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
                <div className="border border-shell bg-paper p-6">
                  <p className="text-sm leading-7 text-muted">Your saved shelf is empty. Add products you want to remember.</p>
                </div>
              )}
            </div>
            <div className="border-t border-shell p-5">
              <p className="mb-4 text-xs leading-6 text-muted">We will share product notes and availability through early access.</p>
              <Link href="/sign-up" onClick={() => cart.setOpen(false)} className="co-button-soft block rounded-2xl bg-coconut px-6 py-4 text-center text-sm text-paper">
                Join early access
              </Link>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
