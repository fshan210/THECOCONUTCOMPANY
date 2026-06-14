import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outDir = path.join(root, "public/assets/generated");
await fs.mkdir(outDir, { recursive: true });

const colors = {
  brown: "#3E2E1F",
  green: "#4A6F4A",
  palm: "#A8B07B",
  sun: "#D8C07A",
  cream: "#F5EBD7",
  ink: "#2D2D2D",
  white: "#fffdf8"
};

function svgShell({ title, body, icon = "coconut", bg = colors.cream }) {
  const doodles = {
    coconut: `<ellipse cx="900" cy="470" rx="210" ry="150" fill="${colors.brown}"/><ellipse cx="900" cy="470" rx="142" ry="92" fill="${colors.white}"/><ellipse cx="960" cy="425" rx="92" ry="48" fill="${colors.green}" transform="rotate(17 960 425)"/><path d="M760 540c90 70 260 68 350-12" fill="none" stroke="${colors.brown}" stroke-width="14" stroke-linecap="round" opacity=".32"/>`,
    bottle: `<rect x="835" y="230" width="170" height="410" rx="58" fill="${colors.white}" stroke="${colors.brown}" stroke-width="12"/><rect x="878" y="178" width="84" height="78" rx="24" fill="${colors.green}"/><rect x="860" y="350" width="120" height="150" rx="20" fill="${colors.cream}" stroke="${colors.palm}" stroke-width="5"/><text x="920" y="432" text-anchor="middle" font-size="44" font-family="Arial" fill="${colors.brown}">.CO</text>`,
    oil: `<ellipse cx="900" cy="510" rx="150" ry="68" fill="${colors.sun}" opacity=".7"/><path d="M910 230c96 112 126 180 126 254 0 85-58 143-126 143s-126-58-126-143c0-74 30-142 126-254Z" fill="${colors.white}" stroke="${colors.brown}" stroke-width="12"/><path d="M910 318c42 63 62 111 62 164 0 46-26 79-62 79s-62-33-62-79c0-53 20-101 62-164Z" fill="${colors.sun}" opacity=".58"/>`,
    skincare: `<circle cx="900" cy="440" r="158" fill="${colors.white}" stroke="${colors.brown}" stroke-width="12"/><path d="M810 500c70 50 160 50 230 0" stroke="${colors.green}" stroke-width="14" fill="none" stroke-linecap="round"/><rect x="822" y="356" width="156" height="206" rx="44" fill="${colors.cream}" stroke="${colors.palm}" stroke-width="7"/><circle cx="994" cy="380" r="42" fill="${colors.sun}" opacity=".65"/>`,
    route: `<path d="M715 505c110-135 240-174 390-108" fill="none" stroke="${colors.green}" stroke-width="12" stroke-dasharray="20 24"/><circle cx="710" cy="510" r="34" fill="${colors.brown}"/><circle cx="1110" cy="400" r="34" fill="${colors.sun}"/><path d="M800 620h300" stroke="${colors.brown}" stroke-width="8" stroke-linecap="round" opacity=".2"/>`,
    network: `<g stroke="${colors.green}" stroke-width="7" opacity=".85"><path d="M790 360 940 460 1088 340M940 460 895 620M940 460l190 150M790 360l105 260"/></g><g fill="${colors.white}" stroke="${colors.brown}" stroke-width="8"><circle cx="790" cy="360" r="48"/><circle cx="940" cy="460" r="58"/><circle cx="1088" cy="340" r="48"/><circle cx="895" cy="620" r="44"/><circle cx="1130" cy="610" r="44"/></g>`,
    palms: `<path d="M770 620C875 440 965 330 1135 265" stroke="${colors.brown}" stroke-width="14" fill="none" stroke-linecap="round"/><g stroke="${colors.green}" stroke-width="7" fill="none" stroke-linecap="round"><path d="M910 382c-24-72-14-126 16-174M938 354c28-70 68-112 140-151M975 332c64-42 119-54 184-46M892 407c-80-4-139 16-190 62M925 377c-72-36-129-42-197-20"/></g>`
  };

  return `
  <svg width="1280" height="900" viewBox="0 0 1280 900" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="paper" cx="25%" cy="15%" r="86%"><stop stop-color="${colors.white}"/><stop offset=".58" stop-color="${bg}"/><stop offset="1" stop-color="${colors.palm}" stop-opacity=".28"/></radialGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="28" stdDeviation="34" flood-color="${colors.brown}" flood-opacity=".16"/></filter>
    </defs>
    <rect width="1280" height="900" fill="url(#paper)"/>
    <path d="M0 690C180 642 346 642 520 694s338 56 512 2 226-58 248-55v259H0Z" fill="${colors.white}" opacity=".45"/>
    <g opacity=".18" stroke="${colors.palm}" stroke-width="3" fill="none">
      ${Array.from({ length: 12 }, (_, i) => `<path d="M${80 + i * 78} 0c34 48 34 90 0 138s-34 90 0 138 34 90 0 138" />`).join("")}
    </g>
    <g filter="url(#shadow)">${doodles[icon] || doodles.coconut}</g>
    <text x="92" y="190" font-size="26" letter-spacing="8" font-family="Arial, sans-serif" fill="${colors.green}">${title.toUpperCase()}</text>
    <text x="92" y="290" font-size="76" font-weight="300" font-family="Arial, sans-serif" fill="${colors.brown}">${body}</text>
  </svg>`;
}

function heroCoconutSvg() {
  return `
  <svg width="1200" height="1000" viewBox="0 0 1200 1000" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="shell" cx="35%" cy="25%" r="75%"><stop stop-color="#8a5a35"/><stop offset=".45" stop-color="${colors.brown}"/><stop offset="1" stop-color="#1f1712"/></radialGradient>
      <radialGradient id="flesh" cx="42%" cy="30%" r="65%"><stop stop-color="${colors.white}"/><stop offset=".72" stop-color="${colors.cream}"/><stop offset="1" stop-color="#d8c9ae"/></radialGradient>
      <radialGradient id="water" cx="40%" cy="30%" r="70%"><stop stop-color="${colors.white}" stop-opacity=".96"/><stop offset=".52" stop-color="${colors.palm}" stop-opacity=".55"/><stop offset="1" stop-color="${colors.green}" stop-opacity=".92"/></radialGradient>
      <filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="42" stdDeviation="38" flood-color="${colors.brown}" flood-opacity=".28"/></filter>
    </defs>
    <rect width="1200" height="1000" fill="none"/>
    <ellipse cx="600" cy="814" rx="310" ry="58" fill="${colors.brown}" opacity=".18"/>
    <g filter="url(#soft)">
      <ellipse cx="545" cy="520" rx="290" ry="248" fill="url(#shell)" transform="rotate(-12 545 520)"/>
      <ellipse cx="555" cy="516" rx="208" ry="162" fill="url(#flesh)" transform="rotate(-12 555 516)"/>
      <ellipse cx="585" cy="520" rx="130" ry="78" fill="url(#water)" transform="rotate(-9 585 520)"/>
      <path d="M309 498c86-144 316-204 482-96" stroke="${colors.sun}" stroke-width="6" opacity=".34" fill="none"/>
      <g opacity=".32" stroke="${colors.cream}" stroke-width="5" stroke-linecap="round">
        <path d="M350 440c88-54 187-74 300-60"/>
        <path d="M330 520c102 30 218 44 356 10"/>
        <path d="M390 618c94 36 195 36 316-4"/>
      </g>
    </g>
    <g filter="url(#soft)">
      <path d="M770 405c130-34 234 38 238 154 4 130-126 224-272 190 78-70 94-242 34-344Z" fill="url(#shell)"/>
      <path d="M806 460c92-7 152 42 154 115 2 78-72 132-154 118 46-58 51-173 0-233Z" fill="url(#flesh)"/>
    </g>
  </svg>`;
}

const assets = [
  ["hero-coconut-render", heroCoconutSvg()],
  ["product-kitchen-oil", svgShell({ title: ".CO Kitchen", body: "Coconut Oil", icon: "oil" })],
  ["product-lifestyle", svgShell({ title: ".CO Lifestyle", body: "Daily rituals", icon: "palms", bg: colors.white })],
  ["recipe-smoothie-bowl", svgShell({ title: "Recipe", body: "Smoothie Bowl", icon: "coconut", bg: colors.cream })],
  ["recipe-coffee-chill", svgShell({ title: "Recipe", body: "Coffee Chill", icon: "bottle", bg: colors.white })],
  ["journey-aggregation", svgShell({ title: "Village Model", body: "Aggregation", icon: "network" })],
  ["journey-manufacturing", svgShell({ title: "Processing", body: "Manufacturing", icon: "bottle", bg: colors.white })],
  ["journey-uae", svgShell({ title: "Kerala to UAE", body: "Export Route", icon: "route" })],
  ["journey-global", svgShell({ title: "Global Vision", body: "Coconut Living", icon: "palms", bg: colors.white })]
];

for (const [name, svg] of assets) {
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  await fs.writeFile(path.join(outDir, `${name}.png`), png);
  await sharp(png).webp({ quality: 86 }).toFile(path.join(outDir, `${name}.webp`));
}

const faviconSource = "/Users/fazilshersha/Desktop/dot CO/ChatGPT Image Jun 15, 2026, 12_53_39 AM.png";
for (const [name, size] of [
  ["favicon-16x16.png", 16],
  ["favicon-32x32.png", 32],
  ["apple-touch-icon.png", 180],
  ["android-chrome-192x192.png", 192],
  ["android-chrome-512x512.png", 512],
  ["favicon.ico", 32]
]) {
  await sharp(faviconSource)
    .resize(size, size, { fit: "cover", position: "center" })
    .png()
    .toFile(path.join(root, "public", name));
}

console.log(`Generated ${assets.length} consumer assets and favicon package.`);
