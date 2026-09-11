/**
 * Draws the site's icons from the buddy.
 *
 * The favicon is the same face the header shows: the blobatar for
 * "kevin-riou", happy, in the default theme's accent, put through the same
 * pixelation as BuddyShader — one colour per cell on a 16×16 grid, a gutter
 * between cells, six levels per channel. It is built as an SVG of squares, so
 * it stays crisp at any size and the ICO, the Apple icon and the Open Graph
 * portrait are all rasterised from the one drawing.
 *
 *   bun run icons
 *
 * Writes app/icon.svg, app/favicon.ico, app/apple-icon.png and
 * assets/og/buddy.png. Re-run after changing the buddy's traits or the accent.
 */
import { mkdir, writeFile } from "node:fs/promises";

import { blobatar } from "blobatar";
import { happy } from "blobatar/expression";
import sharp from "sharp";

/** Mirrors BuddyShader's defaults, so the icon and the header agree. */
const CELLS = 16;
const GAP = 0.14;
const LEVELS = 6;

/** The default theme's --bg and --accent (oklch(0.8 0.115 152)) as sRGB. */
const BG = "#0c0c0c";
const HEAD = "#82d399";
/** As in Buddy.tsx: tall, narrow eyes. */
const TRAITS = { "eye.ratio": 0.92, "eye.stretch": 0.85 };
/** Green channel below this (the head's is 0xd6) means the cell is mostly eye. */
const EYE_CUTOFF = 0x90;

/** The drawing's unit square; every output is a multiple of it. */
const UNIT = 512;

interface Cell {
  x: number;
  y: number;
  fill: string;
  alpha: number;
}

/** The blob, downsampled to the cell grid and posterised, cell by cell. */
async function sampleCells(): Promise<Cell[]> {
  const svg = blobatar("kevin-riou", {
    size: CELLS * 8,
    background: false,
    expression: happy,
    palette: { head: HEAD, eye: BG },
    traits: TRAITS,
  })
    // The face sits in the middle ~66% of its 100-unit canvas; crop to it so
    // the grid is spent on the face rather than on the margin around it.
    .replace('viewBox="0 0 100 100"', 'viewBox="9 7 82 82"');

  const { data } = await sharp(Buffer.from(svg))
    .resize(CELLS, CELLS, { fit: "fill", kernel: "lanczos3" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const step = 255 / LEVELS;
  const post = (v: number) => Math.round(Math.round(v / step) * step);
  const cells: Cell[] = [];
  for (let y = 0; y < CELLS; y++) {
    for (let x = 0; x < CELLS; x++) {
      const i = (y * CELLS + x) * 4;
      const a = data[i + 3];
      if (a < 24) continue; // outside the blob: leave it empty
      const rgb = [post(data[i]), post(data[i + 1]), post(data[i + 2])];
      // An eye is under two cells wide, so its cells average to a murky
      // teal. The header gets away with that at 56px; a tab icon does not, so
      // a cell that is mostly eye becomes all eye.
      const eye = rgb[1] < EYE_CUTOFF;
      cells.push({
        x,
        y,
        fill: eye ? BG : "#" + rgb.map((v) => v.toString(16).padStart(2, "0")).join(""),
        alpha: a / 255,
      });
    }
  }
  return cells;
}

/**
 * The cells as an SVG. `pad` is the margin around the grid as a fraction of
 * the tile; `corner` rounds the tile (0 for iOS, which masks its own).
 */
function draw(
  cells: Cell[],
  { background, pad, corner }: { background: boolean; pad: number; corner: number },
): string {
  const inner = UNIT * (1 - 2 * pad);
  const cell = inner / CELLS;
  const gutter = cell * GAP;
  const off = UNIT * pad;
  const n = (v: number) => Math.round(v * 100) / 100;
  const rects = cells
    .map(
      (c) =>
        `<rect x="${n(off + c.x * cell + gutter / 2)}" y="${n(off + c.y * cell + gutter / 2)}" ` +
        `width="${n(cell - gutter)}" height="${n(cell - gutter)}" fill="${c.fill}"` +
        (c.alpha < 0.995 ? ` fill-opacity="${n(c.alpha)}"` : "") +
        "/>",
    )
    .join("");
  const bg = background
    ? `<rect width="${UNIT}" height="${UNIT}" rx="${n(UNIT * corner)}" fill="${BG}"/>`
    : "";
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${UNIT} ${UNIT}">` +
    `<title>kevin-riou, happy</title>${bg}${rects}</svg>`
  );
}

const png = (svg: string, size: number) =>
  sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();

/** An ICO is a small directory in front of PNGs; every browser reads it. */
function ico(images: { size: number; data: Buffer }[]): Buffer {
  const head = Buffer.alloc(6);
  head.writeUInt16LE(1, 2); // type: icon
  head.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });
  return Buffer.concat([head, ...entries, ...images.map((i) => i.data)]);
}

const cells = await sampleCells();
const tile = draw(cells, { background: true, pad: 0.08, corner: 0.22 });
const apple = draw(cells, { background: true, pad: 0.12, corner: 0 });
const portrait = draw(cells, { background: false, pad: 0, corner: 0 });

await mkdir("assets/og", { recursive: true });
await writeFile("app/icon.svg", tile);
await writeFile(
  "app/favicon.ico",
  ico(await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(tile, size) })))),
);
await writeFile("app/apple-icon.png", await png(apple, 180));
await writeFile("assets/og/buddy.png", await png(portrait, 512));

if (process.env.PREVIEW_DIR) {
  await writeFile(`${process.env.PREVIEW_DIR}/icon-64.png`, await png(tile, 64));
  await writeFile(`${process.env.PREVIEW_DIR}/icon-256.png`, await png(tile, 256));
  await writeFile(`${process.env.PREVIEW_DIR}/apple-180.png`, await png(apple, 180));
}
console.log(`${cells.length} cells → app/icon.svg, app/favicon.ico, app/apple-icon.png, assets/og/buddy.png`);
