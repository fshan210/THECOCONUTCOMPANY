export const coEase = [0.16, 1, 0.3, 1] as const;

export const coMotionDuration = {
  fast: 0.25,
  medium: 0.6,
  reveal: 0.82,
  story: 1.1
} as const;

export const coMotionDistance = {
  sectionY: 28,
  cardY: 18,
  textY: "105%",
  imageScale: 1.035,
  productParallaxY: 24
} as const;

export function coTransition(duration: number = coMotionDuration.medium, delay = 0) {
  return {
    duration,
    ease: coEase,
    delay
  };
}

