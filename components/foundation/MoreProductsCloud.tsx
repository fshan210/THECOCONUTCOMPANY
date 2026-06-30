"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { coPopupVariants } from "@/lib/animation/motion-constants";

type MoreProduct = {
  title: string;
  slug: string;
  description?: string;
};

type MoreProductsCloudProps = {
  open: boolean;
  products: MoreProduct[];
  onBack: () => void;
  onClose: () => void;
};

export function MoreProductsCloud({ open, products, onBack, onClose }: MoreProductsCloudProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="co-premium-glass absolute left-1/2 top-full z-20 mt-4 w-[min(92vw,760px)] -translate-x-1/2 rounded-[40px] p-5 md:p-6"
          variants={coPopupVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="dialog"
          aria-label="More product categories"
        >
          <div className="flex items-center justify-between gap-3">
            <Button variant="outline" size="sm" onClick={onBack}>
              Back to Categories
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close more products">
              <X size={18} />
            </Button>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link key={product.slug} href={`/shop?product=${product.slug}`} className="rounded-[28px] border border-[var(--co-border)] bg-[rgba(255,255,255,0.66)] p-4 transition-transform duration-500 ease-out hover:-translate-y-1">
                <span className="block text-lg font-bold text-[var(--co-brown)]">{product.title}</span>
                {product.description ? <span className="mt-2 block text-sm leading-6 text-[var(--co-muted)]">{product.description}</span> : null}
              </Link>
            ))}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
