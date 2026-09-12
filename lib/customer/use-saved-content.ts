"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { SavedContentKind } from "@dotco/contracts";
import { useCustomerSession } from "@/components/auth/CustomerAuthProvider";

const fieldByKind = {
  product: "productIds",
  recipe: "recipeIds",
  journal: "journalIds",
  community: "communityIds",
  recent: "recentlyViewedProductIds"
} as const;

type SavedPayload = Record<(typeof fieldByKind)[SavedContentKind], string[]>;
const savedContentEvent = "co-saved-content-changed";

export function useSavedContent(kind: SavedContentKind) {
  const session = useCustomerSession();
  const pathname = usePathname();
  const router = useRouter();
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [pending, setPending] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");
  const pendingRef = useRef(new Set<string>());

  const applyPayload = useCallback((payload: Partial<SavedPayload> | undefined) => {
    const values = payload?.[fieldByKind[kind]];
    if (values) setSaved(new Set(values));
  }, [kind]);

  useEffect(() => {
    if (!session) { setSaved(new Set()); setError(""); return; }
    const controller = new AbortController();
    fetch("/api/customer/saved", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json() as Promise<{ data?: Partial<SavedPayload> }>;
      })
      .then((payload) => { applyPayload(payload.data); setError(""); })
      .catch((reason) => { if (reason?.name !== "AbortError") setError("We couldn’t refresh saved items. Please try again."); });
    return () => controller.abort();
  }, [applyPayload, kind, session]);

  useEffect(() => {
    const synchronize = (event: Event) => applyPayload((event as CustomEvent<Partial<SavedPayload>>).detail);
    window.addEventListener(savedContentEvent, synchronize);
    return () => window.removeEventListener(savedContentEvent, synchronize);
  }, [applyPayload]);

  const finish = useCallback((itemId: string) => {
    pendingRef.current.delete(itemId);
    setPending((current) => { const next = new Set(current); next.delete(itemId); return next; });
  }, []);

  const toggle = useCallback(async (itemId: string) => {
    if (!session) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (pendingRef.current.has(itemId)) return;
    const removing = saved.has(itemId);
    pendingRef.current.add(itemId);
    setPending((current) => new Set(current).add(itemId));
    setError("");
    setSaved((current) => {
      const next = new Set(current);
      if (removing) next.delete(itemId); else next.add(itemId);
      return next;
    });
    const response = await fetch("/api/customer/saved", {
      method: removing ? "DELETE" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind, itemId, idempotencyKey: crypto.randomUUID() })
    }).catch(() => null);
    if (response?.status === 401) {
      setSaved((current) => { const next = new Set(current); if (removing) next.add(itemId); else next.delete(itemId); return next; });
      finish(itemId);
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!response?.ok) {
      setSaved((current) => {
        const next = new Set(current);
        if (removing) next.add(itemId); else next.delete(itemId);
        return next;
      });
      setError("We couldn’t update your saved items. Please try again.");
    } else {
      const payload = await response.json().catch(() => null) as { data?: Partial<SavedPayload> } | null;
      applyPayload(payload?.data);
      if (payload?.data) window.dispatchEvent(new CustomEvent(savedContentEvent, { detail: payload.data }));
    }
    finish(itemId);
  }, [applyPayload, finish, kind, pathname, router, saved, session]);

  const save = useCallback(async (itemId: string) => {
    if (!session || saved.has(itemId) || pendingRef.current.has(itemId)) return;
    pendingRef.current.add(itemId);
    setPending((current) => new Set(current).add(itemId));
    setError("");
    const response = await fetch("/api/customer/saved", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind, itemId, idempotencyKey: crypto.randomUUID() })
    }).catch(() => null);
    if (response?.ok) {
      const payload = await response.json().catch(() => null) as { data?: Partial<SavedPayload> } | null;
      applyPayload(payload?.data);
      if (payload?.data) window.dispatchEvent(new CustomEvent(savedContentEvent, { detail: payload.data }));
    } else setError("We couldn’t update your saved items. Please try again.");
    finish(itemId);
  }, [applyPayload, finish, kind, saved, session]);

  return { saved, pending, toggle, save, error };
}
