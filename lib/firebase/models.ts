import type { AdminRole } from "@/lib/admin/rbac";

export type TimestampLike = Date | string | number;

export type BaseDocument = {
  id?: string;
  createdAt: TimestampLike;
  updatedAt: TimestampLike;
};

export type UserDocument = BaseDocument & {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
  emailVerified: boolean;
  accountStatus: "pending" | "active" | "suspended" | "deleted";
  status?: "active" | "suspended" | "deleted";
  newsletterOptIn: boolean;
  preferredCategory?: string;
  verifiedAt?: TimestampLike | null;
  lastLogin?: TimestampLike;
  lastLoginAt?: TimestampLike;
};

export type AdminDocument = BaseDocument & {
  uid: string;
  email: string;
  displayName: string;
  role: AdminRole;
  permissions: string[];
  status: "active" | "suspended";
  lastLoginAt?: TimestampLike;
};

export type ProductDocument = BaseDocument & {
  name: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  images: string[];
  variants: Array<{ name: string; sku: string; available: boolean }>;
  nutrition?: Record<string, string>;
  ingredients?: string[];
  featured: boolean;
  homepage: boolean;
  seo: SeoMetadata;
};

export type RecipeDocument = BaseDocument & {
  title: string;
  slug: string;
  description: string;
  image: string;
  ingredients: string[];
  steps: string[];
  productSlugs: string[];
  status: "draft" | "published";
  seo: SeoMetadata;
};

export type JournalDocument = BaseDocument & {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  author: string;
  coverImage?: string;
  status: "draft" | "published";
  seo: SeoMetadata;
};

export type NewsletterDocument = BaseDocument & {
  email: string;
  name?: string;
  source: string;
  subscribed: boolean;
  preferences: string[];
};

export type WishlistDocument = BaseDocument & {
  userId: string;
  productSlugs: string[];
  recipeSlugs: string[];
};

export type OrderDocument = BaseDocument & {
  userId: string;
  status: "draft" | "reserved" | "paid" | "fulfilled" | "cancelled";
  items: Array<{ productSlug: string; quantity: number }>;
  total?: number;
  currency?: string;
};

export type ActivityLogDocument = BaseDocument & {
  actorId: string;
  actorEmail: string;
  action: string;
  area: string;
  metadata?: Record<string, string | number | boolean>;
};

export type AuditLogDocument = {
  id?: string;
  adminUid: string;
  adminEmail: string;
  adminRole: AdminRole | string;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  before?: unknown;
  after?: unknown;
  ipAddress?: string;
  userAgent?: string;
  createdAt: TimestampLike;
};

export type SecurityEventDocument = {
  id?: string;
  actorId?: string | null;
  actorEmail?: string | null;
  action: string;
  area: "customer_auth" | "admin_auth" | "forms" | "rate_limit" | "system";
  outcome: "allowed" | "blocked" | "failed" | "skipped";
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, string | number | boolean | null>;
  createdAt: TimestampLike;
};

export type RoleDocument = BaseDocument & {
  name: AdminRole | string;
  permissions: string[];
  description?: string;
};

export type PermissionDocument = BaseDocument & {
  key: string;
  label: string;
  area: string;
};

export type BrandAssetDocument = BaseDocument & {
  name: string;
  type: "logo" | "icon" | "doodle" | "illustration" | "pattern" | "font" | "image" | "packaging" | "3d" | "animation";
  url: string;
  thumbnailUrl?: string;
  tags: string[];
};

export type SettingsDocument = BaseDocument & {
  key: string;
  value: unknown;
  area: "brand" | "seo" | "analytics" | "navigation" | "footer" | "feature";
};

export type MediaLibraryDocument = BaseDocument & {
  name: string;
  url: string;
  thumbnailUrl?: string;
  folder: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  tags: string[];
  usage: string[];
  uploadedBy: string;
};

export type ContactFormDocument = BaseDocument & {
  name: string;
  email: string;
  company?: string;
  message: string;
  source: string;
  status: "new" | "reviewed" | "closed";
};

export type SeoMetadata = {
  title: string;
  description: string;
  canonical?: string;
  openGraphImage?: string;
  noindex?: boolean;
};
