import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON) as {
      project_id: string;
      client_email: string;
      private_key: string;
    };
  }

  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credentialsPath && existsSync(credentialsPath)) {
    return JSON.parse(readFileSync(credentialsPath, "utf8")) as {
      project_id: string;
      client_email: string;
      private_key: string;
    };
  }

  throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS.");
}

const serviceAccount = getServiceAccount();
const app =
  getApps()[0] ||
  initializeApp({
    credential: cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key
    })
  });

const manifest = JSON.parse(readFileSync(join(process.cwd(), "public/assets/media-library.generated.json"), "utf8")) as {
  assets: Array<{
    id: string;
    title: string;
    path: string;
    type: string;
    category: string;
    tags: string[];
    altText: string;
    thumbnail: string | null;
  }>;
};

const db = getFirestore(app);

async function main() {
  const now = new Date().toISOString();
  const batch = db.batch();

  for (const asset of manifest.assets) {
    batch.set(
      db.collection("mediaLibrary").doc(asset.id),
      {
        title: asset.title,
        path: asset.path,
        type: asset.type,
        category: asset.category,
        tags: asset.tags,
        altText: asset.altText,
        thumbnail: asset.thumbnail,
        provider: "local",
        createdAt: now,
        updatedAt: now
      },
      { merge: true }
    );
  }

  await batch.commit();
  console.log(`Synced ${manifest.assets.length} local media metadata records to Firestore.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Media metadata sync failed.");
  process.exit(1);
});
