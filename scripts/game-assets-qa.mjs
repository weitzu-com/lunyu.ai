import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const manifest = JSON.parse(await fs.readFile('src/data/game-character-manifest.json', 'utf8'));
assert.equal(manifest.length, 78, '孔子及77位弟子必须全部覆盖');
const hashes = new Set();
let bytes = 0;
for (const person of manifest) {
  const file = path.join('public', person.cartoonAsset.replace(/\.png$/, '.webp'));
  const buffer = await fs.readFile(file);
  const metadata = await sharp(buffer).metadata();
  assert.equal(metadata.format, 'webp', `${person.name}: expected optimized WebP`);
  assert.equal(metadata.width, 640, `${person.name}: width`);
  assert.equal(metadata.height, 640, `${person.name}: height`);
  assert.ok(buffer.length > 6000 && buffer.length < 150000, `${person.name}: unexpected image size`);
  const hash = createHash('sha256').update(await sharp(buffer).raw().toBuffer()).digest('hex');
  assert.ok(!hashes.has(hash), `${person.name}: duplicate portrait`);
  hashes.add(hash);
  bytes += buffer.length;
}
console.log(`PASS: 78 distinct, decodable 640×640 character portraits; ${(bytes/1024/1024).toFixed(2)} MiB total.`);
