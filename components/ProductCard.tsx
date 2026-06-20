"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BrandImage } from "@/components/BrandImage";

type ProductCardProps = {
  name: string;
  role: string;
  detail: string;
  image: string;
  hoverImage?: string;
};

export function ProductCard({ name, role, detail, image, hoverImage }: ProductCardProps) {
  return (
    <motion.article
      data-analytics="product_interest_click"
      data-analytics-label={name}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.45, ease: [0.215, 0.61, 0.355, 1] }}
      className="group relative grid gap-6 overflow-hidden rounded-3xl border border-coconut/10 bg-[#fff8ea] p-4 shadow-[0_18px_50px_rgba(62,46,31,0.06)] transition duration-300 hover:shadow-[0_24px_64px_rgba(62,46,31,0.1)] md:grid-cols-[0.78fr_0.9fr_1.25fr] md:items-center md:p-5"
    >
      <div className="co-wave-pattern pointer-events-none absolute inset-y-0 right-0 w-36 opacity-[0.045]" />
      <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-coconut/12" />
      <div className="relative">
        <BrandImage
          src={image}
          alt={name}
          sizes="(min-width: 768px) 28vw, 90vw"
          aspect="portrait"
          fit="contain"
          hoverZoom
          className="rounded-2xl bg-paper"
          imageClassName="drop-shadow-[0_20px_28px_rgba(62,46,31,0.18)]"
        />
        {hoverImage ? (
          <Image
            src={hoverImage}
            alt=""
            aria-hidden="true"
            fill
            sizes="(min-width: 768px) 28vw, 90vw"
            className="rounded-2xl object-contain p-5 opacity-0 drop-shadow-[0_20px_28px_rgba(62,46,31,0.18)] transition duration-700 ease-out group-hover:scale-[1.03] group-hover:opacity-100"
          />
        ) : null}
      </div>
      <div className="relative">
        <p className="mb-3 text-[0.7rem] font-medium uppercase tracking-editorial text-grove">{role}</p>
        <h3 className="font-display text-4xl font-light leading-tight text-coconut">{name}</h3>
      </div>
      <p className="relative max-w-xl text-base leading-8 text-coconut/68">{detail}</p>
    </motion.article>
  );
}
