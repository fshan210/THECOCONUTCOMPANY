import type { DeploymentEnvironment, HostPlatform } from './environment.mjs';
export function assertResourceIsolation(env?: Record<string, string | undefined>, options?: {startup?: boolean}): {
  environment: DeploymentEnvironment;
  platform: HostPlatform;
};
