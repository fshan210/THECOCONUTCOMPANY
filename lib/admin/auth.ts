import "server-only";

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminRoles, canAccess, type AdminRole } from "@/lib/admin/rbac";

export type AdminSession = {
  email: string;
  name: string;
  role: AdminRole;
  issuedAt: number;
  expiresAt: number;
};

export const adminSessionCookie = "co-admin-session";

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET || "local-admin-session-secret-change-me";
}

function base64Url(input: string) {
  return Buffer.from(input).toString("base64url");
}

function fromBase64Url(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

function sign(payload: string) {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function isAdminAuthConfigured() {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD);
}

export function getConfiguredAdminRole(): AdminRole {
  const role = process.env.ADMIN_ROLE;
  return adminRoles.includes(role as AdminRole) ? (role as AdminRole) : "Super Admin";
}

export function createAdminSession(email: string, role: AdminRole = getConfiguredAdminRole()): string {
  const now = Date.now();
  const payload: AdminSession = {
    email,
    name: process.env.ADMIN_NAME || email.split("@")[0] || "Admin",
    role,
    issuedAt: now,
    expiresAt: now + 1000 * 60 * 60 * 8
  };
  const encoded = base64Url(JSON.stringify(payload));
  return `${encoded}.${sign(encoded)}`;
}

export function verifyAdminSession(token?: string): AdminSession | null {
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = sign(encoded);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) return null;

  try {
    const session = JSON.parse(fromBase64Url(encoded)) as AdminSession;
    if (!session.email || !session.role || Date.now() > session.expiresAt) return null;
    return session;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  return verifyAdminSession(cookieStore.get(adminSessionCookie)?.value);
}

export async function requireAdminSession(requiredPermission?: string) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  if (requiredPermission && !canAccess(session.role, requiredPermission)) {
    redirect("/admin");
  }

  return session;
}
