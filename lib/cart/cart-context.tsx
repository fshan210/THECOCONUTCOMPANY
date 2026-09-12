"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { shopProducts, type ShopProduct } from "@/lib/catalog";
import { useCustomerSession } from "@/components/auth/CustomerAuthProvider";

export type CartItem = {
  slug: string;
  quantity: number;
  sku?: string;
  unitPrice?: number;
  variantLabel?: string;
  itemId?: string;
  bundleMetadata?: Array<{ bundleId: string; bundleName?: string }>;
};

export type CartConfiguration = Pick<CartItem, "sku" | "unitPrice" | "variantLabel"> & { bundle?: { bundleId: string; bundleName?: string } };
export type CartAddOptions = { openDrawer?: boolean };

const previewPrices = Object.fromEntries(shopProducts.map((product) => [product.slug, product.price])) as Record<string, number>;

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
  error: string;
  syncing: boolean;
  setOpen: (value: boolean) => void;
  addItem: (slug: string, configuration?: CartConfiguration, options?: CartAddOptions) => void;
  removeItem: (cartKey: string) => void;
  updateQuantity: (cartKey: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "co-cart";
const pendingMergeKey = "co-cart-pending-merge";
const cartItemKey = (item: Pick<CartItem, "slug" | "sku" | "itemId">) => item.itemId ?? item.sku ?? item.slug;

type ServerCart = {
  items: Array<{ itemId: string; slug: string; quantity: number; sku?: string; unitAmount: number; variantLabel?: string; bundleMetadata?: CartItem["bundleMetadata"] }>;
  subtotalAmount: number;
  totalQuantity: number;
  currency: "INR";
  version: number;
};

export function normalizeGuestCart(value: unknown, catalog: ShopProduct[]): CartItem[] {
  if (!Array.isArray(value)) return [];
  const result: CartItem[] = [];
  for (const candidate of value) {
    if (!candidate || typeof candidate !== "object") continue;
    const item = candidate as Partial<CartItem>;
    if (typeof item.slug !== "string" || !catalog.some((product) => product.slug === item.slug)) continue;
    if (!Number.isInteger(item.quantity) || Number(item.quantity) < 1) continue;
    const next: CartItem = {
      slug: item.slug,
      quantity: Math.min(12, Number(item.quantity)),
      ...(typeof item.sku === "string" ? { sku: item.sku.slice(0, 100) } : {}),
      ...(typeof item.unitPrice === "number" && Number.isFinite(item.unitPrice) && item.unitPrice >= 0 && item.unitPrice <= 100_000 ? { unitPrice: item.unitPrice } : {}),
      ...(typeof item.variantLabel === "string" ? { variantLabel: item.variantLabel.slice(0, 160) } : {}),
      ...(Array.isArray(item.bundleMetadata) ? { bundleMetadata: item.bundleMetadata.filter((bundle) => bundle && typeof bundle.bundleId === "string").slice(0, 12) } : {})
    };
    const key = next.sku ?? next.slug;
    const existing = result.find((current) => (current.sku ?? current.slug) === key);
    if (existing) existing.quantity = Math.min(12, existing.quantity + next.quantity);
    else result.push(next);
  }
  return result.slice(0, 24);
}

export function addGuestCartItem(items: CartItem[], slug: string, configuration: CartConfiguration = {}) {
  const existing = items.find((item) => item.slug === slug && item.sku === configuration.sku);
  if (existing) return items.map((item) => item === existing ? {
    ...item,
    quantity: Math.min(12, item.quantity + 1),
    ...(configuration.bundle && !item.bundleMetadata?.some((bundle) => bundle.bundleId === configuration.bundle?.bundleId) ? { bundleMetadata: [...(item.bundleMetadata ?? []), configuration.bundle] } : {})
  } : item);
  return [...items, {
    slug,
    quantity: 1,
    ...(configuration.sku ? { sku: configuration.sku } : {}),
    ...(configuration.unitPrice !== undefined ? { unitPrice: configuration.unitPrice } : {}),
    ...(configuration.variantLabel ? { variantLabel: configuration.variantLabel } : {}),
    ...(configuration.bundle ? { bundleMetadata: [configuration.bundle] } : {})
  }];
}

export const removeGuestCartItem = (items: CartItem[], key: string) => items.filter((item) => cartItemKey(item) !== key);
export const updateGuestCartQuantity = (items: CartItem[], key: string, quantity: number) => items.map((item) => cartItemKey(item) === key ? { ...item, quantity: Math.min(12, Math.max(1, Math.trunc(quantity))) } : item);
export const toCartMergeItems = (items: CartItem[]) => items.map((item) => ({ productId: item.slug, ...(item.sku ? { variantId: item.sku } : {}), quantity: item.quantity, ...(item.bundleMetadata?.length ? { bundleMetadata: item.bundleMetadata } : {}) }));

function readInitialCart(catalog: ShopProduct[]): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(storageKey);
    return stored ? normalizeGuestCart(JSON.parse(stored), catalog) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children, catalog = shopProducts }: { children: ReactNode; catalog?: ShopProduct[] }) {
  const session = useCustomerSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [open, setOpen] = useState(false);
  const [recentlyAddedSlug, setRecentlyAddedSlug] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [syncing, setSyncing] = useState(false);
  const itemsRef = useRef<CartItem[]>([]);
  const authenticatedRef = useRef(false);
  const serverVersionRef = useRef(0);
  const locksRef = useRef(new Set<string>());
  const queuedMutationsRef = useRef(new Map<string, { path: string; init: RequestInit }>());
  const queuedAddsRef = useRef(new Map<string, { slug: string; configuration: CartConfiguration; quantity: number }>());

  const replaceItems = useCallback((next: CartItem[]) => {
    itemsRef.current = next;
    setItems(next);
  }, []);

  const applyServerCart = useCallback((cart: ServerCart) => {
    if (!cart || !Array.isArray(cart.items) || cart.version < serverVersionRef.current) return;
    serverVersionRef.current = cart.version;
    replaceItems(cart.items.map((item) => ({
      slug: item.slug,
      quantity: item.quantity,
      itemId: item.itemId,
      ...(item.sku ? { sku: item.sku } : {}),
      unitPrice: item.unitAmount / 100,
      ...(item.variantLabel ? { variantLabel: item.variantLabel } : {}),
      ...(item.bundleMetadata?.length ? { bundleMetadata: item.bundleMetadata } : {})
    })));
    setError("");
  }, [replaceItems]);

  const request = useCallback(async (path: string, init?: RequestInit) => {
    const response = await fetch(path, { ...init, cache: "no-store", headers: { "content-type": "application/json", ...(init?.headers || {}) } });
    const payload = await response.json().catch(() => null) as { data?: ServerCart; error?: { message?: string } } | null;
    if (!response.ok || !payload?.data) {
      if (response.status === 401) window.dispatchEvent(new Event("co-auth-changed"));
      throw new Error(payload?.error?.message || "Your cart could not be updated. Please try again.");
    }
    return payload.data;
  }, []);

  useEffect(() => {
    replaceItems(readInitialCart(catalog));
    setHydrated(true);
  }, [catalog, replaceItems]);

  useEffect(() => {
    if (!hydrated || session) return;
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [hydrated, items, session]);

  useEffect(() => {
    if (!hydrated) return;
    if (!session) {
      if (authenticatedRef.current) replaceItems(readInitialCart(catalog));
      authenticatedRef.current = false;
      serverVersionRef.current = 0;
      return;
    }
    authenticatedRef.current = true;
    const controller = new AbortController();
    const synchronize = async () => {
      setSyncing(true);
      const guest = readInitialCart(catalog);
      try {
        let cart: ServerCart;
        if (guest.length) {
          let idempotencyKey = window.localStorage.getItem(pendingMergeKey);
          if (!idempotencyKey) {
            idempotencyKey = crypto.randomUUID();
            window.localStorage.setItem(pendingMergeKey, idempotencyKey);
          }
          cart = await request("/api/customer/cart", {
            method: "PUT",
            signal: controller.signal,
            body: JSON.stringify({
              idempotencyKey,
              items: toCartMergeItems(guest)
            })
          });
          window.localStorage.removeItem(storageKey);
          window.localStorage.removeItem(pendingMergeKey);
        } else cart = await request("/api/customer/cart", { signal: controller.signal });
        applyServerCart(cart);
      } catch (reason) {
        if ((reason as Error)?.name !== "AbortError") setError(reason instanceof Error ? reason.message : "Your cart could not be loaded. Please try again.");
      } finally {
        if (!controller.signal.aborted) setSyncing(false);
      }
    };
    void synchronize();
    return () => controller.abort();
  }, [applyServerCart, catalog, hydrated, replaceItems, request, session]);

  const mutateServer = useCallback(async function runServerMutation(lockKey: string, path: string, init: RequestInit) {
    if (locksRef.current.has(lockKey)) { queuedMutationsRef.current.set(lockKey, { path, init }); return; }
    locksRef.current.add(lockKey);
    setSyncing(true);
    try { applyServerCart(await request(path, init)); }
    catch (reason) {
      const message = reason instanceof Error ? reason.message : "Your cart could not be updated. Please try again.";
      try { applyServerCart(await request("/api/customer/cart")); } catch { /* Preserve the original actionable mutation error. */ }
      setError(message);
    }
    finally {
      locksRef.current.delete(lockKey);
      const queued = queuedMutationsRef.current.get(lockKey);
      if (queued) {
        queuedMutationsRef.current.delete(lockKey);
        void runServerMutation(lockKey, queued.path, queued.init);
      } else setSyncing(locksRef.current.size > 0);
    }
  }, [applyServerCart, request]);

  const flushAdd = useCallback((identity: string) => {
    if (locksRef.current.has(`add:${identity}`)) return;
    queueMicrotask(async () => {
      const queued = queuedAddsRef.current.get(identity);
      if (!queued) return;
      queuedAddsRef.current.delete(identity);
      const lockKey = `add:${identity}`;
      locksRef.current.add(lockKey);
      setSyncing(true);
      try {
        const cart = await request("/api/customer/cart", {
          method: "POST",
          body: JSON.stringify({
            productId: queued.slug,
            ...(queued.configuration.sku ? { variantId: queued.configuration.sku } : {}),
            quantity: Math.min(12, queued.quantity),
            ...(queued.configuration.bundle ? { bundle: queued.configuration.bundle } : {}),
            idempotencyKey: crypto.randomUUID()
          })
        });
        applyServerCart(cart);
      } catch (reason) {
        const message = reason instanceof Error ? reason.message : "Your cart could not be updated. Please try again.";
        try { applyServerCart(await request("/api/customer/cart")); } catch { /* Preserve the original actionable mutation error. */ }
        setError(message);
      } finally {
        locksRef.current.delete(lockKey);
        setSyncing(locksRef.current.size > 0);
        if (queuedAddsRef.current.has(identity)) flushAdd(identity);
      }
    });
  }, [applyServerCart, request]);

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
      error,
      syncing,
      setOpen: (value) => {
        setOpen(value);
        if (!value) setRecentlyAddedSlug(null);
      },
      recentlyAddedSlug,
      addItem: (slug, configuration = {}, options = {}) => {
        if (!session) {
          replaceItems(addGuestCartItem(itemsRef.current, slug, configuration));
        } else {
          replaceItems(addGuestCartItem(itemsRef.current, slug, configuration));
          const identity = configuration.sku ?? slug;
          const queued = queuedAddsRef.current.get(identity);
          queuedAddsRef.current.set(identity, { slug, configuration, quantity: (queued?.quantity ?? 0) + 1 });
          flushAdd(identity);
        }
        if (options.openDrawer !== false) {
          setRecentlyAddedSlug(configuration.sku ?? slug);
          setOpen(true);
        }
      },
      removeItem: (cartKey) => {
        if (!session) { replaceItems(removeGuestCartItem(itemsRef.current, cartKey)); return; }
        replaceItems(removeGuestCartItem(itemsRef.current, cartKey));
        void mutateServer(`item:${cartKey}`, `/api/customer/cart/items/${encodeURIComponent(cartKey)}`, { method: "DELETE", body: JSON.stringify({ idempotencyKey: crypto.randomUUID() }) });
      },
      updateQuantity: (cartKey, quantity) => {
        if (quantity <= 0) {
          if (!session) replaceItems(removeGuestCartItem(itemsRef.current, cartKey));
          else void mutateServer(`item:${cartKey}`, `/api/customer/cart/items/${encodeURIComponent(cartKey)}`, { method: "DELETE", body: JSON.stringify({ idempotencyKey: crypto.randomUUID() }) });
          return;
        }
        const normalized = Math.min(12, Math.max(1, Math.trunc(quantity)));
        if (!session) replaceItems(updateGuestCartQuantity(itemsRef.current, cartKey, normalized));
        else {
          replaceItems(updateGuestCartQuantity(itemsRef.current, cartKey, normalized));
          void mutateServer(`item:${cartKey}`, `/api/customer/cart/items/${encodeURIComponent(cartKey)}`, { method: "PATCH", body: JSON.stringify({ quantity: normalized, idempotencyKey: crypto.randomUUID() }) });
        }
      },
      clearCart: () => {
        if (!session) replaceItems([]);
        else {
          replaceItems([]);
          void mutateServer("clear", "/api/customer/cart", { method: "DELETE", body: JSON.stringify({ idempotencyKey: crypto.randomUUID() }) });
        }
      }
    };
  }, [catalog, error, flushAdd, items, mutateServer, open, recentlyAddedSlug, replaceItems, session, syncing]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
