import { AccountPage } from "@/components/account/AccountPage";
import { createPageMetadata } from "@/lib/seo/metadata";
export const metadata = createPageMetadata({
  title: "Security",
  description: "Your personal .CO account, favourites and everyday rituals.",
  path: "/account/security",
  index: false,
});
export default function Page() {
  return <AccountPage view="security" />;
}
