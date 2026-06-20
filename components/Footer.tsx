"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DoodleImage } from "@/components/PublicDesign";
import { publicAssets } from "@/lib/public-assets";

const links = [
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Shop", href: "/shop" },
  { label: "Recipes", href: "/recipes" },
  { label: "Sustainability", href: "/sustainability" },
  { label: "Founders", href: "/founders" },
  { label: "Journal", href: "/journal" }
];

export function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="relative overflow-hidden rounded-t-[2rem] border-t border-coconut/10 bg-coconut text-paper">
      <div className="co-wave-pattern pointer-events-none absolute inset-y-0 right-0 w-80 opacity-[0.07]" />
      <DoodleImage src={publicAssets.doodles.rawCoconut} className="bottom-10 left-6 h-36 w-36 invert md:h-52 md:w-52" />
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:px-8">
        <div>
          <Image src="/images/logo.svg" alt=".CO The Coconut Company" width={112} height={90} className="mb-8 brightness-125" />
          <p className="max-w-sm font-display text-3xl font-light leading-tight">A coconut company from Palakkad, made for everyday living.</p>
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
        <div className="space-y-4 text-sm text-paper/70">
          <p className="text-[0.7rem] font-medium uppercase tracking-editorial text-paper">Base</p>
          <p>Palakkad, Kerala</p>
          <p>Coconut water, ice cream, kitchen, care, recipes, and warm everyday rituals.</p>
          <p className="pt-6 text-xs uppercase tracking-editorial text-paper/72">.CO | The Coconut Company</p>
        </div>
      </div>
    </footer>
  );
}
