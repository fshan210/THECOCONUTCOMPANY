import type { Metadata } from "next";
import { CustomerSimplePage } from "@/components/auth/CustomerAccountDashboard";
import { StructuredData } from "@/components/seo/StructuredData";
import { requireCustomerSession } from "@/lib/customer/auth";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Profile",
  description: "Manage your .CO profile, addresses and preferences.",
  path: "/profile"
});

export default async function ProfilePage() {
  const session = await requireCustomerSession();

  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Profile", path: "/profile" }]} />
      <CustomerSimplePage
        session={session}
        title="Profile."
        body="Manage identity, addresses, newsletter preferences, password changes, and deletion requests from a separate customer authentication flow."
        items={[
          { title: "Identity", detail: `${session.name} / ${session.email}` },
          { title: "Addresses", detail: "Primary, billing, and delivery addresses are database-ready." },
          { title: "Privacy", detail: "Password change and delete-account workflows are separated from admin RBAC." }
        ]}
      />
    </>
  );
}
