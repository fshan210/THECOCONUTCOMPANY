"use client";
import Link from "next/link";
import { LockKeyhole, Package, ShieldCheck } from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";
import {
  CommerceHero,
  CommerceSurface,
  CommerceLink,
  CommerceTrust,
} from "./Primitives";
export function CheckoutSurface({ payment = false }: { payment?: boolean }) {
  const cart = useCart();
  return (
    <CommerceSurface>
      <CommerceHero
        products
        eyebrow={payment ? "Payment" : "Checkout"}
        title={
          <>
            Good choices.
            <br />
            <em>Worth waiting for.</em>
          </>
        }
        body="Our coconut collection is taking shape. Purchasing will open once delivery, policies and payment checks are complete."
      />
      <div className="cm-container">
        <nav className="cm-steps" aria-label="Ordering stages">
          <Link href="/cart">
            1 <span>Cart</span>
          </Link>
          <span aria-current={payment ? undefined : "step"}>
            2 <span>Checkout</span>
          </span>
          <span aria-current={payment ? "step" : undefined}>
            3 <span>Payment</span>
          </span>
          <span>
            4 <span>Confirmation</span>
          </span>
        </nav>
        <div className="cm-split">
          <div className="cm-stack">
            <section className="cm-panel cm-unavailable">
              <LockKeyhole size={30} />
              <p className="cm-eyebrow">Not open for orders yet</p>
              <h2>
                {payment
                  ? "Payments are being prepared."
                  : "Checkout is being prepared."}
              </h2>
              <p>
                Payments are intentionally unavailable until fulfilment,
                policies and security have completed their launch gates.
              </p>
              <p>
                Nothing will be charged. Your cart remains here while you
                explore.
              </p>
              <button className="cm-button" disabled>
                {payment ? "Payment unavailable" : "Checkout unavailable"}
              </button>
              <CommerceLink href="/shop" secondary>
                Continue exploring
              </CommerceLink>
            </section>
            <section className="cm-panel">
              <h2>Before your first order</h2>
              <div className="cm-policy-links">
                <Link href="/shipping-delivery">
                  <Package />
                  Delivery information
                </Link>
                <Link href="/returns">
                  <Package />
                  Returns & refunds
                </Link>
                <Link href="/privacy-policy">
                  <ShieldCheck />
                  Your privacy
                </Link>
              </div>
            </section>
          </div>
          <aside className="cm-panel cm-summary">
            <p className="cm-eyebrow">Your cart</p>
            <h2>
              {cart.totalQuantity} {cart.totalQuantity === 1 ? "item" : "items"}{" "}
              selected
            </h2>
            {cart.products.length ? (
              <>
                <div className="cm-summary-lines">
                  {cart.products.map((p) => (
                    <div key={p.cartKey}>
                      <span>
                        {p.name}
                        <small>Quantity {p.quantity}</small>
                      </span>
                    </div>
                  ))}
                </div>
                <dl>
                  <div>
                    <dt>Estimated subtotal</dt>
                    <dd>₹{cart.subtotal.toLocaleString("en-IN")}</dd>
                  </div>
                </dl>
                <p>
                  Shipping, taxes and final pricing will be confirmed when
                  ordering opens.
                </p>
              </>
            ) : (
              <p>
                Your cart is empty. Explore the collection to find your
                favourites.
              </p>
            )}
            <CommerceLink href="/cart" secondary>
              Review your cart
            </CommerceLink>
          </aside>
        </div>
        <CommerceTrust />
      </div>
    </CommerceSurface>
  );
}
