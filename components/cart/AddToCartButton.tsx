"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";

export function AddToCartButton({ slug, label = "Add to Cart" }: { slug: string; label?: string }) {
  const cart = useCart();

  return (
    <button
      type="button"
      onClick={() => cart.addItem(slug)}
      data-analytics="product_interest_click"
      data-analytics-label={`add_to_cart_${slug}`}
      className="inline-flex items-center gap-3 bg-ink px-6 py-4 text-sm text-paper shadow-[0_18px_44px_rgba(62,46,31,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_60px_rgba(62,46,31,0.2)]"
    >
      {label} <ShoppingBag size={16} />
    </button>
  );
}
