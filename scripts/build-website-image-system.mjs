import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const brandRoot = path.join(root, "public/brand-reference");
const websiteRoot = path.join(root, "public/images/website");
const promptsPath = path.join(root, "docs/website-image-prompts.md");
const manifestPath = path.join(brandRoot, "asset-manifest.json");

const rel = (file) => `/${path.relative(path.join(root, "public"), file).replaceAll(path.sep, "/")}`;

const locked = {
  water: {
    label: ".CO Coconut Water",
    productFamily: "Coconut Water",
    hero: "coconut-water/dotco-home-hero-coconut-water-master-v1.png .png",
    mobileHero: "coconut-water/dotco-home-hero-coconut-water-mobile-master-v1.png",
    front: "coconut-water/dotco-coconut-water-packshot-front-master-v1.png",
    angle: "coconut-water/dotco-coconut-water-packshot-angle-master-v1.png .png",
    floating: "coconut-water/dotco-coconut-water-packshot-floating-master-v1.png",
    lifestyle: "coconut-water/dotco-coconut-water-lifestyle-master-v1.png",
  },
  melt: {
    label: "MELT Coconut Gelato",
    productFamily: "MELT",
    hero: "melt/dotco-melt-home-hero-desktop-master-v1.png",
    mobileHero: "melt/dotco-melt-home-hero-mobile-master-v1.png",
    front: "melt/dotco-melt-coconut-mango-packshot-front-master-v1.png",
    angle: "melt/dotco-melt-coconut-mango-packshot-angle-master-v1.png",
    floating: "melt/dotco-melt-coconut-mango-packshot-floating-master-v1.png",
    lifestyle: "melt/dotco-melt-lifestyle-master-v1.png",
  },
  kitchenOil: {
    label: ".CO Kitchen Virgin Coconut Oil",
    productFamily: ".CO Kitchen",
    front: "kitchen/coconut-oil/CO_KITCHEN_COCONUT_OIL_01_Front_Final_Master.png",
    angle: "kitchen/coconut-oil/CO_KITCHEN_COCONUT_OIL_03_Three_Quarter_Final_Master.png",
    ecommerce: "kitchen/coconut-oil/CO_KITCHEN_COCONUT_OIL_07_Ecommerce_Primary_Packshot_Master.png",
    usage: "kitchen/coconut-oil/CO_KITCHEN_COCONUT_OIL_08_Controlled_Pour_Usage_Master.png",
  },
  kitchenFlour: {
    label: ".CO Kitchen Coconut Flour",
    productFamily: ".CO Kitchen",
    front: "kitchen/coconut-flour/CO_KITCHEN_COCONUT_FLOUR_00_Packaging_Design_Master.png",
    angle: "kitchen/coconut-flour/CO_KITCHEN_COCONUT_FLOUR_03_Three_Quarter_Master.png",
    ecommerce: "kitchen/coconut-flour/CO_KITCHEN_COCONUT_FLOUR_06_Ecommerce_Primary_Packshot_Master.png",
    texture: "kitchen/coconut-flour/CO_KITCHEN_COCONUT_FLOUR_07_Texture_and_Scoop_Master.png",
  },
  kitchenMilk: {
    label: ".CO Kitchen Coconut Milk",
    productFamily: ".CO Kitchen",
    front: "kitchen/coconut-milk/CO_KITCHEN_COCONUT_MILK_01_Front_Master.png",
    angle: "kitchen/coconut-milk/CO_KITCHEN_COCONUT_MILK_00_Packaging_Design_Master.png",
    ecommerce: "kitchen/coconut-milk/CO_KITCHEN_COCONUT_MILK_05_Ecommerce_Primary_Packshot_Master.png",
    pantry: "kitchen/coconut-milk/CO_KITCHEN_COCONUT_MILK_09_Pantry_Lifestyle_Master.png",
  },
  botanicaShampoo: {
    label: "BOTANiCA Shampoo",
    productFamily: "BOTANiCA",
    hero: "botanica/shampoo/BOTANICA_01_Hero_Editorial_Master.png",
    detail: "botanica/shampoo/BOTANICA_03_Product_Detail_Master.png",
    lifestyle: "botanica/shampoo/BOTANICA_05_Bathroom_Lifestyle_Master.png",
  },
  botanicaFaceWash: {
    label: "BOTANiCA Face Wash",
    productFamily: "BOTANiCA",
    angle: "botanica/facewash/BOTANICA_FACE_WASH_03_Three_Quarter_Master.png",
    ecommerce: "botanica/facewash/BOTANICA_FACE_WASH_06_Ecommerce_Primary_Packshot_Master.png",
    texture: "botanica/facewash/BOTANICA_FACE_WASH_07_Texture_and_Dispense_Master.png",
  },
  botanicaHairSerum: {
    label: "BOTANiCA Hair Serum",
    productFamily: "BOTANiCA",
    front: "botanica/hair-serum/BOTANICA_HAIR_SERUM_01_Front_Master.png",
    hero: "botanica/hair-serum/BOTANICA_HAIR_SERUM_06_Hero_Editorial_Master.png",
    detail: "botanica/hair-serum/BOTANICA_HAIR_SERUM_07_Dropper_Texture_Master.png",
  },
  botanicaMoisturizer: {
    label: "BOTANiCA Body Moisturizer",
    productFamily: "BOTANiCA",
    front: "botanica/Moisturiser/BOTANICA_BODY_MOISTURIZER_01_Front_Master.png",
    ecommerce: "botanica/Moisturiser/BOTANICA_BODY_MOISTURIZER_06_Ecommerce_Primary_Packshot_Master.png",
    texture: "botanica/Moisturiser/BOTANICA_BODY_MOISTURIZER_07_Texture_and_Dispense_Master.png",
  },
};

const timelines = [
  ["it_all_started", "2020", "It all started", "A simple idea: build a coconut company around considered products and everyday living."],
  ["building_the_foundation", "2021", "Building the foundation", "Early product work turned the idea into a practical sourcing and production plan."],
  ["first_product_direction", "2022", "First product direction", "The coconut-water ecosystem became the anchor for the wider .CO brand world."],
  ["growing_the_ecosystem", "2023", "Growing the ecosystem", "Kitchen, Creamery and Botanica directions expanded the brand beyond one bottle."],
  ["rooted_partnerships", "2024", "Rooted partnerships", "A Pollachi contract-farm anchor and Kerala operating base shaped the sourcing model."],
  ["made_for_living", "next", "Made for living", "Phase-one UHT production and a measured VAP network are the next execution milestones."],
];

async function exists(file) {
  try { await fs.access(file); return true; } catch { return false; }
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const out = [];
  for (const entry of entries) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(file));
    else if (/\.(png|jpe?g|webp|avif)$/i.test(entry.name)) out.push(file);
  }
  return out;
}

function familyFromRelative(relativePath) {
  if (relativePath.includes("coconut-water/")) return "Coconut Water";
  if (relativePath.includes("kitchen/")) return ".CO Kitchen";
  if (relativePath.includes("botanica/")) return "BOTANiCA";
  if (relativePath.includes("melt/")) return "MELT";
  return "Brand";
}

function productFromRelative(relativePath) {
  const p = relativePath.toLowerCase();
  if (p.includes("coconut-water")) return ".CO Coconut Water";
  if (p.includes("coconut-oil")) return ".CO Kitchen Virgin Coconut Oil";
  if (p.includes("coconut-flour")) return ".CO Kitchen Coconut Flour";
  if (p.includes("coconut-milk")) return ".CO Kitchen Coconut Milk";
  if (p.includes("facewash") || p.includes("face_wash")) return "BOTANiCA Face Wash";
  if (p.includes("hair-serum") || p.includes("hair_serum")) return "BOTANiCA Hair Serum";
  if (p.includes("moisturiser") || p.includes("moisturizer")) return "BOTANiCA Body Moisturizer";
  if (p.includes("shampoo")) return "BOTANiCA Shampoo";
  if (p.includes("melt")) return "MELT Coconut Gelato";
  return "Unclassified";
}

function viewFromRelative(relativePath) {
  const p = relativePath.toLowerCase();
  if (p.includes("front")) return "front";
  if (p.includes("back")) return "back";
  if (p.includes("three_quarter") || p.includes("angle")) return "three-quarter";
  if (p.includes("side")) return "side";
  if (p.includes("macro") || p.includes("detail")) return "macro";
  if (p.includes("lifestyle") || p.includes("hero") || p.includes("application") || p.includes("ritual")) return "lifestyle";
  if (p.includes("ecommerce") || p.includes("packshot")) return "packshot";
  return "master";
}

async function imageInventory() {
  const files = await walk(brandRoot);
  const items = [];
  for (const file of files) {
    const metadata = await sharp(file).metadata();
    const stat = await fs.stat(file);
    const relativePath = path.relative(brandRoot, file).replaceAll(path.sep, "/");
    const ratio = metadata.width && metadata.height ? Number((metadata.width / metadata.height).toFixed(4)) : null;
    items.push({
      fileName: path.basename(file),
      path: rel(file),
      format: metadata.format,
      width: metadata.width,
      height: metadata.height,
      aspectRatio: ratio,
      bytes: stat.size,
      productFamily: familyFromRelative(relativePath),
      productName: productFromRelative(relativePath),
      viewType: viewFromRelative(relativePath),
      hasTransparency: Boolean(metadata.hasAlpha),
      suitability: {
        desktop: metadata.width >= 1200 || ratio > 1.4,
        mobile: metadata.height >= 1200 || ratio < 0.9,
      },
      likelyWebsiteUse: likelyUse(relativePath),
    });
  }
  return items;
}

function likelyUse(relativePath) {
  const v = viewFromRelative(relativePath);
  if (v === "lifestyle") return ["hero", "transition", "timeline", "editorial card"];
  if (v === "packshot" || v === "front" || v === "three-quarter") return ["product card", "hero composite", "transition composite"];
  if (v === "macro") return ["detail card", "supporting editorial"];
  return ["reference", "locked master"];
}

function svgScene({ width, height, mood = "hero", dark = false }) {
  const h = height;
  const w = width;
  const sky = dark ? "#20371d" : "#f7f0e4";
  const cream = dark ? "#2e4a27" : "#f4eadb";
  const green = dark ? "rgba(80,112,63,.32)" : "rgba(78,122,67,.18)";
  const gold = dark ? "rgba(202,166,88,.22)" : "rgba(199,165,98,.2)";
  const floorY = Math.round(h * 0.68);
  const palmPath = `<path d="M${w * .72} ${h * .02} C${w * .86} ${h * .18},${w * .92} ${h * .34},${w * .99} ${h * .5}" stroke="#36572f" stroke-opacity=".22" stroke-width="${Math.max(10, w * .009)}" fill="none" stroke-linecap="round"/>`;
  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="${sky}"/>
          <stop offset=".62" stop-color="${cream}"/>
          <stop offset="1" stop-color="${dark ? "#173113" : "#eadcc8"}"/>
        </linearGradient>
        <radialGradient id="glow" cx=".72" cy=".3" r=".58">
          <stop offset="0" stop-color="${gold}"/>
          <stop offset="1" stop-color="rgba(255,255,255,0)"/>
        </radialGradient>
        <filter id="blur"><feGaussianBlur stdDeviation="${Math.max(16, w * .012)}"/></filter>
        <pattern id="grain" width="72" height="72" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="9" r="1" fill="#4d3525" opacity=".025"/>
          <circle cx="48" cy="22" r="1.2" fill="#4d3525" opacity=".024"/>
          <circle cx="26" cy="58" r=".8" fill="#4d3525" opacity=".02"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <rect width="100%" height="100%" fill="url(#grain)"/>
      <rect width="100%" height="100%" fill="url(#glow)"/>
      <ellipse cx="${w * .72}" cy="${h * .36}" rx="${w * .34}" ry="${h * .22}" fill="${green}" filter="url(#blur)"/>
      <ellipse cx="${w * .12}" cy="${h * .22}" rx="${w * .26}" ry="${h * .2}" fill="rgba(255,255,255,.28)" filter="url(#blur)"/>
      <rect x="0" y="${floorY}" width="${w}" height="${h - floorY}" fill="${dark ? "#20391c" : "#eadbc5"}" opacity=".45"/>
      <path d="M0 ${floorY} C${w * .18} ${floorY - 45}, ${w * .36} ${floorY + 40}, ${w * .56} ${floorY - 10} S${w * .82} ${floorY + 40}, ${w} ${floorY - 18}" fill="none" stroke="${dark ? "#668158" : "#d7c2a6"}" stroke-width="2" opacity=".38"/>
      ${palmPath}
      <g opacity="${mood === "kitchen" ? .3 : .18}" transform="translate(${w * .06} ${h * .06}) rotate(-18)">
        <path d="M0 0 C${w * .12} ${h * .06},${w * .2} ${h * .16},${w * .28} ${h * .34}" stroke="#305a34" stroke-width="${Math.max(6, w * .006)}" fill="none" stroke-linecap="round"/>
        ${Array.from({ length: 9 }).map((_, i) => `<path d="M${i * 18} ${i * 16} C${w * .04 + i * 18} ${h * .03 + i * 18},${w * .08 + i * 22} ${h * .04 + i * 18},${w * .15 + i * 18} ${h * .06 + i * 20}" stroke="#305a34" stroke-width="${Math.max(3, w * .003)}" fill="none" stroke-linecap="round"/>`).join("")}
      </g>
    </svg>
  `);
}

async function productLayer(relative, width, options = {}) {
  const input = path.join(brandRoot, relative);
  if (!(await exists(input))) throw new Error(`Missing locked asset: ${relative}`);
  const img = sharp(input).resize({ width, withoutEnlargement: true });
  if (options.rounded) {
    const metadata = await img.metadata();
    const resized = await sharp(input).resize({ width, withoutEnlargement: true }).png().toBuffer();
    const info = await sharp(resized).metadata();
    const mask = Buffer.from(`<svg width="${info.width}" height="${info.height}"><rect x="0" y="0" width="100%" height="100%" rx="${options.rounded}" ry="${options.rounded}" fill="white"/></svg>`);
    return sharp(resized).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
  }
  return img.png().toBuffer();
}

async function saveScene({ name, width, height, mood, layers, dark = false }) {
  const base = sharp(svgScene({ width, height, mood, dark })).png();
  const composites = [];
  for (const layer of layers) {
    if (layer.shadow) {
      composites.push({
        input: Buffer.from(`<svg width="${width}" height="${height}"><ellipse cx="${layer.left + layer.w / 2}" cy="${layer.top + layer.h * .92}" rx="${layer.w * .34}" ry="${layer.h * .08}" fill="#2a1b13" opacity=".18" filter="blur(18px)"/></svg>`),
        left: 0,
        top: 0,
      });
    }
    composites.push({
      input: await productLayer(layer.asset, layer.w, { rounded: layer.rounded }),
      left: Math.round(layer.left),
      top: Math.round(layer.top),
    });
  }
  const sourcePng = path.join(websiteRoot, "source-composites", name.replace(/\.webp$/, ".png"));
  const outWebp = path.join(websiteRoot, name);
  await fs.mkdir(path.dirname(sourcePng), { recursive: true });
  await fs.mkdir(path.dirname(outWebp), { recursive: true });
  const buffer = await base.composite(composites).png({ compressionLevel: 8 }).toBuffer();
  await sharp(buffer).toFile(sourcePng);
  await sharp(buffer).webp({ quality: 88, effort: 6, smartSubsample: true }).toFile(outWebp);
  return outWebp;
}

async function createVariants(master) {
  const metadata = await sharp(master).metadata();
  const widths = [640, 960, 1280, 1600, 1920, 2400].filter((w) => w < metadata.width);
  const dir = path.dirname(master);
  const parsed = path.parse(master);
  const variants = [];
  for (const width of widths) {
    const target = path.join(dir, `${parsed.name}-${width}.webp`);
    await sharp(master).resize({ width, withoutEnlargement: true }).webp({ quality: 84, effort: 6 }).toFile(target);
    variants.push(rel(target));
  }
  return variants;
}

async function buildManifest(inventory) {
  const products = {};
  for (const [key, product] of Object.entries(locked)) {
    const assets = {};
    for (const [view, assetPath] of Object.entries(product)) {
      if (view === "label" || view === "productFamily") continue;
      const abs = path.join(brandRoot, assetPath);
      if (await exists(abs)) {
        const meta = await sharp(abs).metadata();
        assets[view] = {
          path: rel(abs),
          width: meta.width,
          height: meta.height,
          format: meta.format,
          hasTransparency: Boolean(meta.hasAlpha),
          viewType: view,
          intendedWebsiteUses: view.includes("hero") || view.includes("lifestyle") ? ["hero", "transition", "editorial card"] : ["product composite", "product card"],
        };
      }
    }
    products[key] = {
      productName: product.label,
      productFamily: product.productFamily,
      brandLock: "Approved product pixels must not be regenerated, redrawn, retyped, stretched, or painted over.",
      assets,
    };
  }
  const manifest = {
    generatedAt: new Date().toISOString(),
    sourceDirectory: "/brand-reference",
    brandLock: {
      rule: "All approved packaging and logo pixels are locked masters. Website scenes must be environment-first, then locked-asset composite.",
      nonTransparentMasterNote: "Most approved masters are non-transparent PNGs. These are preserved as exact pixels; future manual cut-outs can improve physical integration without touching package artwork.",
    },
    products,
    inventory,
  };
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

function promptSection(assetName, purpose, dims, productAssets, composition, physicalState) {
  return `### ${assetName}

- Purpose: ${purpose}
- Target page: ${purpose.includes("About") ? "About" : "Homepage"}
- Dimensions: ${dims}
- Source product assets: ${productAssets.map((asset) => `\`${asset}\``).join(", ")}
- Packaging lock: Generate the environment only. Leave a clean product-placement area. The approved packaging will be composited from the locked source asset. Never recreate the .CO, KITCHEN, BOTANiCA, or MELT typography.
- Composition: ${composition}
- Physical state: ${physicalState}
- Camera: warm editorial product photography, modest telephoto compression, no impossible perspective.
- Lighting: warm Kerala morning or afternoon light, restrained palm-shadow rhythm, no harsh glare over package text.
- Background: mineral ivory, pale limestone, natural wood, muted palm green, warm earth brown.
- Responsive safe zones: preserve clean headline-safe negative space and do not crop critical branding on desktop or mobile.
- Negative prompt: regenerated logo, altered labels, misspelt product name, warped typography, floating unsupported pack, sealed product pouring, fake regulatory text, neon colours, glossy fantasy CGI, heavy fog, tourist postcard Kerala.
- Validation checklist: locked source path used; uniform scaling only; package not stretched; branding readable; object supported; gravity plausible; no collision with page text; mobile crop preserves label.
`;
}

async function buildPrompts() {
  const sections = [
    promptSection("CO_WEBSITE_HOME_HERO_DESKTOP_MASTER.webp", "Desktop homepage ecosystem hero", "2400 × 1350", [locked.water.front, locked.melt.floating, locked.kitchenOil.angle, locked.botanicaFaceWash.angle], "A calm .CO ecosystem on a pale limestone platform with generous left text-safe space.", "Products stand on or visually occupy supported limestone tiers; no package is dispensing."),
    promptSection("CO_WEBSITE_HOME_HERO_MOBILE_MASTER.webp", "Mobile homepage ecosystem hero", "1800 × 2400", [locked.water.front, locked.melt.floating, locked.botanicaFaceWash.angle], "Vertical composition with clear upper headline-safe zone and product cluster in lower middle.", "Products remain fully readable and supported."),
    promptSection("CO_WEBSITE_TRANSITION_ORIGIN_DESKTOP_MASTER.webp", "Desktop coconut-origin transition", "2400 × 1200", [locked.water.lifestyle], "Kerala coconut grove light path toward a modern .CO coconut-water scene.", "Modern product is the destination object; no tourist imagery."),
    promptSection("CO_WEBSITE_TRANSITION_ORIGIN_MOBILE_MASTER.webp", "Mobile coconut-origin transition", "1600 × 2000", [locked.water.mobileHero], "Vertical grove-to-product path with negative space near top.", "Product remains destination; no invented people."),
    promptSection("CO_WEBSITE_TRANSITION_KITCHEN_DESKTOP_MASTER.webp", "Desktop .CO Kitchen transition", "2400 × 1200", [locked.kitchenOil.angle, locked.kitchenFlour.angle, locked.kitchenMilk.angle], "Three .CO Kitchen products on a contemporary preparation surface with linen, ceramic bowl and spoon.", "Exactly three sealed products standing upright; none are pouring."),
    promptSection("CO_WEBSITE_TRANSITION_KITCHEN_MOBILE_MASTER.webp", "Mobile .CO Kitchen transition", "1600 × 2000", [locked.kitchenOil.angle, locked.kitchenFlour.angle, locked.kitchenMilk.angle], "Stacked vertical kitchen surface with three readable products.", "Exactly three sealed products standing upright; no product cropped through branding."),
    promptSection("CO_WEBSITE_TRANSITION_BOTANICA_DESKTOP_MASTER.webp", "Desktop BOTANiCA transition", "2400 × 1200", [locked.botanicaFaceWash.angle, locked.botanicaHairSerum.front, locked.botanicaMoisturizer.front], "Soft stone bathroom-light scene with restrained water reflection and botanical shadow.", "Two or three products standing supported; no water splash over label."),
    promptSection("CO_WEBSITE_TRANSITION_BOTANICA_MOBILE_MASTER.webp", "Mobile BOTANiCA transition", "1600 × 2000", [locked.botanicaFaceWash.angle, locked.botanicaHairSerum.front], "Vertical personal-care scene with safe top space.", "Products stand supported; labels readable."),
    promptSection("CO_WEBSITE_TRANSITION_MELT_DESKTOP_MASTER.webp", "Desktop MELT transition", "2400 × 1200", [locked.melt.floating], "Warm slow-living table scene around the approved MELT tub.", "Tub is closed and supported; no melted mess."),
    promptSection("CO_WEBSITE_TRANSITION_MELT_MOBILE_MASTER.webp", "Mobile MELT transition", "1600 × 2000", [locked.melt.floating], "Vertical warm table scene with single MELT tub emphasis.", "Tub remains closed and supported."),
    ...timelines.map(([slug, year, title, body], i) => promptSection(`CO_WEBSITE_ABOUT_TIMELINE_${String(i + 1).padStart(2, "0")}_${slug}_MASTER.webp`, `About timeline milestone: ${year} ${title}`, "2000 × 1500", [locked.water.front], `Single editorial story for milestone "${title}": ${body}`, "Use environments, sketches, coconut sourcing or product-development objects. Do not fabricate founders.")),
  ];
  await fs.writeFile(promptsPath, `# .CO Website Image Prompts

These prompts implement the mandatory two-stage method: environment first, locked product composite second. The local implementation uses Sharp-generated editorial environments and composites the approved assets from \`/public/brand-reference\` without overwriting any originals.

${sections.join("\n")}
`);
}

async function buildScenes() {
  const outputs = [];
  outputs.push(await saveScene({
    name: "home/hero/CO_WEBSITE_HOME_HERO_DESKTOP_MASTER.webp",
    width: 2400,
    height: 1350,
    mood: "hero",
    layers: [
      { asset: locked.kitchenOil.angle, left: 1280, top: 365, w: 420, h: 525, shadow: true, rounded: 26 },
      { asset: locked.water.front, left: 1530, top: 270, w: 430, h: 540, shadow: true, rounded: 26 },
      { asset: locked.melt.floating, left: 1840, top: 430, w: 360, h: 540, shadow: true },
      { asset: locked.botanicaFaceWash.angle, left: 1135, top: 540, w: 300, h: 375, shadow: true, rounded: 24 },
    ],
  }));
  outputs.push(await saveScene({
    name: "home/hero/CO_WEBSITE_HOME_HERO_MOBILE_MASTER.webp",
    width: 1800,
    height: 2400,
    mood: "hero",
    layers: [
      { asset: locked.water.front, left: 680, top: 870, w: 520, h: 650, shadow: true, rounded: 32 },
      { asset: locked.melt.floating, left: 960, top: 1190, w: 440, h: 660, shadow: true },
      { asset: locked.botanicaFaceWash.angle, left: 470, top: 1370, w: 360, h: 450, shadow: true, rounded: 28 },
    ],
  }));
  outputs.push(await saveScene({
    name: "home/transitions/CO_WEBSITE_TRANSITION_ORIGIN_DESKTOP_MASTER.webp",
    width: 2400,
    height: 1200,
    mood: "origin",
    layers: [{ asset: locked.water.lifestyle, left: 1320, top: 260, w: 720, h: 405, shadow: true, rounded: 34 }],
    titleBlock: { left: 160, top: 230, width: 760, height: 180, eyebrow: "SOURCE TO SHELF", title: "Kerala roots. Modern rituals.", body: "A calm path from coconut origin to everyday living." },
  }));
  outputs.push(await saveScene({
    name: "home/transitions/CO_WEBSITE_TRANSITION_ORIGIN_MOBILE_MASTER.webp",
    width: 1600,
    height: 2000,
    mood: "origin",
    layers: [{ asset: locked.water.mobileHero, left: 420, top: 720, w: 760, h: 1350, shadow: true, rounded: 34 }],
  }));
  outputs.push(await saveScene({
    name: "home/transitions/CO_WEBSITE_TRANSITION_KITCHEN_DESKTOP_MASTER.webp",
    width: 2400,
    height: 1200,
    mood: "kitchen",
    layers: [
      { asset: locked.kitchenOil.angle, left: 980, top: 290, w: 420, h: 525, shadow: true, rounded: 28 },
      { asset: locked.kitchenFlour.angle, left: 1370, top: 345, w: 390, h: 488, shadow: true, rounded: 28 },
      { asset: locked.kitchenMilk.angle, left: 1710, top: 330, w: 390, h: 488, shadow: true, rounded: 28 },
    ],
    titleBlock: { left: 150, top: 235, width: 720, height: 180, eyebrow: ".CO KITCHEN", title: "The shelf gets calmer.", body: "Oil, flour and milk in a precise everyday kitchen system." },
  }));
  outputs.push(await saveScene({
    name: "home/transitions/CO_WEBSITE_TRANSITION_KITCHEN_MOBILE_MASTER.webp",
    width: 1600,
    height: 2000,
    mood: "kitchen",
    layers: [
      { asset: locked.kitchenOil.angle, left: 500, top: 515, w: 520, h: 650, shadow: true, rounded: 30 },
      { asset: locked.kitchenFlour.angle, left: 285, top: 1110, w: 460, h: 575, shadow: true, rounded: 30 },
      { asset: locked.kitchenMilk.angle, left: 820, top: 1110, w: 460, h: 575, shadow: true, rounded: 30 },
    ],
  }));
  outputs.push(await saveScene({
    name: "home/transitions/CO_WEBSITE_TRANSITION_BOTANICA_DESKTOP_MASTER.webp",
    width: 2400,
    height: 1200,
    mood: "botanica",
    layers: [
      { asset: locked.botanicaFaceWash.angle, left: 1060, top: 290, w: 420, h: 525, shadow: true, rounded: 28 },
      { asset: locked.botanicaHairSerum.front, left: 1440, top: 310, w: 380, h: 475, shadow: true, rounded: 28 },
      { asset: locked.botanicaMoisturizer.front, left: 1780, top: 310, w: 380, h: 475, shadow: true, rounded: 28 },
    ],
    titleBlock: { left: 150, top: 235, width: 720, height: 180, eyebrow: "BOTANiCA", title: "Care, softened.", body: "A restrained personal-care ritual from coconut botanicals." },
  }));
  outputs.push(await saveScene({
    name: "home/transitions/CO_WEBSITE_TRANSITION_BOTANICA_MOBILE_MASTER.webp",
    width: 1600,
    height: 2000,
    mood: "botanica",
    layers: [
      { asset: locked.botanicaFaceWash.angle, left: 430, top: 690, w: 520, h: 650, shadow: true, rounded: 30 },
      { asset: locked.botanicaHairSerum.front, left: 760, top: 1060, w: 430, h: 538, shadow: true, rounded: 30 },
    ],
  }));
  outputs.push(await saveScene({
    name: "home/transitions/CO_WEBSITE_TRANSITION_MELT_DESKTOP_MASTER.webp",
    width: 2400,
    height: 1200,
    mood: "melt",
    layers: [{ asset: locked.melt.floating, left: 1340, top: 250, w: 560, h: 840, shadow: true }],
    titleBlock: { left: 150, top: 235, width: 720, height: 180, eyebrow: "MELT", title: "Slow afternoons. Clean indulgence.", body: "A warm Creamery transition built around one approved tub." },
  }));
  outputs.push(await saveScene({
    name: "home/transitions/CO_WEBSITE_TRANSITION_MELT_MOBILE_MASTER.webp",
    width: 1600,
    height: 2000,
    mood: "melt",
    layers: [{ asset: locked.melt.floating, left: 520, top: 720, w: 560, h: 840, shadow: true }],
  }));

  const timelineAssets = [
    locked.water.lifestyle,
    locked.kitchenMilk.pantry,
    locked.water.front,
    locked.kitchenOil.angle,
    locked.water.hero,
    locked.melt.lifestyle,
  ];
  for (let i = 0; i < timelines.length; i += 1) {
    const [slug, year, title, body] = timelines[i];
    outputs.push(await saveScene({
      name: `about/timeline/CO_WEBSITE_ABOUT_TIMELINE_${String(i + 1).padStart(2, "0")}_${slug}_MASTER.webp`,
      width: 2000,
      height: 1500,
      mood: i % 2 ? "kitchen" : "origin",
      layers: [{ asset: timelineAssets[i], left: 1040, top: 470, w: i === 2 ? 440 : 650, h: 520, shadow: true, rounded: 30 }],
      titleBlock: { left: 130, top: 210, width: 760, height: 220, eyebrow: `${year} · ${String(i + 1).padStart(2, "0")}`, title, body },
    }));
  }

  const variantMap = {};
  for (const output of outputs) variantMap[rel(output)] = await createVariants(output);
  return variantMap;
}

async function main() {
  await fs.mkdir(websiteRoot, { recursive: true });
  const inventory = await imageInventory();
  await buildManifest(inventory);
  await buildPrompts();
  const variants = await buildScenes();
  await fs.writeFile(path.join(websiteRoot, "website-image-manifest.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), variants }, null, 2)}\n`);
  console.log(`Inventoried ${inventory.length} approved brand assets.`);
  console.log(`Wrote ${manifestPath}`);
  console.log(`Wrote ${promptsPath}`);
  console.log(`Generated ${Object.keys(variants).length} master website images plus responsive variants.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
