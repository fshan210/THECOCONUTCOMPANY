/**
 * Migration guard. This command is intentionally aggregate-only until a reviewed
 * DynamoDB transform is approved. It never writes to Firebase or AWS by default.
 */
const mode = process.argv[2] ?? "dry-run";
const allowed = new Set(["dry-run", "dev"]);
if (!allowed.has(mode)) {
  console.error("Usage: npm run migrate:firebase:dry-run | npm run migrate:firebase:dev");
  process.exit(1);
}

if (mode === "dev" && process.env.DOTCO_MIGRATION_APPROVED !== "true") {
  console.error("DEV migration is gated. Set DOTCO_MIGRATION_APPROVED=true only after reviewing FIREBASE_DATA_AUDIT.md.");
  process.exit(1);
}

console.log(JSON.stringify({
  mode,
  source: "firebase",
  target: "dynamodb-dev",
  dryRun: true,
  sourceCount: null,
  transformedCount: 0,
  insertedCount: 0,
  skippedCount: 0,
  conflictCount: 0,
  failedCount: 0,
  message: "No transform is enabled yet; production data is untouched. Run firebase:audit first."
}));
