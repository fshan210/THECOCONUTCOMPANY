"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { shopProducts, type ShopProduct } from "@/lib/catalog";

export type CartItem = {
  slug: string;
  quantity: number;
  sku?: string;
  unitPrice?: number;
  variantLabel?: string;
};

export type CartConfiguration = Pick<CartItem, "sku" | "unitPrice" | "variantLabel">;

const previewPrices: Record<string, number> = {
  "co-water": 120,
  "melt-co-mango-coconut": 220,
  "co-kitchen-coconut-oil": 250,
  "co-botanica-coconut-care": 499,
  "co-lifestyle": 350
};

export function getCartPreviewPrice(slug: string) {
  return previewPrices[slug] || 0;
}

type CartContextValue = {
  items: CartItem[];
  products: Array<ShopProduct & CartItem & { cartKey: string }>;
  totalQuantity: number;
  subtotal: number;
  open: boolean;
  recentlyAddedSlug: string | null;
  setOpen: (value: boolean) => void;
  addItem: (slug: string, configuration?: CartConfiguration) => void;
  removeItem: (cartKey: string) => void;
  updateQuantity: (cartKey: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "co-cart";
const cartItemKey = (item: Pick<CartItem, "slug" | "sku">) => item.sku ?? item.slug;

function readInitialCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children, catalog = shopProducts }: { children: ReactNode; catalog?: ShopProduct[] }) {
  const [items, setItems] = useState<CartItem[]>(readInitialCart);
  const [open, setOpen] = useState(false);
  const [recentlyAddedSlug, setRecentlyAddedSlug] = useState<string | null>(null);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const products = items
      .map((item) => {
        const product = catalog.find((candidate) => candidate.slug === item.slug);
        return product ? { ...product, ...item, cartKey: cartItemKey(item) } : null;
      })
      .filter(Boolean) as Array<ShopProduct & CartItem & { cartKey: string }>;

    return {
      items,
      products,
      totalQuantity: items.reduce((total, item) => total + item.quantity, 0),
      subtotal: products.reduce((total, product) => total + (product.unitPrice ?? getCartPreviewPrice(product.slug)) * product.quantity, 0),
      open,
      setOpen: (value) => {
        setOpen(value);
        if (!value) setRecentlyAddedSlug(null);
      },
      recentlyAddedSlug,
      addItem: (slug, configuration = {}) => {
        setItems((current) => {
          const existing = current.find((item) => item.slug === slug && item.sku === configuration.sku);
          if (existing) {
            return current.map((item) => (item === existing ? { ...item, quantity: item.quantity + 1 } : item));
          }
          return [...current, { slug, quantity: 1, ...configuration }];
        });
        setRecentlyAddedSlug(configuration.sku ?? slug);
        setOpen(true);
      },
      removeItem: (cartKey) => setItems((current) => current.filter((item) => cartItemKey(item) !== cartKey)),
      updateQuantity: (cartKey, quantity) => {
        setItems((current) =>
          current
            .map((item) => (cartItemKey(item) === cartKey ? { ...item, quantity: Math.max(0, quantity) } : item))
            .filter((item) => item.quantity > 0)
        );
      },
      clearCart: () => setItems([])
    };
  }, [catalog, items, open, recentlyAddedSlug]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
