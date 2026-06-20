import type { Metadata } from "next";
import { CustomerSimplePage } from "@/components/auth/CustomerAccountDashboard";
import { StructuredData } from "@/components/seo/StructuredData";
import { requireVerifiedCustomerSession } from "@/lib/customer/auth";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Orders",
  description: "Your .CO order history.",
  path: "/orders"
});

export default async function OrdersPage() {
  const session = await requireVerifiedCustomerSession();

  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Orders", path: "/orders" }]} />
      <CustomerSimplePage
        session={session}
        title="Order history."
        body="A simple place for your .CO orders, receipts, and delivery notes when you shop with us."
        items={[
          { title: "No orders yet", detail: "Your first .CO order will appear here once it is placed." },
          { title: "Receipts", detail: "Order summaries and product details stay together for easy reference." },
          { title: "Delivery notes", detail: "Useful delivery updates will be kept clear and easy to scan." }
        ]}
      />
    </>
  );
}
