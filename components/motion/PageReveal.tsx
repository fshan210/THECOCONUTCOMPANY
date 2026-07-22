"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { revealVariants } from "@/lib/motion";
export function PageReveal({ children, className = "" }: { children: ReactNode; className?: string }) { return <motion.div data-motion-element="page-reveal" className={className} variants={revealVariants} initial="hidden" animate="visible">{children}</motion.div>; }
