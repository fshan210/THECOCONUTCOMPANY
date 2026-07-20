export type ImpactMetricStatus = "verified" | "estimate" | "target";
export type ImpactMetric = { id: string; label: string; startValue: number; endValue: number; prefix?: string; suffix?: string; sourceNote: string; sourceUrl?: string; status: ImpactMetricStatus; lastReviewed: string; enabled: boolean; };
export type ImpactCounterConfig = { heading: string; metrics: ImpactMetric[]; };

export const defaultImpactCounterConfig: ImpactCounterConfig = {
  heading: "Our operating foundation",
  metrics: [
    { id: "farm-trees", label: "Trees in the contract-farm anchor", startValue: 0, endValue: 450, prefix: "~", sourceNote: "Current Pollachi sourcing anchor", status: "estimate", lastReviewed: "2026-07-20", enabled: true },
    { id: "preservatives", label: "Preservatives in the Phase 1 UHT brief", startValue: 8, endValue: 0, sourceNote: "Current white-label production brief", status: "verified", lastReviewed: "2026-07-20", enabled: true },
    { id: "phase-one-moq", label: "Phase 1 UHT MOQ in units", startValue: 0, endValue: 10000, sourceNote: "Current co-packer MOQ", status: "verified", lastReviewed: "2026-07-20", enabled: true },
  ],
};
