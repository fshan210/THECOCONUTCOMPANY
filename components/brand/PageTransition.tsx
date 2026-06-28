"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useCoconutMotionMode } from "@/lib/animations/coconut-motion";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { shouldReduce } = useCoconutMotionMode();

  if (pathname.startsWith("/admin")) return children;

  return (
    <>
      {children}
      {shouldReduce ? null : (
        <motion.div
          aria-hidden="true"
          initial={{ scaleX: 1, opacity: 0.7 }}
          animate={{ scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none fixed inset-x-0 top-[78px] z-[90] h-1 origin-right bg-[var(--co-sun)] lg:top-[88px]"
        />
      )}
    </>
  );
}
