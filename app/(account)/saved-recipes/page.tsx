import { AccountPage } from "@/components/account/AccountPage";
import { createPageMetadata } from "@/lib/seo/metadata";
export const metadata = createPageMetadata({
  title: "Saved Recipes",
  description: "Your personal .CO account, favourites and everyday rituals.",
  path: "/saved-recipes",
  index: false,
});
export default function Page() {
  return <AccountPage view="recipes" />;
}
