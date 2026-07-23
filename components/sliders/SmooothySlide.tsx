import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SmooothySlide({ children, index, total, className }: { children: ReactNode; index: number; total: number; className?: string }) {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${total}`}
      className={cn("shrink-0", className)}
    >
      {children}
    </div>
  );
}
