import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const root = process.cwd();
const source = process.argv.find((arg) => arg.startsWith('--source='))?.slice(9) ?? path.join(root, 'output/imagegen/characters');
const partial = process.argv.includes('--partial');
const manifest = JSON.parse(await fs.readFile(path.join(root, 'src/data/game-character-manifest.json'), 'utf8'));
const hashes = new Set();
const missing = [];
let bytes = 0;
let count = 0;
await fs.mkdir(path.join(root, 'public/game/characters-3d'), { recursive: true });
for (const character of manifest) {
  const input = path.join(source, `${character.slug}.png`);
  let original;
  try { original = await fs.readFile(input); } catch (error) { if (error.code !== 'ENOENT') throw error; missing.push(character.name); continue; }
  const hash = createHash('sha256').update(original).digest('hex');
  if (hashes.has(hash)) throw new Error(`Duplicate character artwork: ${character.name}`);
  hashes.add(hash);
  const output = path.join(root, 'public', character.cartoonAsset.replace(/\.png$/, '.webp'));
  const result = await sharp(original).resize(640, 640, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 84, effort: 5 }).toBuffer();
  await fs.writeFile(output, result);
  count++; bytes += result.length;
}
console.log(`Character images: ${count}/${manifest.length}; ${(bytes / 1024 / 1024).toFixed(2)} MiB optimized WebP.`);
if (missing.length) { console.log(`Pending: ${missing.join('、')}`); if (!partial) process.exitCode = 1; }
