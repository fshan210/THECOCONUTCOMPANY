"use client";

import { useSyncExternalStore } from "react";

export type MotionQuality = "full" | "reduced" | "minimal";

const reducedQuery = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const media = window.matchMedia(reducedQuery);
  const connection = (navigator as Navigator & { connection?: EventTarget }).connection;
  media.addEventListener("change", callback);
  connection?.addEventListener("change", callback);
  return () => {
    media.removeEventListener("change", callback);
    connection?.removeEventListener("change", callback);
  };
}

function getSnapshot(): MotionQuality {
  if (window.matchMedia(reducedQuery).matches) return "reduced";
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return connection?.saveData ? "minimal" : "full";
}

export function useMotionQuality() {
  return useSyncExternalStore(subscribe, getSnapshot, () => "reduced" as MotionQuality);
}

export function allowsMotion(quality: MotionQuality) {
  return quality === "full";
}
