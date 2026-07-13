import "server-only";

import { CognitoIdentityProviderClient, ResendConfirmationCodeCommand } from "@aws-sdk/client-cognito-identity-provider";

export const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.DOTCO_AWS_REGION || "ap-south-1" });

export function cognitoClientId() {
  return process.env.COGNITO_APP_CLIENT_ID;
}

export function normalizeCognitoEmail(value: string) {
  return value.trim().toLowerCase();
}

export function cognitoErrorName(error: unknown) {
  return error instanceof Error ? error.name : "UnknownError";
}

export function hasCognitoError(error: unknown, name: string) {
  return cognitoErrorName(error).includes(name);
}

export async function resendCognitoConfirmation(email: string, id = cognitoClientId()) {
  if (!id) throw new Error("CognitoClientNotConfigured");
  return cognitoClient.send(new ResendConfirmationCodeCommand({ ClientId: id, Username: normalizeCognitoEmail(email) }));
}
