import type { Metadata } from "next";
import { ReferenceAboutPage } from "@/components/about/ReferenceAboutPage";
import { StructuredData } from "@/components/seo/StructuredData";
import { getSeoMetadata } from "@/lib/content/server";
import { createPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("/about");
  return createPageMetadata({
    title: seo?.title || "About .CO",
    description: seo?.description || "Rooted in Kerala and made for living: discover the coconut, people, clean ingredients and zero-waste purpose behind .CO The Coconut Company.",
    path: seo?.canonicalPath || "/about",
    index: !seo?.noindex,
    ogImage: seo?.ogImage,
  });
}

export default function AboutPage() {
  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "About", path: "/about" }]} />
      <ReferenceAboutPage />
    </>
  );
}
