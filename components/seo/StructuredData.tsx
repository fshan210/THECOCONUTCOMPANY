import { breadcrumbSchema, organizationSchema, websiteSchema } from "@/lib/seo/structured-data";

type StructuredDataProps = {
  breadcrumbs?: Array<{ name: string; path: string }>;
  extra?: Record<string, unknown>[];
  includeGlobal?: boolean;
};

export function StructuredData({ breadcrumbs, extra = [], includeGlobal = false }: StructuredDataProps) {
  const schemas: Record<string, unknown>[] = includeGlobal ? [organizationSchema(), websiteSchema()] : [];

  if (breadcrumbs?.length) {
    schemas.push(breadcrumbSchema(breadcrumbs));
  }

  schemas.push(...extra);

  if (!schemas.length) return null;

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(schemas) }}
    />
  );
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
