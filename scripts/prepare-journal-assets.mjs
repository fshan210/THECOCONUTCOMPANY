import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd();
const supplied =
  process.argv[2] || "/Users/fazilshersha/Desktop/redesign asset";
const dest = path.join(root, "public/assets/redesign/journal/cinematic");
await mkdir(dest, { recursive: true });
const sources = {
  farmer: "public/assets/sustainability/refined/raw-materials-farmer.png",
  fazil: "public/assets/founders/refined/fazil-shersha-portrait.jpg",
  afsala: "public/assets/founders/refined/afsala-muthali-portrait.jpg",
  hero: path.join(
    supplied,
    "journal/STORIES FROM THE COCONUT AND EVERYTHING AROUND IT.png",
  ),
  ...Object.fromEntries(
    [1, 2, 3, 4, 5].map((n) => [
      `world-${n}`,
      path.join(supplied, `backgrounds/journal/${n}.png`),
    ]),
  ),
  people:
    "public/assets/redesign/sustainability/IMPACT SHOULD REACH PEOPLE TOO.png",
  husk: "public/assets/redesign/about/built-by-people.png",
  farm: "public/assets/redesign/about/grown-by-people.png",
  grove: "public/assets/redesign/about/where-it-begins.png",
  bowl: "public/assets/redesign/recipes/coconut breakfast bowl.png",
  stew: "public/assets/redesign/recipes/Kerala Vegetable Stew.png",
  drink: "public/assets/redesign/recipes/coconut matcha smoothie.png",
  cake: "public/assets/redesign/recipes/JAMAICAN TOTO – TRADITIONAL CARIBBEAN COCONUT CAKE.png",
  pancakes: "public/assets/redesign/recipes/coconut flour pancackes.png",
  kitchen: "public/assets/redesign/about/kitchen.png",
  community: "public/assets/redesign/recipes/GOOD FOOD GETS PASSED AROUND.png",
  oil: "public/assets/redesign/home/cinematic/lifestyle/coconut-oil.png",
  water: "public/assets/redesign/home/cinematic/sunrise-reset.png",
  milk: "public/assets/redesign/home/cinematic/lifestyle/coconut-milk.png",
  soil: "public/assets/redesign/sustainability/cinematic/impact.webp",
};
const manifest = [];
for (const [name, src] of Object.entries(sources)) {
  const width =
    name === "hero" ? 1448 : name.startsWith("world-") ? 1672 : 1000;
  const info = await sharp(src)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 86 })
    .toFile(path.join(dest, `${name}.webp`));
  manifest.push({
    name,
    source: src.replace(supplied, "SUPPLIED"),
    width: info.width,
    height: info.height,
    bytes: info.size,
  });
  if (name === "hero")
    await sharp(src)
      .resize({ width: 800 })
      .webp({ quality: 86 })
      .toFile(path.join(dest, "hero-mobile.webp"));
}
await writeFile(
  path.join(root, "docs/journal-reference/assets.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(
  `${manifest.length} approved/source assets encoded; ${manifest.reduce((s, x) => s + x.bytes, 0)} bytes`,
);
