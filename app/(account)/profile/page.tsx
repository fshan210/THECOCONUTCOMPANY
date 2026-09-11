import { AccountPage } from "@/components/account/AccountPage";
import { createPageMetadata } from "@/lib/seo/metadata";
export const metadata = createPageMetadata({
  title: "Preferences",
  description: "Your personal .CO account, favourites and everyday rituals.",
  path: "/profile",
  index: false,
});
export default function Page() {
  return <AccountPage view="preferences" />;
}
