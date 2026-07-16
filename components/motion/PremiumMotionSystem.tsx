"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function PremiumMotionSystem() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname.startsWith("/admin") || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section"));
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target as HTMLElement;
      element.animate(
        [{ opacity: .35, transform: "translate3d(0,22px,0) scale(.992)", filter: "blur(7px)" }, { opacity: 1, transform: "translate3d(0,0,0) scale(1)", filter: "blur(0)" }],
        { duration: 720, easing: "cubic-bezier(.16,1,.3,1)", fill: "both" }
      );
      observer.unobserve(element);
    }), { threshold: .08, rootMargin: "0px 0px -6%" });
    sections.forEach((section, index) => { if (index > 0) observer.observe(section); });

    const ripple = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>(".co-primary-cta,[data-co-ripple]");
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const wave = document.createElement("span");
      wave.className = "co-water-ripple";
      wave.style.left = `${event.clientX - rect.left}px`;
      wave.style.top = `${event.clientY - rect.top}px`;
      target.append(wave);
      wave.addEventListener("animationend", () => wave.remove(), { once: true });
    };
    document.addEventListener("pointerdown", ripple, { passive: true });
    return () => { observer.disconnect(); document.removeEventListener("pointerdown", ripple); };
  }, [pathname]);
  return null;
}
