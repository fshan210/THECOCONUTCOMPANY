import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { customerSessionCookie, type CustomerSession } from "@/lib/customer/auth-config";
import { firestoreCollections } from "@/lib/firebase/collections";
import { getFirebaseAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { decodeFirebaseTokenTimes, lookupFirebaseAccount } from "@/lib/firebase/auth-rest";

const configuredSessionDays = Number(process.env.SESSION_MAX_AGE_DAYS || 7);
const customerSessionMs = 1000 * 60 * 60 * 24 * (Number.isFinite(configuredSessionDays) ? configuredSessionDays : 7);

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
  return idToken;
}

async function getUserProfile(uid: string) {
  try {
    const snapshot = await (await getFirebaseAdminDb()).collection(firestoreCollections.users).doc(uid).get();
    return snapshot.exists ? snapshot.data() : null;
  } catch (error) {
    console.warn("[customer-session-verify-failed]", error instanceof Error ? error.message : "unknown");
    return null;
  }
}

export async function verifyCustomerSession(token?: string): Promise<CustomerSession | null> {
  if (!token || !isFirebaseAdminConfigured()) return null;
  try {
    const account = await lookupFirebaseAccount(token);
    const profile = await getUserProfile(account.localId);
    const name = (profile?.displayName as string | undefined) || account.displayName || account.email?.split("@")[0] || "Customer";
    const emailVerified = Boolean(account.emailVerified || profile?.emailVerified);
    const accountStatus = String(profile?.accountStatus || (emailVerified ? "active" : "pending")) as CustomerSession["accountStatus"];
    const times = decodeFirebaseTokenTimes(token);
    return {
      uid: account.localId,
      email: account.email || "",
      name,
      initials: initialsFromName(name),
      emailVerified,
      accountStatus,
      issuedAt: times.issuedAt,
      expiresAt: times.expiresAt
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

export async function requireVerifiedCustomerSession() {
  const session = await requireCustomerSession();
  if (!session.emailVerified || session.accountStatus !== "active") redirect("/account?verify=1");
  return session;
}
