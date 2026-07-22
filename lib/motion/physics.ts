export const motionEase = [0.16, 1, 0.3, 1] as const;

export const motionSpring = {
  gentle: { type: "spring", stiffness: 190, damping: 24, mass: 0.85 },
  responsive: { type: "spring", stiffness: 260, damping: 28, mass: 0.72 },
  expressive: { type: "spring", stiffness: 165, damping: 20, mass: 0.92 },
} as const;

export const motionDuration = {
  instant: 0.16,
  quick: 0.28,
  standard: 0.46,
  reveal: 0.62,
  route: 0.72,
} as const;
