import type { Metadata } from "next";
import { CustomerSimplePage } from "@/components/auth/CustomerAccountDashboard";
import { StructuredData } from "@/components/seo/StructuredData";
import { requireVerifiedCustomerSession } from "@/lib/customer/auth";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Saved Recipes",
  description: "Your saved .CO coconut recipes.",
  path: "/saved-recipes",
  index: false
});

export default async function SavedRecipesPage() {
  const session = await requireVerifiedCustomerSession();

  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Saved Recipes", path: "/saved-recipes" }]} />
      <CustomerSimplePage
        session={session}
        title="Saved recipes."
        body="Collect coconut water rituals, smoothie bowls, and simple kitchen ideas you want to revisit."
        items={[
          { title: "Hydration", detail: "Coconut water coolers, breakfast blends, and gentle refreshers." },
          { title: "Kitchen", detail: "Dessert, breakfast, and hosting notes with coconut at the centre." },
          { title: "Rituals", detail: "A personal shelf for the recipes you return to often." }
        ]}
      />
    </>
  );
}
