import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/foundation/GlassCard";
import { cn } from "@/lib/utils";

type JournalCardProps = {
  title: string;
  excerpt?: string;
  href: string;
  className?: string;
};

export function JournalCard({ title, excerpt, href, className }: JournalCardProps) {
  return (
    <Link href={href} className="block">
      <GlassCard className={cn("group/journal min-h-64", className)}>
        <p className="co-label">Journal</p>
        <h3 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-[var(--co-brown)]">{title}</h3>
        {excerpt ? <p className="co-body mt-4">{excerpt}</p> : null}
        <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[var(--co-palm)]">
          Read story <ArrowRight size={16} className="transition-transform group-hover/journal:translate-x-1" />
        </span>
      </GlassCard>
    </Link>
  );
}
