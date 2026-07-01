"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Search, UserRound, X } from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CartButton } from "@/components/cart/CartDrawer";
import { useCustomerSession } from "@/components/auth/CustomerAuthProvider";
import { logoutCustomer } from "@/lib/customer/actions";
import { getAdminPath } from "@/lib/admin/path";

const links = [
  { href: "/about", label: "About" },
  { href: "/shop#all-products", label: "Products" },
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
  const headerBackground = useTransform(scrollY, [0, 90], ["rgba(245, 235, 215, 0.96)", "rgba(245, 235, 215, 0.84)"]);
  const headerShadow = useTransform(scrollY, [0, 90], ["0 0 0 rgba(58, 36, 22, 0)", "inset 0 1px 0 rgba(255,255,255,0.74), 0 22px 60px rgba(58, 36, 22, 0.14)"]);
  const headerBorder = useTransform(scrollY, [0, 90], ["rgba(58, 36, 22, 0.14)", "rgba(58, 36, 22, 0.18)"]);
  const headerWidth = useTransform(scrollY, [0, 90], ["100%", "min(1180px, calc(100% - 32px))"]);
  const headerRadius = useTransform(scrollY, [0, 90], ["0px", "40px"]);
  const headerTop = useTransform(scrollY, [0, 90], ["0px", "14px"]);

  const configuredAdminPath = getAdminPath();
  if (pathname === "/" || pathname === "/about" || pathname === "/shop" || pathname === "/recipes" || pathname.startsWith("/recipes/") || pathname === "/sustainability" || pathname === "/founders" || pathname.startsWith("/admin") || pathname === configuredAdminPath || pathname.startsWith(`${configuredAdminPath}/`)) return null;

  return (
    <>
      <div aria-hidden="true" className="h-[78px] lg:h-[88px]" />
      <motion.header
        style={{
          top: headerTop,
          width: headerWidth,
          borderRadius: headerRadius,
          backgroundColor: headerBackground,
          boxShadow: headerShadow,
          borderColor: headerBorder,
          WebkitBackdropFilter: "blur(22px)",
          backdropFilter: "blur(22px)"
        }}
        className="co-site-header fixed left-1/2 z-[100] -translate-x-1/2 overflow-visible border"
      >
        <nav className="co-container co-nav-row relative flex min-h-[66px] items-center justify-between gap-2 py-2 lg:min-h-[76px] lg:gap-4 lg:py-3">
          <Link href="/" className="flex min-w-0 items-center gap-3" aria-label=".CO home">
            <span className="relative block aspect-[188/150] w-[74px] origin-left sm:w-[82px] md:w-[88px]">
              <Image src="/images/logo.svg" alt=".CO The Coconut Company" fill priority sizes="88px" className="object-contain" />
            </span>
          </Link>
          <div className="hidden items-center gap-6 text-[0.7rem] font-bold uppercase tracking-[0.08em] text-[var(--co-ink)] lg:flex xl:gap-8">
            {links.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-analytics="cta_click"
                  data-analytics-label={`nav_${link.label.toLowerCase()}`}
                  className={`relative py-2 transition after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-center after:bg-[var(--co-black)] after:transition-transform ${active ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/shop"
              aria-label="Search products"
              className="grid h-11 w-11 place-items-center rounded-[24px] text-[var(--co-ink)] transition hover:bg-[var(--co-white)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[rgba(244,201,93,0.72)]"
            >
              <Search size={20} />
            </Link>
            {session ? (
              <Link
                href="/account"
                aria-label="My Account"
                className="grid h-11 min-w-11 place-items-center rounded-[24px] border border-[var(--co-border)] bg-[var(--co-white)] px-3 text-sm font-bold text-[var(--co-ink)] transition hover:border-[var(--co-black)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[rgba(244,201,93,0.72)]"
              >
                {session.initials}
              </Link>
            ) : (
              <Link
                href="/login"
                aria-label="Login"
                className="grid h-11 w-11 place-items-center rounded-[24px] border border-[var(--co-border)] bg-[var(--co-white)] text-[var(--co-ink)] transition hover:border-[var(--co-black)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[rgba(244,201,93,0.72)]"
              >
                <UserRound size={18} />
              </Link>
            )}
            <CartButton />
          </div>
          <div className="co-mobile-controls ml-auto flex shrink-0 items-center justify-end gap-1 lg:hidden">
            <Link
              href="/shop"
              aria-label="Search products"
              className="co-mobile-search grid h-11 w-11 place-items-center rounded-[24px] text-[var(--co-ink)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[rgba(244,201,93,0.72)]"
            >
              <Search size={21} strokeWidth={2.1} />
            </Link>
            <CartButton showZero className="co-mobile-cart h-11 w-11 rounded-[24px]" />
            <button
              type="button"
              aria-label="Toggle navigation"
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
              className="co-mobile-menu grid h-11 w-11 place-items-center rounded-[24px] text-[var(--co-ink)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[rgba(244,201,93,0.72)]"
            >
              {open ? <X size={24} strokeWidth={2.1} /> : <Menu size={26} strokeWidth={2.1} />}
            </button>
          </div>
        </nav>
        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="mx-3 mb-3 rounded-[32px] border border-[var(--co-border)] bg-[var(--co-white)] p-4 shadow-[0_18px_48px_rgba(58,36,22,0.08)] lg:hidden"
            >
              {links.map((link) => {
                const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    data-analytics="cta_click"
                    data-analytics-label={`mobile_nav_${link.label.toLowerCase()}`}
                    onClick={() => setOpen(false)}
                    className={`block border-b border-[var(--co-border)] py-4 text-sm font-bold uppercase tracking-[0.12em] last:border-0 ${active ? "text-[var(--co-palm)]" : "text-[var(--co-muted)]"}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link href="/wishlist" onClick={() => setOpen(false)} className="block border-b border-[var(--co-border)] py-4 text-sm font-bold uppercase tracking-[0.12em] text-[var(--co-muted)]">
                Wishlist
              </Link>
              <Link href={session ? "/account" : "/login"} onClick={() => setOpen(false)} className="block py-4 text-sm font-bold uppercase tracking-[0.12em] text-[var(--co-ink)]">
                {session ? "My Account" : "Login"}
              </Link>
              {session ? (
                <>
                  <Link href="/orders" onClick={() => setOpen(false)} className="block border-t border-[var(--co-border)] py-4 text-sm font-bold uppercase tracking-[0.12em] text-[var(--co-muted)]">
                    Orders
                  </Link>
                  <form action={logoutCustomer}>
                    <button type="submit" className="block w-full py-4 text-left text-sm font-bold uppercase tracking-[0.12em] text-[var(--co-ink)]">
                      Logout
                    </button>
                  </form>
                </>
              ) : null}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
