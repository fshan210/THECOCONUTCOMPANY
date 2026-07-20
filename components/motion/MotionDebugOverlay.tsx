"use client";

import { useEffect, useState } from "react";

export function MotionDebugOverlay() {
  const [enabled, setEnabled] = useState(false);
  const [snapshot, setSnapshot] = useState("idle");
  useEffect(() => {
    const active = process.env.NODE_ENV === "development" && new URLSearchParams(window.location.search).has("motionDebug");
    setEnabled(active);
    if (!active) return;
    const timer = window.setInterval(() => setSnapshot(JSON.stringify(window.__CO_MOTION_DIAGNOSTICS__ || { routePhase: "idle" }, null, 2)), 300);
    return () => window.clearInterval(timer);
  }, []);
  if (!enabled) return null;
  return <pre className="fixed bottom-3 left-3 z-[9999] max-w-xs rounded-2xl bg-[#1d2f1d]/90 p-3 text-[10px] text-white shadow-xl backdrop-blur-xl" aria-hidden="true">{snapshot}</pre>;
}
