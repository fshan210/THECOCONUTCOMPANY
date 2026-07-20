"use client";
import type { ReactNode } from "react";
export function WaterRipple({ children, className = "" }: { children: ReactNode; className?: string }) { return <span className={`relative inline-flex overflow-hidden ${className}`} data-water-ripple>{children}</span>; }
