"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { motionEase } from "@/lib/motion";
import { CoconutLoader } from "./CoconutLoader";
import { useCoMotion } from "./MotionProvider";

export function RouteTransition({ children }: { children: ReactNode }) {
  const { routePhase, quality } = useCoMotion();
  const active = routePhase !== "idle";
  return (
    <>
      <div data-motion-element="route-shell">{children}</div>
      <AnimatePresence>
        {active && quality === "full" ? (
          <motion.div className="co-route-transition" initial={{ opacity: 0, clipPath: "inset(0 100% 0 0 round 0 100% 100% 0)" }} animate={{ opacity: routePhase === "revealing" ? 0 : 1, clipPath: "inset(0 0% 0 0 round 0)" }} exit={{ opacity: 0 }} transition={{ duration: routePhase === "revealing" ? .38 : .28, ease: motionEase }} aria-hidden={routePhase === "revealing"}>
            <div className="co-route-leaf" />
            <CoconutLoader mode="route" label={routePhase === "navigating" ? "Opening the next story" : "Made for living"} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
