"use client";

import { useCallback, useEffect, useState } from "react";
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

export function useSavedContent(kind: SavedContentKind) {
  const session = useCustomerSession();
  const pathname = usePathname();
  const router = useRouter();
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [pending, setPending] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!session) { setSaved(new Set()); return; }
    const controller = new AbortController();
    fetch("/api/customer/saved", { cache: "no-store", signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((payload: { data?: Partial<SavedPayload> } | null) => setSaved(new Set(payload?.data?.[fieldByKind[kind]] ?? [])))
      .catch(() => undefined);
    return () => controller.abort();
  }, [kind, session]);

  const toggle = useCallback(async (itemId: string) => {
    if (!session) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (pending.has(itemId)) return;
    const removing = saved.has(itemId);
    setPending((current) => new Set(current).add(itemId));
    setSaved((current) => {
      const next = new Set(current);
      if (removing) next.delete(itemId); else next.add(itemId);
      return next;
    });
    const response = await fetch("/api/customer/saved", {
      method: removing ? "DELETE" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind, itemId })
    }).catch(() => null);
    if (!response?.ok) {
      setSaved((current) => {
        const next = new Set(current);
        if (removing) next.add(itemId); else next.delete(itemId);
        return next;
      });
    }
    setPending((current) => { const next = new Set(current); next.delete(itemId); return next; });
  }, [kind, pathname, pending, router, saved, session]);

  const save = useCallback(async (itemId: string) => {
    if (!session || saved.has(itemId) || pending.has(itemId)) return;
    setPending((current) => new Set(current).add(itemId));
    const response = await fetch("/api/customer/saved", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind, itemId })
    }).catch(() => null);
    if (response?.ok) setSaved((current) => new Set(current).add(itemId));
    setPending((current) => { const next = new Set(current); next.delete(itemId); return next; });
  }, [kind, pending, saved, session]);

  return { saved, pending, toggle, save };
}
