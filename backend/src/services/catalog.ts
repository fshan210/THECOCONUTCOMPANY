import { commerceCatalog, type ProductListQuery } from "@dotco/contracts";

export type ApiProductVariant = {
  id: string;
  sku: string;
  label: string;
  price: { currency: "INR"; amount: number };
  available: boolean;
};

export type ApiProduct = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  price: { currency: "INR"; amount: number };
  available: boolean;
  variants?: ApiProductVariant[];
};

const catalog: ApiProduct[] = commerceCatalog.map((product) => ({
  id: product.id,
  slug: product.slug,
  title: product.title,
  subtitle: product.subtitle,
  category: product.category,
  price: { currency: "INR", amount: product.amount },
  available: product.available,
  ...(product.variants ? {
    variants: product.variants.map((variant) => ({
      id: variant.id,
      sku: variant.sku,
      label: variant.label,
      price: { currency: "INR", amount: variant.amount },
      available: variant.available
    }))
  } : {})
}));

// Compatibility aliases for the initial API contract. They are not exposed as
// duplicate storefront products.
const { variants: _waterVariants, ...legacyWaterBase } = catalog[0]!;
const legacyProducts = new Map<string, ApiProduct>([
  ["co-water-330", { ...legacyWaterBase, id: "co-water-330", price: { currency: "INR", amount: 12000 } }],
  ["meltco-mango-350", { ...catalog[1]!, id: "meltco-mango-350" }],
  ["toasted-coconut-chips", { id: "toasted-coconut-chips", slug: "co-toasted-coconut-chips", title: ".CO Toasted Coconut Chips 150g", subtitle: "Golden + crisp", category: "food", price: { currency: "INR", amount: 16000 }, available: true }],
  ["body-lotion-200", { ...catalog[8]!, id: "body-lotion-200" }]
]);

export async function listProducts(query: ProductListQuery) {
  const search = query.search?.toLocaleLowerCase("en-IN");
  const filtered = catalog.filter((product) =>
    (!query.category || product.category === query.category) &&
    (!search || `${product.title} ${product.subtitle} ${product.slug}`.toLocaleLowerCase("en-IN").includes(search))
  );
  const sorted = [...filtered].sort((a, b) => {
    if (query.sort === "price-low-high") return a.price.amount - b.price.amount;
    if (query.sort === "price-high-low") return b.price.amount - a.price.amount;
    if (query.sort === "alphabetical") return a.title.localeCompare(b.title);
    return 0;
  });
  return { items: sorted.slice(0, query.limit), nextCursor: null };
}

export async function getProductBySlug(slug: string) {
  return catalog.find((product) => product.slug === slug) ?? null;
}

export function getProductById(id: string) {
  return catalog.find((product) => product.id === id || product.slug === id) ?? legacyProducts.get(id) ?? null;
}

export function resolveCatalogItem(productId: string, variantId?: string) {
  const product = getProductById(productId);
  if (!product || !product.available) return null;
  if (!variantId) return { product, variant: null, unitAmount: product.price.amount };
  const variant = product.variants?.find((candidate) => candidate.id === variantId || candidate.sku === variantId);
  if (!variant || !variant.available) return null;
  return { product, variant, unitAmount: variant.price.amount };
}

export function isKnownProductId(itemId: string) {
  return getProductById(itemId) !== null;
}
