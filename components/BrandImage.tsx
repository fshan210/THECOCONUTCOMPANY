"use client";

import Image from "next/image";
import { useState } from "react";
import { publicAssets } from "@/lib/public-assets";

type BrandImageProps = {
  src?: string;
  alt: string;
  sizes: string;
  aspect?: "square" | "portrait" | "landscape" | "wide" | "product";
  fit?: "cover" | "contain";
  position?: string;
  priority?: boolean;
  hoverZoom?: boolean;
  className?: string;
  imageClassName?: string;
  fallbackSrc?: string;
};

const aspectClass = {
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  landscape: "aspect-[4/3]",
  wide: "aspect-[16/9]",
  product: "aspect-[3/4]"
};

export function BrandImage({
  src,
  alt,
  sizes,
  aspect = "portrait",
  fit = "cover",
  position = "center",
  priority = false,
  hoverZoom = false,
  className = "",
  imageClassName = "",
  fallbackSrc = publicAssets.water.floating
}: BrandImageProps) {
  const [resolvedSrc, setResolvedSrc] = useState(src || fallbackSrc);

  return (
    <div className={`group/brand-image relative overflow-hidden rounded-3xl border border-coconut/10 bg-[#fff8ea] ${aspectClass[aspect]} ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(216,192,122,0.26),transparent_34%),linear-gradient(145deg,rgba(255,253,248,0.82),rgba(245,235,215,0.58))]" />
      <Image
        src={resolvedSrc}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        onError={() => setResolvedSrc(fallbackSrc)}
        className={`${fit === "contain" ? "object-contain p-5 md:p-7" : "object-cover"} ${hoverZoom ? "transition duration-700 ease-out group-hover/brand-image:scale-[1.035]" : ""} ${imageClassName}`}
        style={{ objectPosition: position }}
      />
      {fit === "contain" ? <div className="pointer-events-none absolute inset-x-10 bottom-7 h-10 rounded-full bg-coconut/10 blur-2xl" /> : null}
    </div>
  );
}
