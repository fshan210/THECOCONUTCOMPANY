import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";
import type { ContentType } from "@/lib/content/types";

const pathsByType: Record<ContentType, string[]> = {
  products: ["/", "/shop"],
  recipes: ["/", "/recipes"],
  journal: ["/journal"],
  testimonials: ["/"],
  homepage: ["/"],
  seo: ["/", "/shop", "/recipes", "/journal", "/about", "/founders", "/sustainability"]
};

export function revalidateContent(type: ContentType, slug?: string) {
  revalidateTag("content");
  revalidateTag(`content:${type}`);
  pathsByType[type].forEach((path) => revalidatePath(path));
  if (type === "products" && slug) revalidatePath(`/shop/${slug}`);
}
