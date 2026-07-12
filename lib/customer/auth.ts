import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type CustomerSession } from "@/lib/customer/auth-config";
import { awsSessionCookie, unsealAwsSession } from "@/lib/auth/aws-session";

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

export async function getCustomerSession() {
  const cookieStore = await cookies();
  const aws = unsealAwsSession(cookieStore.get(awsSessionCookie)?.value);
  if (aws) {
    const email = aws.email || "";
    const name = aws.name || email.split("@")[0] || "Customer";
    return { uid: aws.sub || "cognito-session", email, name, initials: initialsFromName(name), emailVerified: true, accountStatus: "active" as const, issuedAt: aws.expiresAt - 900, expiresAt: aws.expiresAt };
  }
  return null;
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
