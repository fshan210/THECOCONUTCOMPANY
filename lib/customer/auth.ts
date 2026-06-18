import "server-only";

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { customerSessionCookie, type CustomerSession } from "@/lib/customer/auth-config";

const customerSessionMs = 1000 * 60 * 60 * 24 * 14;

function getSecret() {
  return process.env.CUSTOMER_SESSION_SECRET || process.env.NEXTAUTH_SECRET || "local-customer-session-secret-change-me";
}

function base64Url(input: string) {
  return Buffer.from(input).toString("base64url");
}

function fromBase64Url(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

function sign(payload: string) {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

function initialsFromName(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "CO";
}

export function createCustomerSession(email: string, name: string) {
  const now = Date.now();
  const payload: CustomerSession = {
    email,
    name,
    initials: initialsFromName(name),
    issuedAt: now,
    expiresAt: now + customerSessionMs
  };
  const encoded = base64Url(JSON.stringify(payload));
  return `${encoded}.${sign(encoded)}`;
}

export function verifyCustomerSession(token?: string): CustomerSession | null {
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  const expected = sign(encoded);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) return null;

  try {
    const session = JSON.parse(fromBase64Url(encoded)) as CustomerSession;
    if (!session.email || !session.name || Date.now() > session.expiresAt) return null;
    return session;
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
