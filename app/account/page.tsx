import { AccountPage } from "@/components/account/AccountPage";
import { createPageMetadata } from "@/lib/seo/metadata";
export const metadata = createPageMetadata({title:"Account",description:"Your personal .CO account, favourites and everyday rituals.",path:"/account",index:false});
export default function Page() { return <AccountPage view="overview"/>; }
