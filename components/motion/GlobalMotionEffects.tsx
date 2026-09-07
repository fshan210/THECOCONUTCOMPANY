"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { isAccountRoute } from "@/lib/account/routes";

const excludedImageAncestor = "[data-smooothy-slider], [data-lifestyle-3d-gallery], [role='dialog'], header, footer";

export function GlobalMotionEffects() {
  const pathname = usePathname();

  useEffect(() => {
    if (isAccountRoute(pathname) || pathname.startsWith("/admin") || pathname.startsWith("/control-center")) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealNodes = new Set<HTMLElement>();
    const parallaxNodes = new Set<HTMLImageElement>();
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (entry.target as HTMLElement).dataset.coReveal = "visible";
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6%" });

    let frame = 0;
    const update = () => {
      frame = 0;
      const viewportCenter = window.innerHeight / 2;
      const range = window.innerWidth < 768 ? 13 : 24;
      parallaxNodes.forEach((image) => {
        const rect = image.getBoundingClientRect();
        if (rect.bottom < -100 || rect.top > window.innerHeight + 100) return;
        const progress = Math.max(-1, Math.min(1, (rect.top + rect.height / 2 - viewportCenter) / window.innerHeight));
        const offset = Number((-progress * range).toFixed(2));
        image.style.translate = `0 ${offset}px`;
        image.dataset.coParallaxOffset = String(offset);
      });
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const scan = () => {
      Array.from(document.querySelectorAll<HTMLElement>(".co-site-content h1, .co-site-content h2, .co-site-content [data-co-reveal]"))
        .forEach((node, index) => {
          if (revealNodes.has(node)) return;
          revealNodes.add(node);
          node.dataset.coReveal = reduced ? "reduced" : "pending";
          node.style.setProperty("--co-reveal-delay", `${Math.min(index % 4, 3) * 55}ms`);
          if (!reduced) revealObserver.observe(node);
        });
      if (!reduced) {
        Array.from(document.querySelectorAll<HTMLImageElement>(".co-site-content img")).forEach((image) => {
          if (parallaxNodes.has(image) || image.closest(excludedImageAncestor)) return;
          const rect = image.getBoundingClientRect();
          if (rect.width < 320 || rect.height < 230) return;
          parallaxNodes.add(image);
          image.dataset.coParallax = "active";
          image.style.willChange = "translate";
        });
      }
      schedule();
    };
    const mutationObserver = new MutationObserver(scan);
    const content = document.querySelector(".co-site-content");
    if (content) mutationObserver.observe(content, { childList: true, subtree: true });
    const scanTimers = [0, 160, 650, 1500].map((delay) => window.setTimeout(scan, delay));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      revealObserver.disconnect();
      mutationObserver.disconnect();
      scanTimers.forEach((timer) => window.clearTimeout(timer));
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      parallaxNodes.forEach((image) => {
        image.style.translate = "";
        image.style.willChange = "";
        delete image.dataset.coParallax;
        delete image.dataset.coParallaxOffset;
      });
    };
  }, [pathname]);

  return null;
}
