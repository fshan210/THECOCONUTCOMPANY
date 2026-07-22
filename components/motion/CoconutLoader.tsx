"use client";

import { motion } from "framer-motion";
import { useEffect, useId, useRef } from "react";
import { motionEase } from "@/lib/motion";

type CoconutLoaderProps = {
  progress?: number;
  mode?: "route" | "inline";
  label?: string;
  visible?: boolean;
  minimumVisibleMs?: number;
  onExitComplete?: () => void;
};

export function CoconutLoader({ progress, mode = "route", label = "Preparing your experience", visible = true, minimumVisibleMs = 360, onExitComplete }: CoconutLoaderProps) {
  const shownAt = useRef(Date.now());
  const clipId = useId().replaceAll(":", "");
  useEffect(() => {
    if (visible) shownAt.current = Date.now();
    if (!visible && onExitComplete) {
      const wait = Math.max(0, minimumVisibleMs - (Date.now() - shownAt.current));
      const timer = window.setTimeout(onExitComplete, wait + 260);
      return () => window.clearTimeout(timer);
    }
  }, [minimumVisibleMs, onExitComplete, visible]);
  if (!visible) return null;
  const fill = Math.max(12, Math.min(92, progress ?? 64));
  const foreground = mode === "route" ? "#f8f0dd" : "#31512f";
  return (
    <div className={mode === "route" ? "co-loader-stack text-white" : "co-loader-stack text-[#35271e]"} role="status" aria-live="polite">
      <motion.svg viewBox="0 0 100 100" className="size-16 drop-shadow-[0_10px_18px_rgba(17,40,20,.2)]" initial={{ rotate: -4, scale: .92 }} animate={{ rotate: 4, scale: 1 }} transition={{ duration: 1.6, repeat: Infinity, repeatType: "reverse", ease: motionEase }} aria-hidden="true">
        <defs>
          <clipPath id={clipId}><path d="M50 9C28 9 13 27 12 50c-1 24 14 42 38 43 24-1 39-19 38-43C87 27 72 9 50 9Z" /></clipPath>
          <linearGradient id={`${clipId}-shell`} x1="0" x2="1" y1="0" y2="1"><stop stopColor="#9aac68" /><stop offset=".5" stopColor="#527444" /><stop offset="1" stopColor="#2d4b2b" /></linearGradient>
          <linearGradient id={`${clipId}-water`} x1="0" x2="0" y1="0" y2="1"><stop stopColor="#f8f1d4" stopOpacity=".96" /><stop offset="1" stopColor="#b9d9b0" stopOpacity=".9" /></linearGradient>
        </defs>
        <path d="M50 9C28 9 13 27 12 50c-1 24 14 42 38 43 24-1 39-19 38-43C87 27 72 9 50 9Z" fill={`url(#${clipId}-shell)`} stroke={foreground} strokeWidth="2.4" />
        <g clipPath={`url(#${clipId})`}>
          <motion.rect x="10" width="80" height="92" fill={`url(#${clipId}-water)`} initial={{ y: 94 }} animate={{ y: 92 - fill }} transition={{ duration: .62, ease: motionEase }} />
          <motion.path d="M-16 58 Q4 50 24 58 T64 58 T104 58" fill="none" stroke="rgba(255,255,255,.9)" strokeWidth="2.6" initial={{ y: 34 }} animate={{ x: [-18, 0], y: 34 - fill }} transition={{ x: { duration: 1.1, repeat: Infinity, ease: "linear" }, y: { duration: .62, ease: motionEase } }} />
          <ellipse cx="34" cy="28" rx="14" ry="26" fill="rgba(255,255,255,.16)" transform="rotate(32 34 28)" />
        </g>
        <path d="M41 22c4-5 14-5 18 0" fill="none" stroke={foreground} strokeLinecap="round" strokeWidth="2.2" opacity=".72" />
        <circle cx="40" cy="36" r="3.2" fill={foreground} opacity=".7" /><circle cx="60" cy="35" r="3.2" fill={foreground} opacity=".7" /><circle cx="51" cy="49" r="3.2" fill={foreground} opacity=".7" />
      </motion.svg>
      <span className="text-[10px] font-semibold uppercase tracking-[.16em]">{label}</span>
    </div>
  );
}
