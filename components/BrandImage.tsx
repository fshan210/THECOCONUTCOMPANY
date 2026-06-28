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
  fallbackLabel?: string;
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
  fallbackLabel = ".CO",
  className = "",
  imageClassName = "",
  fallbackSrc = publicAssets.water.floating
}: BrandImageProps) {
  const [resolvedSrc, setResolvedSrc] = useState(src || fallbackSrc);
  const [failed, setFailed] = useState(false);

  return (
    <div className={`group/brand-image relative w-full max-w-full overflow-hidden border border-[var(--co-border)] rounded-[32px] bg-[var(--co-white)] ${aspectClass[aspect]} ${className}`}>
      {failed ? (
        <div className="absolute inset-0 grid place-items-center bg-[var(--co-cream)] p-8 text-center">
          <div>
            <p className="co-label mb-4">.CO product world</p>
            <p className="font-sans text-[clamp(40px,8vw,96px)] font-bold leading-[0.82] text-[var(--co-brown)]">{fallbackLabel}</p>
            <svg aria-hidden="true" viewBox="0 0 160 54" className="mx-auto mt-6 h-12 w-36 text-[var(--co-palm)]">
              <path d="M12 30c26-24 43-24 70 0s44 24 66 0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <path d="M42 18c10-15 26-15 36 0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.45" />
            </svg>
          </div>
        </div>
      ) : (
        <Image
          src={resolvedSrc}
          alt={alt}
          fill
          preload={priority}
          sizes={sizes}
          onError={() => {
            if (resolvedSrc === fallbackSrc) setFailed(true);
            else setResolvedSrc(fallbackSrc);
          }}
          className={`${fit === "contain" ? "object-contain p-3 md:p-5" : "object-cover"} transform-gpu ${hoverZoom ? "transition duration-700 ease-out group-hover/brand-image:scale-[1.035] motion-reduce:transition-none" : ""} ${imageClassName}`}
          style={{ objectPosition: position }}
        />
      )}
      {fit === "contain" ? <div className="pointer-events-none absolute inset-x-10 bottom-7 h-10 rounded-full bg-[var(--co-brown)]/10 blur-2xl" /> : null}
    </div>
  );
}
