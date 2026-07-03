import type { Metadata } from "next";
import { CustomerSimplePage } from "@/components/auth/CustomerAccountDashboard";
import { StructuredData } from "@/components/seo/StructuredData";
import { requireVerifiedCustomerSession } from "@/lib/customer/auth";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Wishlist",
  description: "Your favourite .CO products and recipes.",
  path: "/wishlist",
  index: false
});

export default async function WishlistPage() {
  const session = await requireVerifiedCustomerSession();

  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Wishlist", path: "/wishlist" }]} />
      <CustomerSimplePage
        session={session}
        title="Wishlist."
        body="Keep favourite products, rituals, and recipe ideas in one place for later."
        items={[]}
      />
    </>
  );
}
