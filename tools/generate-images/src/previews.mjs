// npm run previews -- [--only <envId glob>]
// Writes PNG contact sheets to .cache/previews/ for visual QA:
//  env-<id>.png : composite (sky→far→mid→fore) | 2× tiled strip zoomed on the wrap seam | each layer over magenta
//  ground.png, icons.png, portraits.png, missions.png, ui.png, fog.png
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { IMAGES_DIR, PREVIEW_DIR, parseArgs, globToRegExp } from './lib.mjs';

const args = parseArgs(process.argv.slice(2));
const re = args.only ? globToRegExp(args.only) : null;
fs.mkdirSync(PREVIEW_DIR, { recursive: true });
const W = 1200;
const MAG = { r: 255, g: 0, b: 255, alpha: 1 };

const png = (s) => s.png().toBuffer();
async function tile2x(buf, w, h) {
  return png(sharp({ create: { width: w * 2, height: h, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: buf, left: 0, top: 0 }, { input: buf, left: w, top: 0 }]));
}

async function envSheet(envId) {
  const dir = path.join(IMAGES_DIR, 'env', envId);
  const layers = ['sky', 'far', 'mid', 'fore'].map((l) => path.join(dir, `${l}.webp`));
  if (!layers.every((f) => fs.existsSync(f))) return console.log(`skip ${envId} (missing layers)`);
  const comp = await png(sharp(layers[0]).composite(layers.slice(1).map((input) => ({ input }))));
  const compSmall = await png(sharp(comp).resize(W, W / 2));
  // seam zoom: tile 2x at half-scale (2048x512), crop 1200 centred on the seam (x = 1024)
  const t2 = await tile2x(await png(sharp(comp).resize(1024, 512)), 1024, 512);
  const seam = await png(sharp(t2).extract({ left: 1024 - W / 2, top: 0, width: W, height: 512 }));
  const thumbs = await Promise.all(layers.map((f) => png(sharp(f).resize(W / 4, W / 8).flatten({ background: MAG }))));
  const H = W / 2 + 512 + W / 8 + 8;
  const out = path.join(PREVIEW_DIR, `env-${envId}.png`);
  await sharp({ create: { width: W, height: H, channels: 3, background: '#202020' } })
    .composite([
      { input: compSmall, left: 0, top: 0 },
      { input: seam, left: 0, top: W / 2 + 4 },
      ...thumbs.map((input, i) => ({ input, left: (i * W) / 4, top: W / 2 + 512 + 8 })),
    ]).png().toFile(out);
  console.log(`wrote ${path.relative(process.cwd(), out)}`);
}

async function grid(name, files, cell, cols, bg = MAG) {
  files = files.filter((f) => fs.existsSync(f));
  if (!files.length) return;
  const rows = Math.ceil(files.length / cols);
  const comps = await Promise.all(files.map(async (f, i) => ({
    input: await png(sharp(f).resize(cell[0], cell[1], { fit: 'contain', background: bg }).flatten({ background: bg })),
    left: (i % cols) * cell[0], top: Math.floor(i / cols) * cell[1],
  })));
  const out = path.join(PREVIEW_DIR, `${name}.png`);
  await sharp({ create: { width: cols * cell[0], height: rows * cell[1], channels: 3, background: '#202020' } }).composite(comps).png().toFile(out);
  console.log(`wrote ${path.relative(process.cwd(), out)}`);
}

const envRoot = path.join(IMAGES_DIR, 'env');
const envIds = fs.existsSync(envRoot) ? fs.readdirSync(envRoot).filter((d) => d !== '_fog' && (!re || re.test(d))) : [];
for (const id of envIds) await envSheet(id);

if (!args.only) {
  const list = (sub) => (fs.existsSync(path.join(IMAGES_DIR, sub)) ? fs.readdirSync(path.join(IMAGES_DIR, sub)).sort().map((f) => path.join(IMAGES_DIR, sub, f)) : []);
  await grid('icons', list('icons'), [128, 128], 7);
  await grid('icons-32px', list('icons'), [32, 32], 14, { r: 60, g: 50, b: 40, alpha: 1 });
  await grid('ground', list('ground'), [300, 300], 4);
  // ground tiled 2x2 to check both-axis seams
  for (const f of list('ground').concat(list('ui').filter((f) => f.includes('parchment')))) {
    const b = await png(sharp(f).resize(400, 400));
    const t = await png(sharp({ create: { width: 800, height: 800, channels: 3, background: '#000' } })
      .composite([0, 1, 2, 3].map((i) => ({ input: b, left: (i % 2) * 400, top: Math.floor(i / 2) * 400 }))));
    fs.writeFileSync(path.join(PREVIEW_DIR, `tile-${path.basename(f, '.webp')}.png`), t);
  }
  await grid('portraits', list('portraits'), [256, 256], 5);
  await grid('missions', list('missions'), [384, 256], 4);
  await grid('ui', list('ui'), [480, 270], 3);
  // fog over a mid-grey/dark backdrop, 2× tiled
  for (const f of list('env/_fog')) {
    const b = await png(sharp(f).resize(600, 300));
    const t = await tile2x(b, 600, 300);
    await sharp({ create: { width: 1200, height: 300, channels: 3, background: '#3a4048' } }).composite([{ input: t }]).png()
      .toFile(path.join(PREVIEW_DIR, `fog-${path.basename(f, '.webp')}.png`));
  }
}
