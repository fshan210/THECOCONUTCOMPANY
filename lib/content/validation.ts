import { z } from "zod";
import type { ContentRecord, ContentType } from "@/lib/content/types";

const publicationStatus = z.enum(["draft", "published"]);
const seoSchema = z.object({
  title: z.string().max(120),
  description: z.string().max(320),
  canonicalPath: z.string().startsWith("/"),
  ogImage: z.string().optional(),
  noindex: z.boolean().optional()
});
const base = { id: z.string().min(1).max(160), publicationStatus };

export const contentSchemas = {
  products: z.object({
    ...base,
    slug: z.string().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    name: z.string().min(1).max(120), subtitle: z.string().max(160), category: z.string().min(1).max(80), format: z.string().max(80),
    status: z.enum(["coming-soon", "preview"]), shortDescription: z.string().min(1).max(320), longDescription: z.string().max(5000),
    price: z.number().nonnegative().optional(), currency: z.string().length(3), availability: z.string().max(500),
    availabilityStatus: z.enum(["preview", "coming-soon", "in-stock", "out-of-stock"]), comingSoon: z.boolean(),
    image: z.string().min(1), images: z.array(z.string()), hoverImage: z.string().optional(), ingredients: z.array(z.string()),
    nutritionHighlights: z.array(z.string()), benefits: z.array(z.string()), howToUse: z.array(z.string()), seo: seoSchema,
    structuredData: z.record(z.string(), z.unknown()).optional(), featured: z.boolean()
  }),
  recipes: z.object({
    ...base,
    slug: z.string().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), title: z.string().min(1).max(140), category: z.string().min(1).max(80),
    description: z.string().min(1).max(600), ingredients: z.array(z.string()), steps: z.array(z.string()), prepTime: z.string().max(60), cookTime: z.string().max(60),
    servings: z.string().max(60), time: z.string().max(60), difficulty: z.enum(["Easy", "Medium"]), nutrition: z.string().max(160), image: z.string().min(1),
    relatedProduct: z.string().max(120), product: z.string().max(120), seo: seoSchema, featured: z.boolean()
  }),
  journal: z.object({
    ...base,
    slug: z.string().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), title: z.string().min(1).max(160), excerpt: z.string().min(1).max(600),
    body: z.string().max(30000), category: z.string().min(1).max(80), author: z.string().max(120), image: z.string().min(1),
    publishedDate: z.string().max(80), date: z.string().max(80), readTime: z.string().max(40), seo: seoSchema, featured: z.boolean()
  }),
  testimonials: z.object({
    ...base,
    quote: z.string().min(1).max(1000), name: z.string().min(1).max(120), role: z.string().max(120), rating: z.number().min(1).max(5).optional(),
    source: z.string().min(1).max(200), featured: z.boolean()
  }),
  homepage: z.object({
    ...base,
    id: z.literal("homepage"), heroEyebrow: z.string().min(1).max(160), heroHeadline: z.array(z.string().min(1).max(80)).min(1).max(6), heroSubheadline: z.string().min(1).max(500),
    heroCtaText: z.string().min(1).max(80), heroCtaLink: z.string().startsWith("/"), secondaryCtaText: z.string().min(1).max(80), secondaryCtaLink: z.string().startsWith("/"),
    trustBadges: z.array(z.object({ title: z.string(), body: z.string(), icon: z.enum(["leaf", "drop", "cold", "palm"]) })).max(6),
    groveStages: z.array(z.string()), featuredProductSlugs: z.array(z.string()), featuredRecipeSlugs: z.array(z.string()), featuredTestimonialIds: z.array(z.string()),
    impactCounters: z.object({ heading: z.string().min(1), metrics: z.array(z.object({ id: z.string().min(1), label: z.string().min(1), startValue: z.number(), endValue: z.number(), prefix: z.string().optional(), suffix: z.string().optional(), sourceNote: z.string().min(1), sourceUrl: z.string().url().optional(), status: z.enum(["verified", "estimate", "target"]), lastReviewed: z.string().min(1), enabled: z.boolean() })).max(6) }).optional(), seo: seoSchema
  }),
  seo: z.object({
    ...base,
    pagePath: z.string().startsWith("/"), title: z.string().min(1).max(120), description: z.string().min(1).max(320), canonicalPath: z.string().startsWith("/"),
    ogImage: z.string().optional(), noindex: z.boolean().optional(), structuredDataOverride: z.record(z.string(), z.unknown()).optional()
  })
} as const;

export function validateContentRecord(type: ContentType, value: unknown): ContentRecord | null {
  const parsed = contentSchemas[type].safeParse(value);
  return parsed.success ? parsed.data as ContentRecord : null;
}
