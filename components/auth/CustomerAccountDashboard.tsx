import Image from "next/image";
import Link from "next/link";
import { Heart, Leaf, MapPin, PackageCheck, Settings, ShieldCheck, Soup, UserRound } from "lucide-react";
import type { CustomerSession } from "@/lib/customer/auth-config";
import { logoutCustomer } from "@/lib/customer/actions";

const customerCards = [
  { title: "Orders", href: "/orders", body: "Track product interest, launch reservations, and future purchases.", icon: PackageCheck },
  { title: "Wishlist", href: "/wishlist", body: "Keep your favourite coconut rituals ready for launch.", icon: Heart },
  { title: "Profile", href: "/profile", body: "Manage identity, address, password, newsletter, and privacy.", icon: UserRound },
  { title: "Saved recipes", href: "/saved-recipes", body: "Return to hydration recipes and kitchen notes.", icon: Soup }
];

export function CustomerAccountDashboard({ session }: { session: CustomerSession }) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fffdf8_0%,#F5EBD7_48%,rgba(74,111,74,0.16)_100%)] px-5 py-16 md:px-8 md:py-24">
      <div className="co-wave-pattern pointer-events-none absolute inset-y-0 right-0 w-80 opacity-[0.08]" />
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.74fr_1.26fr]">
        <aside className="co-glass h-fit p-6">
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-coconut text-xl font-medium text-paper">{session.initials}</span>
            <div>
              <p className="text-sm uppercase tracking-editorial text-grove">My Account</p>
              <h1 className="font-display text-4xl text-ink">{session.name}</h1>
              <p className="text-sm text-muted">{session.email}</p>
            </div>
          </div>
          <div className="mt-8 space-y-2">
            {[
              ["Account dashboard", "/account", Settings],
              ["Profile", "/profile", UserRound],
              ["Orders", "/orders", PackageCheck],
              ["Wishlist", "/wishlist", Heart]
            ].map(([label, href, Icon]) => {
              const TypedIcon = Icon as typeof Settings;
              return (
                <Link key={href as string} href={href as string} className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm text-coconut transition hover:bg-paper">
                  <TypedIcon size={17} /> {label as string}
                </Link>
              );
            })}
          </div>
          <form action={logoutCustomer} className="mt-6 border-t border-coconut/10 pt-5">
            <button type="submit" className="min-h-11 w-full rounded-lg border border-coconut/15 px-4 text-sm font-medium text-coconut transition hover:bg-coconut hover:text-paper">
              Sign out
            </button>
          </form>
        </aside>
        <div className="space-y-6">
          <div className="co-glass overflow-hidden p-6 md:p-8">
            <div className="grid gap-8 md:grid-cols-[1fr_280px] md:items-center">
              <div>
                <p className="mb-4 text-[0.72rem] uppercase tracking-editorial text-grove">Welcome back</p>
                <h2 className="font-display text-5xl leading-tight text-ink md:text-7xl">Your coconut ritual space.</h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-muted">
                  Manage favourites, saved recipes, addresses, newsletter preferences, and future .CO orders from one calm customer workspace.
                </p>
              </div>
              <div className="relative aspect-square">
                <Image src="/assets/transparent/co-water-bottle.webp" alt=".CO Water bottle" fill sizes="280px" className="object-contain drop-shadow-[0_28px_38px_rgba(62,46,31,0.22)]" />
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {customerCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link key={card.href} href={card.href} className="co-neu co-soft-depth-hover p-6">
                  <Icon className="mb-6 text-grove" size={24} />
                  <h3 className="font-display text-4xl text-ink">{card.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{card.body}</p>
                </Link>
              );
            })}
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Newsletter", "Launch drops and recipes enabled", Leaf],
              ["Addresses", "Primary delivery region: Kerala / UAE ready", MapPin],
              ["Privacy", "Customer auth separated from admin users", ShieldCheck]
            ].map(([title, body, Icon]) => {
              const TypedIcon = Icon as typeof Leaf;
              return (
                <article key={title as string} className="co-glass p-5">
                  <TypedIcon className="mb-5 text-grove" size={20} />
                  <h3 className="font-display text-3xl text-ink">{title as string}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{body as string}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CustomerSimplePage({ session, title, body, items }: { session: CustomerSession; title: string; body: string; items: Array<{ title: string; detail: string }> }) {
  return (
    <section className="relative overflow-hidden px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <p className="mb-5 text-[0.72rem] uppercase tracking-editorial text-grove">{session.name}</p>
        <h1 className="font-display text-6xl leading-none text-ink md:text-8xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-muted">{body}</p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {items.map((item) => (
            <article key={item.title} className="co-neu p-6">
              <h2 className="font-display text-4xl text-ink">{item.title}</h2>
              <p className="mt-4 text-sm leading-7 text-muted">{item.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
