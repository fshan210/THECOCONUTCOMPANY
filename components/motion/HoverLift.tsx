"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { hoverLift, motionSpring } from "@/lib/motion";
export function HoverLift({ children, className = "" }: { children: ReactNode; className?: string }) { return <motion.div className={className} whileHover={hoverLift} whileTap={{ scale: .992 }} transition={motionSpring.gentle}>{children}</motion.div>; }
