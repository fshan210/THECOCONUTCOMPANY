import Image from "next/image";
import Link from "next/link";
import { Heart, Leaf, MapPin, PackageCheck, Settings, ShieldCheck, Soup, UserRound } from "lucide-react";
import type { CustomerSession } from "@/lib/customer/auth-config";
import { logoutCustomer } from "@/lib/customer/actions";
import { StatePanel } from "@/components/launch/StatePanel";

const customerCards = [
  { title: "Orders", href: "/orders", body: "Find your .CO order history and useful delivery notes.", icon: PackageCheck },
  { title: "Wishlist", href: "/wishlist", body: "Keep favourite coconut products and rituals close.", icon: Heart },
  { title: "Profile", href: "/profile", body: "Manage identity, address, password, newsletter, and privacy.", icon: UserRound },
  { title: "Saved recipes", href: "/saved-recipes", body: "Return to hydration recipes and kitchen notes.", icon: Soup }
];

export function CustomerAccountDashboard({ session }: { session: CustomerSession }) {
  return (
    <section className="co-section bg-[var(--co-cream)] pt-24 md:pt-32">
      <div className="co-container grid gap-6 lg:grid-cols-[0.74fr_1.26fr]">
        <aside className="h-fit rounded-[36px] border border-[var(--co-border)] bg-[var(--co-white)] p-6 shadow-[0_18px_48px_rgba(58,36,22,0.065)]">
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-[var(--co-black)] text-xl font-bold text-[var(--co-white)]">{session.initials}</span>
            <div>
              <p className="co-label">My Account</p>
              <h1 className="text-4xl font-bold leading-none text-[var(--co-ink)]">{session.name}</h1>
              <p className="mt-2 text-sm text-[var(--co-muted)]">{session.email}</p>
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
                <Link key={href as string} href={href as string} className="flex min-h-11 items-center gap-3 rounded-full px-4 text-sm font-bold text-[var(--co-brown)] transition hover:bg-[var(--co-cream)]">
                  <TypedIcon size={17} /> {label as string}
                </Link>
              );
            })}
          </div>
          <form action={logoutCustomer} className="mt-6 border-t border-[var(--co-border)] pt-5">
            <button type="submit" className="min-h-11 w-full rounded-full border border-[var(--co-border)] px-4 text-sm font-bold text-[var(--co-brown)] transition hover:bg-[var(--co-black)] hover:text-[var(--co-white)]">
              Sign out
            </button>
          </form>
        </aside>
        <div className="space-y-6">
          <div className="overflow-hidden rounded-[48px] border border-[var(--co-border)] bg-[var(--co-white)] p-6 shadow-[0_18px_48px_rgba(58,36,22,0.065)] md:p-8">
            <div className="grid gap-8 md:grid-cols-[1fr_280px] md:items-center">
              <div>
                <p className="co-label mb-4">Welcome back</p>
                <h2 className="text-[clamp(48px,7vw,96px)] font-bold leading-[0.86] text-[var(--co-ink)]">Your coconut ritual space.</h2>
                <p className="co-body mt-5 max-w-2xl">
                  Manage favourites, saved recipes, addresses, newsletter preferences, and .CO orders from one calm customer space.
                </p>
              </div>
              <div className="relative aspect-square">
                <Image src="/assets/transparent/co-water-bottle.png" alt=".CO Water bottle" fill sizes="280px" className="object-contain drop-shadow-[0_28px_38px_rgba(62,46,31,0.22)]" />
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {customerCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link key={card.href} href={card.href} className="co-press rounded-[36px] border border-[var(--co-border)] bg-[var(--co-white)] p-6 shadow-[0_18px_48px_rgba(58,36,22,0.065)]">
                  <Icon className="mb-6 text-[var(--co-palm)]" size={24} />
                  <h3 className="text-4xl font-bold leading-none text-[var(--co-ink)]">{card.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[var(--co-muted)]">{card.body}</p>
                </Link>
              );
            })}
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Newsletter", "Product notes and recipes enabled", Leaf],
              ["Addresses", "Keep delivery details ready for checkout", MapPin],
              ["Privacy", "Simple tools for your customer account", ShieldCheck]
            ].map(([title, body, Icon]) => {
              const TypedIcon = Icon as typeof Leaf;
              return (
                <article key={title as string} className="rounded-[28px] border border-[var(--co-border)] bg-[var(--co-white)] p-5">
                  <TypedIcon className="mb-5 text-[var(--co-palm)]" size={20} />
                  <h3 className="text-3xl font-bold leading-none text-[var(--co-ink)]">{title as string}</h3>
                  <p className="mt-4 text-sm leading-7 text-[var(--co-muted)]">{body as string}</p>
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
    <section className="co-section bg-[var(--co-cream)] pt-24 md:pt-32">
      <div className="co-container">
        <p className="co-label mb-5">{session.name}</p>
        <h1 className="text-[clamp(64px,10vw,150px)] font-bold leading-[0.82] text-[var(--co-ink)]">{title}</h1>
        <p className="co-body mt-6 max-w-2xl">{body}</p>
        {items.length ? <div className="mt-10 grid gap-4 md:grid-cols-3">
          {items.map((item) => (
            <article key={item.title} className="rounded-[36px] border border-[var(--co-border)] bg-[var(--co-white)] p-6 shadow-[0_18px_48px_rgba(58,36,22,0.065)]">
              <h2 className="text-4xl font-bold leading-none text-[var(--co-ink)]">{item.title}</h2>
              <p className="mt-5 text-sm leading-7 text-[var(--co-muted)]">{item.detail}</p>
            </article>
          ))}
        </div> : <StatePanel className="mt-10 max-w-[720px]" kind="empty" title="Nothing saved yet." body="Use the heart on a product or recipe and it will appear here." primary={{label:"Browse products",href:"/shop"}} secondary={{label:"Explore recipes",href:"/recipes"}} />}
      </div>
    </section>
  );
}
