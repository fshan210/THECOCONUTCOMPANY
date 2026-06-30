import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ImageBlendBlockProps = {
  children: ReactNode;
  className?: string;
};

export function ImageBlendBlock({ children, className }: ImageBlendBlockProps) {
  return <div className={cn("co-image-blend overflow-hidden rounded-[40px] p-3", className)}>{children}</div>;
}
