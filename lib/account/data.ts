import "server-only";
import { customerAwsApi, type CustomerProfileRecord, type SavedContentRecord } from "@/lib/customer/aws-api";
import { getProducts, getRecipes, getJournalPosts } from "@/lib/content/server";
import { transparentProductAssets } from "@/lib/website-assets";
import type { AddressInput } from "@dotco/contracts";
import { resolveSavedRecipe } from "@/lib/recipes/canonical";
import type { AccountView } from "@/lib/account/routes";

export type AccountAddress = AddressInput & { addressId: string };
export type AccountOrder = { orderId: string; status: string; placedAt?: string; total?: number; currency?: string; items?: Array<{ productId: string; name: string; quantity: number; price?: number; image?: string }> };
export async function loadAccountData(view: AccountView = "overview") {
  const safe = async <T,>(promise: Promise<T>) => promise.catch(() => null);
  const overview = view === "overview" || view === "empty";
  const needsSaved = overview || view === "wishlist" || view === "recipes";
  const needsAddresses = overview || view === "addresses";
  const needsOrders = overview || view === "orders" || view === "history" || view === "detail";
  const needsCatalog = overview || view === "wishlist" || view === "recipes";
  const [profile, saved, addresses, orders, products, recipes, journal] = await Promise.all([
    safe(customerAwsApi<{ profile: CustomerProfileRecord }>("v1/me")),
    needsSaved ? safe(customerAwsApi<SavedContentRecord>("v1/wishlist")) : null,
    needsAddresses ? safe(customerAwsApi<{ items: AccountAddress[] }>("v1/me/addresses")) : null,
    needsOrders ? safe(customerAwsApi<{ items: AccountOrder[] }>("v1/orders")) : null,
    needsCatalog ? getProducts() : [],
    needsSaved ? getRecipes() : [],
    view === "wishlist" ? getJournalPosts() : []
  ]);
  const savedRecord = saved?.data ?? { productIds: [], recipeIds: [], journalIds: [], communityIds: [], recentlyViewedProductIds: [] };
  const savedRecipeEntries = savedRecord.recipeIds.flatMap((persistedId) => {
    const resolved = resolveSavedRecipe(persistedId, recipes);
    return resolved ? [resolved] : [];
  });
  return {
    profile: profile?.data?.profile ?? null,
    saved: savedRecord,
    savedRecipeEntries,
    addresses: addresses?.data?.items ?? [], orders: orders?.data?.items ?? [],
    products: products.map(product=>{const key=product.slug==="melt-co-mango-coconut"?"melt":product.slug==="co-botanica-body-moisturizer"?"botanica-moisturizer":product.slug.replace(/^co-/,"");return {...product,image:transparentProductAssets[key]?.src??product.image};}), recipes, journal,
    unavailable: {
      profile: !profile?.ok,
      saved: needsSaved && !saved?.ok,
      addresses: needsAddresses && !addresses?.ok,
      orders: needsOrders && !orders?.ok
    }
  };
}
export type AccountData = Awaited<ReturnType<typeof loadAccountData>>;
