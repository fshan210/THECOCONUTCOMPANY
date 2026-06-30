import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HeaderProps = {
  className?: string;
};

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/recipes", label: "Recipes" },
  { href: "/journal", label: "Journal" }
];

export function Header({ className }: HeaderProps) {
  return (
    <header className={cn("co-premium-glass rounded-full px-5 py-3", className)}>
      <div className="flex items-center justify-between gap-6">
        <Link href="/" className="text-xl font-bold tracking-[-0.04em] text-[var(--co-black)]">
          .CO
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium text-[var(--co-brown)] md:flex" aria-label="Foundation navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <Button size="sm" variant="leaf">
          Shop now
        </Button>
      </div>
    </header>
  );
}
