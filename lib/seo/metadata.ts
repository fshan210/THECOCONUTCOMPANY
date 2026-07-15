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
  ogImage?: string;
};

export function createPageMetadata({ title, description, path, absoluteTitle = false, index = true, ogImage = "/opengraph-image" }: PageMetadataInput): Metadata {
  const url = `${siteUrl}${path}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: path,
      languages: {
        "en-IN": path,
        "x-default": path
      }
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: siteName
        }
      ],
      locale: "en_IN",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage]
    },
    robots: index ? undefined : { index: false, follow: false, noarchive: true }
  };
}
