"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { adminSessionCookie, createAdminSession, getConfiguredAdminRole, isAdminAuthConfigured } from "@/lib/admin/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  remember: z.string().optional()
});

const forgotPasswordSchema = z.object({
  email: z.string().email()
});

export type AdminActionState = {
  ok: boolean;
  message: string;
};

export async function loginAdmin(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    remember: formData.get("remember")
  });

  if (!parsed.success) {
    return { ok: false, message: "Enter a valid admin email and password." };
  }

  if (!isAdminAuthConfigured()) {
    return { ok: false, message: "Admin credentials are not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD." };
  }

  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const authorized = parsed.data.email.toLowerCase() === expectedEmail?.toLowerCase() && parsed.data.password === expectedPassword;

  if (!authorized) {
    return { ok: false, message: "Invalid admin credentials." };
  }

  const cookieStore = await cookies();
  cookieStore.set(adminSessionCookie, createAdminSession(parsed.data.email, getConfiguredAdminRole()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: parsed.data.remember ? 60 * 60 * 24 * 7 : 60 * 60 * 8
  });

  redirect("/admin");
}

export async function requestAdminPasswordReset(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { ok: false, message: "Enter a valid admin email." };

  if (!isAdminAuthConfigured()) {
    return { ok: false, message: "Admin email recovery is not configured until ADMIN_EMAIL is set." };
  }

  return {
    ok: true,
    message: "If this email is an authorized admin, a reset workflow can be sent by the configured email provider."
  };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(adminSessionCookie);
  redirect("/admin/login");
}
