export type SecurityEnvironment = "preview" | "production" | "development";

export function getSecurityEnvironment(vercelEnvironment: string | undefined): SecurityEnvironment {
  return vercelEnvironment === "preview" || vercelEnvironment === "production"
    ? vercelEnvironment
    : "development";
}

export function getRateLimitKey(environment: SecurityEnvironment, action: string, identity: string) {
  return `${environment}:${action}:${identity}`.trim().toLowerCase().replace(/[^a-z0-9@._:-]/gi, "-").slice(0, 160);
}
