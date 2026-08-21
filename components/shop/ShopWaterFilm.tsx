"use client";

import { useEffect, useRef, useState } from "react";
import { mediaUrl } from "@/lib/media";

const desktopSource = mediaUrl("/assets/video/shop/coconut-water-flow-desktop-v1.mp4");
const mobileSource = mediaUrl("/assets/video/shop/coconut-water-flow-mobile-v1.mp4");
const poster = mediaUrl("/assets/video/shop/coconut-water-flow-poster-v1.jpg");

export function ShopWaterFilm() {
  const hostRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [source, setSource] = useState("");

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
    if (reducedMotion || saveData) return;

    let delay = 0;
    const activate = () => {
      window.clearTimeout(delay);
      setSource(window.matchMedia("(max-width: 767px)").matches ? mobileSource : desktopSource);
      window.setTimeout(() => void videoRef.current?.play().catch(() => undefined), 0);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        window.addEventListener("pointerdown", activate, { once: true, passive: true });
        window.addEventListener("keydown", activate, { once: true });
        window.addEventListener("scroll", activate, { once: true, passive: true });
        delay = window.setTimeout(activate, 12000);
      } else {
        window.clearTimeout(delay);
        videoRef.current?.pause();
      }
    }, { rootMargin: "0px", threshold: .35 });
    observer.observe(host);
    return () => {
      observer.disconnect();
      window.clearTimeout(delay);
      window.removeEventListener("pointerdown", activate);
      window.removeEventListener("keydown", activate);
      window.removeEventListener("scroll", activate);
    };
  }, []);

  return (
    <div ref={hostRef} className="co-shop-hero__film" aria-hidden="true">
      <video ref={videoRef} src={source || undefined} muted playsInline loop preload="none" poster={poster} tabIndex={-1} />
    </div>
  );
}
