"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, ChevronRight, Command, LogOut, Menu, Moon, Search, Sun, X } from "lucide-react";
import { useMemo, useState } from "react";
import { logoutAdmin } from "@/lib/admin/actions";
import { adminNavItems } from "@/lib/admin/data";
import { getAdminPath } from "@/lib/admin/path";
import { type AdminRole, canAccess } from "@/lib/admin/rbac";

type AdminShellProps = {
  children: React.ReactNode;
  session: {
    email: string;
    name: string;
    role: AdminRole;
  };
};

export function AdminShell({ children, session }: AdminShellProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const visibleNav = useMemo(() => adminNavItems.filter((item) => canAccess(session.role, item.permission)), [session.role]);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-dvh bg-[linear-gradient(135deg,#fffdf8_0%,#F5EBD7_42%,rgba(168,176,123,0.28)_100%)] text-ink dark:bg-[linear-gradient(135deg,#1f1711_0%,#2d2d2d_50%,#243824_100%)] dark:text-paper">
        <div className="co-wave-pattern pointer-events-none fixed inset-y-0 right-0 w-[28vw] opacity-[0.05]" />
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-coconut/10 bg-porcelain/78 p-4 shadow-[20px_0_80px_rgba(62,46,31,0.08)] backdrop-blur-xl dark:border-paper/10 dark:bg-coconut/42 lg:block">
          <AdminSidebar pathname={pathname} nav={visibleNav} />
        </aside>

        <AnimatePresence>
          {open ? (
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-[min(88vw,320px)] border-r border-coconut/10 bg-porcelain p-4 shadow-soft lg:hidden"
            >
              <button type="button" aria-label="Close admin menu" onClick={() => setOpen(false)} className="co-neu mb-4 grid h-10 w-10 place-items-center text-coconut">
                <X size={18} />
              </button>
              <AdminSidebar pathname={pathname} nav={visibleNav} onNavigate={() => setOpen(false)} />
            </motion.aside>
          ) : null}
        </AnimatePresence>

        <div className="lg:pl-72">
          <header className="sticky top-0 z-30 border-b border-coconut/10 bg-porcelain/76 px-4 py-3 backdrop-blur-xl dark:border-paper/10 dark:bg-ink/58 md:px-6">
            <div className="flex items-center gap-3">
              <button type="button" aria-label="Open admin menu" onClick={() => setOpen(true)} className="co-neu grid h-10 w-10 place-items-center text-coconut lg:hidden">
                <Menu size={18} />
              </button>
              <div className="co-neu-inset hidden min-h-11 flex-1 items-center gap-3 px-4 text-sm text-muted md:flex">
                <Search size={16} />
                <span>Search pages, products, assets, orders, users...</span>
                <span className="ml-auto inline-flex items-center gap-1 text-[0.68rem] uppercase tracking-editorial">
                  <Command size={13} /> K
                </span>
              </div>
              <button type="button" aria-label="Toggle theme" onClick={() => setDark((value) => !value)} className="co-neu grid h-11 w-11 place-items-center text-coconut dark:bg-paper">
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button type="button" aria-label="Notifications" className="co-neu grid h-11 w-11 place-items-center text-coconut dark:bg-paper">
                <Bell size={18} />
              </button>
              <div className="hidden min-w-48 text-right sm:block">
                <p className="text-sm font-medium">{session.name}</p>
                <p className="text-xs text-muted dark:text-paper/58">{session.role}</p>
              </div>
            </div>
          </header>
          <main className="relative px-4 py-6 md:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

function AdminSidebar({
  pathname,
  nav,
  onNavigate
}: {
  pathname: string;
  nav: typeof adminNavItems;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <Link href={getAdminPath()} onClick={onNavigate} className="mb-6 flex items-center gap-3 px-2">
        <span className="block w-24">
          <Image src="/images/logo.svg" alt=".CO The Coconut Company" width={124} height={100} className="h-auto w-full" />
        </span>
        <span className="text-[0.65rem] uppercase tracking-editorial text-muted">Admin OS</span>
      </Link>
      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
        {nav.map((item) => {
          const Icon = item.icon;
          const configuredHref = item.href === "/admin" ? getAdminPath() : getAdminPath(item.href.replace("/admin/", ""));
          const active = pathname === item.href || pathname === configuredHref;
          return (
            <Link
              key={item.href}
              href={configuredHref}
              onClick={onNavigate}
              className={`group flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm transition ${
                active ? "bg-coconut text-paper shadow-[0_16px_34px_rgba(62,46,31,0.18)]" : "text-muted hover:bg-paper hover:text-coconut"
              }`}
            >
              <Icon size={17} />
              <span>{item.title}</span>
              <ChevronRight className="ml-auto opacity-0 transition group-hover:opacity-100" size={14} />
            </Link>
          );
        })}
      </nav>
      <form action={logoutAdmin} className="mt-4">
        <button type="submit" className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm text-muted transition hover:bg-paper hover:text-coconut">
          <LogOut size={17} /> Sign out
        </button>
      </form>
    </div>
  );
}
