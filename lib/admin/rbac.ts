export const adminRoles = [
  "Super Admin",
  "Admin",
  "Content Editor",
  "Marketing",
  "Customer Support",
  "Read-only Analytics"
] as const;

export type AdminRole = (typeof adminRoles)[number];

export function normalizeAdminRole(role?: string | null): AdminRole {
  const normalized = String(role || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ");
  if (normalized === "super admin") return "Super Admin";
  if (normalized === "admin") return "Admin";
  if (normalized === "content editor") return "Content Editor";
  if (normalized === "marketing") return "Marketing";
  if (normalized === "customer support") return "Customer Support";
  if (normalized === "read only analytics" || normalized === "read-only analytics") return "Read-only Analytics";
  return "Read-only Analytics";
}

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
