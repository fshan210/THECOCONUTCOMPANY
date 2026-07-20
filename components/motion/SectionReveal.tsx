"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { choreography, revealVariants } from "@/lib/motion";
export function SectionReveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) { return <motion.div data-motion-element="section-reveal" className={className} variants={revealVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: choreography.section.viewportAmount }} transition={{ delay }}>{children}</motion.div>; }
