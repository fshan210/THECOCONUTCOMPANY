const version = "v3";
const frameCount = 18;

function frames(viewport: "desktop" | "mobile", extension: "avif" | "jpg") {
  return Array.from(
    { length: frameCount },
    (_, index) => `/experience/coconut-bottle/${version}/${viewport}/frame-${String(index).padStart(2, "0")}.${extension}`,
  );
}

export const coconutScrollAssets = {
  version,
  frameCount,
  alt: "A fresh green coconut resolving into a .CO organic coconut water bottle",
  desktop: {
    width: 1440,
    height: 900,
    avif: frames("desktop", "avif"),
    jpeg: frames("desktop", "jpg"),
  },
  mobile: {
    width: 720,
    height: 1280,
    avif: frames("mobile", "avif"),
    jpeg: frames("mobile", "jpg"),
  },
} as const;

export const coconutScrollStages = [
  { label: "Whole by nature", detail: "A tender coconut, held in warm Kerala light." },
  { label: "A quiet anticipation", detail: "The seam appears before one careful opening." },
  { label: "One continuous flow", detail: "A clean water veil carries the story forward." },
  { label: "Nothing added", detail: "The approved bottle enters without altering its identity." },
  { label: "Made for living", detail: "The final .CO composition resolves exactly as designed." },
] as const;

export function coconutStageIndex(progress: number) {
  if (progress < 0.2) return 0;
  if (progress < 0.4) return 1;
  if (progress < 0.65) return 2;
  if (progress < 0.84) return 3;
  return 4;
}
