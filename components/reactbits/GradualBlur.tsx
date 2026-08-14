"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export function GradualBlur({ position = "both", strength = 10, className }: { position?: "left" | "right" | "both"; strength?: number; className?: string }) {
  const sides = position === "both" ? ["left", "right"] as const : [position] as const;
  return <>{sides.map((side) => (
    <div key={side} aria-hidden="true" className={cn("co-gradual-blur", `co-gradual-blur--${side}`, className)}>
      {Array.from({ length: 5 }, (_, index) => {
        const start = index * 16;
        const end = Math.min(100, start + 38);
        return <span key={index} style={{ "--co-blur": `${((index + 1) / 5) * strength}px`, "--co-mask-start": `${start}%`, "--co-mask-end": `${end}%` } as CSSProperties} />;
      })}
    </div>
  ))}</>;
}
