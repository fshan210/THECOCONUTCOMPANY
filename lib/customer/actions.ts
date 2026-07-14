"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { awsSessionCookie, readAwsSession } from "@/lib/auth/aws-session";
import { requireVerifiedCustomerSession } from "@/lib/customer/auth";

export type CustomerAuthState = { ok: boolean; message: string; status?: "idle" | "success" | "error" };

const profileSchema = z.object({ displayName: z.string().min(2).max(80), preferredCategory: z.string().max(60).optional(), newsletterOptIn: z.string().optional() });

export async function logoutCustomer() {
  const cookieStore = await cookies();
  cookieStore.delete(awsSessionCookie);
  redirect("/");
}

export async function updateCustomerProfile(formData: FormData) {
  const session = await requireVerifiedCustomerSession();
  const parsed = profileSchema.safeParse({ displayName: formData.get("displayName"), preferredCategory: formData.get("preferredCategory"), newsletterOptIn: formData.get("newsletterOptIn") });
  if (!parsed.success) redirect("/profile?status=invalid");
  const cookieStore = await cookies();
  const awsSession = readAwsSession(cookieStore);
  const baseUrl = process.env.SERVER_API_BASE_URL;
  if (!awsSession?.accessToken || !baseUrl) redirect("/profile?status=unavailable");
  try {
    await fetch(new URL("v1/me", baseUrl), { method: "PATCH", headers: { "content-type": "application/json", authorization: `Bearer ${awsSession.accessToken}` }, body: JSON.stringify({ displayName: parsed.data.displayName, preferredCategory: parsed.data.preferredCategory || null, newsletterOptIn: parsed.data.newsletterOptIn === "on" }), cache: "no-store" });
  } catch {
    redirect("/profile?status=unavailable");
  }
  redirect(`/profile?status=saved&name=${encodeURIComponent(session.name)}`);
}
