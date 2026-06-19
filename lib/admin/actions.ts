"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  createFirebaseAdminSessionCookie,
  isAdminAuthConfigured,
  verifyAdminCsrfToken
} from "@/lib/admin/auth";
import { adminCsrfCookie, adminIdleTimeoutMs, adminSessionCookie } from "@/lib/admin/auth-config";
import { getAdminPath } from "@/lib/admin/path";
import { getFirebaseAdminAuth, getFirebaseAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { firestoreCollections } from "@/lib/firebase/collections";

const loginSchema = z.object({
  idToken: z.string().min(20),
  remember: z.boolean().optional(),
  csrf: z.string().min(16)
});

const forgotPasswordSchema = z.object({
  email: z.string().email()
});

export type AdminActionState = {
  ok: boolean;
  message: string;
  status?: "idle" | "loading" | "success" | "error";
};

const failedLogins = new Map<string, { count: number; resetAt: number }>();
const loginWindowMs = 1000 * 60 * 10;
const maxLoginAttempts = 5;

function getRateLimitKey(email: string) {
  return email.trim().toLowerCase();
}

function isRateLimited(email: string) {
  const key = getRateLimitKey(email);
  const entry = failedLogins.get(key);
  if (!entry) return false;
  if (Date.now() > entry.resetAt) {
    failedLogins.delete(key);
    return false;
  }
  return entry.count >= maxLoginAttempts;
}

function recordFailedLogin(email: string) {
  const key = getRateLimitKey(email);
  const current = failedLogins.get(key);
  failedLogins.set(key, {
    count: current && Date.now() < current.resetAt ? current.count + 1 : 1,
    resetAt: current && Date.now() < current.resetAt ? current.resetAt : Date.now() + loginWindowMs
  });
}

function clearFailedLogins(email: string) {
  failedLogins.delete(getRateLimitKey(email));
}

function auditAdminAuth(event: string, detail: Record<string, string>) {
  console.info("[admin-audit]", JSON.stringify({ event, at: new Date().toISOString(), ...detail }));
}

export async function loginAdmin(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const parsed = loginSchema.safeParse({
    idToken: formData.get("idToken"),
    remember: formData.get("remember") === "true",
    csrf: formData.get("csrf")
  });

  if (!parsed.success) {
    return { ok: false, status: "error", message: "Enter a valid admin email and password." };
  }

  if (!verifyAdminCsrfToken(parsed.data.csrf)) {
    auditAdminAuth("csrf_rejected", { email: "unknown" });
    return { ok: false, status: "error", message: "Security check expired. Refresh and try again." };
  }

  if (!isAdminAuthConfigured() || !isFirebaseAdminConfigured()) {
    return { ok: false, status: "error", message: "Firebase Admin and Web configuration are required for admin login." };
  }

  const decoded = await (await getFirebaseAdminAuth()).verifyIdToken(parsed.data.idToken, true);
  const email = decoded.email || "";
  if (isRateLimited(email)) {
    auditAdminAuth("rate_limited", { email: email.toLowerCase() });
    return { ok: false, status: "error", message: "Too many failed attempts. Wait a few minutes and try again." };
  }

  const db = await getFirebaseAdminDb();
  const adminRef = db.collection(firestoreCollections.admins).doc(decoded.uid);
  const adminSnapshot = await adminRef.get();
  const bootstrapEmail = process.env.ADMIN_EMAIL;
  const bootstrapAllowed = bootstrapEmail && email.toLowerCase() === bootstrapEmail.toLowerCase();
  const adminData = adminSnapshot.exists ? adminSnapshot.data() : null;
  const authorized = Boolean(adminData?.status === "active" || bootstrapAllowed);

  if (!authorized) {
    recordFailedLogin(email);
    auditAdminAuth("login_failed", { email: email.toLowerCase() });
    return { ok: false, status: "error", message: "This Firebase user is not authorized for Admin OS access." };
  }

  if (!adminSnapshot.exists && bootstrapAllowed) {
    const now = new Date().toISOString();
    await adminRef.set({
      uid: decoded.uid,
      email,
      displayName: process.env.ADMIN_NAME || decoded.name || email.split("@")[0] || "Admin",
      role: process.env.ADMIN_ROLE || "Super Admin",
      permissions: ["*"],
      status: "active",
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now
    });
  } else {
    await adminRef.set({ lastLoginAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, { merge: true });
  }

  clearFailedLogins(email);
  auditAdminAuth("login_success", { email: email.toLowerCase(), role: String(adminData?.role || process.env.ADMIN_ROLE || "Super Admin") });
  const cookieStore = await cookies();
  cookieStore.set(adminSessionCookie, await createFirebaseAdminSessionCookie(parsed.data.idToken, parsed.data.remember), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: parsed.data.remember ? 60 * 60 * 8 : adminIdleTimeoutMs / 1000
  });

  redirect(getAdminPath());
}

export async function requestAdminPasswordReset(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { ok: false, status: "error", message: "Enter a valid admin email." };

  if (!isAdminAuthConfigured()) {
    return { ok: false, status: "error", message: "Admin email recovery is not configured until ADMIN_EMAIL is set." };
  }

  auditAdminAuth("password_reset_requested", { email: parsed.data.email.toLowerCase() });

  return {
    ok: true,
    status: "success",
    message: "If this email is an authorized admin, a reset workflow can be sent by the configured email provider."
  };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(adminSessionCookie);
  cookieStore.delete(adminCsrfCookie);
  redirect(getAdminPath("login"));
}
