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
          initial={{ opacity: 0.94, clipPath: "inset(0 0 0 0)" }}
          animate={{ opacity: 0, clipPath: "inset(0 0 0 100%)" }}
          transition={{ duration: 0.46, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none fixed inset-0 z-[90] origin-right bg-[linear-gradient(105deg,rgba(248,244,236,.98)_0%,rgba(248,244,236,.94)_58%,rgba(33,77,43,.10)_82%,rgba(78,122,67,.22)_100%)] backdrop-blur-[2px]"
        >
          <span className="absolute -right-[8vw] -top-[20vh] h-[130vh] w-[42vw] rotate-[14deg] rounded-[100%_0_100%_0] bg-[linear-gradient(90deg,transparent,rgba(33,77,43,.08))]" />
        </motion.div>
      )}
    </>
  );
}
