import type { Metadata } from "next";
import { ReferenceHomePage } from "@/components/home/ReferenceHomePage";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getHomepageContent, getProducts } from "@/lib/content/server";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getHomepageContent();
  return createPageMetadata({
    title: seo.title,
    description: seo.description,
    path: seo.canonicalPath,
    absoluteTitle: true,
    index: !seo.noindex,
    ogImage: seo.ogImage
  });
}

export default async function HomePage() {
  const [homepage, products] = await Promise.all([getHomepageContent(), getProducts()]);

  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }]} />
      <ReferenceHomePage homepage={homepage} products={products} />
    </>
  );
}
