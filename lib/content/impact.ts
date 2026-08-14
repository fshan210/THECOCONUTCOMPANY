export type ImpactMetricStatus = "verified" | "estimate" | "target";
export type ImpactMetric = { id: string; label: string; startValue: number; endValue: number; prefix?: string; suffix?: string; sourceNote: string; sourceUrl?: string; status: ImpactMetricStatus; lastReviewed: string; enabled: boolean; };
export type ImpactCounterConfig = { heading: string; metrics: ImpactMetric[]; };

export type SustainabilityImpactMode = "simulation" | "verified";
export type SustainabilityImpactMetricId = "coconuts" | "plastic" | "carbon" | "farmers";

export type SustainabilityImpactMetric = {
  id: SustainabilityImpactMetricId;
  value: number;
  suffix: string;
  label: string;
  rollValues: readonly number[];
};

export type SustainabilitySimulationBasis = {
  unitsSold: number;
  coconutEquivalentPerUnit: number;
  plasticAvoidedPerUnitKg: number;
  co2eReducedPerUnitKg: number;
  farmerFamiliesSupported: number;
};

export type SustainabilityImpactConfig = {
  mode: SustainabilityImpactMode;
  basisUnits: number;
  heading: string;
  disclosure: string;
  reportingPeriod?: string;
  simulationBasis: SustainabilitySimulationBasis;
  metrics: readonly SustainabilityImpactMetric[];
};

const simulationBasis: SustainabilitySimulationBasis = {
  unitsSold: 10000,
  coconutEquivalentPerUnit: 1.25,
  plasticAvoidedPerUnitKg: 0.018,
  co2eReducedPerUnitKg: 0.115,
  farmerFamiliesSupported: 24,
};

/**
 * Canonical homepage sustainability data.
 *
 * This is an illustrative design-stage launch scenario, not historical impact
 * reporting. Replace `mode`, the disclosure/reporting period, and the metrics
 * here when reviewed source data is approved; the visual component does not
 * need to be redesigned.
 */
export const sustainabilityImpact: SustainabilityImpactConfig = {
  mode: "simulation",
  basisUnits: simulationBasis.unitsSold,
  heading: "Illustrative sustainability impact",
  disclosure: "10,000-unit launch scenario",
  simulationBasis,
  metrics: [
    {
      id: "coconuts",
      value: simulationBasis.unitsSold * simulationBasis.coconutEquivalentPerUnit,
      suffix: "+",
      label: "Coconuts sourced responsibly",
      rollValues: [12430, 12447, 12466, 12488, 12500],
    },
    {
      id: "plastic",
      value: simulationBasis.unitsSold * simulationBasis.plasticAvoidedPerUnitKg,
      suffix: " kg",
      label: "Plastic avoided",
      rollValues: [172, 175, 178, 180],
    },
    {
      id: "carbon",
      value: simulationBasis.unitsSold * simulationBasis.co2eReducedPerUnitKg,
      suffix: " kg",
      label: "CO₂e reduced",
      rollValues: [1120, 1131, 1142, 1150],
    },
    {
      id: "farmers",
      value: simulationBasis.farmerFamiliesSupported,
      suffix: "",
      label: "Farmer families supported",
      rollValues: [21, 22, 23, 24],
    },
  ],
};

// Legacy CMS shape retained for backward-compatible content parsing only.
// The homepage Sustainability section intentionally uses `sustainabilityImpact`
// so stale CMS data cannot replace the approved launch scenario.
export const defaultImpactCounterConfig: ImpactCounterConfig = {
  heading: "Sustainability impact",
  metrics: [],
};
