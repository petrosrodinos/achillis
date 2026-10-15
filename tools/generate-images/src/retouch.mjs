// Targeted retouches for generated layers (no API calls). Run: node src/retouch.mjs
// Removes bright artefacts (stray figures, smoke puffs) inside given boxes by making
// light pixels transparent, leaving darker painted terrain/architecture untouched.
import sharp from 'sharp';
import path from 'node:path';
import fs from 'node:fs/promises';

const IMAGES = path.resolve(import.meta.dirname, '../../../app/public/assets/images');

/** Boxes are in source pixels (layers are 2048×1024). minLum: 0..255 luminance above which pixels are erased. */
sharp.cache(false);

const RETOUCHES = [
  // (applied once; re-running is idempotent enough — feathered pixels only fade further)
  { file: 'env/swamp-coast/fore.webp', boxes: [{ x0: 1320, y0: 740, x1: 1480, y1: 868 }], minLum: 120 },
  {
    file: 'env/fortress-airspace/far.webp',
    boxes: [
      { x0: 740, y0: 560, x1: 960, y1: 720 },
      { x0: 1235, y0: 380, x1: 1395, y1: 560 },
      { x0: 1385, y0: 500, x1: 1595, y1: 690 },
    ],
    minLum: 105,
  },
];

for (const r of RETOUCHES) {
  const file = path.join(IMAGES, r.file);
  const input = await fs.readFile(file);
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let erased = 0;
  for (const b of r.boxes) {
    for (let y = b.y0; y < Math.min(b.y1, info.height); y++) {
      for (let x = b.x0; x < Math.min(b.x1, info.width); x++) {
        const i = (y * info.width + x) * 4;
        const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
        if (data[i + 3] > 0 && lum >= r.minLum) {
          // Feather: fade alpha by how far above the threshold the pixel is.
          const k = Math.min(1, (lum - r.minLum) / 40);
          data[i + 3] = Math.round(data[i + 3] * (1 - k));
          erased++;
        }
      }
    }
  }
  const out = await sharp(data, { raw: info }).webp({ quality: 82, alphaQuality: 90 }).toBuffer();
  await fs.writeFile(file, out);
  console.log(`${r.file}: ${erased} px retouched`);
}
