import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  copy?: ReactNode;
  className?: string;
};

export function SectionHeading({ eyebrow, title, copy, className }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {eyebrow ? <p className="co-label">{eyebrow}</p> : null}
      <h2 className="co-display-section mt-3 text-[var(--co-brown)]">{title}</h2>
      {copy ? <p className="co-body mt-5 max-w-2xl">{copy}</p> : null}
    </div>
  );
}
