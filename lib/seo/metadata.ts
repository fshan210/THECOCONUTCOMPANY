import type { Metadata } from "next";

export const siteUrl = "https://cothecoconutcompany.com";
export const siteName = ".CO The Coconut Company";
export const defaultDescription = "A modern coconut-origin lifestyle brand. Made for Living.";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  index?: boolean;
  follow?: boolean;
  ogImage?: string;
  canonical?: boolean;
};

export function normalizeCanonicalPath(path: string) {
  const parsed = new URL(path || "/", siteUrl);
  const pathname = parsed.pathname.replace(/\/{2,}/g, "/").replace(/\/$/, "") || "/";
  return pathname;
}

export function absoluteCanonicalUrl(path: string) {
  return new URL(normalizeCanonicalPath(path), siteUrl).toString();
}

export function createPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  index = true,
  follow = index,
  ogImage = "/opengraph-image",
  canonical = true,
}: PageMetadataInput): Metadata {
  const canonicalPath = normalizeCanonicalPath(path);
  const url = absoluteCanonicalUrl(canonicalPath);
  const socialTitle = absoluteTitle ? title : `${title} | ${siteName}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: canonical ? { canonical: canonicalPath } : undefined,
    openGraph: {
      title: socialTitle,
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
      title: socialTitle,
      description,
      images: [ogImage]
    },
    robots: index
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        }
      : {
          index: false,
          follow,
          noarchive: true,
          googleBot: { index: false, follow, noarchive: true },
        },
  };
}

export function createNotFoundMetadata(): Metadata {
  return createPageMetadata({
    title: "Page not found",
    description: "The requested .CO page could not be found.",
    path: "/404",
    absoluteTitle: true,
    index: false,
    follow: false,
    canonical: false,
  });
}
