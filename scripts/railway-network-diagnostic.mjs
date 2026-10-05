import { mkdirSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const baseUrl = 'https://dotco-next-staging-staging.up.railway.app';
const sha = process.env.DIAGNOSTIC_SHA;
if (!/^[a-f0-9]{40}$/.test(sha || '')) throw new Error('Expected exact DIAGNOSTIC_SHA');
const output = resolve('railway-network-evidence');
mkdirSync(output, { recursive: true });
const deadline = Date.now() + 10 * 60_000;
let health;
// This waits for deployment lineage; it does not retry any asset check.
while (Date.now() < deadline) {
  try {
    const response = await fetch(`${baseUrl}/api/health`, { signal: AbortSignal.timeout(10_000) });
    health = await response.json();
    if (response.ok && health.build === sha && health.platform === 'railway' && health.environment === 'preview') break;
  } catch { /* Record a failed readiness gate below if it never settles. */ }
  await new Promise((done) => setTimeout(done, 10_000));
}
writeFileSync(`${output}/lineage.json`, JSON.stringify({ expected: sha, observed: health, node: process.version, platform: process.platform }, null, 2));
if (health?.build !== sha) throw new Error('Matching Railway deployment did not become ready');
const runs = [];
for (let run = 1; run <= 5; run++) {
  const startedAt = new Date().toISOString();
  const result = spawnSync(process.execPath, ['scripts/production-smoke.mjs'], {
    env: { ...process.env, BASE_URL: baseUrl, SMOKE_ASSET_CONCURRENCY: '5' },
    encoding: 'utf8', timeout: 10 * 60_000
  });
  writeFileSync(`${output}/run-${run}.json`, result.stdout || '');
  writeFileSync(`${output}/run-${run}.stderr`, result.stderr || '');
  runs.push({ run, startedAt, endedAt: new Date().toISOString(), exit: result.status, error: result.error?.message });
  writeFileSync(`${output}/summary.json`, JSON.stringify(runs, null, 2));
  console.log(JSON.stringify(runs.at(-1)));
}
if (runs.some((run) => run.exit !== 0)) process.exitCode = 1;
