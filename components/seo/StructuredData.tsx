import { breadcrumbSchema, organizationSchema, siteNavigationSchema, websiteSchema } from "@/lib/seo/structured-data";

type StructuredDataProps = {
  breadcrumbs?: Array<{ name: string; path: string }>;
  extra?: Record<string, unknown>[];
  includeGlobal?: boolean;
};

export function StructuredData({ breadcrumbs, extra = [], includeGlobal = false }: StructuredDataProps) {
  const schemas: Record<string, unknown>[] = includeGlobal ? [organizationSchema(), websiteSchema(), siteNavigationSchema()] : [];

  if (breadcrumbs?.length) {
    schemas.push(breadcrumbSchema(breadcrumbs));
  }

  schemas.push(...extra);

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
    />
  );
}
