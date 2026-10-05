import assert from 'node:assert/strict';
import test from 'node:test';
import { spawnSync } from 'node:child_process';

function config(env) {
  const script = `const {default:c}=await import('./next.config.mjs'); console.log(JSON.stringify({output:c.output??null,headers:await c.headers(),firebaseEnv:c.env.NEXT_PUBLIC_FIREBASE_DEPLOYMENT_ENV}));`;
  const clean = { PATH: process.env.PATH, HOME: process.env.HOME, NODE_ENV: 'production', ...env };
  return spawnSync(process.execPath, ['--input-type=module', '-e', script], { env: clean, encoding: 'utf8' });
}

test('legacy Vercel Production retains normal output, HSTS and indexability', () => {
  const run = config({ VERCEL_ENV: 'production' });
  assert.equal(run.status, 0, run.stderr);
  const result = JSON.parse(run.stdout);
  const headers = result.headers.flatMap(x => x.headers);
  assert.equal(result.output, null);
  assert.equal(result.firebaseEnv, 'production');
  assert.ok(headers.some(x => x.key === 'Strict-Transport-Security'));
  assert.ok(!headers.some(x => x.key === 'X-Robots-Tag'));
});

test('Railway preview emits standalone output and crawler exclusion', () => {
  const run = config({ APP_DEPLOY_ENV: 'preview', APP_HOST_PLATFORM: 'railway', DEPLOY_TARGET: 'railway' });
  assert.equal(run.status, 0, run.stderr);
  const result = JSON.parse(run.stdout);
  assert.equal(result.output, 'standalone');
  assert.equal(result.firebaseEnv, 'preview');
  assert.ok(result.headers.some(x => x.source === '/:path*' && x.headers.some(h => h.key === 'X-Robots-Tag' && h.value === 'noindex, nofollow, noarchive')));
});

test('deployed build config rejects unknown environment and Production Firebase in staging', () => {
  assert.notEqual(config({ APP_HOST_PLATFORM: 'railway' }).status, 0);
  assert.notEqual(config({ APP_DEPLOY_ENV: 'preview', APP_HOST_PLATFORM: 'railway', NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'cothecoconutcompany' }).status, 0);
});
