export type MotionDiagnostics = {
  routePhase: string;
  activeScrollTriggers: number;
  pathname?: string;
  quality?: string;
  reducedMotion?: boolean;
  lenisStatus?: "active" | "disabled" | "idle";
  fps?: number;
  lastReveal?: string;
  lastNavigation?: string;
};

declare global {
  interface Window {
    __CO_MOTION_DIAGNOSTICS__?: MotionDiagnostics;
  }
}

export function updateMotionDiagnostics(patch: Partial<MotionDiagnostics>) {
  if (typeof window === "undefined") return;
  window.__CO_MOTION_DIAGNOSTICS__ = {
    routePhase: "idle",
    activeScrollTriggers: 0,
    lenisStatus: "idle",
    ...window.__CO_MOTION_DIAGNOSTICS__,
    ...patch,
  };
}
