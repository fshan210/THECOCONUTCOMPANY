"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { SmooothyControls } from "./SmooothyControls";
import { pointerDistance, shouldSuppressDraggedClick } from "./interaction";
import type { SmooothySliderProps } from "./types";
import { useSmooothySlider } from "./useSmooothySlider";

export function SmooothySlider({
  children,
  slideCount,
  label,
  axis = "horizontal",
  className,
  trackClassName,
  infinite = false,
  variableWidth = true,
  showControls = true,
  showDots = true,
  parallax = true,
  onSlideChange,
}: SmooothySliderProps) {
  const { wrapperRef, current, goTo, next, previous, reduced } = useSmooothySlider({ axis, infinite, variableWidth, parallax, slideCount, onSlideChange });
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const dragged = useRef(false);

  return (
    <section
      data-smooothy-slider
      data-smooothy-axis={axis}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className={className}
      onKeyDown={(event) => {
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        if ((axis === "horizontal" && event.key === "ArrowRight") || (axis === "vertical" && event.key === "ArrowDown")) { event.preventDefault(); next(); }
        if ((axis === "horizontal" && event.key === "ArrowLeft") || (axis === "vertical" && event.key === "ArrowUp")) { event.preventDefault(); previous(); }
        if (event.key === "Home") { event.preventDefault(); goTo(0); }
        if (event.key === "End") { event.preventDefault(); goTo(slideCount - 1); }
      }}
      onPointerDown={(event) => {
        dragStart.current = { x: event.clientX, y: event.clientY };
        dragged.current = false;
      }}
      onPointerMove={(event) => {
        if (!dragStart.current) return;
        const distance = pointerDistance(dragStart.current, { x: event.clientX, y: event.clientY });
        if (distance > 7) dragged.current = true;
      }}
      onPointerUp={() => { dragStart.current = null; }}
      onClickCapture={(event) => {
        if (shouldSuppressDraggedClick(dragged.current, event)) {
          event.preventDefault();
          event.stopPropagation();
        }
        dragged.current = false;
      }}
    >
      <div
        ref={wrapperRef}
        tabIndex={0}
        data-cursor-target
        className={cn(
          "outline-none focus-visible:ring-2 focus-visible:ring-[#214d2b]/55 focus-visible:ring-offset-4",
          axis === "horizontal" ? "touch-pan-y" : "touch-pan-x",
          axis === "horizontal" ? "flex gap-3" : "flex max-h-[72svh] flex-col gap-3",
          reduced && (axis === "horizontal" ? "snap-x overflow-x-auto" : "snap-y overflow-y-auto"),
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          trackClassName,
        )}
      >
        {children}
      </div>
      <p className="sr-only" aria-live="polite">Slide {current + 1} of {slideCount}</p>
      {showControls && (
        <SmooothyControls
          axis={axis}
          current={current}
          total={slideCount}
          previous={previous}
          next={next}
          goTo={goTo}
          showDots={showDots}
        />
      )}
    </section>
  );
}
