import Link from "next/link";
import { cn } from "@/lib/utils";

type FooterProps = {
  className?: string;
};

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn("rounded-[40px] bg-[var(--co-black)] p-8 text-[var(--co-white)] md:p-10", className)}>
      <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="text-3xl font-bold tracking-[-0.04em]">.CO The Coconut Company</p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/72">Premium coconut rituals rooted in Kerala, designed for the modern fridge shelf.</p>
        </div>
        <nav className="grid gap-2 text-sm text-white/76" aria-label="Foundation footer">
          <Link href="/shop">Shop</Link>
          <Link href="/recipes">Recipes</Link>
          <Link href="/sustainability">Sustainability</Link>
          <Link href="/founders">Founders</Link>
        </nav>
      </div>
    </footer>
  );
}
