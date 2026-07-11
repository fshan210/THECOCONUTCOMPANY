"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, CloudOff, SearchX, ShoppingBag, Sparkles, TriangleAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StateKind = "empty" | "error" | "offline" | "success";

const icons: Record<StateKind, LucideIcon> = {
  empty: SearchX,
  error: TriangleAlert,
  offline: CloudOff,
  success: CheckCircle2
};

export function StatePanel({
  kind = "empty",
  eyebrow,
  title,
  body,
  primary,
  secondary,
  onPrimary,
  compact = false,
  className
}: {
  kind?: StateKind;
  eyebrow?: string;
  title: string;
  body: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  onPrimary?: { label: string; action: () => void };
  compact?: boolean;
  className?: string;
}) {
  const Icon = icons[kind];
  return (
    <section className={cn("relative overflow-hidden rounded-[28px] border border-black/7 bg-[rgba(255,252,246,.72)] p-6 shadow-[0_18px_55px_rgba(42,27,19,.06)]", compact ? "text-left" : "text-center sm:p-9", className)} aria-live={kind === "error" ? "assertive" : "polite"}>
      <div className="pointer-events-none absolute -right-10 -top-12 size-36 rounded-full bg-[#dfe8d7]/70 blur-3xl" />
      <span className={cn("relative grid size-12 place-items-center rounded-full bg-[#e7ecdf] text-[#214d2b]", !compact && "mx-auto")}><Icon size={21} strokeWidth={1.6} /></span>
      {eyebrow ? <p className="relative mt-5 text-[10px] font-semibold uppercase tracking-[.15em] text-[#214d2b]">{eyebrow}</p> : null}
      <h2 className={cn("relative mt-3 font-['Cormorant_Garamond'] leading-[.96] text-[#2a1b13]", compact ? "text-3xl" : "text-[38px] sm:text-[44px]")}>{title}</h2>
      <p className={cn("relative mt-4 text-sm leading-6 text-[#665b52]", !compact && "mx-auto max-w-[46ch]")}>{body}</p>
      <div className={cn("relative mt-6 flex flex-wrap gap-3", !compact && "justify-center")}>
        {onPrimary ? <button type="button" onClick={onPrimary.action} className="co-primary-cta inline-flex min-h-12 items-center gap-3 rounded-full bg-[#214d2b] px-6 text-[10px] font-semibold uppercase text-white">{onPrimary.label}<ArrowRight size={14} /></button> : null}
        {primary ? <Link href={primary.href} className="co-primary-cta inline-flex min-h-12 items-center gap-3 rounded-full bg-[#214d2b] px-6 text-[10px] font-semibold uppercase text-white">{primary.label}<ArrowRight size={14} /></Link> : null}
        {secondary ? <Link href={secondary.href} className="inline-flex min-h-12 items-center gap-3 rounded-full border border-[#214d2b]/22 px-6 text-[10px] font-semibold uppercase text-[#214d2b]">{secondary.label}{kind === "empty" ? <ShoppingBag size={14} /> : <Sparkles size={14} />}</Link> : null}
      </div>
    </section>
  );
}
