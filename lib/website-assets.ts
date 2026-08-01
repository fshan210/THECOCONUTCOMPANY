import manualAvailabilityJson from "@/lib/generated/manual-asset-availability.json";
import assetManifest from "@/public/brand-reference/asset-manifest.json";

export type AssetStatus = "existing" | "mapped" | "awaiting-manual" | "integrated" | "approved";

export type ResponsiveWebsiteAsset = {
  desktop: string;
  mobile: string;
  fallbackDesktop: string;
  fallbackMobile: string;
  alt: string;
  width: number;
  height: number;
  mobileWidth: number;
  mobileHeight: number;
  status: AssetStatus;
};

export type ProductGalleryAsset = { src: string; alt: string; view: string; width: number; height: number };
export type ProductGallery = { name: string; family: string; primary: string; gallery: ProductGalleryAsset[] };
export type WebsiteEditorialAsset = ResponsiveWebsiteAsset & { route: string; section: string };
export type SingleWebsiteAsset = { src: string; fallback: string; alt: string; status: AssetStatus };

const availability = manualAvailabilityJson as Record<string, boolean>;

export function resolveWebsiteAsset(asset: ResponsiveWebsiteAsset) {
  const desktop = availability[asset.desktop] ? asset.desktop : asset.fallbackDesktop;
  const mobile = availability[asset.mobile] ? asset.mobile : asset.fallbackMobile;
  if (process.env.NODE_ENV === "development") {
    if (!availability[asset.desktop]) console.info(`[website-assets] Manual desktop asset pending: ${asset.desktop}`);
    if (!availability[asset.mobile]) console.info(`[website-assets] Manual mobile asset pending: ${asset.mobile}`);
  }
  return { ...asset, desktop, mobile, usingManualDesktop: Boolean(availability[asset.desktop]), usingManualMobile: Boolean(availability[asset.mobile]) };
}

export function resolveSingleWebsiteAsset(asset: SingleWebsiteAsset) {
  return { ...asset, src: availability[asset.src] ? asset.src : asset.fallback, usingManual: Boolean(availability[asset.src]) };
}

const responsive = (manualBase: string, fallbackDesktop: string, fallbackMobile: string, alt: string, ratio: "hero" | "transition" = "transition"): ResponsiveWebsiteAsset => ({
  desktop: `${manualBase}_DESKTOP_MASTER.webp`,
  mobile: `${manualBase}_MOBILE_MASTER.webp`,
  fallbackDesktop,
  fallbackMobile,
  alt,
  width: 2400,
  height: ratio === "hero" ? 1350 : 1200,
  mobileWidth: ratio === "hero" ? 1800 : 1600,
  mobileHeight: ratio === "hero" ? 2400 : 2000,
  status: "awaiting-manual",
});

const websiteProducts = assetManifest.websiteProducts as Record<string, { name: string; family: string; primary: string | null; gallery: ProductGalleryAsset[] }>;

export const productGalleries = Object.fromEntries(Object.entries(websiteProducts).map(([id, product]) => [id, { ...product, primary: product.primary ?? product.gallery[0]?.src ?? "/assets/branding/made-for-living-reference.png" }])) as Record<string, ProductGallery>;

const journey = [
  ["01", "it_all_started", "/images/website/about/timeline/CO_WEBSITE_ABOUT_TIMELINE_01_it_all_started_MASTER.webp", "Warm coconut-origin materials marking the beginning of .CO."],
  ["02", "building_the_foundation", "/images/website/about/timeline/CO_WEBSITE_ABOUT_TIMELINE_02_building_the_foundation_MASTER.webp", "Coconut sourcing and planning materials for the .CO foundation milestone."],
  ["03", "first_product_direction", "/images/website/about/timeline/CO_WEBSITE_ABOUT_TIMELINE_03_first_product_direction_MASTER.webp", ".CO coconut water representing the first product direction."],
  ["04", "growing_the_ecosystem", "/images/website/about/timeline/CO_WEBSITE_ABOUT_TIMELINE_04_growing_the_ecosystem_MASTER.webp", ".CO product families representing a growing coconut ecosystem."],
  ["05", "rooted_partnerships", "/images/website/about/timeline/CO_WEBSITE_ABOUT_TIMELINE_05_rooted_partnerships_MASTER.webp", "Kerala and Pollachi sourcing materials representing rooted partnerships."],
  ["06", "made_for_living", "/images/website/about/timeline/CO_WEBSITE_ABOUT_TIMELINE_06_made_for_living_MASTER.webp", ".CO products arranged for everyday living."],
] as const;

const journeyAssets = journey.map(([order, slug, fallback, alt]) => resolveWebsiteAsset(responsive(
  `/images/website/manual/about/journey/CO_WEBSITE_ABOUT_JOURNEY_${order}_${slug}`,
  fallback,
  fallback,
  alt,
)));

const productPrimary = (id: string, neutral = "/assets/branding/made-for-living-reference.png") => productGalleries[id]?.primary ?? neutral;

export const websiteAssets = {
  home: {
    hero: responsive(
      "/images/website/manual/home/hero/CO_WEBSITE_HOME_ECOSYSTEM_HERO",
      "/images/website/home/hero/CO_WEBSITE_HOME_HERO_DESKTOP_MASTER.webp",
      "/images/website/home/hero/CO_WEBSITE_HOME_HERO_MOBILE_MASTER.webp",
      ".CO product ecosystem arranged in warm natural light.",
      "hero",
    ),
    transitions: {
      origin: responsive("/images/website/manual/home/transitions/CO_WEBSITE_TRANSITION_ORIGIN", "/images/website/home/transitions/CO_WEBSITE_TRANSITION_ORIGIN_DESKTOP_MASTER.webp", "/images/website/home/transitions/CO_WEBSITE_TRANSITION_ORIGIN_MOBILE_MASTER.webp", "Kerala coconut origin and the path to a modern .CO product."),
      water: responsive("/images/website/manual/home/transitions/CO_WEBSITE_TRANSITION_WATER", "/brand-reference/coconut-water/dotco-coconut-water-lifestyle-master-v1.png", "/brand-reference/coconut-water/dotco-home-hero-coconut-water-mobile-master-v1.png", ".CO coconut water in a calm everyday setting."),
      kitchen: responsive("/images/website/manual/home/transitions/CO_WEBSITE_TRANSITION_KITCHEN", "/images/website/home/transitions/CO_WEBSITE_TRANSITION_KITCHEN_DESKTOP_MASTER.webp", "/images/website/home/transitions/CO_WEBSITE_TRANSITION_KITCHEN_MOBILE_MASTER.webp", ".CO Kitchen coconut products on a natural preparation surface."),
      botanica: responsive("/images/website/manual/home/transitions/CO_WEBSITE_TRANSITION_BOTANICA", "/images/website/home/transitions/CO_WEBSITE_TRANSITION_BOTANICA_DESKTOP_MASTER.webp", "/images/website/home/transitions/CO_WEBSITE_TRANSITION_BOTANICA_MOBILE_MASTER.webp", "BOTANiCA coconut care products in soft daylight."),
      melt: responsive("/images/website/manual/home/transitions/CO_WEBSITE_TRANSITION_MELT", "/images/website/home/transitions/CO_WEBSITE_TRANSITION_MELT_DESKTOP_MASTER.webp", "/images/website/home/transitions/CO_WEBSITE_TRANSITION_MELT_MOBILE_MASTER.webp", "MELT coconut gelato in warm afternoon light."),
    },
  },
  about: { journey: journeyAssets },
  sustainability: {
    hero: responsive("/images/website/manual/sustainability/CO_WEBSITE_SUSTAINABILITY_HERO", "/assets/sustainability/refined/sustainability-hero-editorial.png", "/assets/sustainability/refined/sustainability-hero-editorial.png", ".CO products and coconut sourcing materials in warm natural light.", "hero"),
    sourcing: responsive("/images/website/manual/sustainability/CO_WEBSITE_SUSTAINABILITY_SOURCING", "/assets/sustainability/refined/raw-materials-farmer.png", "/assets/sustainability/refined/raw-materials-farmer.png", "A coconut farmer working among palms."),
  },
  founders: {
    hero: responsive("/images/website/manual/founders/CO_WEBSITE_FOUNDERS_HERO", "/assets/founders/refined/fazil-afsala-founder-hero.png", "/assets/founders/refined/fazil-afsala-founder-hero.png", "The founders of .CO The Coconut Company.", "hero"),
    story: { desktop: "/images/website/manual/founders/CO_WEBSITE_FOUNDERS_STORY_01_MASTER.webp", mobile: "/images/website/manual/founders/CO_WEBSITE_FOUNDERS_STORY_01_MASTER.webp", fallbackDesktop: "/assets/home/refined/naturally-hydrating-4k.png", fallbackMobile: "/assets/home/refined/naturally-hydrating-4k.png", alt: ".CO coconut water in a warm everyday setting.", width: 2000, height: 1500, mobileWidth: 1600, mobileHeight: 2000, status: "awaiting-manual" as const },
  },
  recipes: {
    hero: responsive("/images/website/manual/recipes/CO_WEBSITE_RECIPES_HERO", "/assets/recipes/refined/recipes-hero-editorial.png", "/assets/recipes/refined/recipes-hero-editorial.png", ".CO coconut products with a mango coconut breakfast bowl.", "hero"),
  },
  journal: {
    card: (slug: string, fallback: string, alt: string) => resolveSingleWebsiteAsset({ src: `/images/website/manual/journal/CO_WEBSITE_JOURNAL_${slug.toUpperCase().replaceAll("-", "_")}_CARD_MASTER.webp`, fallback, alt, status: "awaiting-manual" as const }),
    hero: (slug: string, fallback: string, alt: string) => resolveSingleWebsiteAsset({ src: `/images/website/manual/journal/CO_WEBSITE_JOURNAL_${slug.toUpperCase().replaceAll("-", "_")}_HERO_MASTER.webp`, fallback, alt, status: "awaiting-manual" as const }),
  },
  puzzle: [
    { id: "co-water", title: ".CO Water", subtitle: "Pure coconut hydration", src: productPrimary("water"), alt: "Front view of .CO coconut water." },
    { id: "coconut-oil", title: ".CO Kitchen Coconut Oil", subtitle: "Everyday kitchen ritual", src: productPrimary("kitchen-oil"), alt: "Front view of .CO Kitchen virgin coconut oil." },
    { id: "coconut-flour", title: ".CO Kitchen Coconut Flour", subtitle: "Coconut pantry staple", src: productPrimary("kitchen-flour"), alt: "Front view of .CO Kitchen coconut flour pouch." },
    { id: "coconut-milk", title: ".CO Kitchen Coconut Milk", subtitle: "Made for everyday cooking", src: productPrimary("kitchen-milk"), alt: "Front view of .CO Kitchen coconut milk carton." },
    { id: "melt", title: "MELT Coconut Gelato", subtitle: "Coconut creamery", src: productPrimary("melt"), alt: "Front view of MELT coconut gelato tub." },
    { id: "botanica-shampoo", title: "BOTANiCA Shampoo", subtitle: "Coconut botanical care", src: productPrimary("botanica-shampoo"), alt: "Front view of BOTANiCA shampoo bottle." },
    { id: "botanica-face-wash", title: "BOTANiCA Face Wash", subtitle: "Daily botanical cleanse", src: productPrimary("botanica-face-wash"), alt: "Front view of BOTANiCA face wash bottle." },
    { id: "botanica-hair-serum", title: "BOTANiCA Hair Serum", subtitle: "Coconut hair ritual", src: productPrimary("botanica-hair-serum"), alt: "Front view of BOTANiCA hair serum bottle." },
    { id: "botanica-moisturizer", title: "BOTANiCA Moisturizer", subtitle: "Daily botanical moisture", src: productPrimary("botanica-moisturizer"), alt: "Front view of BOTANiCA body moisturizer." },
  ],
  products: productGalleries,
} as const;

export function galleryForShopSlug(slug: string): ProductGallery | undefined {
  const ids: Record<string, string> = {
    "co-water": "water", "melt-co": "melt", "melt-co-mango-coconut": "melt",
    "coconut-oil": "kitchen-oil", "co-kitchen-coconut-oil": "kitchen-oil",
    "coconut-flour": "kitchen-flour", "coconut-milk": "kitchen-milk",
    "face-wash": "botanica-face-wash", "body-lotion": "botanica-moisturizer",
    "hair-oil": "botanica-hair-serum", "shampoo": "botanica-shampoo",
  };
  return productGalleries[ids[slug] ?? slug];
}
