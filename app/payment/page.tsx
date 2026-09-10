import { CheckoutSurface } from "@/components/commerce/CheckoutSurface";
import { createPageMetadata } from "@/lib/seo/metadata";
export const metadata = createPageMetadata({
  title: "Payment",
  description: "Current .CO information and guidance.",
  path: "/payment",
  index: false,
});
export default function Page() {
  return <CheckoutSurface payment />;
}
