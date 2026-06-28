"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";

export function AddToCartButton({ slug, label = "Add to Cart", className = "" }: { slug: string; label?: string; className?: string }) {
  const cart = useCart();

  return (
    <button
      type="button"
      onClick={() => cart.addItem(slug)}
      data-analytics="product_interest_click"
      data-analytics-label={`add_to_cart_${slug}`}
      className={`co-press inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-[var(--co-black)] bg-[var(--co-black)] px-6 py-3 text-sm font-bold text-[var(--co-white)] hover:border-[var(--co-palm)] hover:bg-[var(--co-palm)] ${className}`}
    >
      {label} <ShoppingBag size={16} />
    </button>
  );
}
