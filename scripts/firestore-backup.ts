import { spawnSync } from "node:child_process";

const collections = [
  "users",
  "admins",
  "products",
  "recipes",
  "journal",
  "orders",
  "wishlist",
  "newsletter",
  "settings",
  "mediaLibrary",
  "brandAssets",
  "auditLogs"
];

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const bucket = process.env.FIRESTORE_BACKUP_BUCKET;
const execute = process.argv.includes("--execute");
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

if (!projectId) {
  console.error("Missing FIREBASE_PROJECT_ID or NEXT_PUBLIC_FIREBASE_PROJECT_ID.");
  process.exit(1);
}

if (!bucket) {
  console.log("Set FIRESTORE_BACKUP_BUCKET to a secure Google Cloud Storage bucket before running exports.");
  console.log("Recommended bucket pattern: gs://<project-id>-firestore-backups");
  console.log("Do not store secrets in Firestore backup collections.");
  process.exit(0);
}

const outputUriPrefix = `${bucket.replace(/\/+$/, "")}/daily/${timestamp}`;
const args = [
  "firestore",
  "export",
  outputUriPrefix,
  `--project=${projectId}`,
  `--collection-ids=${collections.join(",")}`
];

console.log(`Firestore backup target: ${outputUriPrefix}`);
console.log(`Collections: ${collections.join(", ")}`);

if (!execute) {
  console.log(`Dry run. Execute with: npm run firestore:backup -- --execute`);
  console.log(`gcloud ${args.join(" ")}`);
  process.exit(0);
}

const result = spawnSync("gcloud", args, { stdio: "inherit" });
process.exit(result.status ?? 1);
