import { readFile, readdir, stat } from 'node:fs/promises';
import { assertResourceIsolation } from '../lib/deployment/resources.mjs';

const deployment = assertResourceIsolation(process.env, { startup: true });
const build = JSON.parse(await readFile(new URL('../deployment-build.json', import.meta.url), 'utf8'));
if (deployment.environment !== build.environment || deployment.platform !== build.platform) {
  throw new Error('Runtime deployment does not match the compiled public configuration.');
}
process.env.APP_BUILD_SHA = build.sha;
process.env.HOSTNAME = '0.0.0.0';
// Verify the actual runtime filesystem, not only the Docker COPY instructions.
const staticEntries = await readdir(new URL('../.next/static/', import.meta.url));
if (staticEntries.length === 0) throw new Error('Standalone static assets are missing.');
const chunks = await readdir(new URL('../.next/static/chunks/', import.meta.url));
const sampleChunk = chunks.find((path) => path.endsWith('.js'));
if (!sampleChunk) throw new Error('Standalone JavaScript chunks are missing.');
const chunkStat = await stat(new URL(`../.next/static/chunks/${sampleChunk}`, import.meta.url));
if (!chunkStat.isFile() || chunkStat.size === 0) throw new Error('Standalone JavaScript chunk is empty.');
const publicSamples = [
  'assets/home/co-hero-coconut-transparent-lcp-v1.webp',
  'assets/video/homepage-v2/co-home-scraping-scroll-desktop-v1.mp4',
  'assets/video/homepage-v2/co-home-scraping-scroll-mobile-portrait-v2.mp4'
];
const assets = await Promise.all(publicSamples.map(async (path) => {
  const file = await stat(new URL(`../public/${path}`, import.meta.url));
  if (!file.isFile() || file.size === 0) throw new Error('Required standalone public asset is missing.');
  return { path, bytes: file.size };
}));
console.info('co-runtime-assets', JSON.stringify({ staticEntries: staticEntries.length, chunk: { path: sampleChunk, bytes: chunkStat.size }, assets }));
console.info('co-deployment', JSON.stringify({ ...deployment, sha: build.sha }));
// Same process: Next owns SIGTERM/SIGINT and the Railway-supplied PORT.
await import('../server.js');
