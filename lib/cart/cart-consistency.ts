export type CartSessionScope = { owner: string | null; generation: number };

export function normalizeCartOwner(email?: string | null) {
  return email?.trim().toLocaleLowerCase("en-IN") || null;
}

export function advanceCartScope(current: CartSessionScope, owner: string | null): CartSessionScope {
  return current.owner === owner ? current : { owner, generation: current.generation + 1 };
}

export function isCurrentCartScope(current: CartSessionScope, captured: CartSessionScope) {
  return current.owner === captured.owner && current.generation === captured.generation;
}

export class StaleCartScopeError extends Error {
  constructor() {
    super("Cart response belongs to an expired customer session.");
    this.name = "StaleCartScopeError";
  }
}

export function isStaleCartScopeError(error: unknown) {
  return error instanceof StaleCartScopeError || (error instanceof Error && error.name === "StaleCartScopeError");
}

type IdentifiedCartLine = { slug: string; sku?: string; itemId?: string; quantity: number };

export const optimisticLineIdentity = (line: Pick<IdentifiedCartLine, "slug" | "sku">) => line.sku ?? line.slug;

export function findCartLineByIdentity<T extends IdentifiedCartLine>(items: T[], identity: string) {
  return items.find((item) => optimisticLineIdentity(item) === identity);
}

export function overlayPendingCartLines<T extends IdentifiedCartLine>(
  serverItems: T[],
  optimisticItems: T[],
  protectedIdentities: string[],
  protectedItemIds: string[],
  preserveWholeCart = false
) {
  if (preserveWholeCart) return [...optimisticItems];
  let next = [...serverItems];
  for (const identity of protectedIdentities) {
    next = next.filter((item) => optimisticLineIdentity(item) !== identity);
    const local = findCartLineByIdentity(optimisticItems, identity);
    if (local) next.push(local);
  }
  for (const itemId of protectedItemIds) {
    next = next.filter((item) => item.itemId !== itemId);
    const local = optimisticItems.find((item) => item.itemId === itemId);
    if (local) next.push(local);
  }
  return next;
}

export type PendingLineReconciliation =
  | { action: "apply" }
  | { action: "delete"; itemId: string }
  | { action: "patch"; itemId: string; quantity: number };

export function planPendingLineReconciliation(
  serverItems: IdentifiedCartLine[],
  optimisticItems: IdentifiedCartLine[],
  identity: string
): PendingLineReconciliation {
  const serverLine = findCartLineByIdentity(serverItems, identity);
  if (!serverLine?.itemId) return { action: "apply" };
  const optimisticLine = findCartLineByIdentity(optimisticItems, identity);
  if (!optimisticLine) return { action: "delete", itemId: serverLine.itemId };
  if (optimisticLine.quantity !== serverLine.quantity) {
    return { action: "patch", itemId: serverLine.itemId, quantity: optimisticLine.quantity };
  }
  return { action: "apply" };
}
