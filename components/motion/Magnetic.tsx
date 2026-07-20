"use client";
import { motion, useMotionValue, useSpring } from "framer-motion";
import type { PointerEvent, ReactNode } from "react";
export function Magnetic({ children, className = "", strength = 7 }: { children: ReactNode; className?: string; strength?: number }) { const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 24 }); const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 24 }); const move = (event: PointerEvent<HTMLDivElement>) => { const r = event.currentTarget.getBoundingClientRect(); x.set(((event.clientX-r.left)/r.width-.5)*strength); y.set(((event.clientY-r.top)/r.height-.5)*strength); }; return <motion.div className={className} style={{ x, y }} onPointerMove={move} onPointerLeave={() => { x.set(0); y.set(0); }}>{children}</motion.div>; }
