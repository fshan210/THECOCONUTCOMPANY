import type { SmooothySliderProps } from "./types";
import { SmooothySlider } from "./SmooothySlider";

export function SmooothyVerticalSlider(props: Omit<SmooothySliderProps, "axis">) {
  return <SmooothySlider {...props} axis="vertical"/>;
}
