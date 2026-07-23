"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import type { PointerEvent, ReactNode } from "react";
import { useMotionQuality } from "@/lib/motion";

export function Magnetic({
  children,
  className = "",
  strength = 8,
  radius = 1,
  rotate = 0.65,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
  rotate?: number;
}) {
  const quality = useMotionQuality();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 250, damping: 25, mass: .45 });
  const y = useSpring(rawY, { stiffness: 250, damping: 25, mass: .45 });
  const rotateX = useSpring(rawRotateX, { stiffness: 220, damping: 28, mass: .5 });
  const rotateY = useSpring(rawRotateY, { stiffness: 220, damping: 28, mass: .5 });

  const reset = () => {
    rawX.set(0); rawY.set(0); rawRotateX.set(0); rawRotateY.set(0);
  };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (quality !== "full" || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const normalX = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - .5) * 2));
    const normalY = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - .5) * 2));
    const distance = Math.hypot(normalX, normalY);
    if (distance > radius) return reset();
    rawX.set(normalX * strength);
    rawY.set(normalY * strength);
    rawRotateX.set(normalY * -rotate);
    rawRotateY.set(normalX * rotate);
  };

  return (
    <motion.div
      className={className}
      style={{ x, y, rotateX, rotateY, transformPerspective: 700 }}
      onPointerMove={move}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  );
}
