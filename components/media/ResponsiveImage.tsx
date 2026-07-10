import type { CSSProperties, ImgHTMLAttributes } from "react";
import optimizedManifest from "@/lib/generated/optimized-image-manifest.json";

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
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) return src;
  return src.startsWith("/") ? src : `/${src}`;
}

function imageMeta(src: string) {
  return manifest[normalizeSrc(src)];
}

export function optimizedImageSrc(src: string, variant: "mobile" | "tablet" | "desktop" = "desktop") {
  const meta = imageMeta(src);
  return meta?.variants[variant]?.avif || normalizeSrc(src);
}

export function ResponsiveImage({
  src,
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
  const meta = imageMeta(normalizedSrc);
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
      src={meta?.variants.desktop?.jpg || meta?.fallback || normalizedSrc}
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

  if (!meta) return image;

  return (
    <picture>
      {meta.variants.mobile?.avif ? <source type="image/avif" media="(max-width: 767px)" srcSet={meta.variants.mobile.avif} /> : null}
      {meta.variants.tablet?.avif ? <source type="image/avif" media="(max-width: 1279px)" srcSet={meta.variants.tablet.avif} /> : null}
      {meta.variants.desktop?.avif ? <source type="image/avif" srcSet={meta.variants.desktop.avif} /> : null}
      {meta.variants.mobile?.jpg ? <source type="image/jpeg" media="(max-width: 767px)" srcSet={meta.variants.mobile.jpg} /> : null}
      {meta.variants.tablet?.jpg ? <source type="image/jpeg" media="(max-width: 1279px)" srcSet={meta.variants.tablet.jpg} /> : null}
      {image}
    </picture>
  );
}
