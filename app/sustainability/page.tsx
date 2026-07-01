import type { Metadata } from "next";
import { ReferenceSustainabilityPage } from "@/components/sustainability/ReferenceSustainabilityPage";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getSeoMetadata } from "@/lib/content/server";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("/sustainability");
  return createPageMetadata({ title: seo?.title || "Sustainability", description: seo?.description || "A simple sustainability mindset for coconut sourcing, ingredients, and everyday product use.", path: seo?.canonicalPath || "/sustainability", index: !seo?.noindex, ogImage: seo?.ogImage });
}

export default function SustainabilityPage() {
  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Sustainability", path: "/sustainability" }]} />
      <ReferenceSustainabilityPage />
    </>
  );
}
