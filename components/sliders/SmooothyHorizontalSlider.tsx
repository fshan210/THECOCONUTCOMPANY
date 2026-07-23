import type { SmooothySliderProps } from "./types";
import { SmooothySlider } from "./SmooothySlider";

export function SmooothyHorizontalSlider(props: Omit<SmooothySliderProps, "axis">) {
  return <SmooothySlider {...props} axis="horizontal"/>;
}
