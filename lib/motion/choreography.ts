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
  homepage: {
    lower: {
      routine: {
        cycleMs: 3300,
        pulseCycleMs: 3400,
        crossfadeSeconds: 0.55,
      },
      outsideShelf: {
        cycleMs: 5200,
        transitionSeconds: 1.15,
      },
    },
    heroScrape: {
      desktopScrollHeightVh: 280,
      mobileScrollHeightVh: 270,
      reducedMotionHeightVh: 220,
      thresholds: {
        heroEnd: 0.46,
        heroFadeStart: 0.28,
        videoVisualStart: 0.34,
        videoTimelineStart: 0.46,
        videoTimelineEnd: 0.79,
        videoFinalHoldEnd: 0.86,
        originVisualStart: 0.86,
        originCopyStart: 0.91,
        originJourneyStart: 0.94,
        receiptReveal: 0.98,
        routineReveal: 1,
      },
      hero: {
        stableEnd: 0.28,
        fadeStart: 0.28,
        copyOpacity: {
          input: [0, 0.28, 0.40, 0.46] as const,
          output: [1, 1, 0.45, 0] as const,
        },
        copyY: {
          input: [0.28, 0.46] as const,
          output: [0, -27] as const,
        },
        trustOpacity: {
          input: [0, 0.29, 0.40, 0.46] as const,
          output: [1, 1, 0.35, 0] as const,
        },
        trustY: {
          input: [0.29, 0.46] as const,
          output: [0, -18] as const,
        },
        shelfOpacity: {
          input: [0, 0.28, 0.39, 0.46] as const,
          output: [1, 1, 0.32, 0] as const,
        },
        shelfY: {
          input: [0.28, 0.46] as const,
          output: [0, 10] as const,
        },
        orbitOpacity: {
          input: [0, 0.30, 0.39, 0.45] as const,
          output: [1, 1, 0.22, 0] as const,
        },
        coconutMotion: [0.24, 0.46] as const,
        coconutOpacity: {
          input: [0, 0.33, 0.39, 0.43, 0.46] as const,
          output: [1, 1, 0.92, 0.48, 0] as const,
        },
        contactShadow: [0.28, 0.46] as const,
        ambientShadow: [0.30, 0.46] as const,
      },
      cinematicVeil: {
        input: [0.28, 0.36, 0.43, 0.48, 0.54, 0.82, 0.86] as const,
        output: [0, 0.24, 0.54, 0.24, 0, 0, 0.42] as const,
      },
      video: {
        appearance: {
          input: [0.34, 0.39, 0.46, 0.79, 0.86, 0.94] as const,
          output: [0, 0.18, 1, 1, 1, 0] as const,
        },
        timelineStart: 0.46,
        timelineEnd: 0.79,
        introTimestampSeconds: 0.20,
        sourceDurationSeconds: 11,
        finalTimestampSeconds: 10.9667,
        finalFrameGuardSeconds: 0.0333,
        seekDamping: 0.22,
        finalHold: [0.79, 0.86] as const,
        copy: {
          first: [0.50, 0.55, 0.61, 0.66] as const,
          second: [0.62, 0.67, 0.72, 0.77] as const,
        },
      },
      origin: {
        reveal: {
          input: [0.86, 0.89, 0.92, 0.94] as const,
          output: [0, 0.24, 0.82, 1] as const,
        },
        copy: {
          input: [0.91, 0.95, 0.99] as const,
          output: [0, 0.72, 1] as const,
        },
        stickyRelease: 1,
      },
    },
    originReceipt: {
      origin: {
        desktopScrollHeightSvh: 205,
        mobileScrollHeightSvh: 185,
        headline: { durationSeconds: 0.88, yPx: 18 },
        environment: { durationSeconds: 1.08, initialScale: 0.99 },
        sceneThresholds: {
          harvest: [0.22, 0.34, 0.48, 0.58] as const,
          craft: [0.46, 0.57, 0.70, 0.80] as const,
          everyday: [0.70, 0.80, 0.94, 1] as const,
          products: [0.72, 0.84, 0.98] as const,
        },
        path: {
          drawStart: 0.16,
          drawEnd: 0.90,
          milestoneThresholds: [0.18, 0.39, 0.61, 0.82] as const,
          milestoneScale: 1.025,
          lightRadius: 4,
        },
        parallax: {
          background: 0.035,
          midground: 0.06,
          foreground: 0.085,
        },
      },
      handoff: { start: 0.8, end: 1 },
      receipt: {
        rowDurationSeconds: 0.52,
        rowYpx: 8,
        selectedProductYpx: -6,
        selectedProductScale: 1.01,
      },
    },
    hero: {
      coconut: { yVh: -24, rotateDeg: 24, scale: 0.91 },
      copy: { yPx: -27, opacity: 0.45 },
      trust: { yPx: -18, opacity: 0.35 },
      contactShadow: {
        opacity: [0.4, 0] as const,
        scaleX: [1, 0.52] as const,
        scaleY: [1, 0.65] as const,
        yPx: [0, 8] as const,
        blurPx: [5, 11] as const,
      },
      ambientShadow: {
        opacity: [0.22, 0.04] as const,
        scaleX: [1, 0.68] as const,
        scaleY: [1, 0.78] as const,
        yPx: [0, 5] as const,
        blurPx: [12, 20] as const,
      },
    },
  },
} as const;
