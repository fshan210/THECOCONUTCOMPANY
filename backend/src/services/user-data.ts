import { createHash } from "node:crypto";
import { DeleteCommand, GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { getDocumentClient } from "../repositories/dynamodb.js";
import { getEnv } from "../config/env.js";
import type { AuthenticatedUser } from "../types/context.js";
import type { AddressInput, CartBundleContext, CartItemInput, MePatchInput, SavedContentKind } from "@dotco/contracts";
import { conflict, notFound } from "../errors/api-error.js";
import { resolveCatalogItem } from "./catalog.js";

type StoredProfile = MePatchInput & { PK: string; SK: "PROFILE"; userId: string; email?: string; createdAt: string; updatedAt: string; version: number };
type StoredCartItem = Omit<CartItemInput, "bundle" | "bundleMetadata"> & { bundleMetadata?: CartBundleContext[] };
type StoredCart = { PK: string; SK: "CART"; userId: string; items: StoredCartItem[]; updatedAt: string; version: number; mutationKeys: string[] };
export type StoredWishlist = {
  PK: string;
  SK: "WISHLIST";
  productIds: string[];
  recipeIds: string[];
  journalIds: string[];
  communityIds: string[];
  recentlyViewedProductIds: string[];
  updatedAt: string;
  version: number;
  mutationKeys: string[];
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

function isConditionalFailure(error: unknown) {
  return error instanceof Error && error.name === "ConditionalCheckFailedException";
}

async function writeVersioned(item: Record<string, unknown> & { userId: string; SK: string; version: number }, expectedVersion: number) {
  if (isLocal()) {
    const current = memory.get(key(item.userId, item.SK)) as { version?: number } | undefined;
    if ((current?.version ?? 0) !== expectedVersion) throw conflict();
    memory.set(key(item.userId, item.SK), item);
    return;
  }
  try {
    await getDocumentClient().send(new PutCommand({
      TableName: getEnv().COMMERCE_TABLE_NAME,
      Item: item,
      ConditionExpression: "attribute_not_exists(PK) OR attribute_not_exists(#version) OR #version = :expectedVersion",
      ExpressionAttributeNames: { "#version": "version" },
      ExpressionAttributeValues: { ":expectedVersion": expectedVersion }
    }));
  } catch (error) {
    if (isConditionalFailure(error)) throw conflict();
    throw error;
  }
}

const rememberMutation = (keys: string[], idempotencyKey: string) => [idempotencyKey, ...keys.filter((keyValue) => keyValue !== idempotencyKey)].slice(0, 40);

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
  const stored = await read<Partial<StoredCart>>(userId, "CART");
  return {
    PK: `USER#${userId}`,
    SK: "CART",
    userId,
    items: stored?.items ?? [],
    updatedAt: stored?.updatedAt ?? new Date().toISOString(),
    version: stored?.version ?? 0,
    mutationKeys: stored?.mutationKeys ?? []
  };
}

function normalizeCartItem(input: CartItemInput): StoredCartItem | null {
  const resolved = resolveCatalogItem(input.productId, input.variantId);
  if (!resolved) return null;
  const bundleMetadata = mergeBundleMetadata(input.bundleMetadata, input.bundle ? [input.bundle] : []);
  return {
    productId: resolved.product.slug,
    ...(resolved.variant ? { variantId: resolved.variant.id } : {}),
    quantity: input.quantity,
    ...(bundleMetadata.length ? { bundleMetadata } : {})
  };
}

const lineIdentity = (item: Pick<StoredCartItem, "productId" | "variantId">) => `${item.productId}\u0000${item.variantId ?? ""}`;
export const cartItemId = (item: Pick<StoredCartItem, "productId" | "variantId">) => createHash("sha256").update(lineIdentity(item)).digest("base64url").slice(0, 24);

function mergeBundleMetadata(current: CartBundleContext[] = [], incoming: CartBundleContext[] = []) {
  const values = new Map(current.map((bundle) => [bundle.bundleId, bundle]));
  for (const bundle of incoming) values.set(bundle.bundleId, bundle);
  return [...values.values()];
}

function mergeStoredItem(items: StoredCartItem[], incoming: StoredCartItem) {
  const identity = lineIdentity(incoming);
  const existing = items.find((item) => lineIdentity(item) === identity);
  if (!existing) return [...items, incoming];
  return items.map((item) => item === existing ? {
    ...item,
    quantity: Math.min(12, item.quantity + incoming.quantity),
    bundleMetadata: mergeBundleMetadata(item.bundleMetadata, incoming.bundleMetadata)
  } : item);
}

async function mutateCart(userId: string, idempotencyKey: string, mutation: (cart: StoredCart) => StoredCartItem[]) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const current = await getCart(userId);
    if (current.mutationKeys.includes(idempotencyKey)) return current;
    const next: StoredCart = {
      ...current,
      items: mutation(current),
      updatedAt: new Date().toISOString(),
      version: current.version + 1,
      mutationKeys: rememberMutation(current.mutationKeys, idempotencyKey)
    };
    try {
      await writeVersioned(next, current.version);
      return next;
    } catch (error) {
      if (!(error instanceof Error) || error.name !== "ApiError" || attempt === 4) throw error;
    }
  }
  throw conflict();
}

export async function addCartItem(userId: string, input: CartItemInput, idempotencyKey: string) {
  const normalized = normalizeCartItem(input);
  if (!normalized) throw notFound("Product or variant not found.");
  return mutateCart(userId, idempotencyKey, (current) => mergeStoredItem(current.items, normalized));
}

export async function mergeCart(userId: string, inputs: CartItemInput[], idempotencyKey: string) {
  let ignoredItemCount = 0;
  const normalized = inputs.flatMap((input) => {
    const item = normalizeCartItem(input);
    if (!item) { ignoredItemCount += 1; return []; }
    return [item];
  });
  const cart = await mutateCart(userId, idempotencyKey, (current) => normalized.reduce((items, item) => mergeStoredItem(items, item), current.items));
  return { cart, ignoredItemCount };
}

export async function setCartItemQuantity(userId: string, itemId: string, quantity: number, idempotencyKey: string) {
  return mutateCart(userId, idempotencyKey, (current) => {
    if (!current.items.some((item) => cartItemId(item) === itemId)) throw notFound("Cart item not found.");
    return current.items.map((item) => cartItemId(item) === itemId ? { ...item, quantity } : item);
  });
}

export async function removeCartItem(userId: string, itemId: string, idempotencyKey: string) {
  return mutateCart(userId, idempotencyKey, (current) => {
    if (!current.items.some((item) => cartItemId(item) === itemId)) throw notFound("Cart item not found.");
    return current.items.filter((item) => cartItemId(item) !== itemId);
  });
}

export async function clearCart(userId: string, idempotencyKey: string) {
  return mutateCart(userId, idempotencyKey, () => []);
}

export function presentCart(cart: StoredCart) {
  const items = cart.items.flatMap((item) => {
    const resolved = resolveCatalogItem(item.productId, item.variantId);
    if (!resolved) return [];
    const unitAmount = resolved.unitAmount;
    return [{
      itemId: cartItemId(item),
      productId: resolved.product.id,
      slug: resolved.product.slug,
      variantId: resolved.variant?.id,
      sku: resolved.variant?.sku,
      variantLabel: resolved.variant?.label,
      quantity: item.quantity,
      unitAmount,
      lineAmount: unitAmount * item.quantity,
      bundleMetadata: item.bundleMetadata ?? []
    }];
  });
  return {
    items,
    currency: "INR" as const,
    subtotalAmount: items.reduce((sum, item) => sum + item.lineAmount, 0),
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    updatedAt: cart.updatedAt,
    version: cart.version
  };
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
    updatedAt: stored?.updatedAt ?? new Date().toISOString(),
    version: stored?.version ?? 0,
    mutationKeys: stored?.mutationKeys ?? []
  };
}

const savedField: Record<SavedContentKind, keyof Pick<StoredWishlist, "productIds" | "recipeIds" | "journalIds" | "communityIds" | "recentlyViewedProductIds">> = {
  product: "productIds",
  recipe: "recipeIds",
  journal: "journalIds",
  community: "communityIds",
  recent: "recentlyViewedProductIds"
};

async function mutateSavedContent(userId: string, kind: SavedContentKind, itemId: string, idempotencyKey: string, removing: boolean) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const current = await getWishlist(userId);
    if (current.mutationKeys.includes(idempotencyKey)) return current;
    const field = savedField[kind];
    const values = removing ? current[field].filter((value) => value !== itemId) : [itemId, ...current[field].filter((value) => value !== itemId)];
    const next: StoredWishlist = {
      ...current,
      [field]: kind === "recent" ? values.slice(0, 20) : values,
      updatedAt: new Date().toISOString(),
      version: current.version + 1,
      mutationKeys: rememberMutation(current.mutationKeys, idempotencyKey)
    };
    try {
      await writeVersioned({ ...next, userId }, current.version);
      return next;
    } catch (error) {
      if (!(error instanceof Error) || error.name !== "ApiError" || attempt === 4) throw error;
    }
  }
  throw conflict();
}

export function saveContentItem(userId: string, kind: SavedContentKind, itemId: string, idempotencyKey: string = crypto.randomUUID()) {
  return mutateSavedContent(userId, kind, itemId, idempotencyKey, false);
}

export function removeContentItem(userId: string, kind: SavedContentKind, itemId: string, idempotencyKey: string = crypto.randomUUID()) {
  return mutateSavedContent(userId, kind, itemId, idempotencyKey, true);
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

function normalizeAddress(input: AddressInput): AddressInput {
  return { ...input, phone: input.phone.replace(/\s+/g, " ").trim(), country: input.country.toUpperCase() };
}

export async function getAddress(userId: string, addressId: string) {
  return read<StoredAddress>(userId, `ADDRESS#${addressId}`);
}

export async function saveAddress(userId: string, input: AddressInput, addressId: string = crypto.randomUUID(), requireExisting = false) {
  const now = new Date().toISOString();
  const existing = await getAddress(userId, addressId);
  if (requireExisting && !existing) throw notFound("Address not found.");
  const normalized = normalizeAddress(input);
  if (normalized.isDefault) {
    const addresses = await listAddresses(userId);
    await Promise.all(addresses.items.filter((item) => item.isDefault && item.addressId !== addressId).map((item) => write({ ...item, userId, PK: `USER#${userId}`, SK: `ADDRESS#${item.addressId}`, isDefault: false, updatedAt: now })));
  }
  const address = { PK: `USER#${userId}`, SK: `ADDRESS#${addressId}`, userId, addressId, ...normalized, createdAt: existing?.createdAt ?? now, updatedAt: now };
  await write(address);
  return address;
}

export async function deleteAddress(userId: string, addressId: string) {
  const existing = await getAddress(userId, addressId);
  if (!existing) throw notFound("Address not found.");
  if (isLocal()) { memory.delete(key(userId, `ADDRESS#${addressId}`)); return existing; }
  await getDocumentClient().send(new DeleteCommand({ TableName: getEnv().COMMERCE_TABLE_NAME, Key: { PK: `USER#${userId}`, SK: `ADDRESS#${addressId}` }, ConditionExpression: "attribute_exists(PK)" }));
  return existing;
}

export function resetUserDataForTests() {
  memory.clear();
}
