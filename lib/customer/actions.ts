"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { customerSessionCookie } from "@/lib/customer/auth-config";
import { createFirebaseCustomerSessionCookie, customerSessionMaxAge } from "@/lib/customer/auth";
import { getCustomerSession } from "@/lib/customer/auth";
import { getFirebaseAdminAuth, getFirebaseAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { firestoreCollections } from "@/lib/firebase/collections";

export type CustomerAuthState = {
  ok: boolean;
  message: string;
  status?: "idle" | "success" | "error";
};

const tokenSchema = z.object({
  idToken: z.string().min(20),
  name: z.string().min(2).optional(),
  preference: z.string().min(2).optional(),
  newsletterOptIn: z.boolean().optional()
});

export async function establishCustomerSession(input: unknown): Promise<CustomerAuthState> {
  const parsed = tokenSchema.safeParse(input);
  if (!parsed.success) return { ok: false, status: "error", message: "Firebase sign-in did not return a valid token." };
  if (!isFirebaseAdminConfigured()) return { ok: false, status: "error", message: "Firebase Admin credentials are missing on the server." };

  const decoded = await (await getFirebaseAdminAuth()).verifyIdToken(parsed.data.idToken, true);
  const displayName = parsed.data.name || decoded.name || decoded.email?.split("@")[0] || "Customer";
  const now = new Date().toISOString();
  await (await getFirebaseAdminDb()).collection(firestoreCollections.users).doc(decoded.uid).set(
    {
      uid: decoded.uid,
      email: decoded.email || "",
      displayName,
      photoURL: decoded.picture || null,
      emailVerified: Boolean(decoded.email_verified),
      status: "active",
      newsletterOptIn: parsed.data.newsletterOptIn ?? true,
      preferredCategory: parsed.data.preference || null,
      lastLoginAt: now,
      updatedAt: now,
      createdAt: now
    },
    { merge: true }
  );

  const cookieStore = await cookies();
  cookieStore.set(customerSessionCookie, await createFirebaseCustomerSessionCookie(parsed.data.idToken), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: customerSessionMaxAge
  });
  redirect("/account");
}

export async function logoutCustomer() {
  const cookieStore = await cookies();
  cookieStore.delete(customerSessionCookie);
  redirect("/");
}

const profileSchema = z.object({
  displayName: z.string().min(2),
  preferredCategory: z.string().optional(),
  newsletterOptIn: z.string().optional()
});

export async function updateCustomerProfile(formData: FormData) {
  const session = await getCustomerSession();
  if (!session) redirect("/login");

  const parsed = profileSchema.safeParse({
    displayName: formData.get("displayName"),
    preferredCategory: formData.get("preferredCategory"),
    newsletterOptIn: formData.get("newsletterOptIn")
  });
  if (!parsed.success || !isFirebaseAdminConfigured()) redirect("/profile");

  await (await getFirebaseAdminDb()).collection(firestoreCollections.users).doc(session.uid).set(
    {
      displayName: parsed.data.displayName,
      preferredCategory: parsed.data.preferredCategory || null,
      newsletterOptIn: parsed.data.newsletterOptIn === "on",
      updatedAt: new Date().toISOString()
    },
    { merge: true }
  );

  redirect("/profile");
}
