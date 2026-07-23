import type { ReactNode } from "react";

export type SliderAxis = "horizontal" | "vertical";

export interface SmooothySliderProps {
  children: ReactNode;
  slideCount: number;
  label: string;
  axis?: SliderAxis;
  className?: string;
  trackClassName?: string;
  infinite?: boolean;
  variableWidth?: boolean;
  showControls?: boolean;
  showDots?: boolean;
  parallax?: boolean;
  onSlideChange?: (index: number) => void;
}

export interface SmooothySliderHandle {
  next: () => void;
  previous: () => void;
  goTo: (index: number) => void;
  current: number;
}
