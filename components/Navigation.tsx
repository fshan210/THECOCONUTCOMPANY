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
  const navPadding = useTransform(scrollY, [0, 120], [16, 10]);
  const logoScale = useTransform(scrollY, [0, 120], [1, 0.92]);

  const configuredAdminPath = getAdminPath();
  if (pathname.startsWith("/admin") || pathname === configuredAdminPath || pathname.startsWith(`${configuredAdminPath}/`)) return null;

  return (
    <motion.header className="sticky top-0 isolate z-[100] border-b border-[var(--co-border)] bg-[var(--co-cream)]">
      <motion.nav
        style={{ paddingTop: navPadding, paddingBottom: navPadding, width: "calc(100vw - 24px)", maxWidth: "var(--co-max)" }}
        className="co-container co-nav-row relative grid grid-cols-[auto_auto] items-center justify-between gap-3 lg:flex lg:justify-between"
      >
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label=".CO home">
          <motion.span style={{ scale: logoScale }} className="block w-[70px] origin-left sm:w-[82px] md:w-[92px]">
            <Image src="/images/logo.svg" alt=".CO The Coconut Company" width={124} height={100} priority className="h-auto w-full" />
          </motion.span>
        </Link>
        <div className="hidden items-center gap-8 text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[var(--co-ink)] lg:flex">
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
        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/shop" aria-label="Search products" className="grid h-11 w-11 place-items-center rounded-[16px] text-[var(--co-ink)] transition hover:bg-[var(--co-white)]">
            <Search size={20} />
          </Link>
          {session ? (
            <>
              <Link
                href="/account"
                aria-label="My Account"
                className="grid h-11 min-w-11 place-items-center rounded-[16px] border border-[var(--co-border)] bg-[var(--co-white)] px-3 text-sm font-bold text-[var(--co-ink)] transition hover:border-[var(--co-black)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[rgba(244,201,93,0.72)]"
              >
                {session.initials}
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              aria-label="Login"
              className="grid h-11 w-11 place-items-center rounded-[16px] border border-[var(--co-border)] bg-[var(--co-white)] text-[var(--co-ink)] transition hover:border-[var(--co-black)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[rgba(244,201,93,0.72)]"
            >
              <UserRound size={18} />
            </Link>
          )}
          <CartButton />
        </div>
        <div className="lg:hidden">
          <Link href="/shop" aria-label="Search products" className="fixed right-[108px] top-6 z-[110] grid h-10 w-10 place-items-center rounded-full text-[var(--co-ink)]">
            <Search size={24} strokeWidth={2.1} />
          </Link>
          <CartButton showZero className="fixed right-[60px] top-6 z-[110] rounded-[12px]" />
          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="fixed right-3 top-6 z-[110] grid h-10 w-10 place-items-center rounded-full text-[var(--co-ink)]"
          >
            {open ? <X size={26} strokeWidth={2.1} /> : <Menu size={28} strokeWidth={2.1} />}
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
            className="mx-3 mb-4 rounded-[36px] border border-[var(--co-border)] bg-[var(--co-white)] p-4 shadow-[0_18px_48px_rgba(58,36,22,0.08)] md:hidden"
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
  );
}
