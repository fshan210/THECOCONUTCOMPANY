import type { Metadata } from "next";
import { ReferenceShopPage } from "@/components/shop/ReferenceShopPage";
import { StructuredData } from "@/components/seo/StructuredData";
import { getProducts, getSeoMetadata } from "@/lib/content/server";
import { createPageMetadata } from "@/lib/seo/metadata";
import { collectionPageSchema } from "@/lib/seo/structured-data";

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

export default async function ShopPage() {
  const products = await getProducts();
  return (
    <>
      <link rel="preload" as="image" href="/assets/products/shop-hero/v1/mobile/co-product-ecosystem-v1.webp" media="(max-width: 767px)" fetchPriority="high" />
      <StructuredData
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Shop", path: "/shop" }]}
        extra={[collectionPageSchema({
          name: "Shop .CO coconut products",
          description: "Explore .CO coconut water, kitchen, care and lifestyle products.",
          path: "/shop",
          items: products.map((product) => ({
            name: product.name,
            description: product.shortDescription,
            image: product.image,
            path: `/shop/${product.slug}`,
          })),
        })]}
      />
      <ReferenceShopPage contentProducts={products} />
    </>
  );
}
