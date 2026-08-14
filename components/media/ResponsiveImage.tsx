import type { CSSProperties, ImgHTMLAttributes } from "react";
import optimizedManifest from "@/lib/generated/optimized-image-manifest.json";
import { localMediaPath, mediaUrl, normalizeMediaPath } from "@/lib/media";

type OptimizedVariant = {
  width: number;
  avif: string;
  jpg: string;
  avifBytes?: number;
  jpgBytes?: number;
};

type OptimizedImage = {
  src: string;
  width: number;
  height: number;
  variants: {
    mobile?: OptimizedVariant;
    tablet?: OptimizedVariant;
    desktop?: OptimizedVariant;
  };
  fallback: string;
};

type ResponsiveImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "height" | "width" | "placeholder"> & {
  src: string;
  mobileSrc?: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
};

const manifest = optimizedManifest as Record<string, OptimizedImage | undefined>;

function normalizeSrc(src: string) {
  if (/^(?:https?:)?\/\//i.test(src) || /^(?:data|blob):/i.test(src)) return src;
  return normalizeMediaPath(src);
}

function imageMeta(src: string) {
  return manifest[localMediaPath(src)];
}

export function optimizedImageSrc(src: string, variant: "mobile" | "tablet" | "desktop" = "desktop") {
  const meta = imageMeta(src);
  return mediaUrl(meta?.variants[variant]?.avif || normalizeSrc(src));
}

export function ResponsiveImage({
  src,
  mobileSrc,
  alt,
  width,
  height,
  fill = false,
  sizes,
  priority = false,
  loading,
  fetchPriority,
  decoding = "async",
  className = "",
  style,
  quality: _quality,
  placeholder: _placeholder,
  blurDataURL: _blurDataURL,
  ...props
}: ResponsiveImageProps) {
  const normalizedSrc = normalizeSrc(src);
  const normalizedMobileSrc = mobileSrc ? normalizeSrc(mobileSrc) : undefined;
  const meta = imageMeta(normalizedSrc);
  const mobileMeta = normalizedMobileSrc ? imageMeta(normalizedMobileSrc) : undefined;
  const imgWidth = width || meta?.width || undefined;
  const imgHeight = height || meta?.height || undefined;
  const resolvedLoading = loading || (priority ? "eager" : "lazy");
  const resolvedFetchPriority = fetchPriority || (priority ? "high" : resolvedLoading === "lazy" ? "low" : "auto");
  const fillStyle: CSSProperties = fill
    ? {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%"
      }
    : {};

  const image = (
    // eslint-disable-next-line @next/next/no-img-element -- Static <picture> delivery is intentional here to avoid Vercel runtime Image Optimization costs.
    <img
      src={mediaUrl(meta?.variants.desktop?.jpg || meta?.fallback || normalizedSrc)}
      alt={alt}
      width={imgWidth}
      height={imgHeight}
      sizes={sizes}
      loading={resolvedLoading}
      decoding={decoding}
      fetchPriority={resolvedFetchPriority}
      className={className}
      style={{ ...fillStyle, ...style }}
      {...props}
    />
  );

  if (!meta && !mobileSrc) return image;

  return (
    <picture>
      {mobileMeta?.variants.mobile?.avif ? <source type="image/avif" media="(max-width: 767px)" srcSet={mediaUrl(mobileMeta.variants.mobile.avif)} /> : null}
      {mobileMeta?.variants.mobile?.jpg ? <source type="image/jpeg" media="(max-width: 767px)" srcSet={mediaUrl(mobileMeta.variants.mobile.jpg)} /> : null}
      {normalizedMobileSrc ? <source media="(max-width: 767px)" srcSet={mediaUrl(normalizedMobileSrc)} /> : null}
      {!normalizedMobileSrc && meta?.variants.mobile?.avif ? <source type="image/avif" media="(max-width: 767px)" srcSet={mediaUrl(meta.variants.mobile.avif)} /> : null}
      {meta?.variants.tablet?.avif ? <source type="image/avif" media="(max-width: 1279px)" srcSet={mediaUrl(meta.variants.tablet.avif)} /> : null}
      {meta?.variants.desktop?.avif ? <source type="image/avif" srcSet={mediaUrl(meta.variants.desktop.avif)} /> : null}
      {!normalizedMobileSrc && meta?.variants.mobile?.jpg ? <source type="image/jpeg" media="(max-width: 767px)" srcSet={mediaUrl(meta.variants.mobile.jpg)} /> : null}
      {meta?.variants.tablet?.jpg ? <source type="image/jpeg" media="(max-width: 1279px)" srcSet={mediaUrl(meta.variants.tablet.jpg)} /> : null}
      {image}
    </picture>
  );
}
