import { resolveDeployment } from "@/lib/deployment/environment.mjs";
export type SecurityEnvironment = "preview" | "production" | "development";

export function getSecurityEnvironment(): SecurityEnvironment {
  return resolveDeployment().environment;
}

export function getRateLimitKey(environment: SecurityEnvironment, action: string, identity: string) {
  return `${environment}:${action}:${identity}`.trim().toLowerCase().replace(/[^a-z0-9@._:-]/gi, "-").slice(0, 160);
}
