import { resolveDeployment } from '@/lib/deployment/environment.mjs';
import { privateJson } from '@/lib/security/http';

export const dynamic = 'force-dynamic';

export function GET() {
  const { environment, platform } = resolveDeployment();
  const candidate = process.env.APP_BUILD_SHA || process.env.VERCEL_GIT_COMMIT_SHA || '';
  const build = /^[a-f0-9]{40}$/.test(candidate) ? candidate : 'unavailable';
  return privateJson({ status: 'ok', build, environment, platform });
}
