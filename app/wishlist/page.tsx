import type { Metadata } from "next";
import { CustomerSimplePage } from "@/components/auth/CustomerAccountDashboard";
import { SavedContentGrid, type SavedCard } from "@/components/auth/SavedContentGrid";
import { requireVerifiedCustomerSession } from "@/lib/customer/auth";
import { getCustomerSavedContent } from "@/lib/customer/aws-api";
import { getJournalPosts, getProducts, getRecipes } from "@/lib/content/server";
import { communityPosts } from "@/data/journal";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({ title:"Wishlist", description:"Your favourite .CO products and recipes.", path:"/wishlist", index:false });
export default async function WishlistPage() {
  const [session,saved,products,recipes,journal] = await Promise.all([requireVerifiedCustomerSession(),getCustomerSavedContent(),getProducts(),getRecipes(),getJournalPosts()]);
  const items: SavedCard[] = [
    ...products.filter((p)=>saved.productIds.includes(p.slug)).map((p)=>({id:p.slug,kind:"product" as const,title:p.name,detail:p.subtitle||p.shortDescription,image:p.image,href:`/shop?product=${p.slug}#all-products`,cartSlug:p.slug})),
    ...recipes.filter((r)=>saved.recipeIds.includes(r.slug)).map((r)=>({id:r.slug,kind:"recipe" as const,title:r.title,detail:r.description,image:r.image,href:`/recipes/${r.slug}`})),
    ...journal.filter((post)=>saved.journalIds.includes(post.slug)).map((post)=>({id:post.slug,kind:"journal" as const,title:post.title,detail:post.excerpt,image:post.image,href:`/journal?story=${post.slug}`})),
    ...communityPosts.filter((post)=>saved.communityIds.includes(post.handle)).map((post)=>({id:post.handle,kind:"community" as const,title:post.handle,detail:post.caption,image:post.image,href:"/journal#community-posts"})),
    ...products.filter((p)=>saved.recentlyViewedProductIds.includes(p.slug)).map((p)=>({id:p.slug,kind:"recent" as const,title:p.name,detail:p.subtitle||p.shortDescription,image:p.image,href:`/shop?product=${p.slug}#all-products`,cartSlug:p.slug}))
  ];
  return <><CustomerSimplePage session={session} title="Your saved .CO." body="Wishlist, recipes, journal bookmarks, community saves, and recently viewed products—persisted securely to your account." items={[]} suppressEmpty/><SavedContentGrid initialItems={items}/></>;
}
