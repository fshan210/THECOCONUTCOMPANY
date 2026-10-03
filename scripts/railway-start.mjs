import { readFile } from 'node:fs/promises';
import { assertResourceIsolation } from '../lib/deployment/resources.mjs';

const deployment = assertResourceIsolation(process.env, { startup: true });
const build = JSON.parse(await readFile(new URL('../deployment-build.json', import.meta.url), 'utf8'));
if (deployment.environment !== build.environment || deployment.platform !== build.platform) {
  throw new Error('Runtime deployment does not match the compiled public configuration.');
}
process.env.APP_BUILD_SHA = build.sha;
process.env.HOSTNAME = '0.0.0.0';
console.info('co-deployment', JSON.stringify({ ...deployment, sha: build.sha }));
// Same process: Next owns SIGTERM/SIGINT and the Railway-supplied PORT.
await import('../server.js');
