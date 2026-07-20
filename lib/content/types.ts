import type { ImpactCounterConfig } from "./impact";

export type PublicationStatus = "draft" | "published";

export type ContentSeo = {
  title: string;
  description: string;
  canonicalPath: string;
  ogImage?: string;
  noindex?: boolean;
};

export type ContentProduct = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: string;
  format: string;
  status: "coming-soon" | "preview";
  shortDescription: string;
  longDescription: string;
  price?: number;
  currency: string;
  availability: string;
  availabilityStatus: "preview" | "coming-soon" | "in-stock" | "out-of-stock";
  comingSoon: boolean;
  image: string;
  images: string[];
  hoverImage?: string;
  ingredients: string[];
  nutritionHighlights: string[];
  benefits: string[];
  howToUse: string[];
  seo: ContentSeo;
  structuredData?: Record<string, unknown>;
  publicationStatus: PublicationStatus;
  featured: boolean;
};

export type ContentRecipe = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  ingredients: string[];
  steps: string[];
  prepTime: string;
  cookTime: string;
  servings: string;
  time: string;
  difficulty: "Easy" | "Medium";
  nutrition: string;
  image: string;
  relatedProduct: string;
  product: string;
  seo: ContentSeo;
  publicationStatus: PublicationStatus;
  featured: boolean;
};

export type ContentJournalPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  author: string;
  image: string;
  publishedDate: string;
  date: string;
  readTime: string;
  seo: ContentSeo;
  publicationStatus: PublicationStatus;
  featured: boolean;
};

export type ContentTestimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  rating?: number;
  source: string;
  featured: boolean;
  publicationStatus: PublicationStatus;
};

export type HomepageTrustBadge = {
  title: string;
  body: string;
  icon: "leaf" | "drop" | "cold" | "palm";
};

export type HomepageContent = {
  id: "homepage";
  heroEyebrow: string;
  heroHeadline: string[];
  heroSubheadline: string;
  heroCtaText: string;
  heroCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  trustBadges: HomepageTrustBadge[];
  groveStages: string[];
  featuredProductSlugs: string[];
  featuredRecipeSlugs: string[];
  featuredTestimonialIds: string[];
  impactCounters?: ImpactCounterConfig;
  seo: ContentSeo;
  publicationStatus: PublicationStatus;
};

export type SeoMetadataContent = ContentSeo & {
  id: string;
  pagePath: string;
  structuredDataOverride?: Record<string, unknown>;
  publicationStatus: PublicationStatus;
};

export type MediaContent = {
  id: string;
  url: string;
  alt: string;
  type: "image" | "video" | "document";
  usage: string[];
  credit?: string;
  license?: string;
};

export type ContentType = "products" | "recipes" | "journal" | "testimonials" | "homepage" | "seo";

export type ContentRecord =
  | ContentProduct
  | ContentRecipe
  | ContentJournalPost
  | ContentTestimonial
  | HomepageContent
  | SeoMetadataContent;
