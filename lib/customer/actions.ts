"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { awsSessionCookie } from "@/lib/auth/aws-session";
import { customerAwsApi } from "@/lib/customer/aws-api";
import { requireVerifiedCustomerSession } from "@/lib/customer/auth";

export type CustomerAuthState = { ok: boolean; message: string; status?: "idle" | "success" | "error" };

const optionalText = (max: number) => z.string().trim().max(max).optional();
const profileSchema = z.object({
  firstName: optionalText(60), lastName: optionalText(60), displayName: z.string().trim().min(2).max(80),
  phone: optionalText(30), preferredCategory: optionalText(60), newsletterOptIn: z.boolean(), marketingOptIn: z.boolean(),
  address: z.object({ line1: optionalText(120), line2: optionalText(120), city: optionalText(80), region: optionalText(80), postalCode: optionalText(20), country: optionalText(80) })
});

export async function logoutCustomer() {
  (await cookies()).delete(awsSessionCookie);
  redirect("/");
}

export async function updateCustomerProfile(formData: FormData) {
  await requireVerifiedCustomerSession();
  const value = (name: string) => String(formData.get(name) || "");
  const parsed = profileSchema.safeParse({
    firstName: value("firstName"), lastName: value("lastName"), displayName: value("displayName"), phone: value("phone"),
    preferredCategory: value("preferredCategory"), newsletterOptIn: formData.get("newsletterOptIn") === "on", marketingOptIn: formData.get("marketingOptIn") === "on",
    address: { line1: value("line1"), line2: value("line2"), city: value("city"), region: value("region"), postalCode: value("postalCode"), country: value("country") }
  });
  if (!parsed.success) redirect("/profile?status=invalid");
  const result = await customerAwsApi("v1/me", { method: "PATCH", body: JSON.stringify(parsed.data) });
  if (!result.ok) redirect("/profile?status=unavailable");
  redirect("/profile?status=saved");
}

export async function deleteCustomerAccount(formData: FormData) {
  await requireVerifiedCustomerSession();
  if (String(formData.get("confirmation") || "") !== "DELETE") redirect("/profile?status=delete-confirmation");
  const result = await customerAwsApi("v1/me", { method: "DELETE" });
  if (!result.ok) redirect("/profile?status=unavailable");
  (await cookies()).delete(awsSessionCookie);
  redirect("/login?account=deleted");
}
