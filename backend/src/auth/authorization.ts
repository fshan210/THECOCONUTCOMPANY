import type { DotCoRole } from "@dotco/contracts";

const roleOrder: DotCoRole[] = ["CUSTOMER", "SUPPORT", "CONTENT_EDITOR", "OPERATIONS", "ADMIN"];

export function hasRole(userRoles: DotCoRole[], allowed: DotCoRole[]) {
  return userRoles.some((role) => allowed.includes(role));
}

export function isKnownRole(value: string): value is DotCoRole {
  return roleOrder.includes(value as DotCoRole);
}

export function normalizeRoles(groups: unknown): DotCoRole[] {
  if (!Array.isArray(groups)) return ["CUSTOMER"];
  const roles = groups.filter((group): group is DotCoRole => typeof group === "string" && isKnownRole(group));
  return roles.length ? roles : ["CUSTOMER"];
}
