import { AccountPage } from "@/components/account/AccountPage";
import { createPageMetadata } from "@/lib/seo/metadata";
export const metadata = createPageMetadata({title:"Saved Addresses",description:"Your personal .CO account, favourites and everyday rituals.",path:"/account/addresses",index:false});
export default function Page() { return <AccountPage view="addresses"/>; }
