import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type NeumorphicCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function NeumorphicCard({ children, className, ...props }: NeumorphicCardProps) {
  return (
    <div className={cn("co-premium-neu rounded-[32px] p-5 md:p-6", className)} {...props}>
      {children}
    </div>
  );
}
