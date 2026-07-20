import type { Variants } from "framer-motion";
import { choreography } from "./choreography";
import { motionDuration, motionEase } from "./physics";

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: choreography.section.distance, filter: `blur(${choreography.section.blur}px)` },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: motionDuration.reveal, ease: motionEase } },
};

export const imageRevealVariants: Variants = {
  hidden: { opacity: 0, scale: 1.035, filter: "blur(9px)" },
  visible: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.78, ease: motionEase } },
};

export const hoverLift = { y: -6, scale: 1.012 } as const;
