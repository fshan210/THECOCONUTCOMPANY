import "server-only";

import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminCsrfCookie, adminIdleTimeoutMs, adminSessionCookie } from "@/lib/admin/auth-config";
import { getAdminPath } from "@/lib/admin/path";
import { adminRoles, canAccess, type AdminRole } from "@/lib/admin/rbac";

export type AdminSession = {
  email: string;
  name: string;
  role: AdminRole;
  issuedAt: number;
  expiresAt: number;
};

const adminAbsoluteSessionMs = 1000 * 60 * 60 * 8;

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
  return Boolean(process.env.ADMIN_EMAIL && (process.env.ADMIN_PASSWORD_HASH || process.env.ADMIN_PASSWORD));
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
    expiresAt: now + adminAbsoluteSessionMs
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
    if (Date.now() - session.issuedAt > adminAbsoluteSessionMs) return null;
    if (Date.now() > session.expiresAt) return null;
    return session;
  } catch {
    return null;
  }
}

export function createAdminCsrfToken() {
  const nonce = randomBytes(18).toString("base64url");
  const issuedAt = Date.now();
  const payload = base64Url(JSON.stringify({ nonce, issuedAt }));
  return `${payload}.${sign(`csrf.${payload}`)}`;
}

export function verifyAdminCsrfToken(token?: string | null) {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = sign(`csrf.${payload}`);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (providedBuffer.length !== expectedBuffer.length || !timingSafeEqual(providedBuffer, expectedBuffer)) return false;

  try {
    const parsed = JSON.parse(fromBase64Url(payload)) as { issuedAt?: number };
    return Boolean(parsed.issuedAt && Date.now() - parsed.issuedAt < 1000 * 60 * 30);
  } catch {
    return false;
  }
}

function verifyScryptPassword(password: string, stored: string) {
  const [algorithm, n, r, p, salt, key] = stored.split("$");
  if (algorithm !== "scrypt" || !n || !r || !p || !salt || !key) return false;
  const derived = scryptSync(password, salt, Buffer.from(key, "base64url").length, {
    N: Number(n),
    r: Number(r),
    p: Number(p)
  });
  const storedBuffer = Buffer.from(key, "base64url");
  return derived.length === storedBuffer.length && timingSafeEqual(derived, storedBuffer);
}

export function hashAdminPassword(password: string) {
  const salt = randomBytes(16).toString("base64url");
  const parameters = { N: 16384, r: 8, p: 1 };
  const key = scryptSync(password, salt, 64, parameters).toString("base64url");
  return `scrypt$${parameters.N}$${parameters.r}$${parameters.p}$${salt}$${key}`;
}

export function verifyAdminPassword(password: string) {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (hash) return verifyScryptPassword(password, hash);

  const legacyPassword = process.env.ADMIN_PASSWORD;
  if (!legacyPassword) return false;
  const provided = Buffer.from(password);
  const expected = Buffer.from(legacyPassword);
  return provided.length === expected.length && timingSafeEqual(provided, expected);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  return verifyAdminSession(cookieStore.get(adminSessionCookie)?.value);
}

export async function requireAdminSession(requiredPermission?: string) {
  const session = await getAdminSession();
  if (!session) redirect(getAdminPath("login"));

  if (requiredPermission && !canAccess(session.role, requiredPermission)) {
    redirect(getAdminPath());
  }

  return session;
}
