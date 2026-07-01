import type { Metadata } from "next";
import { ReferenceFoundersPage } from "@/components/founders/ReferenceFoundersPage";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getSeoMetadata } from "@/lib/content/server";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("/founders");
  return createPageMetadata({ title: seo?.title || "Founders", description: seo?.description || "Meet the founders building .CO around coconut rituals, taste, and Made for Living warmth.", path: seo?.canonicalPath || "/founders", index: !seo?.noindex, ogImage: seo?.ogImage });
}

export default async function FoundersPage() {
  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Founders", path: "/founders" }]} />
      <ReferenceFoundersPage />
    </>
  );
}
