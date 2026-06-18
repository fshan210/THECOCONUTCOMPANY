"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  createAdminSession,
  getConfiguredAdminRole,
  isAdminAuthConfigured,
  verifyAdminCsrfToken,
  verifyAdminPassword
} from "@/lib/admin/auth";
import { adminCsrfCookie, adminIdleTimeoutMs, adminSessionCookie } from "@/lib/admin/auth-config";
import { getAdminPath } from "@/lib/admin/path";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  remember: z.string().optional(),
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
    email: formData.get("email"),
    password: formData.get("password"),
    remember: formData.get("remember"),
    csrf: formData.get("csrf")
  });

  if (!parsed.success) {
    return { ok: false, status: "error", message: "Enter a valid admin email and password." };
  }

  if (!verifyAdminCsrfToken(parsed.data.csrf)) {
    auditAdminAuth("csrf_rejected", { email: parsed.data.email.toLowerCase() });
    return { ok: false, status: "error", message: "Security check expired. Refresh and try again." };
  }

  if (!isAdminAuthConfigured()) {
    return { ok: false, status: "error", message: "Admin credentials are not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD_HASH." };
  }

  const expectedEmail = process.env.ADMIN_EMAIL;
  if (isRateLimited(parsed.data.email)) {
    auditAdminAuth("rate_limited", { email: parsed.data.email.toLowerCase() });
    return { ok: false, status: "error", message: "Too many failed attempts. Wait a few minutes and try again." };
  }

  const authorized = parsed.data.email.toLowerCase() === expectedEmail?.toLowerCase() && verifyAdminPassword(parsed.data.password);

  if (!authorized) {
    recordFailedLogin(parsed.data.email);
    auditAdminAuth("login_failed", { email: parsed.data.email.toLowerCase() });
    return { ok: false, status: "error", message: "Invalid admin credentials. Check your email and password." };
  }

  clearFailedLogins(parsed.data.email);
  auditAdminAuth("login_success", { email: parsed.data.email.toLowerCase(), role: getConfiguredAdminRole() });
  const cookieStore = await cookies();
  cookieStore.set(adminSessionCookie, createAdminSession(parsed.data.email, getConfiguredAdminRole()), {
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
