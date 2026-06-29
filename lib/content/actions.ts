"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin/auth";
import { writeAdminAuditLog } from "@/lib/admin/audit";
import { getAdminPath } from "@/lib/admin/path";
import { getFirebaseAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { firestoreCollections } from "@/lib/firebase/collections";
import { revalidateContent } from "@/lib/content/revalidate";
import type { ContentRecord, ContentType } from "@/lib/content/types";
import { contentSchemas } from "@/lib/content/validation";

const contentTypes = ["products", "recipes", "journal", "testimonials", "homepage", "seo"] as const;
const contentTypeSchema = z.enum(contentTypes);

function permissionFor(type: ContentType) {
  if (type === "products") return "commerce";
  if (type === "seo") return "seo";
  return "content";
}

function safeReturn(type: ContentType, status: string) {
  redirect(`${getAdminPath(type)}?cms=${encodeURIComponent(status)}`);
}

export async function saveContentRecord(typeInput: ContentType, formData: FormData) {
  const type = contentTypeSchema.parse(typeInput);
  const session = await requireAdminSession(permissionFor(type));
  if (!isFirebaseAdminConfigured()) safeReturn(type, "Firebase Admin credentials are required to save content");

  let candidate: unknown;
  try {
    candidate = JSON.parse(String(formData.get("payload") || ""));
  } catch {
    safeReturn(type, "Invalid JSON; no changes were saved");
  }

  const parsed = contentSchemas[type].safeParse(candidate);
  if (!parsed.success) safeReturn(type, "A valid id and draft/published status are required");

  const record = parsed.data as ContentRecord;
  const now = new Date().toISOString();
  const db = await getFirebaseAdminDb();
  const ref = db.collection(firestoreCollections[type]).doc(record.id);
  const beforeSnapshot = await ref.get();
  await ref.set({ ...record, updatedAt: now, createdAt: beforeSnapshot.data()?.createdAt || now }, { merge: false });
  await writeAdminAuditLog({
    session,
    action: beforeSnapshot.exists ? "content_update" : "content_create",
    resourceType: type,
    resourceId: record.id,
    before: beforeSnapshot.data() || null,
    after: record
  });
  revalidateContent(type, "slug" in record ? String(record.slug) : undefined);
  safeReturn(type, "Saved and cache refresh requested");
}

export async function archiveContentRecord(typeInput: ContentType, formData: FormData) {
  const type = contentTypeSchema.parse(typeInput);
  const session = await requireAdminSession(permissionFor(type));
  const id = z.string().min(1).max(160).parse(formData.get("id"));
  if (!isFirebaseAdminConfigured()) safeReturn(type, "Firebase Admin credentials are required to archive content");

  const ref = (await getFirebaseAdminDb()).collection(firestoreCollections[type]).doc(id);
  const before = await ref.get();
  if (before.exists) {
    await ref.set({ publicationStatus: "draft", archivedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, { merge: true });
    await writeAdminAuditLog({ session, action: "content_archive", resourceType: type, resourceId: id, before: before.data(), after: { publicationStatus: "draft" } });
  }
  revalidateContent(type, String(before.data()?.slug || ""));
  safeReturn(type, "Archived as draft and cache refresh requested");
}
