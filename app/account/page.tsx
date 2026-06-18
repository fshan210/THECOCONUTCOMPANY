import type { Metadata } from "next";
import { CustomerAccountDashboard } from "@/components/auth/CustomerAccountDashboard";
import { StructuredData } from "@/components/seo/StructuredData";
import { requireCustomerSession } from "@/lib/customer/auth";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Account",
  description: "Your .CO customer dashboard.",
  path: "/account"
});

export default async function AccountPage() {
  const session = await requireCustomerSession();

  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Account", path: "/account" }]} />
      <CustomerAccountDashboard session={session} />
    </>
  );
}
