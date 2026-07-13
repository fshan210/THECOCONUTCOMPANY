import { DeleteCommand, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { getDocumentClient } from "../repositories/dynamodb.js";
import { getEnv } from "../config/env.js";
import type { AuthenticatedUser } from "../types/context.js";
import type { AddressInput, CartItemInput } from "@dotco/contracts";

type StoredProfile = { PK: string; SK: "PROFILE"; userId: string; email?: string; displayName?: string; marketingOptIn?: boolean; createdAt: string; updatedAt: string; version: number };
type StoredCart = { PK: string; SK: "CART"; items: CartItemInput[]; updatedAt: string };
type StoredWishlist = { PK: string; SK: "WISHLIST"; productIds: string[]; updatedAt: string };

const memory = new Map<string, Record<string, unknown>>();
const key = (userId: string, sk: string) => `USER#${userId}#${sk}`;
const isLocal = () => getEnv().APP_ENV === "local";

async function read<T>(pk: string, sk: string): Promise<T | null> {
  if (isLocal()) return (memory.get(key(pk, sk)) as T | undefined) ?? null;
  const result = await getDocumentClient().send(new GetCommand({ TableName: getEnv().COMMERCE_TABLE_NAME, Key: { PK: `USER#${pk}`, SK: sk } }));
  return (result.Item as T | undefined) ?? null;
}

async function write(item: Record<string, unknown>) {
  if (isLocal()) { memory.set(key(String(item.userId ?? item.PK), String(item.SK)), item); return; }
  await getDocumentClient().send(new PutCommand({ TableName: getEnv().COMMERCE_TABLE_NAME, Item: item }));
}

export async function provisionProfile(user: AuthenticatedUser) {
  const existing = await read<StoredProfile>(user.userId, "PROFILE");
  if (existing) return existing;
  const now = new Date().toISOString();
  const profile: StoredProfile = { PK: `USER#${user.userId}`, SK: "PROFILE", userId: user.userId, email: user.email, createdAt: now, updatedAt: now, version: 1 };
  if (isLocal()) { memory.set(key(user.userId, "PROFILE"), profile); return profile; }
  await getDocumentClient().send(new PutCommand({ TableName: getEnv().COMMERCE_TABLE_NAME, Item: profile, ConditionExpression: "attribute_not_exists(PK)" }));
  return (await read<StoredProfile>(user.userId, "PROFILE")) ?? profile;
}

export async function updateProfile(user: AuthenticatedUser, patch: { displayName?: string; marketingOptIn?: boolean }) {
  const current = await provisionProfile(user);
  const next = { ...current, ...patch, updatedAt: new Date().toISOString(), version: current.version + 1 };
  await write(next);
  return next;
}

export async function deleteProfile(userId: string) {
  if (isLocal()) { memory.delete(key(userId, "PROFILE")); return; }
  await getDocumentClient().send(new DeleteCommand({ TableName: getEnv().COMMERCE_TABLE_NAME, Key: { PK: `USER#${userId}`, SK: "PROFILE" } }));
}

export async function getCart(userId: string): Promise<StoredCart> {
  return (await read<StoredCart>(userId, "CART")) ?? { PK: `USER#${userId}`, SK: "CART", items: [], updatedAt: new Date().toISOString() };
}

export async function saveCart(userId: string, items: CartItemInput[]) {
  const cart: StoredCart = { PK: `USER#${userId}`, SK: "CART", items, updatedAt: new Date().toISOString() };
  await write({ ...cart, userId });
  return cart;
}

export async function getWishlist(userId: string): Promise<StoredWishlist> {
  return (await read<StoredWishlist>(userId, "WISHLIST")) ?? { PK: `USER#${userId}`, SK: "WISHLIST", productIds: [], updatedAt: new Date().toISOString() };
}

export async function saveWishlist(userId: string, productIds: string[]) {
  const wishlist: StoredWishlist = { PK: `USER#${userId}`, SK: "WISHLIST", productIds, updatedAt: new Date().toISOString() };
  await write({ ...wishlist, userId });
  return wishlist;
}

export type StoredAddress = AddressInput & { addressId: string; createdAt: string; updatedAt: string };
export async function listAddresses(userId: string) {
  // Address query is intentionally deferred until a GSI-backed query is added;
  // this keeps normal routes free of table scans.
  return { items: [] as StoredAddress[] };
}
