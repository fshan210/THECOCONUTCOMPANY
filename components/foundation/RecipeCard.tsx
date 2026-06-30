import Link from "next/link";
import { GlassCard } from "@/components/foundation/GlassCard";
import { cn } from "@/lib/utils";

type RecipeCardProps = {
  title: string;
  category?: string;
  href: string;
  className?: string;
};

export function RecipeCard({ title, category, href, className }: RecipeCardProps) {
  return (
    <Link href={href} className="block">
      <GlassCard className={cn("min-h-52", className)}>
        {category ? <p className="co-label">{category}</p> : null}
        <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-[var(--co-brown)]">{title}</h3>
      </GlassCard>
    </Link>
  );
}
