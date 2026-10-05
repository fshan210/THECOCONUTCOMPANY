import assert from 'node:assert/strict';
import { test } from 'node:test';
import { assessAudit, policy } from '../../scripts/staging-audit-policy.mjs';

const node = 'node_modules/aws-cdk-lib/node_modules/brace-expansion';
const context = { branch: 'codex/railway-runtime-migration', environment: 'development', now: Date.parse('2026-10-05T12:00:00Z') };
function report() {
  return { auditReportVersion: 2, metadata: { vulnerabilities: { total: 1 } }, vulnerabilities: { 'brace-expansion': {
    severity: 'high', nodes: [node], via: policy.infra.advisories.map(id => ({ url: `https://github.com/advisories/${id}`, severity: 'high' }))
  } } };
}
const evaluate = (data = report(), ctx = context, installed = { [node]: '5.0.9' }) => assessAudit(data, 'infra', ctx, installed);

test('accepts only the recorded staging findings and exposes their IDs', () => {
  assert.deepEqual(evaluate().accepted, [...policy.infra.advisories].sort());
});
test('blocks main, Production, push CI, and expired acceptance', () => {
  for (const change of [{ branch: 'main' }, { environment: 'production' }, { now: Date.parse(policy.expiresAt) }, { githubActions: true, event: 'push', repository: 'fshan210/THECOCONUTCOMPANY' }]) assert.equal(evaluate(report(), { ...context, ...change }).pass, false);
});
test('blocks new advisories, critical escalation, version and path drift', () => {
  const unknown = report(); unknown.vulnerabilities['brace-expansion'].via.push({ url: 'https://github.com/advisories/GHSA-new-new-new', severity: 'high' });
  assert.equal(evaluate(unknown).pass, false);
  const critical = report(); critical.vulnerabilities['brace-expansion'].severity = 'critical'; assert.equal(evaluate(critical).pass, false);
  assert.equal(evaluate(report(), context, { [node]: '5.0.10' }).pass, false);
  const path = report(); path.vulnerabilities['brace-expansion'].nodes.push('node_modules/brace-expansion'); assert.equal(evaluate(path).pass, false);
});
test('fails closed on malformed audit, unresolved propagation, or error', () => {
  assert.equal(evaluate({}).pass, false);
  const unresolved = report(); unresolved.vulnerabilities['brace-expansion'].via = ['missing']; assert.equal(evaluate(unresolved).pass, false);
  assert.equal(evaluate({ ...report(), error: { code: 'NETWORK' } }).pass, false);
});
test('a genuinely clean audit passes without any exception', () => {
  assert.equal(evaluate({ auditReportVersion: 2, vulnerabilities: {}, metadata: { vulnerabilities: { total: 0 } } }, { ...context, branch: 'main', environment: 'production' }).pass, true);
});
