const environments = new Set(['development', 'preview', 'production']);
const platforms = new Set(['local', 'vercel', 'railway']);

/** Pure resolver shared by Next config, server code and startup validation. */
export function resolveDeployment(env = process.env) {
  const detectedPlatform = env.RAILWAY_PROJECT_ID || env.RAILWAY_ENVIRONMENT_ID ? 'railway'
    : env.VERCEL || env.VERCEL_ENV ? 'vercel' : 'local';
  const platform = env.APP_HOST_PLATFORM || detectedPlatform;
  if (!platforms.has(platform)) throw new Error('Invalid APP_HOST_PLATFORM.');
  if (detectedPlatform !== 'local' && platform !== detectedPlatform) {
    throw new Error('APP_HOST_PLATFORM conflicts with the hosting platform.');
  }
  const explicit = env.APP_DEPLOY_ENV;
  const selected = explicit || env.VERCEL_ENV;
  if (selected && !environments.has(selected)) throw new Error('Invalid deployment environment.');
  if (!selected && (platform !== 'local' || env.NODE_ENV === 'production')) {
    throw new Error('APP_DEPLOY_ENV is required for a deployed runtime.');
  }
  const environment = selected || 'development';
  if (platform !== 'local' && environment === 'development') {
    throw new Error('Hosted runtimes must explicitly use preview or production.');
  }
  return { environment, platform };
}
