import { siteUrl } from "@/lib/seo/metadata";

export const indexableStaticRoutes = [
  "/",
  "/about",
  "/careers",
  "/community",
  "/contact",
  "/cookie-policy",
  "/faqs",
  "/founders",
  "/journal",
  "/journal/social-cocreation-hub",
  "/legal",
  "/privacy-policy",
  "/recipes",
  "/refund-policy",
  "/returns",
  "/shipping-delivery",
  "/shipping-returns",
  "/shop",
  "/support",
  "/sustainability",
  "/terms-and-conditions",
] as const;

export const noindexRoutePrefixes = [
  "/account",
  "/admin",
  "/api",
  "/cart",
  "/checkout",
  "/email-verified",
  "/forgot-password",
  "/login",
  "/offline",
  "/orders",
  "/payment",
  "/profile",
  "/register",
  "/reset-password",
  "/saved-recipes",
  "/search",
  "/status",
  "/track-order",
  "/verify-email",
  "/wishlist",
] as const;

type PublicRecord = { slug: string; publicationStatus?: string };

export function buildSitemapUrls(products: PublicRecord[], recipes: PublicRecord[]) {
  const dynamicRoutes = [
    ...products.filter(isPublished).map((product) => `/shop/${product.slug}`),
    ...recipes.filter(isPublished).map((recipe) => `/recipes/${recipe.slug}`),
  ];

  return Array.from(new Set<string>([...indexableStaticRoutes, ...dynamicRoutes]))
    .sort((left, right) => left.localeCompare(right))
    .map((route) => ({
      url: new URL(route, siteUrl).toString(),
      changeFrequency: route === "/" ? "weekly" as const : "monthly" as const,
      priority: route === "/" ? 1 : ["/shop", "/recipes", "/journal"].includes(route) ? 0.9 : route.startsWith("/shop/") || route.startsWith("/recipes/") ? 0.8 : 0.7,
    }));
}

function isPublished(record: PublicRecord) {
  return record.publicationStatus === undefined || record.publicationStatus === "published";
}
