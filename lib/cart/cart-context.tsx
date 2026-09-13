"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { shopProducts, type ShopProduct } from "@/lib/catalog";
import { useCustomerSession } from "@/components/auth/CustomerAuthProvider";
import {
  advanceCartScope,
  findCartLineByIdentity,
  isCurrentCartScope,
  isStaleCartScopeError,
  normalizeCartOwner,
  overlayPendingCartLines,
  planPendingLineReconciliation,
  StaleCartScopeError,
  type CartSessionScope
} from "@/lib/cart/cart-consistency";

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
  const owner = normalizeCartOwner(session?.email);
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [open, setOpen] = useState(false);
  const [recentlyAddedSlug, setRecentlyAddedSlug] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [syncing, setSyncing] = useState(false);
  const hydrationStartedRef = useRef(false);
  const itemsRef = useRef<CartItem[]>([]);
  const itemsOwnerRef = useRef<string | null>(null);
  const scopeRef = useRef<CartSessionScope>({ owner, generation: 0 });
  const nextScope = advanceCartScope(scopeRef.current, owner);
  if (nextScope !== scopeRef.current) {
    // Ref state is cleared during the auth-changing render. The old React state
    // is owner-tagged and therefore hidden until the matching scope reloads.
    itemsRef.current = [];
    scopeRef.current = nextScope;
  }
  const serverVersionRef = useRef(0);
  const locksRef = useRef(new Set<string>());
  const queuedMutationsRef = useRef(new Map<string, { path: string; init: RequestInit; scope: CartSessionScope }>());
  const queuedAddsRef = useRef(new Map<string, { slug: string; configuration: CartConfiguration; quantity: number }>());
  const requestControllersRef = useRef(new Set<AbortController>());

  const replaceItems = useCallback((next: CartItem[], itemOwner = scopeRef.current.owner) => {
    itemsRef.current = next;
    itemsOwnerRef.current = itemOwner;
    setItems(next);
  }, []);

  const applyServerCart = useCallback((cart: ServerCart, scope: CartSessionScope, settledOperationKey?: string) => {
    if (!isCurrentCartScope(scopeRef.current, scope) || !cart || !Array.isArray(cart.items) || cart.version < serverVersionRef.current) return false;
    serverVersionRef.current = cart.version;
    let next: CartItem[] = cart.items.map((item) => ({
      slug: item.slug,
      quantity: item.quantity,
      itemId: item.itemId,
      ...(item.sku ? { sku: item.sku } : {}),
      unitPrice: item.unitAmount / 100,
      ...(item.variantLabel ? { variantLabel: item.variantLabel } : {}),
      ...(item.bundleMetadata?.length ? { bundleMetadata: item.bundleMetadata } : {})
    }));
    const generationPrefix = `${scope.generation}:`;
    let preserveWholeCart = false;
    const protectedIdentities = new Set<string>();
    const protectedItemIds = new Set<string>();
    locksRef.current.forEach((operationKey) => {
      if (operationKey === settledOperationKey || !operationKey.startsWith(generationPrefix)) return;
      const key = operationKey.slice(generationPrefix.length);
      if (key === "clear") preserveWholeCart = true;
      else if (key.startsWith("add:")) protectedIdentities.add(key.slice(4));
      else if (key.startsWith("item:")) protectedItemIds.add(key.slice(5));
    });
    next = overlayPendingCartLines(next, itemsRef.current, Array.from(protectedIdentities), Array.from(protectedItemIds), preserveWholeCart);
    replaceItems(next, scope.owner);
    setError("");
    return true;
  }, [replaceItems]);

  const request = useCallback(async (path: string, init: RequestInit | undefined, scope: CartSessionScope) => {
    if (!isCurrentCartScope(scopeRef.current, scope)) throw new StaleCartScopeError();
    const controller = new AbortController();
    const abort = () => controller.abort();
    init?.signal?.addEventListener("abort", abort, { once: true });
    requestControllersRef.current.add(controller);
    try {
      const response = await fetch(path, { ...init, signal: controller.signal, cache: "no-store", headers: { "content-type": "application/json", ...(init?.headers || {}) } });
      const payload = await response.json().catch(() => null) as { data?: ServerCart; error?: { message?: string } } | null;
      if (!isCurrentCartScope(scopeRef.current, scope)) throw new StaleCartScopeError();
      if (!response.ok || !payload?.data) {
        if (response.status === 401) window.dispatchEvent(new Event("co-auth-changed"));
        throw new Error(payload?.error?.message || "Your cart could not be updated. Please try again.");
      }
      return payload.data;
    } finally {
      init?.signal?.removeEventListener("abort", abort);
      requestControllersRef.current.delete(controller);
    }
  }, []);

  useEffect(() => {
    if (hydrationStartedRef.current) return;
    hydrationStartedRef.current = true;
    if (!scopeRef.current.owner) replaceItems(readInitialCart(catalog), null);
    setHydrated(true);
  }, [catalog, replaceItems]);

  useEffect(() => {
    if (!hydrated || owner || itemsOwnerRef.current !== null) return;
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [hydrated, items, owner]);

  useEffect(() => {
    if (!hydrated) return;
    const scope = scopeRef.current;
    requestControllersRef.current.forEach((controller) => controller.abort());
    requestControllersRef.current.clear();
    locksRef.current = new Set();
    queuedMutationsRef.current = new Map();
    queuedAddsRef.current = new Map();
    serverVersionRef.current = 0;
    setSyncing(false);
    if (!scope.owner) {
      replaceItems(readInitialCart(catalog), null);
      return;
    }
    replaceItems([], scope.owner);
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
          }, scope);
          if (isCurrentCartScope(scopeRef.current, scope)) {
            window.localStorage.removeItem(storageKey);
            window.localStorage.removeItem(pendingMergeKey);
          }
        } else cart = await request("/api/customer/cart", { signal: controller.signal }, scope);
        applyServerCart(cart, scope);
      } catch (reason) {
        if ((reason as Error)?.name !== "AbortError" && !isStaleCartScopeError(reason) && isCurrentCartScope(scopeRef.current, scope)) {
          setError(reason instanceof Error ? reason.message : "Your cart could not be loaded. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted && isCurrentCartScope(scopeRef.current, scope)) setSyncing(false);
      }
    };
    void synchronize();
    return () => controller.abort();
  }, [applyServerCart, catalog, hydrated, owner, replaceItems, request]);

  const mutateServer = useCallback(async function runServerMutation(lockKey: string, path: string, init: RequestInit, scope: CartSessionScope = scopeRef.current) {
    if (!scope.owner || !isCurrentCartScope(scopeRef.current, scope)) return;
    const operationKey = `${scope.generation}:${lockKey}`;
    const locks = locksRef.current;
    const queue = queuedMutationsRef.current;
    if (locks.has(operationKey)) { queue.set(operationKey, { path, init, scope }); return; }
    locks.add(operationKey);
    setSyncing(true);
    try {
      const cart = await request(path, init, scope);
      // A later optimistic intent owns the visible line. Only the last request
      // in this per-item queue may replace it with a server snapshot.
      if (!queue.has(operationKey)) applyServerCart(cart, scope, operationKey);
    }
    catch (reason) {
      if (isStaleCartScopeError(reason) || (reason as Error)?.name === "AbortError" || !isCurrentCartScope(scopeRef.current, scope)) return;
      if (queue.has(operationKey)) return;
      const message = reason instanceof Error ? reason.message : "Your cart could not be updated. Please try again.";
      try { applyServerCart(await request("/api/customer/cart", undefined, scope), scope, operationKey); } catch { /* Preserve the original actionable mutation error. */ }
      setError(message);
    }
    finally {
      locks.delete(operationKey);
      const queued = queue.get(operationKey);
      if (queued) {
        queue.delete(operationKey);
        void runServerMutation(lockKey, queued.path, queued.init, queued.scope);
      } else if (isCurrentCartScope(scopeRef.current, scope)) setSyncing(locks.size > 0);
    }
  }, [applyServerCart, request]);

  const flushAdd = useCallback((identity: string, scope: CartSessionScope = scopeRef.current) => {
    const operationKey = `${scope.generation}:add:${identity}`;
    const locks = locksRef.current;
    const queuedAdds = queuedAddsRef.current;
    if (!scope.owner || !isCurrentCartScope(scopeRef.current, scope) || locks.has(operationKey)) return;
    queueMicrotask(async () => {
      if (!isCurrentCartScope(scopeRef.current, scope) || locks.has(operationKey)) return;
      const queued = queuedAdds.get(identity);
      if (!queued) return;
      queuedAdds.delete(identity);
      locks.add(operationKey);
      setSyncing(true);
      try {
        let cart = await request("/api/customer/cart", {
          method: "POST",
          body: JSON.stringify({
            productId: queued.slug,
            ...(queued.configuration.sku ? { variantId: queued.configuration.sku } : {}),
            quantity: Math.min(12, queued.quantity),
            ...(queued.configuration.bundle ? { bundle: queued.configuration.bundle } : {}),
            idempotencyKey: crypto.randomUUID()
          })
        }, scope);
        while (isCurrentCartScope(scopeRef.current, scope)) {
          // Any extra clicks while the POST was pending are already represented
          // in itemsRef. Discard their redundant add count and converge using the
          // server-issued itemId from the response.
          queuedAdds.delete(identity);
          const plan = planPendingLineReconciliation(cart.items, itemsRef.current, identity);
          if (plan.action === "apply") {
            if (cart.version < serverVersionRef.current) {
              cart = await request("/api/customer/cart", undefined, scope);
              continue;
            }
            applyServerCart(cart, scope, operationKey);
            break;
          }
          if (plan.action === "delete") {
            cart = await request(`/api/customer/cart/items/${encodeURIComponent(plan.itemId)}`, {
              method: "DELETE",
              body: JSON.stringify({ idempotencyKey: crypto.randomUUID() })
            }, scope);
          } else {
            cart = await request(`/api/customer/cart/items/${encodeURIComponent(plan.itemId)}`, {
              method: "PATCH",
              body: JSON.stringify({ quantity: plan.quantity, idempotencyKey: crypto.randomUUID() })
            }, scope);
          }
        }
      } catch (reason) {
        if (isStaleCartScopeError(reason) || (reason as Error)?.name === "AbortError" || !isCurrentCartScope(scopeRef.current, scope)) return;
        const message = reason instanceof Error ? reason.message : "Your cart could not be updated. Please try again.";
        try { applyServerCart(await request("/api/customer/cart", undefined, scope), scope, operationKey); } catch { /* Preserve the original actionable mutation error. */ }
        setError(message);
      } finally {
        locks.delete(operationKey);
        if (isCurrentCartScope(scopeRef.current, scope)) {
          setSyncing(locks.size > 0);
          if (queuedAdds.has(identity)) flushAdd(identity, scope);
        }
      }
    });
  }, [applyServerCart, request]);

  const visibleItems = useMemo(() => itemsOwnerRef.current === owner ? items : [], [items, owner]);

  const value = useMemo<CartContextValue>(() => {
    const products = visibleItems
      .map((item) => {
        const product = catalog.find((candidate) => candidate.slug === item.slug);
        return product ? { ...product, ...item, cartKey: cartItemKey(item) } : null;
      })
      .filter(Boolean) as Array<ShopProduct & CartItem & { cartKey: string }>;

    return {
      items: visibleItems,
      products,
      totalQuantity: visibleItems.reduce((total, item) => total + item.quantity, 0),
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
        if (!owner) {
          replaceItems(addGuestCartItem(itemsRef.current, slug, configuration));
        } else {
          const identity = configuration.sku ?? slug;
          const existing = findCartLineByIdentity(itemsRef.current, identity);
          const next = addGuestCartItem(itemsRef.current, slug, configuration);
          replaceItems(next, owner);
          if (existing?.itemId) {
            const quantity = findCartLineByIdentity(next, identity)?.quantity ?? existing.quantity;
            void mutateServer(`item:${existing.itemId}`, `/api/customer/cart/items/${encodeURIComponent(existing.itemId)}`, {
              method: "PATCH",
              body: JSON.stringify({ quantity, idempotencyKey: crypto.randomUUID() })
            });
          } else {
            const queued = queuedAddsRef.current.get(identity);
            queuedAddsRef.current.set(identity, { slug, configuration, quantity: (queued?.quantity ?? 0) + 1 });
            flushAdd(identity);
          }
        }
        if (options.openDrawer !== false) {
          setRecentlyAddedSlug(configuration.sku ?? slug);
          setOpen(true);
        }
      },
      removeItem: (cartKey) => {
        const existing = itemsRef.current.find((item) => cartItemKey(item) === cartKey);
        replaceItems(removeGuestCartItem(itemsRef.current, cartKey), owner);
        if (!owner || !existing?.itemId) return;
        void mutateServer(`item:${existing.itemId}`, `/api/customer/cart/items/${encodeURIComponent(existing.itemId)}`, { method: "DELETE", body: JSON.stringify({ idempotencyKey: crypto.randomUUID() }) });
      },
      updateQuantity: (cartKey, quantity) => {
        const existing = itemsRef.current.find((item) => cartItemKey(item) === cartKey);
        if (quantity <= 0) {
          replaceItems(removeGuestCartItem(itemsRef.current, cartKey), owner);
          if (owner && existing?.itemId) void mutateServer(`item:${existing.itemId}`, `/api/customer/cart/items/${encodeURIComponent(existing.itemId)}`, { method: "DELETE", body: JSON.stringify({ idempotencyKey: crypto.randomUUID() }) });
          return;
        }
        const normalized = Math.min(12, Math.max(1, Math.trunc(quantity)));
        replaceItems(updateGuestCartQuantity(itemsRef.current, cartKey, normalized), owner);
        if (owner && existing?.itemId) void mutateServer(`item:${existing.itemId}`, `/api/customer/cart/items/${encodeURIComponent(existing.itemId)}`, { method: "PATCH", body: JSON.stringify({ quantity: normalized, idempotencyKey: crypto.randomUUID() }) });
      },
      clearCart: () => {
        if (!owner) replaceItems([], null);
        else {
          replaceItems([], owner);
          void mutateServer("clear", "/api/customer/cart", { method: "DELETE", body: JSON.stringify({ idempotencyKey: crypto.randomUUID() }) });
        }
      }
    };
  }, [catalog, error, flushAdd, mutateServer, open, owner, recentlyAddedSlug, replaceItems, syncing, visibleItems]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
