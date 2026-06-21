"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, UserRound, X } from "lucide-react";
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
      <motion.nav style={{ paddingTop: navPadding, paddingBottom: navPadding }} className="co-container co-nav-row flex items-center justify-between gap-3">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label=".CO home">
          <motion.span style={{ scale: logoScale }} className="block w-[70px] origin-left sm:w-[92px] md:w-[112px]">
            <Image src="/images/logo.svg" alt=".CO The Coconut Company" width={124} height={100} priority className="h-auto w-full" />
          </motion.span>
        </Link>
        <div className="hidden items-center gap-1 rounded-full border border-[var(--co-border)] bg-[var(--co-white)] p-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[var(--co-muted)] lg:flex">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                data-analytics="cta_click"
                data-analytics-label={`nav_${link.label.toLowerCase()}`}
                className={`rounded-full px-4 py-3 transition ${active ? "bg-[var(--co-black)] text-[var(--co-white)]" : "hover:bg-[var(--co-cream)] hover:text-[var(--co-ink)]"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/shop"
            data-analytics="cta_click"
            data-analytics-label="nav_shop"
            className="co-press rounded-full border border-[var(--co-black)] bg-[var(--co-black)] px-5 py-3 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[var(--co-white)] hover:border-[var(--co-palm)] hover:bg-[var(--co-palm)]"
          >
            Shop
          </Link>
          {session ? (
            <>
              <Link href="/orders" className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[var(--co-brown)] transition hover:text-[var(--co-palm)]">
                Orders
              </Link>
              <Link
                href="/account"
                aria-label="My Account"
                className="grid h-11 min-w-11 place-items-center rounded-full bg-[var(--co-black)] px-3 text-sm font-bold text-[var(--co-white)] transition hover:bg-[var(--co-palm)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[rgba(244,201,93,0.72)]"
              >
                {session.initials}
              </Link>
              <form action={logoutCustomer}>
                <button type="submit" className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[var(--co-muted)] transition hover:text-[var(--co-ink)]">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--co-border)] bg-[var(--co-white)] px-4 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[var(--co-ink)] transition hover:border-[var(--co-black)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[rgba(244,201,93,0.72)]"
            >
              <UserRound size={15} /> Login
            </Link>
          )}
          <CartButton />
        </div>
        <div className="flex shrink-0 items-center gap-1.5 md:hidden">
          {session ? (
            <Link href="/account" aria-label="My Account" className="grid h-10 min-w-10 place-items-center rounded-full bg-[var(--co-black)] px-2 text-xs font-bold text-[var(--co-white)]">
              {session.initials}
            </Link>
          ) : (
            <Link href="/login" aria-label="Login" className="grid h-10 w-10 place-items-center rounded-full border border-[var(--co-border)] bg-[var(--co-white)] text-[var(--co-ink)]">
              <UserRound size={16} />
            </Link>
          )}
          <CartButton />
          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--co-border)] bg-[var(--co-white)] text-[var(--co-ink)]"
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
