import type { ReactNode } from "react";
import { PageTransition } from "@/components/brand/PageTransition";
import { PremiumMotionSystem } from "@/components/motion/PremiumMotionSystem";

export default function Template({ children }: { children: ReactNode }) {
  return <PageTransition><PremiumMotionSystem />{children}</PageTransition>;
}
