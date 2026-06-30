export const coMotion = {
  ease: [0.16, 1, 0.3, 1] as const,
  duration: {
    fast: 0.25,
    ui: 0.45,
    reveal: 0.8,
    cinematic: 1.1
  },
  stagger: {
    tight: 0.04,
    editorial: 0.075,
    story: 0.12
  },
  distance: {
    small: 12,
    medium: 24,
    large: 42
  }
} as const;

export const coRevealVariants = {
  hidden: {
    opacity: 0,
    y: coMotion.distance.medium,
    filter: "blur(10px)"
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: coMotion.duration.reveal,
      ease: coMotion.ease
    }
  }
} as const;

export const coPopupVariants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 10
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: coMotion.duration.ui,
      ease: coMotion.ease
    }
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 10,
    transition: {
      duration: 0.28,
      ease: coMotion.ease
    }
  }
} as const;
