"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { shopProducts, type ShopProduct } from "@/lib/catalog";

export type CartItem = {
  slug: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  products: Array<ShopProduct & { quantity: number }>;
  totalQuantity: number;
  open: boolean;
  setOpen: (value: boolean) => void;
  addItem: (slug: string) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "co-cart";

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

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const products = items
      .map((item) => {
        const product = catalog.find((candidate) => candidate.slug === item.slug);
        return product ? { ...product, quantity: item.quantity } : null;
      })
      .filter(Boolean) as Array<ShopProduct & { quantity: number }>;

    return {
      items,
      products,
      totalQuantity: items.reduce((total, item) => total + item.quantity, 0),
      open,
      setOpen,
      addItem: (slug) => {
        setItems((current) => {
          const existing = current.find((item) => item.slug === slug);
          if (existing) {
            return current.map((item) => (item.slug === slug ? { ...item, quantity: item.quantity + 1 } : item));
          }
          return [...current, { slug, quantity: 1 }];
        });
        setOpen(true);
      },
      removeItem: (slug) => setItems((current) => current.filter((item) => item.slug !== slug)),
      updateQuantity: (slug, quantity) => {
        setItems((current) =>
          current
            .map((item) => (item.slug === slug ? { ...item, quantity: Math.max(0, quantity) } : item))
            .filter((item) => item.quantity > 0)
        );
      },
      clearCart: () => setItems([])
    };
  }, [catalog, items, open]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
