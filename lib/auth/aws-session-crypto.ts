import crypto from "node:crypto";

export type AwsSessionPayload = { accessToken: string; idToken?: string; refreshToken?: string; sub?: string; email?: string; name?: string; expiresAt: number };

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
    const segments = value.split(".");
    if (segments.length !== 3) return null;
    const [ivValue, tagValue, dataValue] = segments;
    const iv = Buffer.from(ivValue, "base64url");
    const tag = Buffer.from(tagValue, "base64url");
    if (iv.length !== 12 || tag.length !== 16 || !dataValue) return null;
    const decipher = crypto.createDecipheriv("aes-256-gcm", key(), iv);
    decipher.setAuthTag(tag);
    const data = Buffer.concat([decipher.update(Buffer.from(dataValue, "base64url")), decipher.final()]);
    const candidate = JSON.parse(data.toString("utf8")) as Partial<AwsSessionPayload> | null;
    if (!candidate || typeof candidate !== "object") return null;
    if (typeof candidate.accessToken !== "string" || !candidate.accessToken || candidate.accessToken.length > 16_384) return null;
    if (!Number.isInteger(candidate.expiresAt) || Number(candidate.expiresAt) <= Math.floor(Date.now() / 1000)) return null;
    for (const field of ["idToken", "refreshToken", "sub", "email", "name"] as const) {
      const fieldValue = candidate[field];
      if (fieldValue !== undefined && (typeof fieldValue !== "string" || fieldValue.length > 16_384)) return null;
    }
    return candidate as AwsSessionPayload;
  } catch { return null; }
}
