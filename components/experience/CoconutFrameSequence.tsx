"use client";

import type { MotionValue } from "framer-motion";
import { useMotionValueEvent } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { coconutScrollAssets } from "@/lib/experience/coconut-scroll-config";

type ViewportName = "desktop" | "mobile";

function drawCover(canvas: HTMLCanvasElement, image: HTMLImageElement) {
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const width = Math.round(rect.width * dpr);
  const height = Math.round(rect.height * dpr);
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) return;
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const sourceWidth = width / scale;
  const sourceHeight = height / scale;
  const sourceX = (image.naturalWidth - sourceWidth) / 2;
  const sourceY = (image.naturalHeight - sourceHeight) / 2;
  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);
}

export function CoconutFrameSequence({ progress }: { progress: MotionValue<number> }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<Array<HTMLImageElement | null>>([]);
  const requestedFrameRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const [viewport, setViewport] = useState<ViewportName | null>(null);
  const [nearViewport, setNearViewport] = useState(false);
  const [ready, setReady] = useState(false);

  const renderRequestedFrame = useCallback(() => {
    if (animationFrameRef.current !== null) return;
    animationFrameRef.current = window.requestAnimationFrame(() => {
      animationFrameRef.current = null;
      const requested = requestedFrameRef.current;
      const exact = imagesRef.current[requested];
      const fallback = exact ?? imagesRef.current.reduce<HTMLImageElement | null>((nearest, image, index) => {
        if (!image) return nearest;
        if (!nearest) return image;
        const nearestIndex = imagesRef.current.indexOf(nearest);
        return Math.abs(index - requested) < Math.abs(nearestIndex - requested) ? image : nearest;
      }, null);
      if (fallback && canvasRef.current) drawCover(canvasRef.current, fallback);
    });
  }, []);

  useMotionValueEvent(progress, "change", (value) => {
    requestedFrameRef.current = Math.max(0, Math.min(coconutScrollAssets.frameCount - 1, Math.round(value * (coconutScrollAssets.frameCount - 1))));
    renderRequestedFrame();
  });

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setViewport(media.matches ? "desktop" : "mobile");
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    const observer = new IntersectionObserver(([entry]) => setNearViewport(entry.isIntersecting), { rootMargin: "600px 0px" });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!viewport || !nearViewport) return undefined;
    let cancelled = false;
    const asset = coconutScrollAssets[viewport];
    imagesRef.current = Array(coconutScrollAssets.frameCount).fill(null);
    setReady(false);

    asset.avif.forEach((avifPath, index) => {
      const image = new Image();
      image.decoding = "async";
      const loadFallback = () => {
        image.onerror = null;
        image.src = asset.jpeg[index];
      };
      image.onerror = loadFallback;
      image.onload = () => {
        if (cancelled) return;
        imagesRef.current[index] = image;
        if (index === 0 || index === requestedFrameRef.current) {
          setReady(true);
          renderRequestedFrame();
        }
      };
      image.src = avifPath;
    });

    return () => {
      cancelled = true;
      imagesRef.current = [];
    };
  }, [nearViewport, renderRequestedFrame, viewport]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const observer = new ResizeObserver(renderRequestedFrame);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [renderRequestedFrame]);

  useEffect(() => () => {
    if (animationFrameRef.current !== null) window.cancelAnimationFrame(animationFrameRef.current);
  }, []);

  const desktop = coconutScrollAssets.desktop;
  const mobile = coconutScrollAssets.mobile;

  return (
    <div ref={hostRef} className="absolute inset-0 overflow-hidden bg-[#dfc496]">
      <picture className="absolute inset-0">
        <source media="(min-width: 768px)" srcSet={desktop.avif[0]} type="image/avif" />
        <source media="(min-width: 768px)" srcSet={desktop.jpeg[0]} type="image/jpeg" />
        <source srcSet={mobile.avif[0]} type="image/avif" />
        <img
          src={mobile.jpeg[0]}
          alt={coconutScrollAssets.alt}
          width={mobile.width}
          height={mobile.height}
          loading="lazy"
          decoding="async"
          className={`size-full object-cover transition-opacity duration-300 ${ready ? "opacity-0" : "opacity-100"}`}
        />
      </picture>
      <canvas ref={canvasRef} aria-hidden="true" className={`absolute inset-0 size-full transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`} />
      {!ready && nearViewport ? <div aria-hidden="true" className="absolute inset-x-[22%] bottom-5 h-0.5 overflow-hidden rounded-full bg-white/35"><span className="block h-full w-1/2 animate-pulse rounded-full bg-white/80" /></div> : null}
    </div>
  );
}
