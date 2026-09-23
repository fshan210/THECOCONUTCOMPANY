"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { SavedContentKind } from "@dotco/contracts";
import { useCustomerSession } from "@/components/auth/CustomerAuthProvider";
import { advanceSavedContentScope, isCurrentSavedContentScope, type SavedContentScope } from "@/lib/customer/saved-consistency";

const fieldByKind = {
  product: "productIds",
  recipe: "recipeIds",
  journal: "journalIds",
  community: "communityIds",
  recent: "recentlyViewedProductIds"
} as const;

type SavedPayload = Record<(typeof fieldByKind)[SavedContentKind], string[]>;
const savedContentEvent = "co-saved-content-changed";
let inFlightSavedRead: { scopeKey: string; promise: Promise<{ data?: Partial<SavedPayload> }> } | null = null;

function loadSavedContent(scope: SavedContentScope) {
  const scopeKey = scope.owner + ":" + scope.generation;
  if (inFlightSavedRead?.scopeKey === scopeKey) return inFlightSavedRead.promise;
  const promise = fetch("/api/customer/saved", { cache: "no-store" })
    .then(async (response) => {
      if (!response.ok) throw new Error(String(response.status));
      return response.json() as Promise<{ data?: Partial<SavedPayload> }>;
    })
    .finally(() => {
      if (inFlightSavedRead?.promise === promise) inFlightSavedRead = null;
    });
  inFlightSavedRead = { scopeKey, promise };
  return promise;
}
export function useSavedContent(kind: SavedContentKind) {
  const session = useCustomerSession();
  const owner = session?.email.trim().toLowerCase() || null;
  const pathname = usePathname();
  const router = useRouter();
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [pending, setPending] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");
  const pendingRef = useRef(new Set<string>());
  const scopeRef = useRef<SavedContentScope>({ owner, generation: 0 });
  if (scopeRef.current.owner !== owner) {
    scopeRef.current = advanceSavedContentScope(scopeRef.current, owner);
    pendingRef.current.clear();
  }

  const applyPayload = useCallback((payload: Partial<SavedPayload> | undefined) => {
    const values = payload?.[fieldByKind[kind]];
    if (values) setSaved(new Set(values));
  }, [kind]);

  useEffect(() => {
    setPending(new Set());
    pendingRef.current.clear();
    if (!owner) { setSaved(new Set()); setError(""); return; }
    const scope = scopeRef.current;
    let active = true;
    loadSavedContent(scope)
      .then((payload) => {
        if (!active || !isCurrentSavedContentScope(scopeRef.current, scope)) return;
        applyPayload(payload.data);
        setError("");
      })
      .catch((reason) => {
        if (active && reason?.name !== "AbortError" && isCurrentSavedContentScope(scopeRef.current, scope)) setError("We couldn’t refresh saved items. Please try again.");
      });
    return () => { active = false; };
  }, [applyPayload, kind, owner]);

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
    if (!owner) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (pendingRef.current.has(itemId)) return;
    const scope = scopeRef.current;
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
    if (!isCurrentSavedContentScope(scopeRef.current, scope)) return;
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
  }, [applyPayload, finish, kind, owner, pathname, router, saved]);

  const save = useCallback(async (itemId: string) => {
    if (!owner || saved.has(itemId) || pendingRef.current.has(itemId)) return;
    const scope = scopeRef.current;
    pendingRef.current.add(itemId);
    setPending((current) => new Set(current).add(itemId));
    setError("");
    const response = await fetch("/api/customer/saved", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind, itemId, idempotencyKey: crypto.randomUUID() })
    }).catch(() => null);
    if (!isCurrentSavedContentScope(scopeRef.current, scope)) return;
    if (response?.ok) {
      const payload = await response.json().catch(() => null) as { data?: Partial<SavedPayload> } | null;
      applyPayload(payload?.data);
      if (payload?.data) window.dispatchEvent(new CustomEvent(savedContentEvent, { detail: payload.data }));
    } else setError("We couldn’t update your saved items. Please try again.");
    finish(itemId);
  }, [applyPayload, finish, kind, owner, saved]);

  return { saved, pending, toggle, save, error };
}
