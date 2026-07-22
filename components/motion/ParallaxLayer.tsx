"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useMotionQuality } from "@/lib/motion";
export function ParallaxLayer({ children, distance = 16, className = "" }: { children: ReactNode; distance?: number; className?: string }) { const ref = useRef<HTMLDivElement>(null); const quality = useMotionQuality(); const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] }); const y = useTransform(scrollYProgress, [0, 1], quality === "full" ? [-distance, distance] : [0, 0]); return <motion.div ref={ref} data-motion-element="parallax" style={{ y }} className={className}>{children}</motion.div>; }
