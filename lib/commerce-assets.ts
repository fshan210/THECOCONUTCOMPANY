import { transparentProductAssets } from "@/lib/website-assets";
const cutoutIds: Record<string, string> = {
  "co-water": "water",
  "co-kitchen-coconut-oil": "kitchen-oil",
  "co-kitchen-coconut-milk": "kitchen-milk",
  "co-kitchen-coconut-flour": "kitchen-flour",
  "melt-co-mango-coconut": "melt",
  "co-botanica-shampoo": "botanica-shampoo",
  "co-botanica-face-wash": "botanica-face-wash",
  "co-botanica-hair-serum": "botanica-hair-serum",
  "co-botanica-body-moisturizer": "botanica-moisturizer",
};
export function commerceProductImage(slug: string, fallback: string) {
  return transparentProductAssets[cutoutIds[slug]]?.src ?? fallback;
}
