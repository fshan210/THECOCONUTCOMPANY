"use server";

import sharp from "sharp";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/admin/auth";
import { getAdminPath } from "@/lib/admin/path";
import { writeAdminAuditLog } from "@/lib/admin/audit";
import { getFirebaseAdminDb, getFirebaseAdminStorage, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { firestoreCollections } from "@/lib/firebase/collections";

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "video/mp4",
  "model/gltf+json",
  "model/gltf-binary",
  "application/octet-stream"
]);

export async function uploadMediaAsset(formData: FormData) {
  const session = await requireAdminSession("media");
  if (!isFirebaseAdminConfigured()) redirect(getAdminPath("media-library"));

  const file = formData.get("asset");
  const folder = String(formData.get("folder") || "media");
  const tags = String(formData.get("tags") || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  if (!(file instanceof File) || !file.size || !allowedTypes.has(file.type)) {
    redirect(getAdminPath("media-library"));
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-z0-9._-]/gi, "-").toLowerCase();
  const id = `${Date.now()}-${safeName}`;
  const objectPath = `media/${folder}/${id}`;
  const bucket = (await getFirebaseAdminStorage()).bucket();

  await bucket.file(objectPath).save(bytes, {
    metadata: { contentType: file.type, metadata: { uploadedBy: session.email } },
    resumable: false
  });

  let thumbnailPath: string | undefined;
  let width: number | undefined;
  let height: number | undefined;

  if (file.type.startsWith("image/") && file.type !== "image/svg+xml") {
    const metadata = await sharp(bytes).metadata();
    width = metadata.width;
    height = metadata.height;
    const thumbnail = await sharp(bytes).resize({ width: 480, withoutEnlargement: true }).webp({ quality: 78 }).toBuffer();
    thumbnailPath = `media/${folder}/thumb-${id}.webp`;
    await bucket.file(thumbnailPath).save(thumbnail, {
      metadata: { contentType: "image/webp", metadata: { source: objectPath } },
      resumable: false
    });
  }

  const now = new Date().toISOString();
  const docRef = await (await getFirebaseAdminDb()).collection(firestoreCollections.mediaLibrary).add({
    name: file.name,
    url: `gs://${bucket.name}/${objectPath}`,
    thumbnailUrl: thumbnailPath ? `gs://${bucket.name}/${thumbnailPath}` : null,
    folder,
    mimeType: file.type,
    size: file.size,
    width: width || null,
    height: height || null,
    tags,
    usage: [],
    uploadedBy: session.email,
    createdAt: now,
    updatedAt: now
  });

  await writeAdminAuditLog({
    session,
    action: "asset_upload",
    resourceType: "mediaLibrary",
    resourceId: docRef.id,
    after: { name: file.name, folder, mimeType: file.type, size: file.size, tags }
  });

  redirect(getAdminPath("media-library"));
}
