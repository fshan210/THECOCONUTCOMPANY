import { AccountPage } from "@/components/account/AccountPage";
import { createPageMetadata } from "@/lib/seo/metadata";
export const metadata = createPageMetadata({
  title: "Your .CO Space",
  description: "Your personal .CO account, favourites and everyday rituals.",
  path: "/account/empty",
  index: false,
});
export default function Page() {
  return <AccountPage view="empty" />;
}
