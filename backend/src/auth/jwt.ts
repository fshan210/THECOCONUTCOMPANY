import { CognitoJwtVerifier } from "aws-jwt-verify";
import type { CognitoJwtVerifierSingleUserPool } from "aws-jwt-verify/cognito-verifier";
import { getEnv } from "../config/env.js";
import { unauthorized } from "../errors/api-error.js";
import { normalizeRoles } from "./authorization.js";
import type { AuthenticatedUser } from "../types/context.js";

let verifier: CognitoJwtVerifierSingleUserPool<{ userPoolId: string; tokenUse: "access" | "id"; clientId: string }> | null = null;

function getVerifier() {
  const env = getEnv();
  if (!env.COGNITO_USER_POOL_ID || !env.COGNITO_APP_CLIENT_ID) {
    throw unauthorized("Authentication is not configured for this environment.");
  }
  if (!verifier) {
    verifier = CognitoJwtVerifier.create({
      userPoolId: env.COGNITO_USER_POOL_ID,
      tokenUse: env.COGNITO_REQUIRED_TOKEN_USE,
      clientId: env.COGNITO_APP_CLIENT_ID
    });
  }
  return verifier;
}

export async function verifyBearerToken(authorization?: string): Promise<AuthenticatedUser> {
  const token = parseBearerToken(authorization);
  if (!token) throw unauthorized();
  try {
    const payload = await getVerifier().verify(token);
    const user: AuthenticatedUser = {
      userId: payload.sub,
      roles: normalizeRoles(payload["cognito:groups"]),
      tokenUse: payload.token_use
    };
    if (typeof payload.email === "string") user.email = payload.email;
    return user;
  } catch {
    throw unauthorized("Your session is invalid or expired.");
  }
}

export function parseBearerToken(authorization?: string) {
  return authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
}

export function resetJwtVerifierForTests() {
  verifier = null;
}
