"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Mail } from "lucide-react";
import { productCategories, recipes } from "@/lib/catalog";
import { publicAssets } from "@/lib/public-assets";

const links = [
  { label: "About", href: "/about" },
  { label: "Products", href: "/shop#all-products" },
  { label: "Shop", href: "/shop" },
  { label: "Recipes", href: "/recipes" },
  { label: "Sustainability", href: "/sustainability" },
  { label: "Founders", href: "/founders" },
  { label: "Journal", href: "/journal" }
];

export function Footer() {
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/about" || pathname === "/shop" || pathname === "/recipes" || pathname.startsWith("/recipes/") || pathname === "/sustainability" || pathname === "/founders" || pathname.startsWith("/journal") || pathname.startsWith("/admin")) return null;

  return (
    <footer className="relative z-10 overflow-visible rounded-t-[2rem] border-t border-coconut/10 bg-coconut text-paper">
      <div className="co-wave-pattern pointer-events-none absolute inset-y-0 right-0 w-80 opacity-[0.07]" />
      <div className="pointer-events-none absolute -top-10 left-5 hidden rounded-full border border-paper/10 px-5 py-3 text-[0.65rem] uppercase tracking-editorial text-paper/45 md:block">
        Made for Living
      </div>
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:px-8 lg:grid-cols-[1.1fr_0.76fr_0.76fr_0.9fr]">
        <div className="relative">
          <span className="relative mb-8 block aspect-[188/150] w-[116px]">
            <Image src="/images/logo.svg" alt=".CO The Coconut Company" fill sizes="116px" className="object-contain brightness-125" />
          </span>
          <p className="max-w-md font-display text-4xl font-light leading-tight md:text-5xl">A coconut company from Palakkad, made for everyday living.</p>
          <p className="mt-7 max-w-sm text-sm leading-7 text-paper/68">Coconut water, MELT.CO, kitchen staples, Botanica care, recipes, and warm rituals for the fridge, shelf, and table.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              ["Instagram", "https://www.instagram.com/cothecoconutcompany"],
              ["LinkedIn", "https://www.linkedin.com/company/dotcolife"]
            ].map(([label, href]) => (
              <a key={href} href={href} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-2xl border border-paper/12 px-4 text-xs font-medium uppercase tracking-editorial text-paper/72 transition hover:border-sun hover:text-sun">
                {label} <ArrowUpRight size={13} />
              </a>
            ))}
          </div>
        </div>
        <nav className="space-y-3 text-sm text-paper/70" aria-label="Footer navigation">
          <p className="mb-5 text-[0.7rem] font-medium uppercase tracking-editorial text-paper">Pages</p>
          {links.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href} className={`block rounded-xl px-3 py-2 transition ${active ? "bg-paper/10 text-sun" : "hover:bg-paper/8 hover:text-paper"}`}>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-7 text-sm text-paper/70">
          <div>
            <p className="mb-5 text-[0.7rem] font-medium uppercase tracking-editorial text-paper">Product ecosystem</p>
            <div className="flex flex-wrap gap-2">
              {productCategories.map((category) => (
                <Link key={category} href="/shop#all-products" className="rounded-2xl border border-paper/10 px-3 py-2 text-xs text-paper/68 transition hover:border-sun hover:text-sun">
                  {category}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-4 text-[0.7rem] font-medium uppercase tracking-editorial text-paper">Recipes</p>
            <div className="space-y-2">
              {recipes.slice(0, 3).map((recipe) => (
                <Link key={recipe.slug} href={`/recipes#${recipe.slug}`} className="block text-paper/68 transition hover:text-sun">
                  {recipe.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4 text-sm text-paper/70">
          <p className="text-[0.7rem] font-medium uppercase tracking-editorial text-paper">Newsletter / trade</p>
          <form className="grid gap-3" data-analytics-form="newsletter">
            <label className="sr-only" htmlFor="footer-email">Email</label>
            <input id="footer-email" type="email" placeholder="you@example.com" className="min-h-12 rounded-2xl border border-paper/12 bg-paper px-4 text-sm text-coconut outline-none placeholder:text-coconut/45 focus:border-sun" />
            <button type="button" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-paper px-5 text-sm font-medium text-coconut transition hover:bg-sun">
              Join early access <Mail size={15} />
            </button>
          </form>
          <Link href="/shop" className="inline-flex items-center gap-2 pt-3 text-sm font-medium text-paper transition hover:text-sun">
            Distributor / product interest <ArrowUpRight size={15} />
          </Link>
          <p className="pt-4 text-[0.7rem] font-medium uppercase tracking-editorial text-paper">Base</p>
          <p>Palakkad, Kerala</p>
          <div className="flex flex-wrap gap-3 pt-4 text-xs uppercase tracking-editorial text-paper/54">
            <Link href="/login" className="hover:text-sun">Account</Link>
            <Link href="/sustainability" className="hover:text-sun">Sustainability</Link>
            <Link href="/journal" className="hover:text-sun">Journal</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-paper/10 px-5 py-5 text-xs uppercase tracking-editorial text-paper/48 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>.CO | The Coconut Company</p>
          <p>Premium coconut products, made for living.</p>
        </div>
      </div>
    </footer>
  );
}
