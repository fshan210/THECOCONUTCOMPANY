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
          key={pathname}
          aria-hidden="true"
          initial={{ opacity: 0.96, clipPath: "inset(0 0 0 0)" }}
          animate={{ opacity: 0, clipPath: "inset(0 0 0 100%)" }}
          transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none fixed inset-0 z-[290] origin-right overflow-hidden bg-[linear-gradient(105deg,rgba(248,244,236,.98)_0%,rgba(248,244,236,.95)_58%,rgba(33,77,43,.12)_82%,rgba(78,122,67,.24)_100%)] backdrop-blur-[5px]"
        >
          <motion.span initial={{x:"20%",rotate:12}} animate={{x:"-125%",rotate:4}} transition={{duration:.62,ease:[.16,1,.3,1]}} className="absolute -right-[8vw] -top-[20vh] h-[130vh] w-[42vw] rounded-[100%_0_100%_0] bg-[linear-gradient(90deg,transparent,rgba(33,77,43,.14))]" />
          <motion.span initial={{scale:.2,opacity:.55}} animate={{scale:3.4,opacity:0}} transition={{duration:.56,ease:"easeOut"}} className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#214d2b]/25" />
        </motion.div>
      )}
    </>
  );
}
