import { InformationSurface } from "@/components/commerce/InformationSurface";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";
export const metadata = createPageMetadata({
  title: "Shipping Returns",
  description: "Find current .CO guidance on delivery coverage, shipping timelines, returns, damaged items, and refund support.",
  path: "/shipping-returns",
  index: true,
});
export default function Page() {
  return <><StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Shipping and returns", path: "/shipping-returns" }]}/><InformationSurface slug="shipping-returns" /></>;
}
