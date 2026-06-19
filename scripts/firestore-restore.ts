import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

function getProjectId() {
  if (process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    return process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  }

  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credentialsPath && existsSync(credentialsPath)) {
    const serviceAccount = JSON.parse(readFileSync(credentialsPath, "utf8")) as { project_id?: string };
    return serviceAccount.project_id;
  }

  return undefined;
}

const projectId = getProjectId();
const source = process.argv.find((arg) => arg.startsWith("gs://"));
const execute = process.argv.includes("--execute");

if (!projectId) {
  console.error("Missing FIREBASE_PROJECT_ID, NEXT_PUBLIC_FIREBASE_PROJECT_ID, or GOOGLE_APPLICATION_CREDENTIALS with project_id.");
  process.exit(1);
}

if (!source) {
  console.log("Provide the backup source URI to restore from, for example:");
  console.log("npm run firestore:restore -- gs://<bucket-name>/daily/<timestamp> -- --execute");
  process.exit(0);
}

const args = ["firestore", "import", source, `--project=${projectId}`];
console.log(`Firestore restore source: ${source}`);

if (!execute) {
  console.log("Dry run. Append -- --execute to run the import.");
  console.log(`gcloud ${args.join(" ")}`);
  process.exit(0);
}

const result = spawnSync("gcloud", args, { stdio: "inherit" });
process.exit(result.status ?? 1);
