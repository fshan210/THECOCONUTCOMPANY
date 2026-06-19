"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { customerSessionCookie } from "@/lib/customer/auth-config";
import { createFirebaseCustomerSessionCookie, customerSessionMaxAge } from "@/lib/customer/auth";
import { getCustomerSession } from "@/lib/customer/auth";
import { getFirebaseAdminAuth, getFirebaseAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { firestoreCollections } from "@/lib/firebase/collections";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { writeSecurityEvent } from "@/lib/security/events";

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
  const email = decoded.email || "";
  const limit = await checkRateLimit({
    key: email || decoded.uid,
    action: "customer_session",
    limit: 12,
    windowMs: 1000 * 60 * 10,
    area: "customer_auth"
  });
  if (!limit.allowed) return { ok: false, status: "error", message: "Too many session attempts. Please wait a few minutes." };

  const now = new Date().toISOString();
  const db = await getFirebaseAdminDb();
  const userRef = db.collection(firestoreCollections.users).doc(decoded.uid);
  const existingSnapshot = await userRef.get();
  const existing = existingSnapshot.exists ? existingSnapshot.data() : null;
  const emailVerified = Boolean(decoded.email_verified);
  const existingStatus = existing?.accountStatus || existing?.status;
  const accountStatus = existingStatus === "suspended" || existingStatus === "deleted" ? existingStatus : emailVerified ? "active" : "pending";
  const verifiedAt = emailVerified ? existing?.verifiedAt || now : existing?.verifiedAt || null;

  await (await getFirebaseAdminDb()).collection(firestoreCollections.users).doc(decoded.uid).set(
    {
      uid: decoded.uid,
      email,
      displayName,
      photoURL: decoded.picture || null,
      emailVerified,
      accountStatus,
      status: accountStatus === "pending" ? "active" : accountStatus,
      newsletterOptIn: parsed.data.newsletterOptIn ?? true,
      preferredCategory: parsed.data.preference || null,
      verifiedAt,
      lastLogin: now,
      lastLoginAt: now,
      updatedAt: now,
      createdAt: existing?.createdAt || now
    },
    { merge: true }
  );

  await writeSecurityEvent({
    actorId: decoded.uid,
    actorEmail: email,
    action: "customer_session_established",
    area: "customer_auth",
    outcome: accountStatus === "suspended" ? "blocked" : "allowed",
    metadata: { emailVerified, accountStatus }
  });

  if (accountStatus === "suspended" || accountStatus === "deleted") {
    return { ok: false, status: "error", message: "This account is not active. Contact support for help." };
  }

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
  if (!session.emailVerified || session.accountStatus !== "active") redirect("/account?verify=1");

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
