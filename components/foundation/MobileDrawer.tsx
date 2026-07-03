"use client";

import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { coPopupVariants } from "@/lib/animation/motion-constants";
import { useBodyScrollLock } from "@/lib/ui/use-body-scroll-lock";

type MobileDrawerProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function MobileDrawer({ open, onClose, children }: MobileDrawerProps) {
  useBodyScrollLock(open);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onClose, open]);
  return (
    <AnimatePresence>
      {open ? (
        <motion.div onClick={onClose} className="fixed inset-0 z-50 bg-[rgba(45,45,45,0.24)] p-3 backdrop-blur-sm md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()} className="co-premium-glass ml-auto max-h-full max-w-sm overflow-y-auto overscroll-contain rounded-[32px] p-5 [touch-action:pan-y]" variants={coPopupVariants} initial="hidden" animate="visible" exit="exit">
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
