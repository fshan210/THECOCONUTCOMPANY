import { breadcrumbSchema, organizationSchema, websiteSchema } from "@/lib/seo/structured-data";

type StructuredDataProps = {
  breadcrumbs?: Array<{ name: string; path: string }>;
  extra?: Record<string, unknown>[];
};

export function StructuredData({ breadcrumbs, extra = [] }: StructuredDataProps) {
  const schemas: Record<string, unknown>[] = [organizationSchema(), websiteSchema()];

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
