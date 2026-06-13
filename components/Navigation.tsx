"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/sustainability", label: "Sustainability" },
  { href: "/founders", label: "Founders" },
  { href: "/journal", label: "Journal" }
];

export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const navPadding = useTransform(scrollY, [0, 120], [16, 10]);
  const logoScale = useTransform(scrollY, [0, 120], [1, 0.82]);

  return (
    <motion.header
      className="sticky top-0 z-50 border-b border-shell/70 bg-porcelain/72 shadow-[0_10px_40px_rgba(33,25,21,0.04)] backdrop-blur-2xl"
    >
      <motion.nav style={{ paddingTop: navPadding, paddingBottom: navPadding }} className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label=".CO home">
          <motion.span style={{ scale: logoScale }} className="block origin-left">
            <Image src="/images/logo.svg" alt=".CO The Coconut Company" width={82} height={66} priority />
          </motion.span>
        </Link>
        <div className="hidden items-center gap-7 text-[0.72rem] uppercase tracking-editorial text-muted md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="group relative py-3 transition hover:text-coconut">
              {link.label}
              <motion.span
                layoutId={pathname === link.href ? "active-nav" : undefined}
                className={`absolute inset-x-0 bottom-1 h-px origin-left bg-coconut transition ${pathname === link.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
              />
            </Link>
          ))}
        </div>
        <Link
          href="/products"
          className="hidden border border-coconut px-4 py-2 text-[0.7rem] uppercase tracking-editorial text-coconut transition hover:bg-coconut hover:text-porcelain md:block"
        >
          Explore
        </Link>
        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="grid h-10 w-10 place-items-center border border-shell text-coconut md:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </motion.nav>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="mx-5 mb-4 border border-shell bg-porcelain/94 p-4 shadow-soft backdrop-blur-2xl md:hidden"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block border-b border-shell/70 py-4 text-sm uppercase tracking-editorial text-muted last:border-0"
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
