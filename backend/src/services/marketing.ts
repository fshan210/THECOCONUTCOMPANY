import { PutCommand } from "@aws-sdk/lib-dynamodb";
import type { NewsletterSubscriptionInput } from "@dotco/contracts";
import { getDocumentClient } from "../repositories/dynamodb.js";
import { getEnv } from "../config/env.js";

const localNewsletter = new Set<string>();
const localDiscounts = new Set<string>();

export async function subscribeNewsletter(input: NewsletterSubscriptionInput) {
  const normalized = input.email.trim().toLowerCase();
  const subscription = {
    email: normalized,
    source: input.source,
    consentedAt: new Date().toISOString(),
    status: "ACTIVE" as const,
    ...(input.country ? { country: input.country } : {}),
    ...(input.favouriteProduct ? { favouriteProduct: input.favouriteProduct } : {}),
    ...(input.interestedCategory ? { interestedCategory: input.interestedCategory } : {}),
    ...(input.launchCity ? { launchCity: input.launchCity } : {})
  };
  if (getEnv().APP_ENV === "local") {
    const duplicate = localNewsletter.has(normalized);
    localNewsletter.add(normalized);
    return { ...subscription, duplicate };
  }
  try {
    await getDocumentClient().send(new PutCommand({
      TableName: getEnv().COMMERCE_TABLE_NAME,
      Item: { PK: `NEWSLETTER#${normalized}`, SK: "SUBSCRIPTION", ...subscription },
      ConditionExpression: "attribute_not_exists(PK)"
    }));
    return { ...subscription, duplicate: false };
  } catch (error) {
    if (error instanceof Error && error.name === "ConditionalCheckFailedException") return { ...subscription, duplicate: true };
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
