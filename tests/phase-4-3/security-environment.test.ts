import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveDeployment } from '../../lib/deployment/environment.mjs';
import { assertResourceIsolation } from '../../lib/deployment/resources.mjs';
import { getRateLimitKey } from '../../lib/security/environment';

test('explicit deployment environment wins; legacy Vercel and local fallback work', () => {
  assert.deepEqual(resolveDeployment({ APP_DEPLOY_ENV: 'preview', APP_HOST_PLATFORM: 'railway', VERCEL_ENV: undefined }), { environment: 'preview', platform: 'railway' });
  assert.equal(resolveDeployment({ APP_DEPLOY_ENV: 'preview', VERCEL_ENV: 'production' }).environment, 'preview');
  assert.equal(resolveDeployment({ VERCEL_ENV: 'production' }).environment, 'production');
  assert.equal(resolveDeployment({}).environment, 'development');
  assert.notEqual(getRateLimitKey('preview', 'customer_login', 'qa@example.com'), getRateLimitKey('production', 'customer_login', 'qa@example.com'));
});

test('unknown deployed environments and platform disguises fail closed', () => {
  for (const env of [
    { NODE_ENV: 'production' }, { RAILWAY_PROJECT_ID: 'test' },
    { APP_DEPLOY_ENV: 'staging' }, { VERCEL_ENV: 'unknown' },
    { APP_DEPLOY_ENV: 'preview', APP_HOST_PLATFORM: 'unknown' },
    { APP_DEPLOY_ENV: 'preview', APP_HOST_PLATFORM: 'local', RAILWAY_PROJECT_ID: 'test' },
    { APP_DEPLOY_ENV: 'development', APP_HOST_PLATFORM: 'railway' }
  ]) assert.throws(() => resolveDeployment(env));
});

test('non-production cannot reach Production AWS or Firebase even with partial configuration', () => {
  const base = { APP_DEPLOY_ENV: 'preview', APP_HOST_PLATFORM: 'railway' };
  for (const configured of [
    { COGNITO_USER_POOL_ID: 'ap-south-1_Ux3bulrBi' },
    { COGNITO_APP_CLIENT_ID: '701q6ujgrkkbfamgnj0e9mnc3f' },
    { SERVER_API_BASE_URL: 'https://pt4om0dz42.execute-api.ap-south-1.amazonaws.com/' },
    { NEXT_PUBLIC_DOTCO_API_BASE_URL: 'https://unreviewed.example' },
    { NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'cothecoconutcompany' },
    { FIREBASE_SERVICE_ACCOUNT_JSON: JSON.stringify({ project_id: 'cothecoconutcompany' }) },
    { FIREBASE_SERVICE_ACCOUNT_JSON: '{invalid' }
  ]) assert.throws(() => assertResourceIsolation({ ...base, ...configured }));
  assert.doesNotThrow(() => assertResourceIsolation({ ...base, SERVER_API_BASE_URL: 'https://evba5qgrqi.execute-api.ap-south-1.amazonaws.com/' }));
  assert.throws(() => assertResourceIsolation(base, { startup: true }), /Missing Railway/);
});
