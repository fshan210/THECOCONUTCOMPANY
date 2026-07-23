"use client";

import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import { Magnetic } from "@/components/motion/Magnetic";
import type { SliderAxis } from "./types";

export function SmooothyControls({ axis, current, total, previous, next, goTo, showDots = true }: {
  axis: SliderAxis;
  current: number;
  total: number;
  previous: () => void;
  next: () => void;
  goTo: (index: number) => void;
  showDots?: boolean;
}) {
  const PreviousIcon = axis === "vertical" ? ArrowUp : ArrowLeft;
  const NextIcon = axis === "vertical" ? ArrowDown : ArrowRight;
  return (
    <div className="mt-4 flex items-center justify-between gap-4">
      <div className="flex gap-2">
        <Magnetic strength={4} rotate={0.35}><button type="button" onClick={previous} aria-label="Previous slide" className="grid size-11 place-items-center rounded-full border border-[#214d2b]/18 bg-white/70 transition hover:bg-[#214d2b] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#214d2b]"><PreviousIcon size={16}/></button></Magnetic>
        <Magnetic strength={4} rotate={0.35}><button type="button" onClick={next} aria-label="Next slide" className="grid size-11 place-items-center rounded-full border border-[#214d2b]/18 bg-white/70 transition hover:bg-[#214d2b] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#214d2b]"><NextIcon size={16}/></button></Magnetic>
      </div>
      {showDots && <div className="flex items-center gap-2" aria-label="Choose slide">{Array.from({ length: total }).map((_, index) => <button key={index} type="button" onClick={() => goTo(index)} aria-label={`Go to slide ${index + 1}`} aria-current={current === index ? "true" : undefined} className={`h-2 rounded-full transition-[width,background-color] ${current === index ? "w-6 bg-[#214d2b]" : "w-2 bg-[#214d2b]/22"}`}/>)}</div>}
    </div>
  );
}
