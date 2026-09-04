import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

// Format-only derivatives of the user-supplied artwork. No compositing or regeneration.
const base = 'public/assets/redesign/sustainability';
const output = join(base, 'cinematic');
await mkdir(output, { recursive: true });
const sources = [
  ['NOTHING WASTED EVERYTHING ACCOUNTED FOR-DESKTOP.png', 'hero-desktop', 1672],
  ['NOTHING WASTED EVERYTHING ACCOUNTED FOR.png', 'hero-mobile', 992],
  ['IMPACT SHOULD REACH PEOPLE TOO.png', 'people', 1536],
  ['A BETTER COCONUT SYSTEM STARTS AT THE SOURCE.png', 'closing', 1672],
  ['WHAT DOES YOUR COCONUT LEAVE BEHIND.png', 'impact', 1448],
  ['whole-coconut-reference.png', 'material-reference', 941],
  ...[1, 2, 3, 4, 5].map(number => [`backgrounds/${number}.png`, `world-${number}`, 1672]),
];
for (const [source, name, width] of sources) {
  const result = await sharp(join(base, source))
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 88, effort: 5 })
    .withMetadata({ exif: { IFD0: { ImageDescription: `User-supplied approved Sustainability artwork. Source: ${source}. Format-only WebP derivative; no creative edits.` } } })
    .toFile(join(output, `${name}.webp`));
  console.log(`${name}.webp: ${Math.round(result.size / 1024)} KB`);
  execFileSync(process.execPath, ['.agents/skills/impeccable/scripts/embed-prompt.mjs', join(output, `${name}.webp`), '--prompt', `Origin: user-supplied approved Sustainability artwork ${source}. Format-only WebP derivative. No generation, retouching, or packaging changes.`]);
}
