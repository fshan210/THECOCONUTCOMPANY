import type { Metadata } from "next";

export const siteUrl = "https://cothecoconutcompany.com";
export const siteName = ".CO | The Coconut Company";
export const defaultDescription = "A modern coconut-origin lifestyle brand. Made for Living.";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  index?: boolean;
};

export function createPageMetadata({ title, description, path, absoluteTitle = false, index = true }: PageMetadataInput): Metadata {
  const url = `${siteUrl}${path}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: path
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: siteName
        }
      ],
      locale: "en_US",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"]
    },
    robots: index ? undefined : { index: false, follow: false, noarchive: true }
  };
}
