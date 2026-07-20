"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { motionEase } from "@/lib/motion";

export function CoconutLoader({ progress, mode = "route", label = "Preparing your experience", visible = true, minimumVisibleMs = 360, onExitComplete }: { progress?: number; mode?: "route" | "inline"; label?: string; visible?: boolean; minimumVisibleMs?: number; onExitComplete?: () => void }) {
  const shownAt = useRef(Date.now());
  useEffect(() => {
    if (visible) shownAt.current = Date.now();
    if (!visible && onExitComplete) {
      const wait = Math.max(0, minimumVisibleMs - (Date.now() - shownAt.current));
      const timer = window.setTimeout(onExitComplete, wait + 260);
      return () => window.clearTimeout(timer);
    }
  }, [minimumVisibleMs, onExitComplete, visible]);
  if (!visible) return null;
  const fill = Math.max(12, Math.min(92, progress ?? 58));
  return (
    <div className={mode === "route" ? "co-loader-stack text-white" : "co-loader-stack text-[#35271e]"} role="status" aria-live="polite">
      <motion.svg viewBox="0 0 100 100" className="size-16" initial={{ rotate: -4, scale: .94 }} animate={{ rotate: 4, scale: 1 }} transition={{ duration: 1.6, repeat: Infinity, repeatType: "reverse", ease: motionEase }} aria-hidden="true">
        <defs><clipPath id="co-coconut-clip"><circle cx="50" cy="52" r="38" /></clipPath></defs>
        <circle cx="50" cy="52" r="38" fill="rgba(255,253,248,.82)" stroke="currentColor" strokeWidth="3" />
        <g clipPath="url(#co-coconut-clip)"><motion.rect x="10" width="80" height="90" fill="rgba(141,197,169,.82)" animate={{ y: 92 - fill }} transition={{ duration: .5, ease: motionEase }} /><motion.path d="M5 55 Q25 48 45 55 T85 55 T125 55" fill="none" stroke="rgba(255,255,255,.8)" strokeWidth="3" animate={{ x: [-18, 0] }} transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }} /></g>
        <circle cx="37" cy="40" r="4" fill="currentColor" opacity=".62" /><circle cx="61" cy="38" r="4" fill="currentColor" opacity=".62" /><circle cx="51" cy="58" r="4" fill="currentColor" opacity=".62" />
      </motion.svg>
      <span className="text-[10px] font-semibold uppercase tracking-[.16em]">{label}</span>
    </div>
  );
}
