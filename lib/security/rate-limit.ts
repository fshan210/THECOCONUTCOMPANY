import "server-only";

import { getFirebaseAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { firestoreCollections } from "@/lib/firebase/collections";
import { writeSecurityEvent } from "@/lib/security/events";

type RateLimitOptions = {
  key: string;
  action: string;
  limit: number;
  windowMs: number;
  area?: "customer_auth" | "admin_auth" | "forms" | "rate_limit" | "system";
};

const memoryLimits = new Map<string, { count: number; resetAt: number }>();

function normalizeKey(key: string) {
  return key.trim().toLowerCase().replace(/[^a-z0-9@._:-]/gi, "-").slice(0, 160) || "anonymous";
}

export async function checkRateLimit({ key, action, limit, windowMs, area = "rate_limit" }: RateLimitOptions) {
  const normalized = normalizeKey(`${action}:${key}`);
  const now = Date.now();
  const nowIso = new Date(now).toISOString();

  if (isFirebaseAdminConfigured()) {
    try {
      const db = await getFirebaseAdminDb();
      const ref = db.collection(firestoreCollections.securityEvents).doc(`rate-${normalized}`);
      const snapshot = await ref.get();
      const current = snapshot.exists ? snapshot.data() : null;
      const resetAt = typeof current?.resetAtMs === "number" && current.resetAtMs > now ? current.resetAtMs : now + windowMs;
      const count = resetAt === current?.resetAtMs ? Number(current?.count || 0) + 1 : 1;
      const allowed = count <= limit;

      await ref.set(
        {
          action: "rate_limit_state",
          area,
          outcome: allowed ? "allowed" : "blocked",
          key: normalized,
          count,
          limit,
          resetAtMs: resetAt,
          updatedAt: nowIso,
          createdAt: current?.createdAt || nowIso
        },
        { merge: true }
      );

      if (!allowed) {
        await writeSecurityEvent({ action, area, outcome: "blocked", metadata: { reason: "rate_limit", limit } });
      }

      return { allowed, remaining: Math.max(limit - count, 0), resetAt };
    } catch {
      // Fall back to memory if Firestore is temporarily unavailable.
    }
  }

  const current = memoryLimits.get(normalized);
  const resetAt = current && current.resetAt > now ? current.resetAt : now + windowMs;
  const count = current && current.resetAt > now ? current.count + 1 : 1;
  memoryLimits.set(normalized, { count, resetAt });
  const allowed = count <= limit;
  if (!allowed) await writeSecurityEvent({ action, area, outcome: "blocked", metadata: { reason: "memory_rate_limit", limit } });
  return { allowed, remaining: Math.max(limit - count, 0), resetAt };
}
