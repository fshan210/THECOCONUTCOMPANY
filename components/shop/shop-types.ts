import type { ProductGalleryAsset } from "@/lib/website-assets";

export type ShopViewProduct = {
  slug: string;
  cartSlug: string;
  name: string;
  subtitle: string;
  category: string;
  price: number;
  currency?: string;
  status?: "coming-soon" | "preview";
  availabilityStatus?: "preview" | "coming-soon" | "in-stock" | "out-of-stock";
  featured?: boolean;
  format?: string;
  badge?: "Featured" | "Bestseller" | "New" | "Limited";
  image: string;
  gallery?: ProductGalleryAsset[];
  collection: string[];
  description: string;
  benefits: string[];
  nutrition: string;
};
