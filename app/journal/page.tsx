import type { Metadata } from "next";
import { ReferenceJournalPage } from "@/components/journal/ReferenceJournalPage";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";
import { collectionPageSchema } from "@/lib/seo/structured-data";
import { getJournalPosts, getSeoMetadata } from "@/lib/content/server";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("/journal");
  return createPageMetadata({ title: seo?.title || "Journal", description: seo?.description || "Editorial notes on coconut culture, taste, recipes, product thinking, and Made for Living.", path: seo?.canonicalPath || "/journal", index: !seo?.noindex, ogImage: seo?.ogImage });
}

export default async function JournalPage() {
  const journalEntries = await getJournalPosts();
  return (
    <>
      <StructuredData
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Journal", path: "/journal" }]}
        extra={[
          collectionPageSchema({
            name: ".CO Journal",
            description: "Editorial notes on coconut culture, taste, recipes, product thinking, and Made for Living.",
            path: "/journal",
            items: journalEntries.map((entry) => ({
              name: entry.title,
              description: entry.excerpt,
              image: entry.image
            }))
          })
        ]}
      />
      <ReferenceJournalPage />
    </>
  );
}
