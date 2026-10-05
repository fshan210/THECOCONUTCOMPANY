export type DeploymentEnvironment = 'development' | 'preview' | 'production';
export type HostPlatform = 'local' | 'vercel' | 'railway';
export function resolveDeployment(env?: Record<string, string | undefined>): {
  environment: DeploymentEnvironment;
  platform: HostPlatform;
};
