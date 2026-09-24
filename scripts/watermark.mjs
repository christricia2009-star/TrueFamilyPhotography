import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE = path.join(ROOT, "public/images");
const PREVIEWS = path.join(ROOT, "public/previews");
const THUMBS = path.join(ROOT, "public/thumbs");

const TILE = 1200;
const TEXT = "@TRUEFAMILYPHOTOGRAPHY";
const FONT_SIZE = Math.max(14, Math.round(TILE / 46));
const GAP_X = FONT_SIZE * 16;
const GAP_Y = FONT_SIZE * 7;
const PREVIEW_EDGE = 1600;
const HERO_EDGE = 2200;
const THUMB_WIDTH = 800;

function tileSvg() {
  const extra = TILE * 2;
  const marks = [];
  for (let y = -extra; y <= TILE + extra; y += GAP_Y) {
    for (let x = -extra; x <= TILE + extra; x += GAP_X) {
      marks.push(
        `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle">${TEXT}</text>`,
      );
    }
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${TILE}" height="${TILE}" viewBox="0 0 ${TILE} ${TILE}">
  <g opacity="0.2" transform="rotate(-24 ${TILE / 2} ${TILE / 2})">
    <g fill="#ffffff" fill-opacity="1" stroke="#04140e" stroke-width="1.25" stroke-opacity="1" paint-order="stroke fill" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="${FONT_SIZE}">
      ${marks.join("\n      ")}
    </g>
  </g>
</svg>`;
}

function shiftFor(filename) {
  const digest = createHash("sha256").update(filename.replaceAll("\\", "/")).digest();
  return {
    x: digest.readUInt32BE(0) % TILE,
    y: digest.readUInt32BE(4) % TILE,
  };
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (/\.jpe?g$/i.test(entry.name)) files.push(full);
  }
  return files;
}

async function renderTile() {
  const png = await sharp(Buffer.from(tileSvg()))
    .resize(TILE, TILE, { fit: "fill" })
    .png()
    .toBuffer();
  const meta = await sharp(png).metadata();
  if (meta.width !== TILE || meta.height !== TILE) {
    throw new Error(`Tile rendered at ${meta.width}×${meta.height}, expected ${TILE}×${TILE}`);
  }
  return png;
}

async function marked(input, tile, filename, { longEdge, width, quality }) {
  let pipeline = sharp(input).rotate();
  if (longEdge) {
    pipeline = pipeline.resize({
      width: longEdge,
      height: longEdge,
      fit: "inside",
      withoutEnlargement: true,
    });
  } else {
    pipeline = pipeline.resize({ width, withoutEnlargement: true });
  }
  const base = await pipeline.toBuffer();
  const meta = await sharp(base).metadata();
  const outW = meta.width ?? 0;
  const outH = meta.height ?? 0;
  const { x: shiftX, y: shiftY } = shiftFor(filename);
  const layers = [];
  for (let top = -TILE + shiftY; top < outH; top += TILE) {
    for (let left = -TILE + shiftX; left < outW; left += TILE) {
      const srcLeft = Math.max(0, -left);
      const srcTop = Math.max(0, -top);
      const destLeft = Math.max(0, left);
      const destTop = Math.max(0, top);
      const cropW = Math.min(TILE - srcLeft, outW - destLeft);
      const cropH = Math.min(TILE - srcTop, outH - destTop);
      if (cropW <= 0 || cropH <= 0) continue;
      const piece =
        cropW === TILE && cropH === TILE
          ? tile
          : await sharp(tile).extract({ left: srcLeft, top: srcTop, width: cropW, height: cropH }).png().toBuffer();
      layers.push({ input: piece, left: destLeft, top: destTop, blend: "over" });
    }
  }
  const overlay = await sharp({
    create: { width: outW, height: outH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite(layers)
    .png()
    .toBuffer();
  return sharp(base).composite([{ input: overlay, blend: "over" }]).jpeg({
    quality,
    mozjpeg: true,
    chromaSubsampling: "4:2:0",
  }).toBuffer();
}

const tile = await renderTile();
const only = process.argv[2];
const files = (await walk(SOURCE)).filter((file) => {
  if (!only) return true;
  const relative = path.relative(SOURCE, file).split(path.sep).join("/");
  return relative === only || path.basename(file) === only;
});
let count = 0;
for (const file of files) {
  const relative = path.relative(SOURCE, file);
  const filename = relative.split(path.sep).join("/");
  const original = await readFile(file);
  const longEdge = filename.toLowerCase() === "hero.jpg" ? HERO_EDGE : PREVIEW_EDGE;
  const preview = await marked(original, tile, filename, { longEdge, quality: 72 });
  const thumb = await marked(original, tile, filename, { width: THUMB_WIDTH, quality: 68 });
  const previewPath = path.join(PREVIEWS, relative);
  const thumbPath = path.join(THUMBS, relative);
  await mkdir(path.dirname(previewPath), { recursive: true });
  await mkdir(path.dirname(thumbPath), { recursive: true });
  await writeFile(previewPath, preview);
  await writeFile(thumbPath, thumb);
  count += 1;
  console.log(`${relative}  shift ${JSON.stringify(shiftFor(filename))}`);
}

console.log(
  `tile ${TILE}px  font ${FONT_SIZE}px  gap ${GAP_X}×${GAP_Y}  ${count} previews, originals unchanged`,
);
