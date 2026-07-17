import type { Metadata } from "next";
import { CustomerSimplePage } from "@/components/auth/CustomerAccountDashboard";
import { SavedContentGrid, type SavedCard } from "@/components/auth/SavedContentGrid";
import { requireVerifiedCustomerSession } from "@/lib/customer/auth";
import { getCustomerSavedContent } from "@/lib/customer/aws-api";
import { getRecipes } from "@/lib/content/server";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({ title:"Saved Recipes", description:"Your saved .CO coconut recipes.", path:"/saved-recipes", index:false });
export default async function SavedRecipesPage() {
  const [session,saved,recipes] = await Promise.all([requireVerifiedCustomerSession(),getCustomerSavedContent(),getRecipes()]);
  const items: SavedCard[] = recipes.filter((r)=>saved.recipeIds.includes(r.slug)).map((r)=>({id:r.slug,kind:"recipe",title:r.title,detail:r.description,image:r.image,href:`/recipes/${r.slug}`}));
  return <><CustomerSimplePage session={session} title="Saved recipes." body="Coconut rituals and kitchen ideas saved to your secure account." items={[]} suppressEmpty/><SavedContentGrid initialItems={items}/></>;
}
