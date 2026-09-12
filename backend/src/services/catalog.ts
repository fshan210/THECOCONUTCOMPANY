import type { ProductListQuery } from "@dotco/contracts";

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

const waterVariants: ApiProductVariant[] = [100, 200, 500].flatMap((sizeMl) =>
  (["UHT", "RAW"] as const).flatMap((processing) =>
    (["without-pulp", "with-pulp"] as const).map((pulp) => {
      const available = !(sizeMl === 100 && processing === "RAW");
      const rupees = (sizeMl === 100 ? 35 : sizeMl === 200 ? 60 : 135) + (pulp === "with-pulp" ? 5 : 0);
      const sku = `CO-CW-${sizeMl}-${processing}-${pulp === "with-pulp" ? "P" : "NP"}`;
      return {
        id: sku,
        sku,
        label: `${sizeMl}ml · ${processing} · ${pulp === "with-pulp" ? "With pulp" : "Without pulp"}`,
        price: { currency: "INR" as const, amount: rupees * 100 },
        available
      };
    })
  )
);

const catalog: ApiProduct[] = [
  { id: "co-water", slug: "co-water", title: ".CO Water", subtitle: "Chilled bottle", category: "coconut-water", price: { currency: "INR", amount: 6000 }, available: true, variants: waterVariants },
  { id: "melt-co-mango-coconut", slug: "melt-co-mango-coconut", title: "MELT.CO Mango Coconut", subtitle: "Frozen dessert", category: "ice-cream", price: { currency: "INR", amount: 22000 }, available: true },
  { id: "co-kitchen-coconut-oil", slug: "co-kitchen-coconut-oil", title: ".CO Kitchen Coconut Oil", subtitle: "Kitchen staple", category: "food", price: { currency: "INR", amount: 25000 }, available: true },
  { id: "co-kitchen-coconut-flour", slug: "co-kitchen-coconut-flour", title: ".CO Kitchen Coconut Flour", subtitle: "Pantry staple", category: "food", price: { currency: "INR", amount: 18000 }, available: true },
  { id: "co-kitchen-coconut-milk", slug: "co-kitchen-coconut-milk", title: ".CO Kitchen Coconut Milk", subtitle: "Cooking essential", category: "food", price: { currency: "INR", amount: 18000 }, available: true },
  { id: "co-botanica-shampoo", slug: "co-botanica-shampoo", title: ".CO BOTANiCA Coconut Shampoo", subtitle: "Hair care preview", category: "cosmetics", price: { currency: "INR", amount: 39900 }, available: true },
  { id: "co-botanica-face-wash", slug: "co-botanica-face-wash", title: ".CO BOTANiCA Coconut Face Wash", subtitle: "Face care preview", category: "cosmetics", price: { currency: "INR", amount: 39900 }, available: true },
  { id: "co-botanica-hair-serum", slug: "co-botanica-hair-serum", title: ".CO BOTANiCA Coconut Hair Serum", subtitle: "Hair care preview", category: "cosmetics", price: { currency: "INR", amount: 49900 }, available: true },
  { id: "co-botanica-body-moisturizer", slug: "co-botanica-body-moisturizer", title: ".CO BOTANiCA Coconut Body Moisturizer", subtitle: "Body care preview", category: "cosmetics", price: { currency: "INR", amount: 49900 }, available: true }
];

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
