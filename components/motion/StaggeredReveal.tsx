"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
export function StaggeredReveal({ children, className = "" }: { children: ReactNode; className?: string }) { return <motion.div className={className} initial="hidden" whileInView="visible" viewport={{ once: true, amount: .12 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: .07 } } }}>{children}</motion.div>; }
