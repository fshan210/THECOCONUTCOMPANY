import "server-only";

import crypto from "node:crypto";
import { awsSessionCookie } from "@/lib/auth/aws-cookie";
export { awsSessionCookie } from "@/lib/auth/aws-cookie";

type SessionPayload = { accessToken: string; idToken?: string; refreshToken?: string; sub?: string; email?: string; expiresAt: number };

function key() {
  const secret = process.env.COGNITO_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("COGNITO_SESSION_SECRET is not configured.");
  return crypto.createHash("sha256").update(secret).digest();
}

export function sealAwsSession(payload: SessionPayload) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key(), iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(payload), "utf8"), cipher.final()]);
  return [iv.toString("base64url"), cipher.getAuthTag().toString("base64url"), ciphertext.toString("base64url")].join(".");
}

export function unsealAwsSession(value?: string): SessionPayload | null {
  if (!value) return null;
  try {
    const [ivValue, tagValue, dataValue] = value.split(".");
    if (!ivValue || !tagValue || !dataValue) return null;
    const decipher = crypto.createDecipheriv("aes-256-gcm", key(), Buffer.from(ivValue, "base64url"));
    decipher.setAuthTag(Buffer.from(tagValue, "base64url"));
    const data = Buffer.concat([decipher.update(Buffer.from(dataValue, "base64url")), decipher.final()]);
    const payload = JSON.parse(data.toString("utf8")) as SessionPayload;
    return payload.expiresAt > Math.floor(Date.now() / 1000) ? payload : null;
  } catch { return null; }
}
