import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
const source = process.argv[2] || '/Users/fazilshersha/Desktop/redesign asset/backgrounds/default pages/profile';
const target = 'public/assets/redesign/account';
await mkdir(target,{recursive:true});
const manifest=[];
for(let index=1;index<=8;index++) {
 const input=await readFile(`${source}/${index}.png`);
 const file=`scene-${index}.webp`;
 await sharp(input).resize({width:index%2 ? 1672 : 941,withoutEnlargement:true}).webp({quality:85}).toFile(`${target}/${file}`);
 manifest.push({file,source:`${source}/${index}.png`,sha256:createHash('sha256').update(input).digest('hex'),provenance:'User supplied account background, deterministic WebP conversion; source unchanged.'});
}
await writeFile(`${target}/provenance.json`,JSON.stringify(manifest,null,2)+'\n');
