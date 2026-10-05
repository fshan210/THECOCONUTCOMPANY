import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const branch = 'codex/railway-runtime-migration';
export const policy = {
  acceptedOn: '2026-10-05',
  expiresAt: '2026-10-19T00:00:00Z',
  root: {
    nodes: {
      'node_modules/braces': '3.0.3',
      'node_modules/chokidar': '3.6.0',
      'node_modules/fast-glob': '3.3.3',
      'node_modules/micromatch': '4.0.8',
      'node_modules/tailwindcss': '3.4.19',
      'node_modules/tailwindcss-animate': '1.0.7'
    },
    advisories: ['GHSA-vfj7-8cjw-p6xm']
  },
  infra: {
    nodes: { 'node_modules/aws-cdk-lib/node_modules/brace-expansion': '5.0.9' },
    advisories: ['GHSA-q2hr-2g5m-vwhr', 'GHSA-qhr7-859c-m2p7', 'GHSA-6j4f-fj2g-mc7p']
  }
};

// This is an explicit staging risk decision, not a patched-dependency claim.
export function assessAudit(report, workspace, context, installed) {
  const reject = (reason) => ({ pass: false, reason });
  if (report?.auditReportVersion !== 2 || !report.vulnerabilities || !report.metadata?.vulnerabilities || report.error) return reject('Invalid audit report');
  const findings = Object.entries(report.vulnerabilities);
  if (!findings.length) {
    return report.metadata.vulnerabilities.total === 0 ? { pass: true, accepted: [] } : reject('Inconsistent audit report');
  }
  const approved = policy[workspace];
  if (!approved || context.branch !== branch || !['development', 'staging'].includes(context.environment)) return reject('Exception is restricted to migration staging evaluation');
  if (context.githubActions && (context.event !== 'pull_request' || context.repository !== 'fshan210/THECOCONUTCOMPANY')) return reject('Exception is restricted to the migration pull request');
  if (!Number.isFinite(context.now) || context.now >= Date.parse(policy.expiresAt)) return reject('Staging risk acceptance expired');
  for (const [name, finding] of findings) {
    if (finding.severity === 'critical' || !finding.nodes?.length || !finding.via?.length) return reject(`Unapproved finding: ${name}`);
    for (const node of finding.nodes) {
      if (!approved.nodes[node] || installed[node] !== approved.nodes[node]) return reject(`Unapproved dependency path/version: ${node}`);
    }
  }
  const leafIds = new Set();
  const visit = (name, ancestors = new Set()) => {
    const finding = report.vulnerabilities[name];
    if (!finding || ancestors.has(name)) return false;
    const next = new Set([...ancestors, name]);
    return finding.via.every((via) => {
      if (typeof via === 'string') return visit(via, next);
      const id = via.url?.match(/^https:\/\/github\.com\/advisories\/(GHSA-[a-z0-9-]+)$/)?.[1];
      if (!id || via.severity === 'critical' || !approved.advisories.includes(id)) return false;
      leafIds.add(id);
      return true;
    });
  };
  if (!findings.every(([name]) => visit(name))) return reject('New, critical, or unresolved advisory');
  return { pass: true, accepted: [...leafIds].sort(), expiresAt: policy.expiresAt };
}

function main() {
  const workspace = process.argv[2];
  if (!['root', 'infra'].includes(workspace)) throw new Error('Expected root or infra workspace');
  const cwd = resolve(fileURLToPath(new URL('..', import.meta.url)), workspace === 'root' ? '.' : 'infra');
  const audit = spawnSync('npm', ['audit', '--omit=dev', '--audit-level=high', '--json'], { cwd, encoding: 'utf8' });
  // Keep every advisory visible in CI, including those explicitly accepted.
  process.stdout.write(audit.stdout || '');
  if (audit.stderr) process.stderr.write(audit.stderr);
  if (audit.error || ![0, 1].includes(audit.status)) throw new Error('npm audit could not complete');
  const installed = {};
  for (const node of Object.keys(policy[workspace].nodes)) {
    try { installed[node] = JSON.parse(readFileSync(resolve(cwd, node, 'package.json'), 'utf8')).version; } catch { /* Missing paths fail if reported as vulnerable. */ }
  }
  const githubActions = process.env.GITHUB_ACTIONS === 'true';
  const currentBranch = githubActions ? process.env.GITHUB_HEAD_REF : spawnSync('git', ['branch', '--show-current'], { cwd, encoding: 'utf8' }).stdout.trim();
  const result = assessAudit(JSON.parse(audit.stdout), workspace, {
    branch: currentBranch,
    environment: process.env.APP_DEPLOY_ENV,
    githubActions,
    event: process.env.GITHUB_EVENT_NAME,
    repository: process.env.GITHUB_REPOSITORY,
    now: Date.now()
  }, installed);
  console.log(JSON.stringify({ workspace, ...result }));
  if (!result.pass) process.exitCode = 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
