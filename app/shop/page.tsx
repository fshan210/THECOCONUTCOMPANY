import type { Metadata } from "next";
import { ReferenceShopPage } from "@/components/shop/ReferenceShopPage";
import { StructuredData } from "@/components/seo/StructuredData";
import { getSeoMetadata } from "@/lib/content/server";
import { createPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("/shop");
  return createPageMetadata({
    title: seo?.title || "Shop .CO",
    description: seo?.description || "Shop premium .CO coconut water, kitchen, care and lifestyle products.",
    path: seo?.canonicalPath || "/shop",
    index: !seo?.noindex,
    ogImage: seo?.ogImage,
  });
}

export default function ShopPage() {
  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Shop", path: "/shop" }]} />
      <ReferenceShopPage />
    </>
  );
}
