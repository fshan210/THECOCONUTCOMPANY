import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div className={cn("co-premium-glass rounded-[32px] p-5 md:p-6", className)} {...props}>
      {children}
    </div>
  );
}
