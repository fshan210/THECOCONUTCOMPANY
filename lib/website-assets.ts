import manualAvailabilityJson from "@/lib/generated/manual-asset-availability.json";
import { mediaUrl } from "@/lib/media";
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
export type CanonicalProductCutout = {
  semanticId: string;
  productId: string;
  sku: string;
  sourceType: "user-supplied";
  canonicalSourceMaster: string;
  runtimeDerivative: string;
  runtimeMediaPath: string;
  sourceDimensions: { width: number; height: number };
  runtimeDimensions: { width: number; height: number };
  hasTransparency: true;
  approved: true;
  src: string;
};

const availability = manualAvailabilityJson as Record<string, boolean>;

export function resolveWebsiteAsset(asset: ResponsiveWebsiteAsset) {
  const desktop = availability[asset.desktop] ? asset.desktop : asset.fallbackDesktop;
  const mobile = availability[asset.mobile] ? asset.mobile : asset.fallbackMobile;
  if (process.env.NODE_ENV === "development") {
    if (!availability[asset.desktop]) console.info(`[website-assets] Manual desktop asset pending: ${asset.desktop}`);
    if (!availability[asset.mobile]) console.info(`[website-assets] Manual mobile asset pending: ${asset.mobile}`);
  }
  return {
    ...asset,
    desktop: mediaUrl(desktop),
    mobile: mediaUrl(mobile),
    fallbackDesktop: mediaUrl(asset.fallbackDesktop),
    fallbackMobile: mediaUrl(asset.fallbackMobile),
    usingManualDesktop: Boolean(availability[asset.desktop]),
    usingManualMobile: Boolean(availability[asset.mobile]),
  };
}

export function resolveSingleWebsiteAsset(asset: SingleWebsiteAsset) {
  return {
    ...asset,
    src: mediaUrl(availability[asset.src] ? asset.src : asset.fallback),
    fallback: mediaUrl(asset.fallback),
    usingManual: Boolean(availability[asset.src]),
  };
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
const manifestProductCutouts = assetManifest.siteAssets.productCutouts as Record<string, Omit<CanonicalProductCutout, "src">>;

export const homepageEnvironmentAssets = {
  origin: {
    ...assetManifest.siteAssets.homepageOriginEnvironment,
    src: mediaUrl(assetManifest.siteAssets.homepageOriginEnvironment.runtimeDerivative),
  },
  harvest: {
    ...assetManifest.siteAssets.homepageHarvestEnvironment,
    desktop: mediaUrl(assetManifest.siteAssets.homepageHarvestEnvironment.runtimeDerivative.desktop),
    mobile: mediaUrl(assetManifest.siteAssets.homepageHarvestEnvironment.runtimeDerivative.mobile),
  },
  craft: {
    ...assetManifest.siteAssets.homepageCraftEnvironment,
    desktop: mediaUrl(assetManifest.siteAssets.homepageCraftEnvironment.runtimeDerivative.desktop),
    mobile: mediaUrl(assetManifest.siteAssets.homepageCraftEnvironment.runtimeDerivative.mobile),
  },
  everyday: {
    ...assetManifest.siteAssets.homepageEverydayEnvironment,
    src: mediaUrl(assetManifest.siteAssets.homepageEverydayEnvironment.runtimeDerivative),
  },
} as const;

export const transparentProductAssets = Object.fromEntries(
  Object.entries(manifestProductCutouts).map(([id, asset]) => [id, { ...asset, src: mediaUrl(asset.runtimeDerivative) }]),
) as Record<string, CanonicalProductCutout>;

export const productGalleries = Object.fromEntries(Object.entries(websiteProducts).map(([id, product]) => [id, {
  ...product,
  primary: mediaUrl(product.primary ?? product.gallery[0]?.src ?? "/assets/branding/made-for-living-reference.png"),
  gallery: product.gallery.map((item) => ({ ...item, src: mediaUrl(item.src) })),
}])) as Record<string, ProductGallery>;

const journey = [
  ["01", "COCONUT_ORIGIN", "/assets/about/refined/about-hero-editorial.png", "Warm coconut-origin materials marking the beginning of .CO."],
  ["02", "IDEA_AND_RESEARCH", "/assets/about/refined/about-hero-editorial.png", "Coconut sourcing and planning materials for the .CO foundation milestone."],
  ["03", "BRAND_AND_PACKAGING", "/brand-reference/coconut-water/dotco-coconut-water-packshot-front-master-v1.png", ".CO coconut water representing the first product direction."],
  ["04", "PRODUCT_ECOSYSTEM", "/images/website/manual/about/CO_WEBSITE_ABOUT_PRODUCT_ECOSYSTEM_DESKTOP_MASTER.webp", ".CO product families representing a growing coconut ecosystem."],
  ["05", "ROOTED_PARTNERSHIPS", "/assets/sustainability/refined/raw-materials-farmer.png", "Kerala and Pollachi sourcing materials representing rooted partnerships."],
  ["06", "MADE_FOR_LIVING", "/images/website/manual/about/journey/CO_WEBSITE_ABOUT_JOURNEY_OVERVIEW_DESKTOP_MASTER.webp", ".CO products arranged for everyday living."],
] as const;

const journeyAssets = journey.map(([order, slug, fallback, alt]) => resolveWebsiteAsset(responsive(
  `/images/website/manual/about/journey/CO_WEBSITE_ABOUT_JOURNEY_${order}_${slug}`,
  fallback,
  fallback,
  alt,
)));

const productPrimary = (id: string, neutral = "/assets/branding/made-for-living-reference.png") => productGalleries[id]?.primary ?? neutral;

const editorial = {
  circularMaterials: responsive("/images/website/manual/editorial/CO_WEBSITE_EDITORIAL_CIRCULAR_MATERIALS", "/assets/sustainability/refined/zero-waste-operations.png", "/assets/sustainability/refined/zero-waste-operations.png", "Coconut shell, coir, compostable packs and coconut bowls on warm stone."),
  communitySourcing: responsive("/images/website/manual/editorial/CO_WEBSITE_EDITORIAL_COMMUNITY_SOURCING", "/assets/sustainability/refined/raw-materials-farmer.png", "/assets/sustainability/refined/raw-materials-farmer.png", "A community coconut quality discussion in Kerala."),
  groveLandscape: responsive("/images/website/manual/editorial/CO_WEBSITE_EDITORIAL_GROVE_LANDSCAPE", "/assets/sustainability/refined/sustainability-banner-groves.png", "/assets/sustainability/refined/sustainability-banner-groves.png", "A sunlit coconut grove landscape."),
  groveBlurred: responsive("/images/website/manual/editorial/CO_WEBSITE_EDITORIAL_GROVE_BLURRED", "/assets/sustainability/refined/sustainability-banner-groves.png", "/assets/sustainability/refined/sustainability-banner-groves.png", "A softly blurred coconut grove."),
  coastalCleanup: responsive("/images/website/manual/editorial/CO_WEBSITE_EDITORIAL_COASTAL_CLEANUP", "/assets/sustainability/refined/clean-ocean-mission.png", "/assets/sustainability/refined/clean-ocean-mission.png", "A community coastal clean-up beside a coconut-lined shore."),
  lowerImpactProcessing: responsive("/images/website/manual/editorial/CO_WEBSITE_EDITORIAL_LOWER_IMPACT_PROCESSING", "/assets/sustainability/refined/clean-manufacturing.png", "/assets/sustainability/refined/clean-manufacturing.png", "A solar-powered coconut processing facility representing a lower-impact future direction."),
} as const;

const journalCardAsset = (slug: string, fallback: string, alt: string) => {
  const normalized = slug.toLowerCase();
  if (/(farm|origin|grove|source)/.test(normalized)) return resolveWebsiteAsset(editorial.groveLandscape).desktop;
  if (/(community|changemaker|partner)/.test(normalized)) return resolveWebsiteAsset(editorial.communitySourcing).desktop;
  if (/(waste|circular|material)/.test(normalized)) return resolveWebsiteAsset(editorial.circularMaterials).desktop;
  if (/(ocean|coast|cleanup)/.test(normalized)) return resolveWebsiteAsset(editorial.coastalCleanup).desktop;
  if (/(process|energy|manufactur)/.test(normalized)) return resolveWebsiteAsset(editorial.lowerImpactProcessing).desktop;
  return fallback;
};

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
  editorial,
  sustainability: {
    hero: responsive("/images/website/manual/sustainability/CO_WEBSITE_SUSTAINABILITY_HERO", "/assets/sustainability/refined/sustainability-hero-editorial.png", "/assets/sustainability/refined/sustainability-hero-editorial.png", ".CO products and coconut sourcing materials in warm natural light.", "hero"),
    sourcing: responsive("/images/website/manual/sustainability/CO_WEBSITE_SUSTAINABILITY_SOURCING", "/assets/sustainability/refined/raw-materials-farmer.png", "/assets/sustainability/refined/raw-materials-farmer.png", "A coconut farmer working among palms."),
  },
  founders: {
    hero: responsive("/images/website/manual/founders/CO_WEBSITE_FOUNDERS_HERO", "/assets/founders/refined/fazil-afsala-founder-hero.png", "/assets/founders/refined/fazil-afsala-founder-hero.png", "The founders of .CO The Coconut Company.", "hero"),
    story: responsive("/images/website/manual/founders/CO_WEBSITE_FOUNDERS_STORY", "/assets/home/refined/naturally-hydrating-4k.png", "/assets/home/refined/naturally-hydrating-4k.png", ".CO coconut water in a warm everyday setting."),
  },
  recipes: {
    hero: responsive("/images/website/manual/recipes/CO_WEBSITE_RECIPES_HERO", "/assets/recipes/refined/recipes-hero-editorial.png", "/assets/recipes/refined/recipes-hero-editorial.png", ".CO coconut products with a mango coconut breakfast bowl.", "hero"),
  },
  journal: {
    card: (slug: string, fallback: string, alt: string) => resolveSingleWebsiteAsset({ src: `/images/website/manual/journal/CO_WEBSITE_JOURNAL_${slug.toUpperCase().replaceAll("-", "_")}_CARD_MASTER.webp`, fallback: journalCardAsset(slug, fallback, alt), alt, status: "awaiting-manual" as const }),
    hero: resolveWebsiteAsset(responsive("/images/website/manual/journal/CO_WEBSITE_JOURNAL_HERO", "/assets/journal/refined/community-coconut-table.png", "/assets/home/refined/naturally-hydrating-4k.png", "The .CO product ecosystem arranged for stories, ideas and community rituals.", "hero")),
    featured: resolveWebsiteAsset(responsive("/images/website/manual/journal/CO_WEBSITE_JOURNAL_FEATURED_STORY", "/assets/journal/refined/journal-featured-story.png", "/assets/journal/refined/journal-featured-story.png", "A featured .CO community story.")),
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
    "coconut-flour": "kitchen-flour", "co-kitchen-coconut-flour": "kitchen-flour",
    "coconut-milk": "kitchen-milk", "co-kitchen-coconut-milk": "kitchen-milk",
    "face-wash": "botanica-face-wash", "co-botanica-face-wash": "botanica-face-wash",
    "body-lotion": "botanica-moisturizer", "co-botanica-body-moisturizer": "botanica-moisturizer",
    "hair-oil": "botanica-hair-serum", "co-botanica-hair-serum": "botanica-hair-serum",
    "shampoo": "botanica-shampoo", "co-botanica-shampoo": "botanica-shampoo",
  };
  return productGalleries[ids[slug] ?? slug];
}
