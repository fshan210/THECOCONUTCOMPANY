import "server-only";

import type { App } from "firebase-admin/app";
import { verifyFirebaseAdminProjectId } from "@/lib/firebase/admin-project";

let adminAppPromise: Promise<App> | null = null;
let previewProjectLogged = false;

function parseServiceAccount() {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (json) {
    try {
      return JSON.parse(json) as {
        project_id: string;
        client_email: string;
        private_key: string;
      };
    } catch {
      return null;
    }
  }

  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    return {
      project_id: process.env.FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    };
  }

  return null;
}

export function isFirebaseAdminConfigured() {
  return Boolean(getVerifiedServiceAccount());
}

function getVerifiedServiceAccount() {
  const serviceAccount = parseServiceAccount();
  if (!serviceAccount) return null;

  const projectId = verifyFirebaseAdminProjectId(
    serviceAccount.project_id,
    process.env.FIREBASE_PROJECT_ID,
    process.env.VERCEL_ENV
  );
  if (process.env.VERCEL_ENV === "preview" && !previewProjectLogged) {
    console.info("firebaseAdminProjectId:", projectId);
    previewProjectLogged = true;
  }

  return { ...serviceAccount, project_id: projectId };
}

export async function getFirebaseAdminApp(): Promise<App> {
  if (adminAppPromise) return adminAppPromise;

  adminAppPromise = (async () => {
    const serviceAccount = getVerifiedServiceAccount();
    if (!serviceAccount) throw new Error("Firebase Admin credentials are missing.");

    const [{ cert, getApps, initializeApp }] = await Promise.all([import("firebase-admin/app")]);
    const existing = getApps()[0];
    if (existing) {
      if (existing.options.projectId && existing.options.projectId !== serviceAccount.project_id) {
        throw new Error("Existing Firebase Admin app project ID mismatch.");
      }
      return existing;
    }

    return initializeApp({
      projectId: serviceAccount.project_id,
      credential: cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key
      })
    });
  })();

  return adminAppPromise;
}

export async function getFirebaseAdminDb() {
  const [{ getFirestore }, app] = await Promise.all([import("firebase-admin/firestore"), getFirebaseAdminApp()]);
  return getFirestore(app);
}
