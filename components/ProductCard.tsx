"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type ProductCardProps = {
  name: string;
  role: string;
  detail: string;
  image: string;
};

export function ProductCard({ name, role, detail, image }: ProductCardProps) {
  return (
    <motion.article
      data-analytics="product_interest_click"
      data-analytics-label={name}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="group co-neu co-soft-depth-hover relative grid gap-6 overflow-hidden p-5 md:grid-cols-[0.8fr_1fr_1.2fr] md:items-center md:p-6"
    >
      <div className="co-wave-pattern pointer-events-none absolute inset-y-0 right-0 w-36 opacity-[0.05]" />
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-grove/40 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(74,111,74,0.12),transparent_38%)]" />
      </div>
      <div className="relative aspect-[4/3] overflow-hidden bg-[linear-gradient(145deg,#fffdf8,#F5EBD7_64%,rgba(168,176,123,0.16))]">
        <div className="absolute inset-x-8 bottom-5 h-8 rounded-full bg-coconut/14 blur-xl" />
        <Image
          src={image}
          alt={name}
          fill
          sizes="(min-width: 768px) 28vw, 90vw"
          className="object-contain p-5 drop-shadow-[0_20px_28px_rgba(62,46,31,0.18)] transition duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div>
        <p className="mb-3 text-[0.7rem] uppercase tracking-editorial text-grove">{role}</p>
        <h3 className="font-display text-4xl text-ink">{name}</h3>
      </div>
      <p className="max-w-xl text-base leading-8 text-muted">{detail}</p>
    </motion.article>
  );
}
