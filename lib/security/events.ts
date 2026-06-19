import "server-only";

import { getFirebaseAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { firestoreCollections } from "@/lib/firebase/collections";
import { getRequestContext, sanitizeLogValue } from "@/lib/security/request";

type SecurityEventInput = {
  actorId?: string | null;
  actorEmail?: string | null;
  action: string;
  area: "customer_auth" | "admin_auth" | "forms" | "rate_limit" | "system";
  outcome: "allowed" | "blocked" | "failed" | "skipped";
  metadata?: Record<string, string | number | boolean | null | undefined>;
};

export async function writeSecurityEvent(input: SecurityEventInput) {
  if (!isFirebaseAdminConfigured()) return;

  try {
    const context = await getRequestContext();
    await (await getFirebaseAdminDb()).collection(firestoreCollections.securityEvents).add({
      actorId: input.actorId || null,
      actorEmail: input.actorEmail?.toLowerCase() || null,
      action: input.action,
      area: input.area,
      outcome: input.outcome,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      metadata: sanitizeLogValue(input.metadata || {}),
      createdAt: new Date().toISOString()
    });
  } catch {
    // Security logging must never block an authentication flow.
  }
}
