import type { Metadata } from "next";
import { CustomerSimplePage } from "@/components/auth/CustomerAccountDashboard";
import { StructuredData } from "@/components/seo/StructuredData";
import { requireVerifiedCustomerSession } from "@/lib/customer/auth";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Saved Recipes",
  description: "Your saved .CO coconut recipes.",
  path: "/saved-recipes"
});

export default async function SavedRecipesPage() {
  const session = await requireVerifiedCustomerSession();

  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Saved Recipes", path: "/saved-recipes" }]} />
      <CustomerSimplePage
        session={session}
        title="Saved recipes."
        body="Your verified account can collect coconut water rituals, smoothie bowls, and launch notes as the recipe CMS expands."
        items={[
          { title: "Hydration", detail: "Coconut water recipes and recovery drinks will save here." },
          { title: "Kitchen", detail: "Dessert and breakfast recipes are ready for customer favourites." },
          { title: "Launch sync", detail: "Saved recipe persistence is separated from admin permissions." }
        ]}
      />
    </>
  );
}
