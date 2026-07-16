import { z } from "zod";

export const roleSchema = z.enum(["CUSTOMER", "SUPPORT", "CONTENT_EDITOR", "OPERATIONS", "ADMIN"]);
export type DotCoRole = z.infer<typeof roleSchema>;

export const envNameSchema = z.enum(["local", "dev", "production"]);
export type DotCoEnvName = z.infer<typeof envNameSchema>;

export const requestIdSchema = z.string().min(8).max(128);

export const apiErrorCodeSchema = z.enum([
  "BAD_REQUEST",
  "UNAUTHORIZED",
  "FORBIDDEN",
  "NOT_FOUND",
  "CONFLICT",
  "RATE_LIMITED",
  "VALIDATION_ERROR",
  "PAYLOAD_TOO_LARGE",
  "INTERNAL_ERROR",
  "SERVICE_UNAVAILABLE"
]);
export type ApiErrorCode = z.infer<typeof apiErrorCodeSchema>;

export const paginationQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).default(20).transform((value) => Math.min(value, 50)),
  cursor: z.string().min(8).max(2048).optional()
});

export const productCategorySchema = z.enum([
  "coconut-water",
  "ice-cream",
  "food",
  "cosmetics",
  "utensils",
  "bundles-gifts"
]);

export const productListQuerySchema = paginationQuerySchema.extend({
  category: productCategorySchema.optional(),
  search: z.string().trim().min(1).max(80).optional(),
  sort: z.enum(["featured", "newest", "price-low-high", "price-high-low", "best-selling", "rating", "alphabetical"]).default("featured")
});

export const slugParamSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).min(2).max(120)
});

const optionalProfileText = (maximum: number) => z.union([z.string().trim().max(maximum), z.literal("")]).optional();

export const mePatchSchema = z.object({
  firstName: optionalProfileText(60),
  lastName: optionalProfileText(60),
  displayName: z.string().trim().min(2).max(80).optional(),
  phone: z.union([z.string().trim().regex(/^\+?[0-9 ()-]{7,20}$/), z.literal("")]).optional(),
  preferredCategory: optionalProfileText(60),
  newsletterOptIn: z.boolean().optional(),
  marketingOptIn: z.boolean().optional(),
  address: z.object({
    line1: optionalProfileText(160),
    line2: optionalProfileText(160),
    city: optionalProfileText(80),
    region: optionalProfileText(80),
    postalCode: optionalProfileText(16),
    country: optionalProfileText(80)
  }).strict().optional()
}).strict();

export const addressIdParamSchema = z.object({
  addressId: z.string().regex(/^[A-Za-z0-9_-]{8,80}$/)
});

export const addressInputSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(20),
  line1: z.string().trim().min(3).max(160),
  line2: z.string().trim().max(160).optional(),
  city: z.string().trim().min(2).max(80),
  region: z.string().trim().min(2).max(80),
  postalCode: z.string().trim().min(3).max(16),
  country: z.string().trim().length(2).default("IN"),
  isDefault: z.boolean().default(false)
}).strict();

export const cartItemInputSchema = z.object({
  productId: z.string().trim().min(2).max(100),
  variantId: z.string().trim().min(2).max(100).optional(),
  quantity: z.number().int().min(1).max(12)
}).strict();

export const cartItemIdParamSchema = z.object({
  itemId: z.string().regex(/^[A-Za-z0-9_-]{8,100}$/)
});

export const wishlistItemInputSchema = z.object({
  productId: z.string().trim().min(2).max(100)
}).strict();

export const savedContentKindSchema = z.enum(["product", "recipe", "journal", "community", "recent"]);
export const savedContentItemSchema = z.object({
  kind: savedContentKindSchema,
  itemId: z.string().trim().min(2).max(120)
}).strict();

export const productIdParamSchema = z.object({
  productId: z.string().trim().min(2).max(100)
});

export const newsletterSubscriptionSchema = z.object({
  email: z.string().trim().email().max(254),
  source: z.string().trim().min(2).max(80).default("website"),
  consent: z.literal(true),
  country: z.string().trim().min(2).max(80).optional(),
  favouriteProduct: z.string().trim().min(2).max(100).optional(),
  interestedCategory: z.string().trim().min(2).max(100).optional(),
  launchCity: z.string().trim().min(2).max(100).optional(),
  honeypot: z.string().max(0).optional()
}).strict();

export const newsletterDeleteSchema = z.object({
  email: z.string().trim().email().max(254)
}).strict();

export const discountClaimSchema = z.object({
  email: z.string().trim().email().max(254),
  idempotencyKey: z.string().trim().min(12).max(120)
}).strict();

export const communitySubmissionSchema = z.object({
  title: z.string().trim().min(4).max(120),
  body: z.string().trim().min(10).max(2000),
  category: z.enum(["recipe", "sustainability", "wellness", "community", "behind-co"]),
  imageUrl: z.string().url().max(2048).optional(),
  honeypot: z.string().max(0).optional()
}).strict();

export const orderPreviewSchema = z.object({
  items: z.array(cartItemInputSchema).min(1).max(24),
  discountCode: z.string().trim().min(4).max(80).optional(),
  shippingAddressId: z.string().trim().min(8).max(80).optional()
}).strict();

export const orderCreateSchema = orderPreviewSchema.extend({
  idempotencyKey: z.string().trim().min(12).max(120)
}).strict();

export type ProductListQuery = z.infer<typeof productListQuerySchema>;
export type AddressInput = z.infer<typeof addressInputSchema>;
export type CartItemInput = z.infer<typeof cartItemInputSchema>;
export type MePatchInput = z.infer<typeof mePatchSchema>;
export type SavedContentKind = z.infer<typeof savedContentKindSchema>;
export type NewsletterSubscriptionInput = z.infer<typeof newsletterSubscriptionSchema>;
export type OrderPreviewInput = z.infer<typeof orderPreviewSchema>;
