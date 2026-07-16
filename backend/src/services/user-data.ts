import { DeleteCommand, GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { getDocumentClient } from "../repositories/dynamodb.js";
import { getEnv } from "../config/env.js";
import type { AuthenticatedUser } from "../types/context.js";
import type { AddressInput, CartItemInput, MePatchInput, SavedContentKind } from "@dotco/contracts";

type StoredProfile = MePatchInput & { PK: string; SK: "PROFILE"; userId: string; email?: string; createdAt: string; updatedAt: string; version: number };
type StoredCart = { PK: string; SK: "CART"; items: CartItemInput[]; updatedAt: string };
export type StoredWishlist = {
  PK: string;
  SK: "WISHLIST";
  productIds: string[];
  recipeIds: string[];
  journalIds: string[];
  communityIds: string[];
  recentlyViewedProductIds: string[];
  updatedAt: string;
};

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
  const profile: StoredProfile = {
    PK: `USER#${user.userId}`,
    SK: "PROFILE",
    userId: user.userId,
    ...(user.email ? { email: user.email } : {}),
    createdAt: now,
    updatedAt: now,
    version: 1
  };
  if (isLocal()) { memory.set(key(user.userId, "PROFILE"), profile); return profile; }
  await getDocumentClient().send(new PutCommand({ TableName: getEnv().COMMERCE_TABLE_NAME, Item: profile, ConditionExpression: "attribute_not_exists(PK)" }));
  return (await read<StoredProfile>(user.userId, "PROFILE")) ?? profile;
}

export async function updateProfile(user: AuthenticatedUser, patch: MePatchInput) {
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
  const stored = await read<Partial<StoredWishlist>>(userId, "WISHLIST");
  return {
    PK: `USER#${userId}`,
    SK: "WISHLIST",
    productIds: stored?.productIds ?? [],
    recipeIds: stored?.recipeIds ?? [],
    journalIds: stored?.journalIds ?? [],
    communityIds: stored?.communityIds ?? [],
    recentlyViewedProductIds: stored?.recentlyViewedProductIds ?? [],
    updatedAt: stored?.updatedAt ?? new Date().toISOString()
  };
}

export async function saveWishlist(userId: string, productIds: string[], existing?: StoredWishlist) {
  const current = existing ?? await getWishlist(userId);
  const wishlist: StoredWishlist = { ...current, PK: `USER#${userId}`, SK: "WISHLIST", productIds, updatedAt: new Date().toISOString() };
  await write({ ...wishlist, userId });
  return wishlist;
}

const savedField: Record<SavedContentKind, keyof Pick<StoredWishlist, "productIds" | "recipeIds" | "journalIds" | "communityIds" | "recentlyViewedProductIds">> = {
  product: "productIds",
  recipe: "recipeIds",
  journal: "journalIds",
  community: "communityIds",
  recent: "recentlyViewedProductIds"
};

export async function saveContentItem(userId: string, kind: SavedContentKind, itemId: string) {
  const current = await getWishlist(userId);
  const field = savedField[kind];
  const items = [itemId, ...current[field].filter((value) => value !== itemId)];
  const next = { ...current, [field]: kind === "recent" ? items.slice(0, 20) : items, updatedAt: new Date().toISOString() };
  await write({ ...next, userId });
  return next;
}

export async function removeContentItem(userId: string, kind: SavedContentKind, itemId: string) {
  const current = await getWishlist(userId);
  const field = savedField[kind];
  const next = { ...current, [field]: current[field].filter((value) => value !== itemId), updatedAt: new Date().toISOString() };
  await write({ ...next, userId });
  return next;
}

export type StoredAddress = AddressInput & { addressId: string; createdAt: string; updatedAt: string };
export async function listAddresses(userId: string) {
  if (isLocal()) {
    const prefix = `USER#${userId}#ADDRESS#`;
    return { items: [...memory.entries()].filter(([entryKey]) => entryKey.startsWith(prefix)).map(([, value]) => value as unknown as StoredAddress) };
  }
  const result = await getDocumentClient().send(new QueryCommand({
    TableName: getEnv().COMMERCE_TABLE_NAME,
    KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
    ExpressionAttributeValues: { ":pk": `USER#${userId}`, ":sk": "ADDRESS#" }
  }));
  return { items: (result.Items ?? []).map((item) => item as unknown as StoredAddress) };
}

export async function saveAddress(userId: string, input: AddressInput, addressId: string = crypto.randomUUID()) {
  const now = new Date().toISOString();
  const existing = await read<Record<string, unknown>>(userId, `ADDRESS#${addressId}`);
  const address = { PK: `USER#${userId}`, SK: `ADDRESS#${addressId}`, userId, addressId, ...input, createdAt: existing?.createdAt ?? now, updatedAt: now };
  await write(address);
  return address;
}

export async function deleteAddress(userId: string, addressId: string) {
  if (isLocal()) { memory.delete(key(userId, `ADDRESS#${addressId}`)); return; }
  await getDocumentClient().send(new DeleteCommand({ TableName: getEnv().COMMERCE_TABLE_NAME, Key: { PK: `USER#${userId}`, SK: `ADDRESS#${addressId}` } }));
}
