// Makes 800px and 1600px WebP copies of the photos in src/assets/scss into public/img.
// Usage: node scripts/optimize-images.mjs
import sharp from "sharp";
import { readdirSync, mkdirSync, existsSync } from "node:fs";
import { extname, basename } from "node:path";

const SRC = "src/assets/scss";
const OUT = "public/img";
mkdirSync(OUT, { recursive: true });
const slug = (f) =>
  basename(f, extname(f)).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

for (const f of readdirSync(SRC)) {
  if (!/\.(jpe?g|png)$/i.test(f)) continue;
  for (const w of [800, 1600]) {
    const out = `${OUT}/${slug(f)}-${w}.webp`;
    if (existsSync(out)) continue;
    await sharp(`${SRC}/${f}`)
      .rotate()
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(out);
    console.log(out);
  }
}
