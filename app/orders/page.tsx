import type { Metadata } from "next";
import { CustomerSimplePage } from "@/components/auth/CustomerAccountDashboard";
import { StructuredData } from "@/components/seo/StructuredData";
import { requireVerifiedCustomerSession } from "@/lib/customer/auth";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Orders",
  description: "Your .CO order history and launch reservations.",
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
        body="Commerce is launch-ready. This page tracks pre-launch reservations now and will hold purchases, invoices, delivery updates, and returns as .CO commerce goes live."
        items={[
          { title: "No paid orders yet", detail: "Checkout is intentionally disabled until launch." },
          { title: "Reservations", detail: "Saved interest from the cart and product pages will appear here." },
          { title: "Delivery", detail: "Address-aware delivery status is ready for future courier integration." }
        ]}
      />
    </>
  );
}
