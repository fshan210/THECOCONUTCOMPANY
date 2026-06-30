import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type BentoGridProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function BentoGrid({ children, className, ...props }: BentoGridProps) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-6 lg:grid-cols-12", className)} {...props}>
      {children}
    </div>
  );
}
