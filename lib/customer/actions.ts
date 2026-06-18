"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createCustomerSession } from "@/lib/customer/auth";
import { customerSessionCookie } from "@/lib/customer/auth-config";

export type CustomerAuthState = {
  ok: boolean;
  message: string;
  status?: "idle" | "success" | "error";
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2),
  preference: z.string().min(2).optional()
});

export async function loginCustomer(_: CustomerAuthState, formData: FormData): Promise<CustomerAuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });
  if (!parsed.success) return { ok: false, status: "error", message: "Enter a valid email and password." };

  const name = parsed.data.email.split("@")[0]?.replace(/[._-]/g, " ") || "Customer";
  const cookieStore = await cookies();
  cookieStore.set(customerSessionCookie, createCustomerSession(parsed.data.email, name), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14
  });
  redirect("/account");
}

export async function registerCustomer(_: CustomerAuthState, formData: FormData): Promise<CustomerAuthState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    preference: formData.get("preference")
  });
  if (!parsed.success) return { ok: false, status: "error", message: "Enter your name, email, and an 8+ character password." };

  const cookieStore = await cookies();
  cookieStore.set(customerSessionCookie, createCustomerSession(parsed.data.email, parsed.data.name), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14
  });
  redirect("/account");
}

export async function logoutCustomer() {
  const cookieStore = await cookies();
  cookieStore.delete(customerSessionCookie);
  redirect("/");
}
