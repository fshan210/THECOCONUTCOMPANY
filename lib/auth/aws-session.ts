import "server-only";

import crypto from "node:crypto";
import { awsSessionCookie } from "@/lib/auth/aws-cookie";
export { awsSessionCookie } from "@/lib/auth/aws-cookie";

export type AwsSessionPayload = { accessToken: string; idToken?: string; refreshToken?: string; sub?: string; email?: string; name?: string; expiresAt: number };

/**
 * Cognito returns three sizeable tokens. Encrypting all three into one cookie can
 * exceed the browser's ~4 KB per-cookie limit, which causes a successful login
 * response to be followed by a missing session on the next navigation. Keep the
 * encrypted payload HttpOnly, but split it into bounded cookie chunks.
 */
export const awsSessionChunkSize = 3_600;
export const maxAwsSessionChunks = 4;

type CookieReader = { get(name: string): { value: string } | undefined };

function key() {
  const secret = process.env.COGNITO_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("COGNITO_SESSION_SECRET is not configured.");
  return crypto.createHash("sha256").update(secret).digest();
}

export function sealAwsSession(payload: AwsSessionPayload) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key(), iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(payload), "utf8"), cipher.final()]);
  return [iv.toString("base64url"), cipher.getAuthTag().toString("base64url"), ciphertext.toString("base64url")].join(".");
}

export function unsealAwsSession(value?: string): AwsSessionPayload | null {
  if (!value) return null;
  try {
    const [ivValue, tagValue, dataValue] = value.split(".");
    if (!ivValue || !tagValue || !dataValue) return null;
    const decipher = crypto.createDecipheriv("aes-256-gcm", key(), Buffer.from(ivValue, "base64url"));
    decipher.setAuthTag(Buffer.from(tagValue, "base64url"));
    const data = Buffer.concat([decipher.update(Buffer.from(dataValue, "base64url")), decipher.final()]);
    const payload = JSON.parse(data.toString("utf8")) as AwsSessionPayload;
    return payload.expiresAt > Math.floor(Date.now() / 1000) ? payload : null;
  } catch { return null; }
}

export function awsSessionCookieName(index: number) {
  return index === 0 ? awsSessionCookie : `${awsSessionCookie}.${index}`;
}

export function splitAwsSession(value: string) {
  const chunks = Array.from({ length: Math.ceil(value.length / awsSessionChunkSize) }, (_, index) => value.slice(index * awsSessionChunkSize, (index + 1) * awsSessionChunkSize));
  if (!chunks.length || chunks.length > maxAwsSessionChunks) {
    throw new Error("The authenticated session is too large to store safely.");
  }
  return chunks;
}

export function readAwsSession(reader: CookieReader) {
  const first = reader.get(awsSessionCookieName(0))?.value;
  if (!first) return null;
  const parts = [first];
  for (let index = 1; index < maxAwsSessionChunks; index += 1) {
    const part = reader.get(awsSessionCookieName(index))?.value;
    if (!part) break;
    parts.push(part);
  }
  return unsealAwsSession(parts.join(""));
}
