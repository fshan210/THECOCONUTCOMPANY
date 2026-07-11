import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

type ServiceAccount = { project_id: string; client_email: string; private_key: string };

function serviceAccount(): ServiceAccount | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (raw) {
    try { return JSON.parse(raw) as ServiceAccount; } catch { return null; }
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

const collections = [
  "users", "admins", "products", "recipes", "journal", "testimonials", "homepage", "seo",
  "newsletter", "wishlist", "savedRecipes", "orders", "activityLogs", "auditLogs", "securityEvents",
  "mediaLibrary"
];

function isTimestamp(value: unknown): value is { toDate: () => Date } {
  return Boolean(value && typeof value === "object" && "toDate" in value && typeof (value as { toDate?: unknown }).toDate === "function");
}

async function main() {
const account = serviceAccount();
if (!account) {
  console.error("Firebase audit requires FIREBASE_SERVICE_ACCOUNT_JSON or the FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY trio.");
  process.exit(1);
}

const app = getApps()[0] ?? initializeApp({ credential: cert(account as Parameters<typeof cert>[0]) });
const db = getFirestore(app);
for (const name of collections) {
  const snapshot = await db.collection(name).get();
  const fields = new Set<string>();
  const timestamps: Date[] = [];
  let malformed = 0;
  let testIndicators = 0;
  const emails = new Set<string>();
  let duplicateEmails = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (!data || typeof data !== "object") { malformed += 1; continue; }
    Object.keys(data).forEach((key) => fields.add(key));
    for (const key of ["createdAt", "updatedAt", "publishedAt"]) {
      if (isTimestamp(data[key])) timestamps.push(data[key].toDate());
    }
    const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
    if (email && emails.has(email)) duplicateEmails += 1;
    if (email) emails.add(email);
    if (data.test === true || data.environment === "test" || data.isTest === true) testIndicators += 1;
  }

  const sorted = timestamps.sort((a, b) => a.getTime() - b.getTime());
  console.log(JSON.stringify({
    collection: name,
    documents: snapshot.size,
    representativeFields: Array.from(fields).sort().slice(0, 40),
    timestampRange: sorted.length ? { earliest: sorted[0].toISOString(), latest: sorted.at(-1)?.toISOString() } : null,
    duplicateEmailCount: duplicateEmails,
    malformedRecordCount: malformed,
    testRecordIndicators: testIndicators
  }));
}
}

void main();
