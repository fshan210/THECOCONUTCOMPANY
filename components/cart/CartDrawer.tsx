"use client";
import Link from "next/link";
import { ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useCart } from "@/lib/cart/cart-context";
import { useBodyScrollLock } from "@/lib/ui/use-body-scroll-lock";
import { CartItems } from "@/components/commerce/CartItems";
import "@/styles/commerce-default.css";

export function CartButton({
  showZero = false,
  className = "",
}: { showZero?: boolean; className?: string } = {}) {
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
  const reduce = useReducedMotion();
  const drawer = useRef<HTMLElement>(null);
  const setOpenRef = useRef(cart.setOpen);
  setOpenRef.current = cart.setOpen;
  useBodyScrollLock(cart.open);
  useEffect(() => {
    if (!cart.open) return;
    const source =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const frame = requestAnimationFrame(() => drawer.current?.focus());
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpenRef.current(false);
      }
      if (event.key !== "Tab" || !drawer.current) return;
      const targets = Array.from(
        drawer.current.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input:not([disabled]),[tabindex="0"]',
        ),
      );
      const first = targets[0],
        last = targets[targets.length - 1];
      if (!first) {
        event.preventDefault();
        return;
      }
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          document.activeElement === drawer.current)
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          document.activeElement === drawer.current)
      ) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      if (source?.isConnected) source.focus();
    };
  }, [cart.open]);
  const close = () => cart.setOpen(false);
  return (
    <AnimatePresence>
      {cart.open && (
        <>
          <motion.div
            className="cm-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            className="cm-drawer"
            ref={drawer}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            tabIndex={-1}
            initial={{ x: reduce ? 0 : "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: reduce ? 0 : "100%", opacity: 0 }}
            transition={{
              duration: reduce ? 0.1 : 0.52,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div className="cm-drawer-heading">
              <h2 id="cart-drawer-title">Your cart</h2>
              <span>{cart.totalQuantity} items</span>
              <button aria-label="Close cart" onClick={close}>
                <X size={22} />
              </button>
            </div>
            <div className="cm-drawer-scroll" data-lenis-prevent>
              {cart.products.length ? (
                <>
                  <CartItems />
                  <section className="cm-panel">
                    <p className="cm-eyebrow">Complete the moment</p>
                    <h3>A little inspiration for your shelf.</h3>
                    <p>
                      Explore our kitchen collection and find your next coconut
                      favourite.
                    </p>
                    <Link
                      href="/shop?category=Kitchen"
                      onClick={close}
                      className="cm-button cm-button--secondary"
                    >
                      Explore the collection →
                    </Link>
                  </section>
                </>
              ) : (
                <div className="cm-empty">
                  <ShoppingBag />
                  <h3>Your cart is waiting.</h3>
                  <p>
                    Add a coconut favourite and it will be ready here when you
                    are.
                  </p>
                  <Link href="/shop" onClick={close} className="cm-button">
                    Explore the collection →
                  </Link>
                </div>
              )}
            </div>
            <div className="cm-drawer-summary">
              <div aria-live="polite">
                <span>Estimated subtotal</span>
                <strong>₹{cart.subtotal.toLocaleString("en-IN")}</strong>
              </div>
              <p>Ordering isn’t open yet. Nothing will be charged.</p>
              <button className="cm-button" disabled>
                Checkout coming soon
              </button>
              <Link
                href="/cart"
                onClick={close}
                className="cm-button cm-button--secondary"
              >
                View full cart →
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
