import { breadcrumbSchema, organizationSchema, websiteSchema } from "@/lib/seo/structured-data";

type StructuredDataProps = {
  breadcrumbs?: Array<{ name: string; path: string }>;
};

export function StructuredData({ breadcrumbs }: StructuredDataProps) {
  const schemas: Record<string, unknown>[] = [organizationSchema(), websiteSchema()];

  if (breadcrumbs?.length) {
    schemas.push(breadcrumbSchema(breadcrumbs));
  }

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
    />
  );
}
