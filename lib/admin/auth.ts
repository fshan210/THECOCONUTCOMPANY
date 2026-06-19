import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminCsrfCookie, adminIdleTimeoutMs, adminSessionCookie } from "@/lib/admin/auth-config";
import { getAdminPath } from "@/lib/admin/path";
import { adminRoles, canAccess, type AdminRole } from "@/lib/admin/rbac";
import { getFirebaseAdminAuth, getFirebaseAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { isFirebasePublicConfigured } from "@/lib/firebase/config";
import { firestoreCollections } from "@/lib/firebase/collections";

export type AdminSession = {
  uid: string;
  email: string;
  name: string;
  role: AdminRole;
  permissions: string[];
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
  return Boolean(isFirebasePublicConfigured() && isFirebaseAdminConfigured());
}

export function getConfiguredAdminRole(): AdminRole {
  const role = process.env.ADMIN_ROLE;
  return adminRoles.includes(role as AdminRole) ? (role as AdminRole) : "Super Admin";
}

export async function createFirebaseAdminSessionCookie(idToken: string, remember = false) {
  return (await getFirebaseAdminAuth()).createSessionCookie(idToken, {
    expiresIn: remember ? adminAbsoluteSessionMs : adminIdleTimeoutMs
  });
}

async function getAdminProfile(uid: string, email?: string) {
  const db = await getFirebaseAdminDb();
  const snapshot = await db.collection(firestoreCollections.admins).doc(uid).get();
  if (snapshot.exists) return snapshot.data();

  const bootstrapEmail = process.env.ADMIN_EMAIL;
  if (bootstrapEmail && email?.toLowerCase() === bootstrapEmail.toLowerCase()) {
    const now = new Date().toISOString();
    const profile = {
      uid,
      email,
      displayName: process.env.ADMIN_NAME || email.split("@")[0] || "Admin",
      role: getConfiguredAdminRole(),
      permissions: ["*"],
      status: "active",
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now
    };
    await db.collection(firestoreCollections.admins).doc(uid).set(profile, { merge: true });
    return profile;
  }

  return null;
}

export async function verifyAdminSession(token?: string): Promise<AdminSession | null> {
  if (!token || !isFirebaseAdminConfigured()) return null;
  try {
    const decoded = await (await getFirebaseAdminAuth()).verifySessionCookie(token, true);
    const profile = await getAdminProfile(decoded.uid, decoded.email);
    if (!profile || profile.status !== "active") return null;

    const role = adminRoles.includes(profile.role as AdminRole) ? (profile.role as AdminRole) : "Read-only Analytics";
    return {
      uid: decoded.uid,
      email: decoded.email || String(profile.email || ""),
      name: String(profile.displayName || decoded.name || decoded.email?.split("@")[0] || "Admin"),
      role,
      permissions: Array.isArray(profile.permissions) ? (profile.permissions as string[]) : [],
      issuedAt: decoded.iat ? decoded.iat * 1000 : Date.now(),
      expiresAt: decoded.exp ? decoded.exp * 1000 : Date.now() + adminIdleTimeoutMs
    };
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
