"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Cloud, Leaf, Package, UsersRound } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { SustainabilityImpactConfig, SustainabilityImpactMetric, SustainabilityImpactMetricId } from "@/lib/content/impact";
import { useMotionQuality } from "@/lib/motion";

const iconByMetric: Record<SustainabilityImpactMetricId, typeof Leaf> = {
  coconuts: Leaf,
  plastic: Package,
  carbon: Cloud,
  farmers: UsersRound,
};

const STEP_INTERVAL_MS = 450;
const METRIC_STAGGER_MS = 130;
const SESSION_KEY = "co-sustainability-impact-seen";

function RollingCharacter({ character, position, frame }: { character: string; position: number; frame: number }) {
  const kind = /\d/.test(character) ? "digit" : character === "," ? "punctuation" : character === " " ? "space" : "suffix";
  return (
    <span className="co-impact-counter__digit" data-character-kind={kind} aria-hidden="true">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={`${position}-${character}-${frame}`}
          initial={{ y: "105%", opacity: 0.2 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-105%", opacity: 0.15 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          {character === " " ? "\u00a0" : character}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function MetricCounter({ active, delay, metric, reduced }: { active: boolean; delay: number; metric: SustainabilityImpactMetric; reduced: boolean }) {
  const sequence = useMemo(() => [...metric.rollValues, metric.value].filter((value, index, values) => index === 0 || value !== values[index - 1]), [metric]);
  const [frame, setFrame] = useState(reduced || active ? sequence.length - 1 : 0);

  useEffect(() => {
    if (reduced) {
      setFrame(sequence.length - 1);
      return undefined;
    }
    if (!active) return undefined;
    const timers = sequence.slice(1).map((_, index) => window.setTimeout(() => setFrame(index + 1), delay + (index + 1) * STEP_INTERVAL_MS));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [active, delay, reduced, sequence]);

  const value = sequence[frame] ?? metric.value;
  const formatted = `${value.toLocaleString("en-IN")}${metric.suffix}`;
  const Icon = iconByMetric[metric.id];

  return (
    <div className="co-impact-counter">
      <Icon className="co-impact-counter__icon" size={20} strokeWidth={1.25} aria-hidden="true" />
      <p className="co-impact-counter__value" aria-label={formatted}>
        {Array.from(formatted).map((character, position) => <RollingCharacter key={position} character={character} position={position} frame={frame} />)}
      </p>
      <p className="co-impact-counter__label">{metric.label}</p>
    </div>
  );
}

export function ImpactCounters({ config }: { config: SustainabilityImpactConfig }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const quality = useMotionQuality();
  const reduced = quality !== "full";
  const [active, setActive] = useState(false);
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    const node = hostRef.current;
    if (!node) return undefined;
    if (reduced || window.sessionStorage.getItem(SESSION_KEY) === "1") {
      setInstant(true);
      setActive(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      window.sessionStorage.setItem(SESSION_KEY, "1");
      setActive(true);
      observer.disconnect();
    }, { threshold: 0.36 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  const disclosure = config.mode === "verified"
    ? config.reportingPeriod ?? config.disclosure
    : config.disclosure;

  return (
    <div ref={hostRef} className="co-impact-counters-wrap">
      <div className="co-impact-counters" aria-label={config.heading} data-impact-mode={config.mode}>
        {config.metrics.map((metric, index) => (
          <MetricCounter key={metric.id} metric={metric} active={active} reduced={reduced || instant} delay={index * METRIC_STAGGER_MS} />
        ))}
      </div>
      <p className="co-impact-disclosure">{disclosure}</p>
    </div>
  );
}
