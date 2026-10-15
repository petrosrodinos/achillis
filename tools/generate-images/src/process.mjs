// Post-processing operations. All ops work on { data: Buffer(RGBA, straight alpha), width, height }.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

async function toRaw(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}
const fromRaw = (img) => sharp(img.data, { raw: { width: img.width, height: img.height, channels: 4 } });

async function resizeCover(img, width, height, position = 'centre') {
  const pos = position === 'bottom' ? 'south' : position === 'top' ? 'north' : 'centre';
  return toRaw(await fromRaw(img).resize(width, height, { fit: 'cover', position: pos, kernel: 'lanczos3' }).png().toBuffer());
}

const smooth = (t) => t * t * (3 - 2 * t);

/**
 * Horizontal seamless tiling via offset-and-blend. Source is first scaled to (width + B) so that
 * output[x] = source[x] for x >= B, and for x < B it cross-fades from source[width + x] (the
 * continuation past the right edge) into source[x]. Hence output[width-1] = source[width-1] sits
 * next to output[0] = source[width] — continuous across the wrap. Blending is premultiplied.
 */
function blendX(src, width) {
  const B = src.width - width;
  const { height } = src;
  const out = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    const so = y * src.width * 4;
    const oo = y * width * 4;
    src.data.copy(out, oo, so, so + width * 4);
    for (let x = 0; x < B; x++) {
      const t = smooth(x / B);
      const a = so + (width + x) * 4; // tail
      const b = so + x * 4; // head
      const aa = src.data[a + 3] / 255, ba = src.data[b + 3] / 255;
      const alpha = aa * (1 - t) + ba * t;
      const o = oo + x * 4;
      for (let c = 0; c < 3; c++) {
        const pm = src.data[a + c] * aa * (1 - t) + src.data[b + c] * ba * t;
        out[o + c] = alpha > 0 ? Math.round(pm / alpha) : 0;
      }
      out[o + 3] = Math.round(alpha * 255);
    }
  }
  return { data: out, width, height };
}

function transpose(img) {
  const { width, height, data } = img;
  const out = Buffer.alloc(data.length);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) data.copy(out, (x * height + y) * 4, (y * width + x) * 4, (y * width + x) * 4 + 4);
  return { data: out, width: height, height: width };
}

const OPS = {
  async fit(img, { width, height, position }) {
    return resizeCover(img, width, height, position);
  },
  async seamless(img, { axes = 'x', width, height, blend = 0.18, position }) {
    const bx = Math.round(width * blend);
    const by = axes === 'xy' ? Math.round(height * blend) : 0;
    let cur = await resizeCover(img, width + bx, height + by, position);
    cur = blendX(cur, width);
    if (axes === 'xy') cur = transpose(blendX(transpose(cur), height));
    return cur;
  },
  /** Zero alpha above `clear` (fraction of height), ramp to unchanged by clear+fade. */
  async topFade(img, { clear, fade }) {
    const { width, height, data } = img;
    for (let y = 0; y < height; y++) {
      const f = y / height;
      const k = f <= clear ? 0 : f >= clear + fade ? 1 : smooth((f - clear) / fade);
      if (k === 1) continue;
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4 + 3;
        data[i] = Math.round(data[i] * k);
      }
    }
    return img;
  },
  /** Remove faint haze the model leaves in "transparent" areas. */
  async alphaClean(img, { threshold = 12 }) {
    const { data } = img;
    for (let i = 3; i < data.length; i += 4) {
      const a = data[i];
      data[i] = a <= threshold ? 0 : Math.round(((a - threshold) / (255 - threshold)) * 255);
    }
    return img;
  },
  /** White-on-black mist → tinted colour with alpha = luminance. */
  async lumaToAlpha(img, { color, gain = 1 }) {
    const r0 = parseInt(color.slice(1, 3), 16), g0 = parseInt(color.slice(3, 5), 16), b0 = parseInt(color.slice(5, 7), 16);
    const { data } = img;
    for (let i = 0; i < data.length; i += 4) {
      const l = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
      const a = Math.min(1, Math.max(0, (l - 0.03) / 0.97) * gain);
      const shade = 0.85 + 0.15 * l;
      data[i] = Math.round(r0 * shade);
      data[i + 1] = Math.round(g0 * shade);
      data[i + 2] = Math.round(b0 * shade);
      data[i + 3] = Math.round(a * 255);
    }
    return img;
  },
  /**
   * The model tends to paint transparent layers as a floating band mid-frame. Find the lowest
   * "solid" row (>= coverage of pixels opaque), drop everything below it, shift the band down so
   * it sits on the bottom edge, then bleed each column's lowest opaque pixel down over the last
   * `bleed` fraction of rows so the layer has no see-through gaps at the bottom.
   */
  async anchorBottom(img, { coverage = 0.6, bleed = 0.06 }) {
    const { width, height, data } = img;
    let bottom = -1;
    for (let y = height - 1; y >= 0 && bottom < 0; y--) {
      let n = 0;
      for (let x = 0; x < width; x++) if (data[(y * width + x) * 4 + 3] > 128) n++;
      if (n / width >= coverage) bottom = y;
    }
    if (bottom < 0) return img;
    const shift = height - 1 - bottom;
    const out = Buffer.alloc(data.length);
    data.copy(out, shift * width * 4, 0, (bottom + 1) * width * 4);
    const from = Math.floor(height * (1 - bleed));
    for (let x = 0; x < width; x++) {
      let last = -1;
      for (let y = from - 40; y < height; y++) {
        const i = (y * width + x) * 4;
        if (out[i + 3] > 200) last = i;
        else if (y >= from && last >= 0) { out.copy(out, i, last, last + 4); }
      }
    }
    return { data: out, width, height };
  },
  /**
   * Shift a bottom-anchored band down so its top (first row with >= coverage opaque pixels) sits at
   * `top` (fraction of height). Moving down drops rows pushed past the bottom; moving up is opt-in (`allowUp`).
   */
  async placeTop(img, { top, coverage = 0.08, allowUp = false, maxUp = 0.3 }) {
    const { width, height, data } = img;
    let cur = -1;
    for (let y = 0; y < height && cur < 0; y++) {
      let n = 0;
      for (let x = 0; x < width; x++) if (data[(y * width + x) * 4 + 3] > 128) n++;
      if (n / width >= coverage) cur = y;
    }
    const shift = Math.round(top * height) - cur;
    if (cur < 0 || shift === 0) return img;
    const out = Buffer.alloc(data.length);
    if (shift > 0) {
      data.copy(out, shift * width * 4, 0, (height - shift) * width * 4);
    } else {
      // Raise a band that sits too low (only for layers whose bottom is hidden by nearer layers):
      // move up and repeat the last row downwards so the layer stays solid to the bottom edge.
      if (!allowUp) return img;
      const up = Math.min(-shift, Math.round(height * maxUp));
      data.copy(out, 0, up * width * 4, height * width * 4);
      // Fill with the last row blurred horizontally (wrap-around keeps it tileable) so there are no streaks.
      const lastRow = (height - up - 1) * width * 4;
      const R = 96;
      const fill = Buffer.alloc(width * 4);
      for (let x = 0; x < width; x++) {
        const acc = [0, 0, 0];
        let wsum = 0;
        for (let k = -R; k <= R; k++) {
          const i = lastRow + (((x + k) % width + width) % width) * 4;
          const w = out[i + 3];
          wsum += w;
          for (let c = 0; c < 3; c++) acc[c] += out[i + c] * w;
        }
        for (let c = 0; c < 3; c++) fill[x * 4 + c] = wsum ? Math.round(acc[c] / wsum) : 0;
        fill[x * 4 + 3] = wsum ? 255 : 0;
      }
      const G = 64; // cross-fade rows from the last real row into the blurred fill
      for (let y = height - up; y < height; y++) {
        const t = Math.min(1, (y - (height - up) + 1) / G);
        const o = y * width * 4;
        for (let x = 0; x < width * 4; x++) out[o + x] = Math.round(out[lastRow + x] * (1 - t) + fill[x] * t);
      }
    }
    return { data: out, width, height };
  },
  async trim(img) {
    return toRaw(await fromRaw(img).trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 1 }).png().toBuffer());
  },
  async contain(img, { width, height, padding = 0 }) {
    const inner = await fromRaw(img)
      .resize(width - padding * 2, height - padding * 2, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 }, kernel: 'lanczos3' })
      .png().toBuffer();
    return toRaw(await sharp({ create: { width, height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite([{ input: inner, gravity: 'centre' }]).png().toBuffer());
  },
};

/** Run an asset's postprocess pipeline from its cached raw PNG and write the final WebP. */
export async function postprocessAsset(asset, rawFile, outFile) {
  let img = await toRaw(fs.readFileSync(rawFile));
  let webp = { quality: 82, alphaQuality: 90 };
  for (const step of asset.postprocess ?? []) {
    if (step.op === 'webp') { webp = { quality: step.quality ?? 82, alphaQuality: step.alphaQuality ?? 90 }; continue; }
    const fn = OPS[step.op];
    if (!fn) throw new Error(`Unknown postprocess op ${step.op} in ${asset.id}`);
    img = await fn(img, step);
  }
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  const opaque = asset.background !== 'transparent' && !asset.postprocess?.some((s) => ['lumaToAlpha', 'topFade'].includes(s.op));
  let pipe = fromRaw(img);
  if (opaque) pipe = pipe.removeAlpha();
  await pipe.webp({ quality: webp.quality, alphaQuality: webp.alphaQuality, effort: 6, smartSubsample: true }).toFile(outFile);
  return { width: img.width, height: img.height };
}
