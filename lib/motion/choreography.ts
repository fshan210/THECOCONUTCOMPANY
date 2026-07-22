import { motionDuration } from "./physics";

export const choreography = {
  route: {
    coverMs: 220,
    navigationTimeoutMs: 900,
    revealMs: 430,
    totalSeconds: motionDuration.route,
  },
  text: { wordStagger: 0.045, lineStagger: 0.075 },
  section: { distance: 24, blur: 8, viewportAmount: 0.16 },
  parallax: { maxDistance: 18 },
} as const;
