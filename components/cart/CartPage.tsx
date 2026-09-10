"use client";
import { ResponsiveImage as Image } from "@/components/media/ResponsiveImage";
import { Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";
import {
  CommerceHero,
  CommerceSurface,
  CommerceLink,
  CommerceTrust,
  CommerceClose,
} from "@/components/commerce/Primitives";
import { CartItems } from "@/components/commerce/CartItems";
export function CartPage({
  recipe,
}: {
  recipe?: { title: string; description: string; image: string; slug: string };
}) {
  const cart = useCart();
  return (
    <CommerceSurface>
      <CommerceHero
        products
        eyebrow="Your .CO order"
        title={
          <>
            The good stuff,
            <br />
            almost <em>yours.</em>
          </>
        }
        body="A few favourites for your everyday. Keep your selection here while you explore the coconut world."
      />
      <div className="cm-container">
        {cart.products.length ? (
          <div className="cm-split">
            <div className="cm-stack">
              <section className="cm-panel cm-cart-panel">
                <div className="cm-cart-heading">
                  <p className="cm-eyebrow">Product</p>
                  <span>Price</span>
                </div>
                <CartItems />
              </section>
              {recipe && (
                <section className="cm-panel cm-cart-recipe">
                  <div className="cm-recipe-image">
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      fill
                      sizes="(max-width:600px) 85vw, 260px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="cm-eyebrow">From the recipe collection</p>
                    <h2>{recipe.title}</h2>
                    <p>{recipe.description}</p>
                    <CommerceLink href={`/recipes/${recipe.slug}`}>
                      View recipe
                    </CommerceLink>
                  </div>
                </section>
              )}
              <section className="cm-panel">
                <Heart />
                <h2>Saved for another day.</h2>
                <p>
                  Your saved products and stories live together in your account.
                </p>
                <CommerceLink href="/wishlist" secondary>
                  View your wishlist
                </CommerceLink>
              </section>
            </div>
            <aside className="cm-panel cm-summary">
              <p className="cm-eyebrow">Order summary</p>
              <h2>Your selection.</h2>
              <dl>
                <div>
                  <dt>Subtotal ({cart.totalQuantity} items)</dt>
                  <dd>₹{cart.subtotal.toLocaleString("en-IN")}</dd>
                </div>
                <div>
                  <dt>Shipping & tax</dt>
                  <dd>Not yet available</dd>
                </div>
              </dl>
              <div className="cm-total" aria-live="polite">
                <span>Estimated subtotal</span>
                <strong>₹{cart.subtotal.toLocaleString("en-IN")}</strong>
              </div>
              <p>
                Purchasing is not open yet. Final prices, delivery and payment
                details will be confirmed when checkout launches.
              </p>
              <button className="cm-button" disabled>
                Checkout coming soon
              </button>
              <CommerceLink href="/checkout" secondary>
                Checkout information
              </CommerceLink>
              <div className="cm-summary-help">
                <p>Need help with your selection?</p>
                <CommerceLink href="/contact" secondary>
                  Contact support
                </CommerceLink>
              </div>
            </aside>
          </div>
        ) : (
          <section className="cm-panel cm-empty">
            <ShoppingBag size={36} />
            <p className="cm-eyebrow">Your cart</p>
            <h2>Good things start here.</h2>
            <p>
              Your cart is empty. Explore our coconut essentials and keep your
              favourites close.
            </p>
            <CommerceLink href="/shop">Explore the collection</CommerceLink>
          </section>
        )}
        <CommerceClose />
        <CommerceTrust />
      </div>
    </CommerceSurface>
  );
}
