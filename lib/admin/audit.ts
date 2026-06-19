import "server-only";

import type { AdminSession } from "@/lib/admin/auth";
import { getFirebaseAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { firestoreCollections } from "@/lib/firebase/collections";
import { getRequestContext, sanitizeLogValue } from "@/lib/security/request";

type AuditInput = {
  session?: Pick<AdminSession, "uid" | "email" | "role"> | null;
  adminUid?: string;
  adminEmail?: string;
  adminRole?: string;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  before?: unknown;
  after?: unknown;
};

export async function writeAdminAuditLog(input: AuditInput) {
  if (!isFirebaseAdminConfigured()) return;

  try {
    const context = await getRequestContext();
    const db = await getFirebaseAdminDb();
    const ref = db.collection(firestoreCollections.auditLogs).doc();
    await ref.set({
      id: ref.id,
      adminUid: input.session?.uid || input.adminUid || "system",
      adminEmail: (input.session?.email || input.adminEmail || "unknown").toLowerCase(),
      adminRole: input.session?.role || input.adminRole || "unknown",
      action: input.action,
      resourceType: input.resourceType,
      resourceId: input.resourceId || null,
      before: sanitizeLogValue(input.before || null),
      after: sanitizeLogValue(input.after || null),
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      createdAt: new Date().toISOString()
    });
  } catch {
    // Audit writes are best-effort in request paths; Admin SDK retries can be added with Cloud Tasks later.
  }
}

export async function fetchRecentAuditLogs(limit = 50) {
  if (!isFirebaseAdminConfigured()) return [];

  try {
    const snapshot = await (await getFirebaseAdminDb())
      .collection(firestoreCollections.auditLogs)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch {
    return [];
  }
}
