"use client";
import { commerceProductImage } from "@/lib/commerce-assets";
import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Minus, Plus, Trash2 } from "lucide-react";
import { useCart, getCartPreviewPrice } from "@/lib/cart/cart-context";
export function CartItems() {
  const cart = useCart();
  return (
    <div className="cm-cart-items">
      {cart.error ? <p role="status" className="cm-cart-feedback">{cart.error}</p> : null}
      {cart.products.map((product) => (
        <CartItem key={product.cartKey} product={product} />
      ))}
    </div>
  );
}
function CartItem({
  product,
}: {
  product: ReturnType<typeof useCart>["products"][number];
}) {
  const cart = useCart();
  const router = useRouter();
  const lock = useRef(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);
  async function save() {
    if (lock.current) return;
    lock.current = true;
    setPending(true);
    setMessage("");
    try {
      const res = await fetch("/api/customer/saved", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind: "product", itemId: product.slug }),
      });
      if (res.status === 401) {
        cart.setOpen(false);
        router.push("/login?redirect=%2Fcart");
        return;
      }
      if (!res.ok) throw new Error("save");
      setSaved(true);
      setMessage("Saved to your wishlist.");
    } catch {
      setMessage("Couldn’t save this item. Try again.");
    } finally {
      lock.current = false;
      setPending(false);
    }
  }
  return (
    <article className="cm-cart-line">
      <div className="cm-cart-image">
        <Image
          src={commerceProductImage(product.slug, product.image)}
          alt={product.name}
          fill
          sizes="(max-width:600px) 80px, 120px"
          className="object-contain"
        />
      </div>
      <div className="cm-cart-copy">
        <h2>{product.name}</h2>
        <p>{product.variantLabel ?? product.format}</p>
        <small>
          {product.status === "coming-soon" ? "Coming soon" : "Product preview"}
        </small>
        <div className="cm-quantity">
          <button
            aria-label={`Decrease ${product.name}`}
            onClick={() =>
              cart.updateQuantity(product.cartKey, product.quantity - 1)
            }
          >
            <Minus size={14} />
          </button>
          <span key={product.quantity}>{product.quantity}</span>
          <button
            aria-label={`Increase ${product.name}`}
            onClick={() =>
              cart.updateQuantity(product.cartKey, product.quantity + 1)
            }
          >
            <Plus size={14} />
          </button>
        </div>
        <div className="cm-row-actions">
          <button
            disabled={pending || saved}
            onClick={() => void save()}
            aria-label={`Save ${product.name} to wishlist`}
          >
            <Heart size={14} />
            {pending ? "Saving…" : saved ? "Saved" : "Save"}
          </button>
          <button
            onClick={() => cart.removeItem(product.cartKey)}
            aria-label={`Remove ${product.name}`}
          >
            <Trash2 size={14} />
            Remove
          </button>
        </div>
        <p role="status" className="cm-cart-feedback">
          {message}
        </p>
      </div>
      <strong className="cm-line-price">
        ₹
        {(
          (product.unitPrice ?? getCartPreviewPrice(product.slug)) *
          product.quantity
        ).toLocaleString("en-IN")}
      </strong>
    </article>
  );
}
