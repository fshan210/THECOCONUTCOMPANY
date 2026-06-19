import "server-only";

import type { App } from "firebase-admin/app";

let adminAppPromise: Promise<App> | null = null;

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
  return Boolean(parseServiceAccount());
}

export async function getFirebaseAdminApp(): Promise<App> {
  if (adminAppPromise) return adminAppPromise;

  adminAppPromise = (async () => {
    const [{ cert, getApps, initializeApp }] = await Promise.all([import("firebase-admin/app")]);
    const existing = getApps()[0];
    if (existing) return existing;

    const serviceAccount = parseServiceAccount();
    if (!serviceAccount) throw new Error("Firebase Admin credentials are missing.");

    return initializeApp({
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
