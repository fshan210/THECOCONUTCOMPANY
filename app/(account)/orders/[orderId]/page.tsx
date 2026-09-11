import { AccountPage } from "@/components/account/AccountPage";
import { createPageMetadata } from "@/lib/seo/metadata";
export const metadata = createPageMetadata({
  title: "Order Details",
  description: "Your .CO order details.",
  path: "/orders",
  index: false,
});
export default async function Page({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  return <AccountPage view="detail" orderId={orderId} />;
}
