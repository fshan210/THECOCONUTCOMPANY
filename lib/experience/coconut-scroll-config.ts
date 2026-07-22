export const coconutScrollAssets = {
  version: "v1",
  opening: {
    alt: "Fresh green coconut resting on warm travertine in morning light",
    desktop: {
      avif: "/experience/coconut-bottle/v1/desktop/opening.avif",
      jpeg: "/experience/coconut-bottle/v1/desktop/opening.jpg",
      width: 1440,
      height: 900,
    },
    mobile: {
      avif: "/experience/coconut-bottle/v1/mobile/opening.avif",
      jpeg: "/experience/coconut-bottle/v1/mobile/opening.jpg",
      width: 720,
      height: 1280,
    },
  },
  final: {
    alt: ".CO organic coconut water bottle on warm travertine in morning light",
    desktop: {
      avif: "/experience/coconut-bottle/v1/desktop/final.avif",
      jpeg: "/experience/coconut-bottle/v1/desktop/final.jpg",
      width: 1440,
      height: 900,
    },
    mobile: {
      avif: "/experience/coconut-bottle/v1/mobile/final.avif",
      jpeg: "/experience/coconut-bottle/v1/mobile/final.jpg",
      width: 720,
      height: 1280,
    },
  },
} as const;

export const coconutScrollStages = [
  { label: "Whole by nature", detail: "A tender coconut, kept close to its origin." },
  { label: "A quiet opening", detail: "The story begins with one precise, natural gesture." },
  { label: "Nothing added", detail: "Clean coconut water moves in one continuous flow." },
  { label: "Made for living", detail: "The finished .CO bottle resolves exactly as designed." },
] as const;

export function coconutStageIndex(progress: number) {
  if (progress < 0.24) return 0;
  if (progress < 0.48) return 1;
  if (progress < 0.76) return 2;
  return 3;
}
