export const defaultAdminPath = "/control-center";

function normalizePath(path?: string) {
  if (!path) return defaultAdminPath;
  const trimmed = path.trim();
  if (!trimmed || trimmed === "/") return defaultAdminPath;
  const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withSlash.replace(/\/+$/, "");
}

export function getAdminPath(path = "") {
  const base = normalizePath(process.env.ADMIN_BASE_PATH || process.env.NEXT_PUBLIC_ADMIN_PATH);
  const suffix = path ? `/${path.replace(/^\/+/, "")}` : "";
  return `${base}${suffix}`;
}

export function isConfiguredAdminPath(pathname: string) {
  const base = getAdminPath();
  return pathname === base || pathname.startsWith(`${base}/`);
}

export function mapConfiguredAdminPath(pathname: string) {
  const base = getAdminPath();
  if (pathname === base) return "/admin";
  if (pathname.startsWith(`${base}/`)) return pathname.replace(base, "/admin");
  return pathname;
}
