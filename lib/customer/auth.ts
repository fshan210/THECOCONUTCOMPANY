import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { customerSessionCookie, type CustomerSession } from "@/lib/customer/auth-config";
import { getFirebaseAdminAuth } from "@/lib/firebase/admin";
import { firestoreCollections } from "@/lib/firebase/collections";
import { getFirebaseAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";

const customerSessionMs = 1000 * 60 * 60 * 24 * 14;

function initialsFromName(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "CO";
}

export const customerSessionMaxAge = customerSessionMs / 1000;

export async function createFirebaseCustomerSessionCookie(idToken: string) {
  return (await getFirebaseAdminAuth()).createSessionCookie(idToken, { expiresIn: customerSessionMs });
}

async function getUserProfile(uid: string) {
  try {
    const snapshot = await (await getFirebaseAdminDb()).collection(firestoreCollections.users).doc(uid).get();
    return snapshot.exists ? snapshot.data() : null;
  } catch {
    return null;
  }
}

export async function verifyCustomerSession(token?: string): Promise<CustomerSession | null> {
  if (!token || !isFirebaseAdminConfigured()) return null;
  try {
    const decoded = await (await getFirebaseAdminAuth()).verifySessionCookie(token, true);
    const profile = await getUserProfile(decoded.uid);
    const name = (profile?.displayName as string | undefined) || decoded.name || decoded.email?.split("@")[0] || "Customer";
    return {
      uid: decoded.uid,
      email: decoded.email || "",
      name,
      initials: initialsFromName(name),
      emailVerified: Boolean(decoded.email_verified),
      issuedAt: decoded.iat ? decoded.iat * 1000 : Date.now(),
      expiresAt: decoded.exp ? decoded.exp * 1000 : Date.now() + customerSessionMs
    };
  } catch {
    return null;
  }
}

export async function getCustomerSession() {
  const cookieStore = await cookies();
  return verifyCustomerSession(cookieStore.get(customerSessionCookie)?.value);
}

export async function requireCustomerSession() {
  const session = await getCustomerSession();
  if (!session) redirect("/login");
  return session;
}
