declare module "jquery.ripples";

interface Window {
  jQuery: JQueryStatic;
  $: JQueryStatic;
}

interface JQuery {
  ripples(options?: {
    imageUrl?: string | null;
    resolution?: number;
    dropRadius?: number;
    perturbance?: number;
    interactive?: boolean;
    crossOrigin?: string;
  }): JQuery;
  ripples(command: "destroy" | "pause" | "play" | "hide" | "show"): JQuery;
  ripples(command: "updateSize"): JQuery;
  ripples(command: "drop", x: number, y: number, radius: number, strength: number): JQuery;
}
