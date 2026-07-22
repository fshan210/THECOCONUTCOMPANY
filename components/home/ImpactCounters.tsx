"use client";
import { useEffect, useRef, useState } from "react";
import type { ImpactCounterConfig, ImpactMetric } from "@/lib/content/impact";
import { useMotionQuality } from "@/lib/motion";

function MetricCounter({ metric }: { metric: ImpactMetric }) {
  const ref = useRef<HTMLDivElement>(null); const [value, setValue] = useState(metric.startValue); const quality = useMotionQuality();
  useEffect(() => { const node = ref.current; if (!node) return; if (quality !== "full") { setValue(metric.endValue); return; } let frame = 0; let started = false; const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting || started) return; started = true; const startedAt = performance.now(); const render = (time: number) => { const progress = Math.min(1, (time - startedAt) / 1550); const eased = 1 - Math.pow(1 - progress, 4); setValue(Math.round(metric.startValue + (metric.endValue - metric.startValue) * eased)); if (progress < 1) frame = requestAnimationFrame(render); }; frame = requestAnimationFrame(render); observer.disconnect(); }, { threshold: .4 }); observer.observe(node); return () => { observer.disconnect(); cancelAnimationFrame(frame); }; }, [metric.endValue, metric.startValue, quality]);
  return <div ref={ref}><p className="font-['Space_Grotesk'] text-[34px] font-medium leading-none md:text-[45px]">{metric.prefix}{value.toLocaleString("en-IN")}{metric.suffix}</p><p className="mt-2 max-w-[170px] text-[10px] leading-4 text-white/86 md:text-[11px] md:leading-5">{metric.label}</p><p className="mt-2 text-[8px] uppercase tracking-[.1em] text-white/55">{metric.status === "estimate" ? "Estimate · " : ""}{metric.sourceNote}</p></div>;
}
export function ImpactCounters({ config }: { config: ImpactCounterConfig }) { const metrics = config.metrics.filter((metric) => metric.enabled).slice(0, 3); return <div className="grid grid-cols-3 gap-4" aria-label={config.heading}>{metrics.map((metric) => <MetricCounter key={metric.id} metric={metric} />)}</div>; }
