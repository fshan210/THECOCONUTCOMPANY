import "server-only";

import crypto from "node:crypto";
import { cookies } from "next/headers";

const verificationCookie = "co_pending_verification";
const maxAgeSeconds = 60 * 30;
const allowedReturnPaths = new Set(["/shop", "/cart", "/wishlist", "/account", "/products"]);

type VerificationState = {
  email: string;
  returnTo: string;
  expiresAt: number;
};

function key() {
  const secret = process.env.COGNITO_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("COGNITO_SESSION_SECRET is not configured.");
  return crypto.createHash("sha256").update(`${secret}:pending-verification`).digest();
}

export function safeReturnTo(value?: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/shop";
  const path = value.split("?")[0] || "/shop";
  return allowedReturnPaths.has(path) ? value : "/shop";
}

function seal(state: VerificationState) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key(), iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(state), "utf8"), cipher.final()]);
  return [iv.toString("base64url"), cipher.getAuthTag().toString("base64url"), ciphertext.toString("base64url")].join(".");
}

function unseal(value?: string): VerificationState | null {
  if (!value) return null;
  try {
    const [ivValue, tagValue, dataValue] = value.split(".");
    if (!ivValue || !tagValue || !dataValue) return null;
    const decipher = crypto.createDecipheriv("aes-256-gcm", key(), Buffer.from(ivValue, "base64url"));
    decipher.setAuthTag(Buffer.from(tagValue, "base64url"));
    const data = Buffer.concat([decipher.update(Buffer.from(dataValue, "base64url")), decipher.final()]);
    const state = JSON.parse(data.toString("utf8")) as VerificationState;
    if (!state.email || state.expiresAt <= Math.floor(Date.now() / 1000)) return null;
    return { ...state, returnTo: safeReturnTo(state.returnTo) };
  } catch {
    return null;
  }
}

export function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!local || !domain) return "your email address";
  return `${local.slice(0, 1)}${"•".repeat(Math.min(Math.max(local.length - 1, 2), 5))}@${domain}`;
}

export async function setPendingVerification(email: string, returnTo?: string | null) {
  const store = await cookies();
  const state: VerificationState = {
    email: email.trim().toLowerCase(),
    returnTo: safeReturnTo(returnTo),
    expiresAt: Math.floor(Date.now() / 1000) + maxAgeSeconds
  };
  store.set(verificationCookie, seal(state), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds
  });
  return state;
}

export async function getPendingVerification() {
  const store = await cookies();
  return unseal(store.get(verificationCookie)?.value);
}

export async function clearPendingVerification() {
  const store = await cookies();
  store.delete(verificationCookie);
}
