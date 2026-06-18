export const adminRoles = [
  "Super Admin",
  "Admin",
  "Content Editor",
  "Marketing",
  "Customer Support",
  "Read-only Analytics"
] as const;

export type AdminRole = (typeof adminRoles)[number];

const rolePermissions: Record<AdminRole, string[]> = {
  "Super Admin": ["*"],
  Admin: ["analytics", "content", "commerce", "media", "settings", "users"],
  "Content Editor": ["content", "media", "seo"],
  Marketing: ["analytics", "content", "media", "newsletter", "seo"],
  "Customer Support": ["orders", "customers", "forms"],
  "Read-only Analytics": ["analytics"]
};

export function canAccess(role: AdminRole, permission: string) {
  const permissions = rolePermissions[role] ?? [];
  return permissions.includes("*") || permissions.includes(permission);
}

export function getRolePermissions(role: AdminRole) {
  return rolePermissions[role] ?? [];
}
