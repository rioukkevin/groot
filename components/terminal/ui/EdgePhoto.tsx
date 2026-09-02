"use client";

import { useEffect, useRef } from "react";

interface EdgePhotoProps {
  src: string;
  /** Box the image is fitted into, before the block margin is added. */
  width: number;
  height: number;
  cellW: number;
  cellH: number;
  gap: number;
  caption?: string;
  label?: string;
}

/**
 * One cell of scatter outside the frame, and one cell of fray inside it.
 *
 * The first version reached three cells out and two in, which put a thick
 * dissolving band around every photo and read as a frame rather than a fray.
 * A single ring, sparsely populated, does the job: the picture is the subject
 * and the cells are a note in the margin.
 */
const PAD = 1;
const BAND = 1;
/** Fraction of eligible cells that actually get drawn. */
const DENSITY = 0.18;

/** Deterministic per-cell noise, so a photo's fray is the same every render. */
function noise(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

/**
 * The photo as itself, with a frayed border of cells.
 *
 * The grid treatment is spent entirely on the edge: the image proper is drawn
 * clean once it has loaded, and a band of cells a couple deep dissolves it into
 * the page, some of them landing outside the frame. Cells take their colour
 * from the pixels underneath, so the fray belongs to the picture rather than
 * sitting on top of it.
 */
export function EdgePhoto({
  src,
  width,
  height,
  cellW,
  cellH,
  gap,
  caption,
  label = "image",
}: EdgePhotoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Whole cells, so the fray lands on the same grid as the text.
  const cols = Math.max(6, Math.round(width / cellW));
  const rows = Math.max(4, Math.round(height / cellH));
  const innerW = cols * cellW;
  const innerH = rows * cellH;
  // Padding is one square fray cell on each side.
  const totalW = innerW + PAD * 2 * cellW;
  const totalH = innerH + PAD * 2 * cellW;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(totalW * dpr);
    canvas.height = Math.round(totalH * dpr);
    canvas.style.width = `${totalW}px`;
    canvas.style.height = `${totalH}px`;

    const g = canvas.getContext("2d");
    if (!g) return;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);

    let alive = true;

    const draw = (img: HTMLImageElement | null) => {
      if (!alive) return;
      g.clearRect(0, 0, totalW, totalH);
      const ox = PAD * cellW;
      const oy = PAD * cellW;

      if (!img) {
        g.fillStyle = "rgba(128,128,128,0.25)";
        g.fillRect(ox, oy, innerW, innerH);
        return;
      }

      // Cover-fit the image into the inner box.
      const s = Math.max(innerW / img.width, innerH / img.height);
      const dw = img.width * s;
      const dh = img.height * s;
      g.save();
      g.beginPath();
      g.rect(ox, oy, innerW, innerH);
      g.clip();
      g.imageSmoothingEnabled = true;
      g.imageSmoothingQuality = "high";
      g.drawImage(img, ox + (innerW - dw) / 2, oy + (innerH - dh) / 2, dw, dh);
      g.restore();

      // Sample the image small, to colour each cell from what is under it.
      const low = document.createElement("canvas");
      low.width = cols;
      low.height = rows;
      const lg = low.getContext("2d");
      if (!lg) return;
      lg.imageSmoothingEnabled = true;
      lg.drawImage(img, 0, 0, cols, rows);
      let data: Uint8ClampedArray | null = null;
      try {
        data = lg.getImageData(0, 0, cols, rows).data;
      } catch {
        data = null;
      }

      const px = (cx: number, cy: number) => {
        if (!data) return "rgba(160,160,160,1)";
        const x = Math.min(cols - 1, Math.max(0, cx));
        const y = Math.min(rows - 1, Math.max(0, cy));
        const k = (y * cols + x) * 4;
        return `rgb(${data[k]},${data[k + 1]},${data[k + 2]})`;
      };

      // The fray is drawn in SQUARE cells of its own, not the photo's tall
      // terminal cell: an 8x19 mark reads as a tick, and what is wanted here
      // is a stray pixel. One ring only, sparsely populated.
      const fray = cellW;
      const fcols = Math.round(innerW / fray);
      const frows = Math.round(innerH / fray);

      for (let cy = -PAD; cy < frows + PAD; cy++) {
        for (let cx = -PAD; cx < fcols + PAD; cx++) {
          const inside = cx >= 0 && cx < fcols && cy >= 0 && cy < frows;
          const depth = inside
            ? Math.min(cx, cy, fcols - 1 - cx, frows - 1 - cy)
            : 0;
          // Only the outermost ring inside, and the single ring outside.
          if (inside && depth >= BAND) continue;
          if (noise(cx, cy) > DENSITY) continue;

          // Jitter by up to half a cell so the ring is not a tidy rectangle.
          const jx = (noise(cx + 31, cy) - 0.5) * fray * 0.9;
          const jy = (noise(cx, cy + 17) - 0.5) * fray * 0.9;

          const sx = Math.min(cols - 1, Math.max(0, Math.round((cx / fcols) * cols)));
          const sy = Math.min(rows - 1, Math.max(0, Math.round((cy / frows) * rows)));

          g.globalAlpha = inside ? 1 : 0.75;
          g.fillStyle = px(sx, sy);
          g.fillRect(
            Math.round(ox + cx * fray + jx),
            Math.round(oy + cy * fray + jy),
            fray - 1,
            fray - 1,
          );
        }
      }
      g.globalAlpha = 1;
    };

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => draw(img);
    img.onerror = () => {
      const plain = new Image();
      plain.onload = () => draw(plain);
      plain.onerror = () => draw(null);
      plain.src = src;
    };
    img.src = src;

    return () => {
      alive = false;
    };
  }, [src, cols, rows, cellW, cellH, gap, innerW, innerH, totalW, totalH]);

  return (
    <div className="inline-block">
      <canvas
        ref={canvasRef}
        className="block cursor-zoom-in"
        aria-label={label}
      />
      {caption && (
        <div className="pt-[7px] text-[10px] uppercase leading-[1.5] tracking-[.09em] opacity-[.42]">
          {caption}
        </div>
      )}
    </div>
  );
}
