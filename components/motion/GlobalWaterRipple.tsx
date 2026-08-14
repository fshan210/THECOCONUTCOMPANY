"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function supportsWebGl() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

export function GlobalWaterRipple({ image }: { image: string }) {
  const pathname = usePathname();
  const hostRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "active" | "reduced" | "fallback">("loading");
  const adminRoute = pathname.startsWith("/admin") || pathname.startsWith("/control-center");
  // The catalogue is deliberately static: scanning and buying products must not
  // compete with a WebGL material layer. PDPs remain editorial route surfaces.
  const shopCatalogueRoute = pathname === "/shop";
  const debugRoute = pathname === "/ripple-debug";

  useEffect(() => {
    const host = hostRef.current;
    if (!host || adminRoute || shopCatalogueRoute || debugRoute) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setState("reduced");
      return undefined;
    }
    if (!supportsWebGl()) {
      setState("fallback");
      return undefined;
    }

    let disposed = false;
    let cleanup: (() => void) | undefined;
    void (async () => {
      const jqueryModule = await import("jquery");
      const $ = jqueryModule.default;
      window.jQuery = $;
      window.$ = $;
      await import("jquery.ripples");
      if (disposed || !hostRef.current) return;

      const surface = $(hostRef.current);
      surface.ripples({
        imageUrl: image,
        resolution: 256,
        dropRadius: window.innerWidth < 768 ? 20 : 28,
        perturbance: window.innerWidth < 768 ? 0.04 : 0.052,
        interactive: false,
        crossOrigin: "anonymous",
      });
      setState("active");

      let pointerFrame = 0;
      let lastPointerX = -Infinity;
      let lastPointerY = -Infinity;
      let dropCount = 0;
      const recordDrop = (kind: "pointer" | "ambient") => {
        dropCount += 1;
        hostRef.current?.setAttribute("data-ripple-drop-count", String(dropCount));
        hostRef.current?.setAttribute("data-ripple-last-drop", kind);
      };
      const drop = (x: number, y: number, radius: number, strength: number, kind: "pointer" | "ambient") => {
        if (document.hidden) return;
        try {
          surface.ripples("drop", x, y, radius, strength);
          recordDrop(kind);
        } catch {
          setState("fallback");
        }
      };
      const onPointerMove = (event: PointerEvent) => {
        if (event.pointerType === "touch") return;
        const x = event.clientX;
        const y = event.clientY;
        const threshold = window.innerWidth < 768 ? 28 : 22;
        if (Math.hypot(x - lastPointerX, y - lastPointerY) < threshold) return;
        lastPointerX = x;
        lastPointerY = y;
        window.cancelAnimationFrame(pointerFrame);
        pointerFrame = window.requestAnimationFrame(() => {
          drop(x, y, window.innerWidth < 768 ? 16 : 24, window.innerWidth < 768 ? 0.06 : 0.095, "pointer");
        });
      };
      const ambientMs = window.innerWidth < 768 ? 5600 : 3800;
      const ambient = window.setInterval(() => {
        drop(window.innerWidth * (0.16 + Math.random() * 0.68), window.innerHeight * (0.14 + Math.random() * 0.72), window.innerWidth < 768 ? 16 : 26, window.innerWidth < 768 ? 0.04 : 0.075, "ambient");
      }, ambientMs);
      const onVisibility = () => surface.ripples(document.hidden ? "pause" : "play");
      const onResize = () => surface.ripples("updateSize");
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("resize", onResize, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
      cleanup = () => {
        window.clearInterval(ambient);
        window.cancelAnimationFrame(pointerFrame);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("resize", onResize);
        document.removeEventListener("visibilitychange", onVisibility);
        try { surface.ripples("destroy"); } catch { /* Static fallback remains. */ }
      };
    })().catch(() => setState("fallback"));

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [adminRoute, debugRoute, image, shopCatalogueRoute]);

  if (adminRoute || shopCatalogueRoute || debugRoute) return null;
  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      data-global-water-ripple
      data-ripple-state={state}
      data-ripple-target="visible-material-layer"
      data-ripple-interactive="false"
      className="co-global-water-ripple"
      style={{ backgroundImage: `url("${image}")` }}
    />
  );
}
