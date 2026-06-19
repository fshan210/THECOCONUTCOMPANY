"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Menu, UserRound, X } from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CartButton } from "@/components/cart/CartDrawer";
import { useCustomerSession } from "@/components/auth/CustomerAuthProvider";
import { logoutCustomer } from "@/lib/customer/actions";

const links = [
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/shop", label: "Shop" },
  { href: "/recipes", label: "Recipes" },
  { href: "/sustainability", label: "Sustainability" },
  { href: "/founders", label: "Founders" },
  { href: "/journal", label: "Journal" }
];

export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const session = useCustomerSession();
  const { scrollY } = useScroll();
  const navPadding = useTransform(scrollY, [0, 120], [18, 11]);
  const logoScale = useTransform(scrollY, [0, 120], [1, 0.9]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <motion.header
      className="co-glass sticky top-0 z-50 border-x-0 border-t-0"
    >
      <motion.nav style={{ paddingTop: navPadding, paddingBottom: navPadding }} className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label=".CO home">
          <motion.span style={{ scale: logoScale }} className="block w-[92px] origin-left md:w-[112px]">
            <Image src="/images/logo.svg" alt=".CO The Coconut Company" width={124} height={100} priority className="h-auto w-full" />
          </motion.span>
        </Link>
        <div className="hidden items-center gap-5 text-[0.7rem] uppercase tracking-editorial text-muted lg:flex xl:gap-7">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-analytics="cta_click"
              data-analytics-label={`nav_${link.label.toLowerCase()}`}
              className="group relative py-3 transition hover:text-coconut"
            >
              {link.label}
              <motion.span
                layoutId={pathname === link.href ? "active-nav" : undefined}
                className={`absolute inset-x-0 bottom-1 h-px origin-left bg-coconut transition ${pathname === link.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
              />
            </Link>
          ))}
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="co-neu grid h-10 w-10 place-items-center text-coconut transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coconut"
          >
            <Heart size={16} />
          </Link>
          <Link
            href="/shop"
            data-analytics="cta_click"
            data-analytics-label="nav_shop"
            className="border border-coconut px-4 py-2 text-[0.7rem] uppercase tracking-editorial text-coconut shadow-[0_12px_30px_rgba(62,46,31,0.06)] transition hover:bg-coconut hover:text-porcelain"
          >
            Shop
          </Link>
          {session ? (
            <>
              <Link href="/orders" className="text-[0.7rem] uppercase tracking-editorial text-coconut transition hover:text-grove">
                Orders
              </Link>
              <Link
                href="/account"
                aria-label="My Account"
                className="grid h-10 min-w-10 place-items-center rounded-full bg-coconut px-3 text-sm font-medium text-paper shadow-[0_12px_30px_rgba(62,46,31,0.18)] transition hover:bg-grove focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coconut"
              >
                {session.initials}
              </Link>
              <form action={logoutCustomer}>
                <button type="submit" className="text-[0.7rem] uppercase tracking-editorial text-muted transition hover:text-coconut">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-coconut px-4 text-[0.7rem] uppercase tracking-editorial text-paper shadow-[0_12px_30px_rgba(62,46,31,0.16)] transition hover:bg-grove focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coconut"
            >
              <UserRound size={15} /> Login
            </Link>
          )}
          <CartButton />
        </div>
        <div className="flex items-center gap-2 md:hidden">
          {session ? (
            <Link href="/account" aria-label="My Account" className="grid h-10 min-w-10 place-items-center rounded-full bg-coconut px-2 text-xs font-medium text-paper">
              {session.initials}
            </Link>
          ) : (
            <Link href="/login" aria-label="Login" className="co-neu grid h-10 w-10 place-items-center text-coconut">
              <UserRound size={16} />
            </Link>
          )}
          <CartButton />
          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="co-neu grid h-10 w-10 place-items-center text-coconut"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.nav>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="co-glass mx-5 mb-4 p-4 md:hidden"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-analytics="cta_click"
                data-analytics-label={`mobile_nav_${link.label.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className="block border-b border-shell/70 py-4 text-sm uppercase tracking-editorial text-muted last:border-0"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/wishlist" onClick={() => setOpen(false)} className="block border-b border-shell/70 py-4 text-sm uppercase tracking-editorial text-muted">
              Wishlist
            </Link>
            <Link href={session ? "/account" : "/login"} onClick={() => setOpen(false)} className="block py-4 text-sm uppercase tracking-editorial text-coconut">
              {session ? "My Account" : "Login"}
            </Link>
            {session ? (
              <>
                <Link href="/orders" onClick={() => setOpen(false)} className="block border-t border-shell/70 py-4 text-sm uppercase tracking-editorial text-muted">
                  Orders
                </Link>
                <form action={logoutCustomer}>
                  <button type="submit" className="block w-full py-4 text-left text-sm uppercase tracking-editorial text-coconut">
                    Logout
                  </button>
                </form>
              </>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
