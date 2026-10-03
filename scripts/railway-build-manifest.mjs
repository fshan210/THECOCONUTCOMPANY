import { writeFileSync } from 'node:fs';
import { assertResourceIsolation } from '../lib/deployment/resources.mjs';
const deployment = assertResourceIsolation();
if (deployment.platform !== 'railway') throw new Error('Railway build platform is required.');
const sha = process.env.RAILWAY_GIT_COMMIT_SHA;
if (!/^[a-f0-9]{40}$/.test(sha || '')) throw new Error('Exact Railway Git SHA is required.');
for (const name of ['NEXT_PUBLIC_APP_ENV', 'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_API_KEY', 'NEXT_PUBLIC_FIREBASE_APP_ID', 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 'NEXT_PUBLIC_MEDIA_BASE_URL']) {
  if (!process.env[name]) throw new Error(`Missing public build variable: ${name}.`);
}
writeFileSync('deployment-build.json', JSON.stringify({ ...deployment, sha }) + '\n');
console.info('co-build', JSON.stringify({ ...deployment, sha }));
