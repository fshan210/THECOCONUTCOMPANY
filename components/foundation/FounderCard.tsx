import { GlassCard } from "@/components/foundation/GlassCard";
import { cn } from "@/lib/utils";

type FounderCardProps = {
  name: string;
  role: string;
  note?: string;
  className?: string;
};

export function FounderCard({ name, role, note, className }: FounderCardProps) {
  return (
    <GlassCard className={cn("min-h-72", className)}>
      <p className="co-label">{role}</p>
      <h3 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-[var(--co-brown)]">{name}</h3>
      {note ? <p className="co-body mt-4">{note}</p> : null}
    </GlassCard>
  );
}
