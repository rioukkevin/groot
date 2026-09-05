"use client";

import { useEffect, useRef } from "react";

/**
 * A picture rained in as glyphs. Ported from the design's fx-glyph-rain.
 *
 * Any transparent PNG: one sample per cell, transparent cells skipped, the
 * exposure set from the 98th-percentile channel so a dark photo still reads,
 * then the user's brightness, contrast and saturation on top. Two alphabets:
 * a luminance ramp of ASCII, or Braille, where each cell carries 2×4 dots
 * chosen by unsharp masking and Floyd–Steinberg diffusion over the whole
 * dot grid — so edges and gradients survive at dot resolution.
 *
 * Glyphs fall in column by column and settle; a bright head leads each
 * column, the settled field twinkles faintly, the pointer scrambles what it
 * passes over, and a click replays the rain. Under reduced motion the field
 * is drawn settled, once.
 */

export type GlyphMode = "ascii" | "braille";

export interface GlyphRainProps {
  src: string;
  /** Box the picture is fitted into, on whole cells. */
  width: number;
  height: number;
  /** Alphabet. ASCII is the default; Braille resolves finer. */
  mode?: GlyphMode;
  /** Cell width in px; height is 1.9× that, glyph size 1.45×. */
  cell?: number;
  /** 0–200: colour intensity, 100 as shot. */
  saturation?: number;
  /** 40–200: brightness on top of the auto exposure, 100 neutral. */
  brightness?: number;
  /** 50–180: contrast about mid-grey, 100 neutral. */
  contrast?: number;
  /** 0–100: how much the settled field shimmers. */
  twinkle?: number;
  /** 20–300: fall speed, 100 as designed. */
  speed?: number;
  /** Seconds between automatic replays; 0 never replays on its own. */
  loop?: number;
  label?: string;
  caption?: string;
}

const ASCII = ".:-~=+*co#%@";
/** [subRow][subCol] → dot bit of U+2800. */
const BRAILLE_BITS = [
  [0x01, 0x08],
  [0x02, 0x10],
  [0x04, 0x20],
  [0x40, 0x80],
];
/** Braille glyphs by number of raised dots, for the coarse fallback. */
const BRAILLE_BY_COUNT = [
  "⠀",
  "⠁⠂⠄⠈⠐⠠⡀⢀",
  "⠃⠅⠆⠉⠊⠌⠑⠒⠔⠘⠡⠢⠤⠨⠰⡁⡂⡄⡈⡐⡠⢁⢂⢄⢈⢐⢠⣀",
  "⠇⠋⠍⠎⠓⠕⠖⠙⠚⠜⠣⠥⠦⠩⠪⠬⠱⠲⠴⠸⡃⡅⡆⡉⡊⡌⡑⡒⡔⡘⡡⡢⡤⡨⡰⢃⢅⢆⢉⢊⢌⢑⢒⢔⢘⢡⢢⢤⢨⢰⣁⣂⣄⣈⣐⣠",
  "⠏⠗⠛⠝⠞⠧⠫⠭⠮⠳⠵⠶⠹⠺⠼⡇⡋⡍⡎⡓⡕⡖⡙⡚⡜⡣⡥⡦⡩⡪⡬⡱⡲⡴⡸⢇⢋⢍⢎⢓⢕⢖⢙⢚⢜⢣⢥⢦⢩⢪⢬⢱⢲⢴⢸⣃⣅⣆⣉⣊⣌⣑⣒⣔⣘⣡⣢⣤⣨⣰",
  "⠟⠯⠷⠻⠽⠾⡏⡗⡛⡝⡞⡧⡫⡭⡮⡳⡵⡶⡹⡺⡼⢏⢗⢛⢝⢞⢧⢫⢭⢮⢳⢵⢶⢹⢺⢼⣇⣋⣍⣎⣓⣕⣖⣙⣚⣜⣣⣥⣦⣩⣪⣬⣱⣲⣴⣸",
  "⠿⡟⡯⡷⡻⡽⡾⢟⢯⢷⢻⢽⢾⣏⣗⣛⣝⣞⣧⣫⣭⣮⣳⣵⣶⣹⣺⣼",
  "⡿⢿⣟⣯⣷⣻⣽⣾",
  "⣿",
];

interface Cell {
  i: number;
  j: number;
  ch: string;
  col: string;
  /** Until when the pointer's scramble lasts. */
  scr: number;
  /** Twinkle phase. */
  ph: number;
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const luma = (r: number, g: number, b: number) => 0.299 * r + 0.587 * g + 0.114 * b;

/** Auto exposure: a gain that lifts the 98th-percentile channel towards 0.88. */
function exposure(data: Uint8ClampedArray, brightness: number): number {
  const l: number[] = [];
  for (let k = 0; k < data.length; k += 4) {
    if (data[k + 3] < 128) continue;
    l.push(Math.max(data[k], data[k + 1], data[k + 2]) / 255);
  }
  l.sort((a, b) => a - b);
  const hi = Math.max(0.12, l.length ? l[Math.floor(l.length * 0.98)] : 1);
  return Math.max(1, Math.min(Math.min(3.2, 1 / hi), 0.88 / hi)) * (brightness / 100);
}

function sample(img: HTMLImageElement, w: number, h: number): Uint8ClampedArray | null {
  const o = document.createElement("canvas");
  o.width = w;
  o.height = h;
  const g = o.getContext("2d");
  if (!g) return null;
  g.imageSmoothingEnabled = true;
  g.imageSmoothingQuality = "high";
  g.drawImage(img, 0, 0, w, h);
  try {
    return g.getImageData(0, 0, w, h).data;
  } catch {
    return null;
  }
}

/**
 * Braille dots: unsharp-masked luminance, then serpentine Floyd–Steinberg
 * over the opaque sub-pixels. Returns one byte per sub-pixel, 1 = raised.
 */
function brailleDots(hd: Uint8ClampedArray, w2: number, h2: number, gain: number, contrast: number): Uint8Array {
  const N = w2 * h2;
  const lum = new Float32Array(N);
  const op = new Uint8Array(N);
  for (let p = 0; p < N; p++) {
    const k = p * 4;
    if (hd[k + 3] < 128) continue;
    op[p] = 1;
    const L = (luma(hd[k], hd[k + 1], hd[k + 2]) * gain) / 255;
    lum[p] = clamp(0.5 + (L - 0.5) * contrast, 0, 1);
  }
  // Local mean over a 9×9 box, opaque-weighted, as two prefix-sum passes.
  const R = 4;
  const hS = new Float32Array(N);
  const hN = new Float32Array(N);
  for (let y = 0; y < h2; y++) {
    let acc = 0;
    let cnt = 0;
    for (let x = -R; x < w2; x++) {
      const add = x + R;
      if (add < w2) {
        const p = y * w2 + add;
        if (op[p]) {
          acc += lum[p];
          cnt++;
        }
      }
      const sub = x - R - 1;
      if (sub >= 0) {
        const p = y * w2 + sub;
        if (op[p]) {
          acc -= lum[p];
          cnt--;
        }
      }
      if (x >= 0) {
        hS[y * w2 + x] = acc;
        hN[y * w2 + x] = cnt;
      }
    }
  }
  const mean = new Float32Array(N);
  for (let x = 0; x < w2; x++) {
    let acc = 0;
    let cnt = 0;
    for (let y = -R; y < h2; y++) {
      const add = y + R;
      if (add < h2) {
        acc += hS[add * w2 + x];
        cnt += hN[add * w2 + x];
      }
      const sub = y - R - 1;
      if (sub >= 0) {
        acc -= hS[sub * w2 + x];
        cnt -= hN[sub * w2 + x];
      }
      if (y >= 0) mean[y * w2 + x] = cnt > 0 ? acc / cnt : 0.5;
    }
  }
  const err = new Float32Array(N);
  const dots = new Uint8Array(N);
  const UNSHARP = 0.9;
  for (let y = 0; y < h2; y++) {
    const ltr = (y & 1) === 0;
    for (let xi = 0; xi < w2; xi++) {
      const x = ltr ? xi : w2 - 1 - xi;
      const p = y * w2 + x;
      if (!op[p]) continue;
      const v = lum[p] + UNSHARP * (lum[p] - mean[p]) + err[p];
      const on = v > 0.5;
      dots[p] = on ? 1 : 0;
      const e = v - (on ? 1 : 0);
      const dx = ltr ? 1 : -1;
      const p1 = p + dx;
      if (x + dx >= 0 && x + dx < w2 && op[p1]) err[p1] += (e * 7) / 16;
      if (y + 1 < h2) {
        const p2 = p + w2 - dx;
        if (x - dx >= 0 && x - dx < w2 && op[p2]) err[p2] += (e * 3) / 16;
        const p3 = p + w2;
        if (op[p3]) err[p3] += (e * 5) / 16;
        const p4 = p + w2 + dx;
        if (x + dx >= 0 && x + dx < w2 && op[p4]) err[p4] += (e * 1) / 16;
      }
    }
  }
  return dots;
}

export function GlyphRain({
  src,
  width,
  height,
  mode = "ascii",
  cell = 9,
  saturation = 100,
  brightness = 100,
  contrast = 100,
  twinkle = 60,
  speed = 100,
  loop = 0,
  label = "portrait",
  caption,
}: GlyphRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const g = canvas.getContext("2d");
    if (!g) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const CW = cell;
    const CH = Math.round(cell * 1.9);
    const FS = Math.round(cell * 1.45);
    const style = getComputedStyle(canvas);
    const font = `${FS}px ${style.fontFamily || "ui-monospace, Menlo, Consolas, monospace"}`;
    // The rain's head takes the theme's accent; canvas accepts the CSS colour
    // as computed, oklch included, in every browser that runs this site.
    const accent = style.getPropertyValue("--accent").trim() || "#9adbb2";

    let alive = true;
    let raf = 0;
    let cells: Cell[] = [];
    let cols = 0;
    let rows = 0;
    let ox = 0;
    let oy = 0;
    let prog: number[] = [];
    let spd: number[] = [];
    let t = 0;
    let lastRain = 0;
    let mx = -1e4;
    let my = -1e4;
    let ramp = ASCII;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);

    const rain = () => {
      prog = [];
      spd = [];
      for (let i = 0; i < cols; i++) {
        prog[i] = reduced ? rows + 5 : -Math.random() * rows * 1.4;
        spd[i] = 0.45 + Math.random() * 0.5;
      }
      lastRain = t;
    };

    const build = (img: HTMLImageElement) => {
      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;
      if (!iw || !ih) return;
      const scale = Math.min(width / iw, height / ih);
      cols = Math.max(4, Math.round((iw * scale) / CW));
      rows = Math.max(4, Math.round((ih * scale) / CH));
      const d = sample(img, cols, rows);
      if (!d) return;

      const gain = exposure(d, brightness);
      const sat = saturation / 100;
      const con = contrast / 100;

      // Braille resolves 2×4 dots per cell from a finer sample.
      let hd: Uint8ClampedArray | null = null;
      let dots: Uint8Array | null = null;
      const w2 = cols * 2;
      const h2 = rows * 4;
      if (mode === "braille") {
        hd = sample(img, w2, h2);
        if (hd) dots = brailleDots(hd, w2, h2, exposure(hd, brightness), con);
      }

      ox = (width - cols * CW) / 2;
      oy = (height - rows * CH) / 2;
      cells = [];
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const k = (j * cols + i) * 4;
          if (d[k + 3] < 128) continue;
          let r = d[k] * gain;
          let gg = d[k + 1] * gain;
          let b = d[k + 2] * gain;
          let lum = luma(r, gg, b);
          r = lum + (r - lum) * sat;
          gg = lum + (gg - lum) * sat;
          b = lum + (b - lum) * sat;
          r = clamp(128 + (r - 128) * con, 0, 255);
          gg = clamp(128 + (gg - 128) * con, 0, 255);
          b = clamp(128 + (b - 128) * con, 0, 255);
          lum = clamp(luma(r, gg, b) / 255, 0, 1);

          let ch: string;
          if (mode === "braille" && hd && dots) {
            let bits = 0;
            let anyOp = false;
            let bestP = -1;
            let bestL = -1;
            for (let sy = 0; sy < 4; sy++) {
              for (let sx = 0; sx < 2; sx++) {
                const p = (j * 4 + sy) * w2 + (i * 2 + sx);
                const hk = p * 4;
                if (hd[hk + 3] < 128) continue;
                anyOp = true;
                const sl = luma(hd[hk], hd[hk + 1], hd[hk + 2]);
                if (sl > bestL) {
                  bestL = sl;
                  bestP = sy * 2 + sx;
                }
                if (dots[p]) bits |= BRAILLE_BITS[sy][sx];
              }
            }
            if (!anyOp) continue;
            // A silhouette floor: an opaque cell never goes fully blank.
            if (bits === 0 && lum > 0.04 && bestP >= 0) bits |= BRAILLE_BITS[bestP >> 1][bestP & 1];
            ch = String.fromCharCode(0x2800 + bits);
          } else if (mode === "braille") {
            const set = BRAILLE_BY_COUNT[Math.min(8, Math.floor(lum * 9))];
            ch = set[(Math.random() * set.length) | 0];
          } else {
            ch = ASCII[Math.min(ASCII.length - 1, 1 + Math.floor(lum * (ASCII.length - 1)))];
          }
          cells.push({ i, j, ch, col: `rgb(${r | 0},${gg | 0},${b | 0})`, scr: 0, ph: Math.random() * 9 });
        }
      }
      ramp = mode === "braille" ? BRAILLE_BY_COUNT[4] : ASCII;
      rain();
    };

    const tick = () => {
      if (!alive) return;
      t += 1 / 60;
      if (loop > 0 && !reduced && t - lastRain > loop) rain();
      g.clearRect(0, 0, width, height);
      g.font = font;
      g.textBaseline = "top";
      const twA = reduced ? 0 : (twinkle / 100) * 0.25;
      for (const c of cells) {
        const p = prog[c.i];
        const px = ox + c.i * CW;
        const py = oy + c.j * CH;
        if (c.j > p) continue;
        const dHead = p - c.j;
        if (!reduced && (mx - px) * (mx - px) + (my - py) * (my - py) < 3600) c.scr = t + 0.25;
        if (dHead < 4) {
          g.globalAlpha = dHead < 1.2 ? 1 : 0.7;
          g.fillStyle = accent;
          g.fillText(ramp[(Math.random() * ramp.length) | 0], px, py);
          g.globalAlpha = 1;
        } else if (c.scr > t) {
          g.fillStyle = c.col;
          g.fillText(ramp[(Math.random() * ramp.length) | 0], px, py);
        } else {
          g.globalAlpha = 1 - twA + twA * Math.sin(t * 1.7 + c.ph);
          g.fillStyle = c.col;
          g.fillText(Math.random() < 0.002 && !reduced ? ramp[(Math.random() * ramp.length) | 0] : c.ch, px, py);
          g.globalAlpha = 1;
        }
      }
      const fall = speed / 100;
      for (let i = 0; i < cols; i++) prog[i] += spd[i] * fall;
      // Once everything has settled and nothing moves, a still frame is enough.
      const settled = prog.length > 0 && prog.every((p) => p > rows + 4);
      if (reduced && settled) return;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    const onLeave = () => {
      mx = -1e4;
      my = -1e4;
    };
    const onClick = () => {
      if (!reduced) rain();
    };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    canvas.addEventListener("click", onClick);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (!alive) return;
      build(img);
      raf = requestAnimationFrame(tick);
    };
    img.src = src;

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("click", onClick);
    };
  }, [src, width, height, mode, cell, saturation, brightness, contrast, twinkle, speed, loop]);

  return (
    <div className="inline-block">
      <canvas
        ref={canvasRef}
        className="block cursor-pointer"
        role="img"
        aria-label={label}
        title={caption}
      />
      {caption && (
        <div className="pt-[7px] text-[10px] uppercase leading-[1.5] tracking-[.09em] opacity-[.42]">
          {caption}
        </div>
      )}
    </div>
  );
}
