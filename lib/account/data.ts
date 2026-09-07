import "server-only";
import { customerAwsApi, type CustomerProfileRecord, type SavedContentRecord } from "@/lib/customer/aws-api";
import { getProducts, getRecipes, getJournalPosts } from "@/lib/content/server";
import { transparentProductAssets } from "@/lib/website-assets";
import type { AddressInput } from "@dotco/contracts";

export type AccountAddress = AddressInput & { addressId: string };
export type AccountOrder = { orderId: string; status: string; placedAt?: string; total?: number; currency?: string; items?: Array<{ productId: string; name: string; quantity: number; price?: number; image?: string }> };
export async function loadAccountData() {
  const safe = async <T,>(promise: Promise<T>) => promise.catch(() => null);
  const [profile, saved, addresses, orders, products, recipes, journal] = await Promise.all([
    safe(customerAwsApi<{ profile: CustomerProfileRecord }>("v1/me")),
    safe(customerAwsApi<SavedContentRecord>("v1/wishlist")),
    safe(customerAwsApi<{ items: AccountAddress[] }>("v1/me/addresses")),
    safe(customerAwsApi<{ items: AccountOrder[] }>("v1/orders")),
    getProducts(), getRecipes(), getJournalPosts()
  ]);
  return {
    profile: profile?.data?.profile ?? null,
    saved: saved?.data ?? { productIds: [], recipeIds: [], journalIds: [], communityIds: [], recentlyViewedProductIds: [] },
    addresses: addresses?.data?.items ?? [], orders: orders?.data?.items ?? [],
    products: products.map(product=>{const key=product.slug==="melt-co-mango-coconut"?"melt":product.slug==="co-botanica-body-moisturizer"?"botanica-moisturizer":product.slug.replace(/^co-/,"");return {...product,image:transparentProductAssets[key]?.src??product.image};}), recipes, journal,
    unavailable: { profile: !profile?.ok, saved: !saved?.ok, addresses: !addresses?.ok, orders: !orders?.ok }
  };
}
export type AccountData = Awaited<ReturnType<typeof loadAccountData>>;
