"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef } from "react";

type WaterRippleSurfaceProps = {
  image: string;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

function supportsWebGl() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

export function WaterRippleSurface({ image, children, className = "", style }: WaterRippleSurfaceProps) {
  const surfaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface || !supportsWebGl() || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    let disposed = false;
    let destroy: (() => void) | undefined;
    let observer: IntersectionObserver | undefined;

    const setup = async () => {
      const jqueryModule = await import("jquery");
      const $ = jqueryModule.default;
      window.jQuery = $;
      window.$ = $;
      await import("jquery.ripples");
      if (disposed || !surfaceRef.current) return;
      const $surface = $(surfaceRef.current);
      $surface.ripples({ resolution: 320, dropRadius: 13, perturbance: 0.012, interactive: true, crossOrigin: "anonymous" });
      observer = new IntersectionObserver(([entry]) => {
        if (document.hidden || !entry.isIntersecting) $surface.ripples("pause");
        else $surface.ripples("play");
      }, { rootMargin: "100px" });
      observer.observe(surfaceRef.current);
      const visibility = () => $surface.ripples(document.hidden ? "pause" : "play");
      document.addEventListener("visibilitychange", visibility);
      destroy = () => {
        document.removeEventListener("visibilitychange", visibility);
        observer?.disconnect();
        try { $surface.ripples("destroy"); } catch { /* The fallback image remains visible. */ }
      };
    };

    void setup().catch(() => undefined);
    return () => {
      disposed = true;
      destroy?.();
      observer?.disconnect();
    };
  }, [image]);

  return (
    <div
      ref={surfaceRef}
      aria-hidden={children ? undefined : "true"}
      className={className}
      style={{ backgroundImage: `url("${image}")`, backgroundPosition: "center", backgroundSize: "cover", ...style }}
    >
      {children}
    </div>
  );
}
