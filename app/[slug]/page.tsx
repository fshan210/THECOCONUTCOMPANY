import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UtilityPage } from "@/components/launch/UtilityPage";
import { launchPages, launchPageSlugs } from "@/lib/launch-pages";
import { createPageMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return launchPageSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = launchPages[slug];
  if (!page) return {};
  return createPageMetadata({ title: page.title, description: page.intro, path: `/${slug}`, index: !["cart", "checkout", "track-order", "search"].includes(slug) });
}

export default async function LaunchUtilityRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = launchPages[slug];
  if (!page) notFound();
  return <UtilityPage page={page} />;
}
