"use client";

import { useEffect, useRef, useState } from "react";
import { mediaUrl } from "@/lib/media";

const desktopSource = mediaUrl("/assets/video/shop/coconut-water-flow-desktop-v1.mp4");
const mobileSource = mediaUrl("/assets/video/shop/coconut-water-flow-mobile-v1.mp4");
const poster = mediaUrl("/assets/video/shop/coconut-water-flow-poster-v1.jpg");

export function ShopWaterFilm() {
  const hostRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [source, setSource] = useState("");

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
    if (reducedMotion || saveData) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setSource(window.matchMedia("(max-width: 767px)").matches ? mobileSource : desktopSource);
        window.setTimeout(() => void videoRef.current?.play().catch(() => undefined), 0);
      } else {
        videoRef.current?.pause();
      }
    }, { rootMargin: "0px", threshold: .65 });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={hostRef} className="relative overflow-hidden bg-[#23130c] px-4 pb-9 md:px-8 md:pb-12" aria-label="Coconut water in motion">
      <div className="relative mx-auto h-[min(84vw,520px)] max-w-[1340px] overflow-hidden rounded-[32px] border border-[#e4ad77]/16 bg-[#432819] md:h-[310px]">
        <video ref={videoRef} src={source || undefined} muted playsInline loop preload="none" poster={poster} aria-label="Water flowing into a fresh coconut" className="h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(26,13,8,.22),transparent_42%,rgba(26,13,8,.15)),linear-gradient(180deg,rgba(35,19,12,.06),rgba(35,19,12,.32))]" />
        <p className="absolute bottom-5 left-5 max-w-[19ch] font-['Cormorant_Garamond'] text-3xl leading-[.9] text-[#fff0dc] md:bottom-8 md:left-8 md:text-5xl">From coconut into the everyday.</p>
      </div>
    </section>
  );
}
