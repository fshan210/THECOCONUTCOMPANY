import { InformationSurface } from "@/components/commerce/InformationSurface";
import { createPageMetadata } from "@/lib/seo/metadata";
export const metadata = createPageMetadata({
  title: "Legal",
  description: "Current .CO information and guidance.",
  path: "/legal",
  index: true,
});
export default function Page() {
  return <InformationSurface slug="legal" />;
}
