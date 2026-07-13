import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { getDocumentClient } from "../repositories/dynamodb.js";
import { getEnv } from "../config/env.js";

const localNewsletter = new Set<string>();
const localDiscounts = new Set<string>();

export async function subscribeNewsletter(email: string, source: string) {
  const normalized = email.trim().toLowerCase();
  if (getEnv().APP_ENV === "local") {
    const duplicate = localNewsletter.has(normalized);
    localNewsletter.add(normalized);
    return { email: normalized, source, duplicate };
  }
  try {
    await getDocumentClient().send(new PutCommand({
      TableName: getEnv().COMMERCE_TABLE_NAME,
      Item: { PK: `NEWSLETTER#${normalized}`, SK: "SUBSCRIPTION", email: normalized, source, consentedAt: new Date().toISOString(), status: "ACTIVE" },
      ConditionExpression: "attribute_not_exists(PK)"
    }));
    return { email: normalized, source, duplicate: false };
  } catch (error) {
    if (error instanceof Error && error.name === "ConditionalCheckFailedException") return { email: normalized, source, duplicate: true };
    throw error;
  }
}

export async function claimFirstPurchase(email: string, idempotencyKey: string) {
  const normalized = email.trim().toLowerCase();
  if (getEnv().APP_ENV === "local") {
    const duplicate = localDiscounts.has(normalized);
    localDiscounts.add(normalized);
    return { email: normalized, idempotencyKey, status: duplicate ? "ALREADY_CLAIMED" : "CLAIMED", expiresInDays: 30 };
  }
  try {
    await getDocumentClient().send(new PutCommand({
      TableName: getEnv().COMMERCE_TABLE_NAME,
      Item: { PK: `DISCOUNT#${normalized}`, SK: "FIRST_PURCHASE", email: normalized, idempotencyKey, status: "CLAIMED", claimedAt: new Date().toISOString(), expiresAt: Math.floor(Date.now() / 1000) + 30 * 86400 },
      ConditionExpression: "attribute_not_exists(PK)"
    }));
    return { email: normalized, idempotencyKey, status: "CLAIMED", expiresInDays: 30 };
  } catch (error) {
    if (error instanceof Error && error.name === "ConditionalCheckFailedException") return { email: normalized, idempotencyKey, status: "ALREADY_CLAIMED", expiresInDays: 30 };
    throw error;
  }
}
