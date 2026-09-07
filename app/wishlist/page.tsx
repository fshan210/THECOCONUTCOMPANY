import { AccountPage } from "@/components/account/AccountPage";
import { createPageMetadata } from "@/lib/seo/metadata";
export const metadata = createPageMetadata({title:"Wishlist",description:"Your personal .CO account, favourites and everyday rituals.",path:"/wishlist",index:false});
export default function Page() { return <AccountPage view="wishlist"/>; }
