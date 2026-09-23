import "server-only";

import { awsSessionCookie } from "@/lib/auth/aws-cookie";
import { unsealAwsSession } from "@/lib/auth/aws-session-crypto";
export { sealAwsSession, unsealAwsSession, type AwsSessionPayload } from "@/lib/auth/aws-session-crypto";
export { awsSessionCookie } from "@/lib/auth/aws-cookie";

/**
 * Cognito returns three sizeable tokens. Encrypting all three into one cookie can
 * exceed the browser's ~4 KB per-cookie limit, which causes a successful login
 * response to be followed by a missing session on the next navigation. Keep the
 * encrypted payload HttpOnly, but split it into bounded cookie chunks.
 */
export const awsSessionChunkSize = 3_600;
export const maxAwsSessionChunks = 4;

type CookieReader = { get(name: string): { value: string } | undefined };

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
