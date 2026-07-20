"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { imageRevealVariants } from "@/lib/motion";
export function ImageReveal({ children, className = "" }: { children: ReactNode; className?: string }) { return <motion.div data-motion-element="image-reveal" className={className} variants={imageRevealVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: .18 }}>{children}</motion.div>; }
