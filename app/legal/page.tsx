import { InformationSurface } from "@/components/commerce/InformationSurface";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";
export const metadata = createPageMetadata({
  title: "Legal",
  description: "Review .CO privacy, cookie, and terms information in one clear legal centre, with direct links to each current policy.",
  path: "/legal",
  index: true,
});
export default function Page() {
  return <><StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Legal", path: "/legal" }]}/><InformationSurface slug="legal" /></>;
}
