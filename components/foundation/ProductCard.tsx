import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GlassCard } from "@/components/foundation/GlassCard";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  title: string;
  description?: string;
  href: string;
  className?: string;
};

export function ProductCard({ title, description, href, className }: ProductCardProps) {
  return (
    <GlassCard className={cn("group/product min-h-56", className)}>
      <Link href={href} className="flex h-full flex-col justify-between gap-8">
        <span className="inline-flex size-10 items-center justify-center rounded-full bg-[var(--co-palm)] text-[var(--co-white)] transition-transform duration-500 ease-out group-hover/product:translate-x-1 group-hover/product:-translate-y-1">
          <ArrowUpRight size={18} />
        </span>
        <span>
          <span className="block text-2xl font-bold tracking-[-0.03em] text-[var(--co-brown)]">{title}</span>
          {description ? <span className="mt-2 block text-sm leading-6 text-[var(--co-muted)]">{description}</span> : null}
        </span>
      </Link>
    </GlassCard>
  );
}
