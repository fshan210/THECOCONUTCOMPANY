"use server";

import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/admin/auth";
import { getAdminPath } from "@/lib/admin/path";
import { writeAdminAuditLog } from "@/lib/admin/audit";
import { getFirebaseAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { firestoreCollections } from "@/lib/firebase/collections";
import mediaManifest from "@/public/assets/media-library.generated.json";

type LocalMediaAsset = {
  id: string;
  title: string;
  path: string;
  type: string;
  category: string;
  tags: string[];
  altText: string;
  thumbnail: string | null;
};

export type MediaProvider = "local" | "firebase-storage" | "cloudinary" | "s3";

export async function syncLocalMediaLibrary() {
  const session = await requireAdminSession("media");
  if (!isFirebaseAdminConfigured()) redirect(getAdminPath("media-library"));

  const db = await getFirebaseAdminDb();
  const now = new Date().toISOString();
  const assets = (mediaManifest.assets as LocalMediaAsset[]).filter((asset) => asset.path.startsWith("/assets/"));
  const batch = db.batch();

  for (const asset of assets) {
    const ref = db.collection(firestoreCollections.mediaLibrary).doc(asset.id);
    batch.set(
      ref,
      {
        title: asset.title,
        path: asset.path,
        type: asset.type,
        category: asset.category,
        tags: asset.tags,
        altText: asset.altText,
        thumbnail: asset.thumbnail,
        provider: "local" satisfies MediaProvider,
        updatedAt: now,
        createdAt: now
      },
      { merge: true }
    );
  }

  await batch.commit();
  await writeAdminAuditLog({
    session,
    action: "media_metadata_sync",
    resourceType: "mediaLibrary",
    resourceId: "local-assets",
    after: { provider: "local", count: assets.length }
  });

  redirect(getAdminPath("media-library"));
}
