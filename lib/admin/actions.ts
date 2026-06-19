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
import { writeAdminAuditLog } from "@/lib/admin/audit";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { verifyRecaptchaToken } from "@/lib/security/recaptcha";
import { writeSecurityEvent } from "@/lib/security/events";

const loginSchema = z.object({
  idToken: z.string(),
  remember: z.boolean().optional(),
  csrf: z.string().min(16),
  recaptchaToken: z.string().optional(),
  securityError: z.string().optional()
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

export async function loginAdmin(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const parsed = loginSchema.safeParse({
    idToken: formData.get("idToken"),
    remember: formData.get("remember") === "true",
    csrf: formData.get("csrf"),
    recaptchaToken: formData.get("recaptchaToken") || undefined,
    securityError: formData.get("securityError") || undefined
  });

  if (!parsed.success) {
    await writeSecurityEvent({ action: "admin_login_invalid_payload", area: "admin_auth", outcome: "failed" });
    return { ok: false, status: "error", message: "Enter a valid admin email and password." };
  }

  if (parsed.data.securityError) return { ok: false, status: "error", message: parsed.data.securityError };

  if (!verifyAdminCsrfToken(parsed.data.csrf)) {
    await writeAdminAuditLog({ action: "failed_admin_login", resourceType: "auth", adminEmail: "unknown", adminRole: "unknown", before: { reason: "csrf_rejected" } });
    await writeSecurityEvent({ action: "admin_csrf_rejected", area: "admin_auth", outcome: "blocked" });
    return { ok: false, status: "error", message: "Security check expired. Refresh and try again." };
  }

  if (!isAdminAuthConfigured() || !isFirebaseAdminConfigured()) {
    return { ok: false, status: "error", message: "Firebase Admin and Web configuration are required for admin login." };
  }

  if (parsed.data.idToken.length < 20) {
    await writeAdminAuditLog({ action: "failed_admin_login", resourceType: "auth", adminEmail: "unknown", adminRole: "unknown", before: { reason: "firebase_sign_in_failed" } });
    return { ok: false, status: "error", message: "Invalid admin email or password." };
  }

  const decoded = await (await getFirebaseAdminAuth()).verifyIdToken(parsed.data.idToken, true);
  const email = decoded.email || "";
  const recaptcha = await verifyRecaptchaToken(parsed.data.recaptchaToken, "admin_login");
  if (!recaptcha.ok) {
    await writeAdminAuditLog({ action: "failed_admin_login", resourceType: "auth", adminUid: decoded.uid, adminEmail: email, adminRole: "unknown", before: { reason: "recaptcha_rejected" } });
    return { ok: false, status: "error", message: recaptcha.message || "Security check failed." };
  }

  const distributedLimit = await checkRateLimit({
    key: email || decoded.uid,
    action: "admin_login",
    limit: maxLoginAttempts,
    windowMs: loginWindowMs,
    area: "admin_auth"
  });
  if (!distributedLimit.allowed) {
    await writeAdminAuditLog({ action: "failed_admin_login", resourceType: "auth", adminUid: decoded.uid, adminEmail: email, adminRole: "unknown", before: { reason: "rate_limited" } });
    return { ok: false, status: "error", message: "Too many failed attempts. Wait a few minutes and try again." };
  }

  if (isRateLimited(email)) {
    await writeAdminAuditLog({ action: "failed_admin_login", resourceType: "auth", adminUid: decoded.uid, adminEmail: email, adminRole: "unknown", before: { reason: "local_rate_limited" } });
    return { ok: false, status: "error", message: "Too many failed attempts. Wait a few minutes and try again." };
  }

  const db = await getFirebaseAdminDb();
  const adminRef = db.collection(firestoreCollections.admins).doc(decoded.uid);
  const adminSnapshot = await adminRef.get();
  const bootstrapEmail = process.env.ADMIN_EMAIL;
  const bootstrapAllowed = bootstrapEmail && email.toLowerCase() === bootstrapEmail.toLowerCase();
  const adminData = adminSnapshot.exists ? adminSnapshot.data() : null;
  const authorized = Boolean(adminData?.status === "active" || adminData?.isActive === true || bootstrapAllowed);

  if (!authorized) {
    recordFailedLogin(email);
    await writeAdminAuditLog({ action: "failed_admin_login", resourceType: "auth", adminUid: decoded.uid, adminEmail: email, adminRole: String(adminData?.role || "unknown"), before: { reason: "not_authorized" } });
    await writeSecurityEvent({ actorId: decoded.uid, actorEmail: email, action: "failed_admin_login", area: "admin_auth", outcome: "blocked", metadata: { reason: "not_authorized" } });
    return { ok: false, status: "error", message: "This Firebase user is not authorized for Admin OS access." };
  }

  if (!adminSnapshot.exists && bootstrapAllowed) {
    const now = new Date().toISOString();
    await adminRef.set({
      uid: decoded.uid,
      email,
      displayName: process.env.ADMIN_NAME || decoded.name || email.split("@")[0] || "Admin",
      role: process.env.ADMIN_ROLE || "Super Admin",
      roleKey: "super_admin",
      permissions: ["*"],
      status: "active",
      isActive: true,
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now
    });
  } else {
    await adminRef.set({ lastLoginAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, { merge: true });
  }

  clearFailedLogins(email);
  await writeAdminAuditLog({
    action: "admin_login",
    resourceType: "auth",
    adminUid: decoded.uid,
    adminEmail: email,
    adminRole: String(adminData?.role || process.env.ADMIN_ROLE || "Super Admin"),
    after: { remember: parsed.data.remember ?? false }
  });
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

  await writeAdminAuditLog({ action: "admin_password_reset_requested", resourceType: "auth", adminEmail: parsed.data.email.toLowerCase(), adminRole: "unknown" });

  return {
    ok: true,
    status: "success",
    message: "If this email is an authorized admin, a reset workflow can be sent by the configured email provider."
  };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminSessionCookie)?.value;
  if (token) {
    try {
      const decoded = await (await getFirebaseAdminAuth()).verifySessionCookie(token, false);
      await writeAdminAuditLog({ action: "admin_logout", resourceType: "auth", adminUid: decoded.uid, adminEmail: decoded.email || "unknown", adminRole: "unknown" });
    } catch {
      await writeAdminAuditLog({ action: "admin_logout", resourceType: "auth", adminEmail: "unknown", adminRole: "unknown" });
    }
  }
  cookieStore.delete(adminSessionCookie);
  cookieStore.delete(adminCsrfCookie);
  redirect(getAdminPath("login"));
}
