import { StructuredData } from "@/components/seo/StructuredData";
import { InformationSurface } from "@/components/commerce/InformationSurface";
import { createPageMetadata } from "@/lib/seo/metadata";
export const metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contact .CO for product interest, retail conversations, and coconut brand updates.",
  path: "/contact",
});
export default function ContactPage() {
  return (
    <>
      <StructuredData
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />
      <InformationSurface slug="contact" />
    </>
  );
}
