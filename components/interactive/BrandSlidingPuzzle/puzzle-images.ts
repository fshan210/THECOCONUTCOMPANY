import { websiteAssets } from "@/lib/website-assets";
import type { PuzzleImage } from "./puzzle-types";

export const defaultPuzzleImages: PuzzleImage[] = websiteAssets.puzzle.map((asset) => ({
  id: asset.id,
  title: asset.title,
  subtitle: asset.subtitle,
  src: asset.src,
  thumbnailSrc: asset.src,
  alt: asset.alt,
}));
