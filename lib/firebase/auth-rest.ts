import "server-only";

type FirebaseLookupUser = {
  localId: string;
  email?: string;
  displayName?: string;
  photoUrl?: string;
  emailVerified?: boolean;
  validSince?: string;
};

function getApiKey() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) throw new Error("Firebase Web API key is missing.");
  return apiKey;
}

export function decodeFirebaseTokenTimes(token: string) {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1] || "", "base64url").toString("utf8")) as {
      iat?: number;
      exp?: number;
    };
    return {
      issuedAt: payload.iat ? payload.iat * 1000 : Date.now(),
      expiresAt: payload.exp ? payload.exp * 1000 : Date.now() + 1000 * 60 * 60
    };
  } catch {
    return {
      issuedAt: Date.now(),
      expiresAt: Date.now() + 1000 * 60 * 60
    };
  }
}

export async function lookupFirebaseAccount(idToken: string) {
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(getApiKey())}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ idToken }),
    cache: "no-store"
  });

  const result = (await response.json()) as { users?: FirebaseLookupUser[]; error?: { message?: string } };
  if (!response.ok || !result.users?.[0]) {
    throw new Error(result.error?.message || "Firebase token lookup failed.");
  }

  return result.users[0];
}
