import { AccountPage } from "@/components/account/AccountPage";
import { createPageMetadata } from "@/lib/seo/metadata";
export const metadata = createPageMetadata({
  title: "Order History",
  description: "Your personal .CO account, favourites and everyday rituals.",
  path: "/orders/history",
  index: false,
});
export default function Page() {
  return <AccountPage view="history" />;
}
