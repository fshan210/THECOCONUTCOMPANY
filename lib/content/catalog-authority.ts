import { commerceCatalog } from "@dotco/contracts";
import type { ContentProduct } from "@/lib/content/types";

/**
 * CMS owns product presentation. The shared commerce contract owns every field
 * used to identify, price, or decide whether a product can enter the cart.
 */
export function projectStorefrontCatalog(fallback: ContentProduct[], dynamic: ContentProduct[]) {
  const merged = new Map(fallback.map((product) => [product.id, product]));
  for (const product of dynamic) merged.set(product.id, product);

  return commerceCatalog.flatMap((authority) => {
    const content = merged.get(authority.id);
    if (!content || content.publicationStatus !== "published") return [];
    return [{
      ...content,
      id: authority.id,
      slug: authority.slug,
      name: authority.title,
      subtitle: authority.subtitle,
      category: authority.categoryLabel,
      format: authority.subtitle,
      status: authority.storefrontStatus,
      price: authority.amount / 100,
      currency: "INR",
      availabilityStatus: authority.storefrontStatus,
      comingSoon: authority.storefrontStatus === "coming-soon"
    } satisfies ContentProduct];
  });
}
