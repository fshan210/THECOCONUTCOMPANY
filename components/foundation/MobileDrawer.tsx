"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { coPopupVariants } from "@/lib/animation/motion-constants";

type MobileDrawerProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function MobileDrawer({ open, onClose, children }: MobileDrawerProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-50 bg-[rgba(45,45,45,0.24)] p-4 backdrop-blur-sm md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="co-premium-glass ml-auto h-full max-w-sm rounded-[32px] p-5" variants={coPopupVariants} initial="hidden" animate="visible" exit="exit">
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close menu">
              <X size={20} />
            </Button>
            <div className="mt-6">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
