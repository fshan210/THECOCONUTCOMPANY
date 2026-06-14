import { execFile } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { promisify } from "node:util";

const exec = promisify(execFile);

type DnsRecord = {
  type: string;
  name: string;
  data: string;
  ttl?: number;
  priority?: number;
  service?: string;
  protocol?: string;
  port?: number;
  weight?: number;
};

type Plan = {
  delete: DnsRecord[];
  keep: DnsRecord[];
  add: DnsRecord[];
  replace: Array<{ from: DnsRecord[]; to: DnsRecord[]; reason: string }>;
  warnings: string[];
};

const GODADDY_API_BASE = "https://api.godaddy.com/v1";
const VERCEL_A_RECORD = "76.76.21.21";
const GODADDY_PARKING_A = new Set(["76.223.105.230", "13.248.243.5"]);
const DEFAULT_TTL = 600;

loadEnvFiles([".env.local", ".env"]);

const args = new Set(process.argv.slice(2));
const shouldApply = args.has("--apply");
const allowPublicDnsFallback = args.has("--allow-public-dns-fallback");
const domain = process.env.GODADDY_DOMAIN || "cothecoconutcompany.com";
const apiKey = process.env.GODADDY_API_KEY;
const apiSecret = process.env.GODADDY_API_SECRET;

function loadEnvFiles(files: string[]) {
  for (const file of files) {
    if (!existsSync(file)) continue;

    const lines = readFileSync(file, "utf8").split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const separator = trimmed.indexOf("=");
      if (separator === -1) continue;

      const key = trimmed.slice(0, separator).trim();
      const rawValue = trimmed.slice(separator + 1).trim();
      const value = rawValue.replace(/^['"]|['"]$/g, "");

      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }
}

function authAvailable() {
  return Boolean(apiKey && apiSecret);
}

function authHeaders() {
  if (!apiKey || !apiSecret) {
    throw new Error("Missing GODADDY_API_KEY or GODADDY_API_SECRET.");
  }

  return {
    Authorization: `sso-key ${apiKey}:${apiSecret}`,
    Accept: "application/json",
    "Content-Type": "application/json"
  };
}

function normalizeName(name: string) {
  if (name === domain || name === `${domain}.`) return "@";
  return name.replace(`.${domain}`, "").replace(`.${domain}.`, "") || "@";
}

function recordLabel(record: DnsRecord) {
  const priority = record.priority === undefined ? "" : ` priority=${record.priority}`;
  const ttl = record.ttl === undefined ? "" : ` ttl=${record.ttl}`;
  return `${record.type} ${record.name} ${record.data}${priority}${ttl}`;
}

function isEmailOrVerificationRecord(record: DnsRecord) {
  if (["MX", "NS"].includes(record.type)) return true;
  if (record.type === "TXT") return true;
  if (record.name.toLowerCase().includes("_dmarc")) return true;
  if (record.name.toLowerCase().includes("_domainkey")) return true;
  return false;
}

function sameRecord(a: DnsRecord, b: DnsRecord) {
  return a.type === b.type && a.name === b.name && a.data === b.data;
}

async function godaddyRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${GODADDY_API_BASE}${path}`, {
    ...init,
    headers: {
      ...authHeaders(),
      ...(init?.headers || {})
    }
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GoDaddy API ${response.status}: ${body}`);
  }

  const body = await response.text();
  if (!body.trim()) return undefined as T;
  return JSON.parse(body) as T;
}

async function fetchCurrentRecords() {
  const records = await godaddyRequest<DnsRecord[]>(`/domains/${domain}/records`);
  return records
    .map((record) => ({ ...record, name: normalizeName(record.name) }))
    .sort((a, b) => `${a.type}:${a.name}:${a.data}`.localeCompare(`${b.type}:${b.name}:${b.data}`));
}

function createPlan(records: DnsRecord[]): Plan {
  const targetApex: DnsRecord = { type: "A", name: "@", data: VERCEL_A_RECORD, ttl: DEFAULT_TTL };
  const targetWww: DnsRecord = { type: "A", name: "www", data: VERCEL_A_RECORD, ttl: DEFAULT_TTL };
  const plan: Plan = { delete: [], keep: [], add: [], replace: [], warnings: [] };

  const apexA = records.filter((record) => record.type === "A" && record.name === "@");
  const wwwA = records.filter((record) => record.type === "A" && record.name === "www");
  const wwwCname = records.filter((record) => record.type === "CNAME" && record.name === "www");
  const parkingApex = apexA.filter((record) => GODADDY_PARKING_A.has(record.data));
  const targetApexExists = apexA.some((record) => record.data === VERCEL_A_RECORD);
  const targetWwwExists = wwwA.some((record) => record.data === VERCEL_A_RECORD);
  const parkingWwwCname = wwwCname.filter((record) => {
    const data = record.data.replace(/\.$/, "");
    return data === domain || data === "@";
  });

  for (const record of records) {
    if (isEmailOrVerificationRecord(record)) {
      plan.keep.push(record);
      continue;
    }

    if (parkingApex.some((candidate) => sameRecord(candidate, record))) {
      plan.delete.push(record);
      continue;
    }

    if (parkingWwwCname.some((candidate) => sameRecord(candidate, record))) {
      plan.delete.push(record);
      continue;
    }

    if (record.type === "A" && record.name === "@" && record.data !== VERCEL_A_RECORD) {
      plan.warnings.push(`Non-parking apex A record found and would be replaced by Vercel: ${recordLabel(record)}`);
      plan.delete.push(record);
      continue;
    }

    if (record.type === "A" && record.name === "www" && record.data !== VERCEL_A_RECORD) {
      plan.warnings.push(`Non-target www A record found and would be replaced by Vercel: ${recordLabel(record)}`);
      plan.delete.push(record);
      continue;
    }

    if (record.type === "CNAME" && record.name === "www") {
      plan.warnings.push(`www CNAME conflicts with required A www record and would be deleted: ${recordLabel(record)}`);
      plan.delete.push(record);
      continue;
    }

    plan.keep.push(record);
  }

  if (!targetApexExists) plan.add.push(targetApex);
  if (!targetWwwExists) plan.add.push(targetWww);

  if (apexA.length > 0 || !targetApexExists) {
    plan.replace.push({
      from: apexA,
      to: [targetApex],
      reason: "Point apex domain to Vercel."
    });
  }

  if (wwwA.length > 0 || wwwCname.length > 0 || !targetWwwExists) {
    plan.replace.push({
      from: [...wwwA, ...wwwCname],
      to: [targetWww],
      reason: "Point www host to Vercel so app-level redirect sends www to apex."
    });
  }

  return plan;
}

function printRecords(title: string, records: DnsRecord[]) {
  console.log(`\n${title}`);
  if (records.length === 0) {
    console.log("  none");
    return;
  }

  for (const record of records) {
    console.log(`  ${recordLabel(record)}`);
  }
}

function printPlan(plan: Plan) {
  printRecords("Records to keep", plan.keep);
  printRecords("Records to remove", plan.delete);
  printRecords("Records to update", plan.replace.flatMap((operation) => operation.from));
  printRecords("Records to add", plan.add);

  if (plan.replace.length > 0) {
    console.log("\nReplacement operations");
    for (const operation of plan.replace) {
      console.log(`  ${operation.reason}`);
      console.log(`    from: ${operation.from.length ? operation.from.map(recordLabel).join("; ") : "none"}`);
      console.log(`    to:   ${operation.to.map(recordLabel).join("; ")}`);
    }
  }

  if (plan.warnings.length > 0) {
    console.log("\nWarnings");
    for (const warning of plan.warnings) {
      console.log(`  ${warning}`);
    }
  }
}

function recordForWrite(record: DnsRecord) {
  return Object.fromEntries(
    Object.entries({
      type: record.type,
      name: record.name,
      data: record.data,
      ttl: record.ttl,
      priority: record.priority,
      service: record.service,
      protocol: record.protocol,
      port: record.port,
      weight: record.weight
    }).filter(([, value]) => value !== undefined)
  );
}

function createDesiredZone(records: DnsRecord[]) {
  const withoutWebsiteConflicts = records.filter((record) => {
    if (record.type === "A" && record.name === "@" && record.data !== VERCEL_A_RECORD) return false;
    if (record.type === "A" && record.name === "www") return false;
    if (record.type === "CNAME" && record.name === "www") return false;
    return true;
  });

  const apexExists = withoutWebsiteConflicts.some(
    (record) => record.type === "A" && record.name === "@" && record.data === VERCEL_A_RECORD
  );

  return [
    ...withoutWebsiteConflicts,
    ...(apexExists ? [] : [{ type: "A", name: "@", data: VERCEL_A_RECORD, ttl: DEFAULT_TTL }]),
    { type: "A", name: "www", data: VERCEL_A_RECORD, ttl: DEFAULT_TTL }
  ]
    .map(recordForWrite)
    .sort((a, b) => `${a.type}:${a.name}:${a.data}`.localeCompare(`${b.type}:${b.name}:${b.data}`));
}

async function applyPlan(records: DnsRecord[]) {
  console.log("\nApplying DNS changes to GoDaddy...");
  console.log("Secrets are loaded from environment and are not printed.");

  await godaddyRequest(`/domains/${domain}/records`, {
    method: "PUT",
    body: JSON.stringify(createDesiredZone(records))
  });

  console.log("Apply complete. DNS propagation can still take time.");
}

async function dig(name: string, type = "A") {
  try {
    const { stdout } = await exec("dig", ["+short", type, name]);
    const values = stdout.trim().split("\n").filter(Boolean);
    if (type === "A") {
      return values.filter((value) => /^\d{1,3}(\.\d{1,3}){3}$/.test(value));
    }
    return values;
  } catch {
    return [];
  }
}

async function printPropagationStatus() {
  const apex = await dig(domain);
  const www = await dig(`www.${domain}`);

  console.log("\nPropagation status");
  console.log(`  dig A ${domain}: ${apex.length ? apex.join(", ") : "no answer"}`);
  console.log(`  dig A www.${domain}: ${www.length ? www.join(", ") : "no answer"}`);
  console.log(`  Apex points to Vercel: ${apex.includes(VERCEL_A_RECORD) ? "yes" : "not yet"}`);
  console.log(`  www points to Vercel: ${www.includes(VERCEL_A_RECORD) ? "yes" : "not yet"}`);
}

async function printPublicDnsFallback() {
  const apex = await dig(domain);
  const wwwCname = await dig(`www.${domain}`, "CNAME");
  const wwwA = await dig(`www.${domain}`, "A");

  console.log("\nPublic DNS snapshot from dig");
  console.log(`  A ${domain}: ${apex.length ? apex.join(", ") : "no answer"}`);
  console.log(`  CNAME www.${domain}: ${wwwCname.length ? wwwCname.join(", ") : "no answer"}`);
  console.log(`  A www.${domain}: ${wwwA.length ? wwwA.join(", ") : "no answer"}`);

  const fallbackRecords: DnsRecord[] = [
    ...apex.map((data) => ({ type: "A", name: "@", data })),
    ...wwwCname.map((data) => ({ type: "CNAME", name: "www", data })),
    ...wwwA.map((data) => ({ type: "A", name: "www", data }))
  ];

  printPlan(createPlan(fallbackRecords));
}

async function main() {
  console.log(`GoDaddy DNS sync for ${domain}`);
  console.log(`Mode: ${shouldApply ? "APPLY" : "DRY RUN"}`);

  if (!authAvailable()) {
    console.log("\nGoDaddy API credentials are not available in this shell.");
    console.log("Required environment variables: GODADDY_API_KEY, GODADDY_API_SECRET, GODADDY_DOMAIN");
    console.log("No DNS writes can be performed. Secrets were not printed.");

    if (shouldApply) {
      throw new Error("Refusing --apply because GoDaddy API credentials are missing.");
    }

    if (allowPublicDnsFallback) {
      await printPublicDnsFallback();
      console.log("\nDry-run complete using public DNS fallback. Export GoDaddy credentials for authoritative record inspection.");
      return;
    }

    console.log("Public DNS fallback is disabled for this run.");
    console.log("If credentials are in a file, place them in .env.local or .env; these files are already ignored by git.");
    console.log("\nAuthoritative dry-run could not start because GoDaddy credentials were not visible to this process.");
    process.exitCode = 1;
    return;
  }

  const records = await fetchCurrentRecords();
  printRecords("Current GoDaddy records", records);

  const plan = createPlan(records);
  printPlan(plan);

  if (!shouldApply) {
    console.log("\nDry-run only. No DNS changes were written.");
    console.log("Run npm run godaddy:dns:apply only after approving the delete/keep/add plan above.");
    await printPropagationStatus();
    return;
  }

  await applyPlan(records);
  await printPropagationStatus();
}

main().catch((error) => {
  console.error(`\nDNS sync failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
