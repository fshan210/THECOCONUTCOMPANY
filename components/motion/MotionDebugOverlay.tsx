"use client";

import { useEffect, useState } from "react";

type DebugSnapshot = Record<string, unknown>;

export function MotionDebugOverlay() {
  const [enabled, setEnabled] = useState(false);
  const [snapshot, setSnapshot] = useState<DebugSnapshot>({ routePhase: "idle" });
  const [outlined, setOutlined] = useState(false);
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const active = process.env.NODE_ENV === "development" && new URLSearchParams(window.location.search).has("motionDebug");
    setEnabled(active);
    if (!active) return;
    let frames = 0;
    let lastSample = performance.now();
    let animationFrame = 0;
    const measure = (now: number) => {
      frames += 1;
      if (now - lastSample >= 1000) {
        const fps = Math.round((frames * 1000) / (now - lastSample));
        window.__CO_MOTION_DIAGNOSTICS__ = { routePhase: "idle", activeScrollTriggers: 0, ...window.__CO_MOTION_DIAGNOSTICS__, fps };
        frames = 0;
        lastSample = now;
      }
      animationFrame = window.requestAnimationFrame(measure);
    };
    animationFrame = window.requestAnimationFrame(measure);
    const timer = window.setInterval(() => setSnapshot({ ...window.__CO_MOTION_DIAGNOSTICS__ }), 300);
    return () => {
      window.clearInterval(timer);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);
  if (!enabled) return null;
  const toggleOutline = () => {
    const next = !outlined;
    setOutlined(next);
    document.documentElement.classList.toggle("co-motion-debug-outline", next);
  };
  const toggleSlow = () => {
    const next = !slow;
    setSlow(next);
    document.documentElement.style.setProperty("--co-motion-debug-speed", next ? "4" : "1");
    document.getAnimations().forEach((animation) => {
      animation.playbackRate = next ? 0.25 : 1;
    });
  };
  return <aside className="fixed bottom-3 left-3 z-[9999] w-[280px] rounded-2xl bg-[#1d2f1d]/92 p-3 text-[10px] text-white shadow-xl backdrop-blur-xl" aria-label="Motion diagnostics">
    <div className="mb-2 flex gap-2"><button type="button" onClick={toggleOutline} className="rounded-full border border-white/25 px-2 py-1">{outlined ? "Hide" : "Outline"} motion</button><button type="button" onClick={toggleSlow} className="rounded-full border border-white/25 px-2 py-1">{slow ? "Normal" : "0.25x"}</button><button type="button" onClick={() => window.location.reload()} className="rounded-full border border-white/25 px-2 py-1">Replay</button></div>
    <pre className="max-h-56 overflow-auto whitespace-pre-wrap" aria-live="polite">{JSON.stringify(snapshot, null, 2)}</pre>
  </aside>;
}
