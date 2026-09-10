import { InformationSurface } from "@/components/commerce/InformationSurface";
import { createPageMetadata } from "@/lib/seo/metadata";
export const metadata = createPageMetadata({
  title: "Shipping Returns",
  description: "Current .CO information and guidance.",
  path: "/shipping-returns",
  index: true,
});
export default function Page() {
  return <InformationSurface slug="shipping-returns" />;
}
