export const MEDIA_BASE_PATH = "/site-media/v1";

const managedPrefixes = [
  "/assets/",
  "/assets-optimized/",
  "/brand-reference/",
  "/experience/",
  "/images/website/",
] as const;

const bundledRuntimePrefixes = [
  "/assets/about/about-hand-holding-coconut.png",
  "/assets/about/about-scraped-coconut-split.png",
  "/assets/home/co-hero-coconut-transparent-v1.webp",
  "/assets/home/generated/",
  "/assets/redesign/home/cinematic/",
  "/assets/redesign/about/",
  "/assets/redesign/shop/",
  "/assets/redesign/recipes/",
  "/assets/redesign/sustainability/",
  "/assets/backgrounds/water-material/co-coconut-water-material.png",
  "/assets/backgrounds/day-with-co/midday-kitchen.png",
  "/assets/products/transparent-current/",
  "/assets/products/shop-hero/",
  "/assets/video/shop/",
  "/assets/video/homepage-v2/",
] as const;

function configuredBaseUrl() {
  return (process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? "").trim().replace(/\/+$/, "");
}

export function normalizeMediaPath(src: string) {
  if (!src) return src;
  return src.startsWith("/") ? src : `/${src}`;
}

export function localMediaPath(src: string) {
  const baseUrl = configuredBaseUrl();
  if (baseUrl && src.startsWith(`${baseUrl}${MEDIA_BASE_PATH}/`)) {
    return src.slice(`${baseUrl}${MEDIA_BASE_PATH}`.length);
  }
  return normalizeMediaPath(src);
}

export function isManagedMediaPath(src: string) {
  const localPath = localMediaPath(src);
  return managedPrefixes.some((prefix) => localPath.startsWith(prefix));
}

export function mediaUrl(src: string) {
  if (!src || /^(?:https?:)?\/\//i.test(src) || /^(?:data|blob):/i.test(src)) return src;
  const localPath = normalizeMediaPath(src);
  if (bundledRuntimePrefixes.some((prefix) => localPath.startsWith(prefix))) return localPath;
  const baseUrl = configuredBaseUrl();
  if (!baseUrl || !isManagedMediaPath(localPath)) return localPath;
  return `${baseUrl}${MEDIA_BASE_PATH}${localPath}`;
}

export function mapMediaUrls<T>(value: T): T {
  if (typeof value === "string") return mediaUrl(value) as T;
  if (Array.isArray(value)) return value.map((item) => mapMediaUrls(item)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, mapMediaUrls(item)])) as T;
  }
  return value;
}
