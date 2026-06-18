"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="relative overflow-hidden border-t border-shell bg-ink text-paper">
      <div className="co-wave-pattern pointer-events-none absolute inset-y-0 right-0 w-80 opacity-[0.06]" />
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:px-8">
        <div>
          <div className="relative mb-8 inline-block">
            <Image src="/images/logo.svg" alt=".CO The Coconut Company" width={104} height={84} className="brightness-125" />
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 rounded-full border border-paper/10"
            >
              <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-clay shadow-[0_0_18px_rgba(184,134,100,0.65)]" />
            </motion.span>
          </div>
          <p className="max-w-sm font-display text-3xl leading-tight">
            A coconut house from Palakkad, built for a global life.
          </p>
        </div>
        <div className="space-y-4 text-sm text-paper/70">
          <p className="text-[0.7rem] uppercase tracking-editorial text-paper">Pages</p>
          {[
            { label: "About", href: "/about" },
            { label: "Products", href: "/products" },
            { label: "Shop", href: "/shop" },
            { label: "Recipes", href: "/recipes" },
            { label: "Sustainability", href: "/sustainability" },
            { label: "Founders", href: "/founders" },
            { label: "Journal", href: "/journal" }
          ].map((item) => (
            <Link key={item.href} href={item.href} className="block transition hover:text-paper">
              {item.label}
            </Link>
          ))}
        </div>
        <div className="space-y-4 text-sm text-paper/70">
          <p className="text-[0.7rem] uppercase tracking-editorial text-paper">Base</p>
          <p>Palakkad, Kerala</p>
          <p>Direct farm and village aggregation network.</p>
          <p className="pt-6 text-xs uppercase tracking-editorial">.CO | The Coconut Company</p>
        </div>
      </div>
    </footer>
  );
}
