import { AccountPage } from "@/components/account/AccountPage";
import { createPageMetadata } from "@/lib/seo/metadata";
export const metadata = createPageMetadata({
  title: "Payments",
  description: "Your personal .CO account, favourites and everyday rituals.",
  path: "/account/payments",
  index: false,
});
export default function Page() {
  return <AccountPage view="payments" />;
}
