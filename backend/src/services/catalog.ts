import type { ProductListQuery } from "@dotco/contracts";

export type ApiProduct = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  price: { currency: "INR"; amount: number };
  available: boolean;
};

const catalog: ApiProduct[] = [
  { id: "co-water-330", slug: "co-coconut-water-330ml", title: ".CO Coconut Water 330ml", subtitle: "100% Organic", category: "coconut-water", price: { currency: "INR", amount: 12000 }, available: true },
  { id: "meltco-mango-350", slug: "meltco-mango-coconut-ice-cream", title: "Melt.CO Mango + Coconut Ice Cream 350ml", subtitle: "Coconut + Mango", category: "ice-cream", price: { currency: "INR", amount: 22000 }, available: true },
  { id: "toasted-coconut-chips", slug: "co-toasted-coconut-chips", title: ".CO Toasted Coconut Chips 150g", subtitle: "Golden + crisp", category: "food", price: { currency: "INR", amount: 16000 }, available: true },
  { id: "body-lotion-200", slug: "co-coconut-body-lotion", title: ".CO Coconut Body Lotion 200ml", subtitle: "Coconut botanical care", category: "cosmetics", price: { currency: "INR", amount: 49900 }, available: true }
];

export async function listProducts(query: ProductListQuery) {
  const filtered = catalog.filter((product) => !query.category || product.category === query.category);
  return {
    items: filtered.slice(0, query.limit),
    nextCursor: null
  };
}

export async function getProductBySlug(slug: string) {
  return catalog.find((product) => product.slug === slug) ?? null;
}
