"use client";

import { useEffect, useRef } from "react";

/**
 * Pixelates the live buddy.
 *
 * A CSS mask punches holes in the SVG, which reads as a grille laid *over* a
 * smooth drawing — the curves stay curves, just interrupted. Pixelating means
 * resolving the image down to a coarse grid and quantising it, so the eyes and
 * the body are genuinely made of cells: an edge steps rather than bending
 * behind a slot.
 *
 * Done on a 2D canvas rather than in WebGL. The first attempt was a fragment
 * shader and it drew nothing at 56 px — and at 14x14 cells there is nothing a
 * shader buys: the downsample is one drawImage, the upscale is nearest
 * neighbour, and the posterise is a pass over 196 pixels. WebGL added context
 * loss, driver differences and a silent-blank failure mode in exchange for
 * arithmetic the CPU finishes in microseconds.
 *
 * The SVG animates, so it is re-sampled: on any DOM mutation (the gaze driver
 * writes custom properties, so a pointer move is observable) and on a slow
 * heartbeat for the CSS-only blink and bob. It stops entirely when the buddy
 * is off-screen or the tab is hidden.
 */

interface BuddyShaderProps {
  /** The element holding the live SVG to sample. */
  source: React.RefObject<HTMLElement | null>;
  size: number;
  /** Cells across the buddy. Lower is chunkier. */
  cells?: number;
  /** Fraction of a cell left as gutter, so the cells read as separate. */
  gap?: number;
  /** Colour steps per channel. Fewer is flatter and more deliberate. */
  levels?: number;
}

/** Blink and bob mutate nothing, so they need a poll. Twice a second is plenty. */
const HEARTBEAT = 500;

export function BuddyShader({
  source,
  size,
  cells = 16,
  gap = 0.14,
  levels = 6,
}: BuddyShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = source.current;
    if (!canvas || !host) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const px = Math.round(size * dpr);
    canvas.width = px;
    canvas.height = px;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // The downsample target: one pixel per cell. The browser's own filtering
    // averages for us, which is both better and cheaper than doing it by hand.
    const small = document.createElement("canvas");
    small.width = cells;
    small.height = cells;
    const sg = small.getContext("2d", { willReadFrequently: true });
    if (!sg) return;

    let raf = 0;
    let alive = true;
    let dirty = true;
    let visible = true;
    let pending = false;
    let img: HTMLImageElement | null = null;
    let url = "";
    let last = 0;

    const snapshot = () => {
      const svg = host.querySelector("svg");
      if (!svg || pending) return;
      dirty = false;
      pending = true;

      const clone = svg.cloneNode(true) as SVGSVGElement;
      // Rasterise a few times the cell grid, so the downsample has real detail
      // to average rather than aliasing straight to the grid.
      clone.setAttribute("width", String(cells * 4));
      clone.setAttribute("height", String(cells * 4));
      clone.style.opacity = "1";
      const markup = new XMLSerializer().serializeToString(clone);
      const next = URL.createObjectURL(
        new Blob([markup], { type: "image/svg+xml;charset=utf-8" }),
      );

      const im = new Image();
      im.onload = () => {
        pending = false;
        if (!alive) {
          URL.revokeObjectURL(next);
          return;
        }
        if (url) URL.revokeObjectURL(url);
        url = next;
        img = im;
      };
      im.onerror = () => {
        pending = false;
        URL.revokeObjectURL(next);
      };
      im.src = next;
    };

    const paint = () => {
      if (!img) return;

      sg.clearRect(0, 0, cells, cells);
      sg.imageSmoothingEnabled = true;
      sg.imageSmoothingQuality = "high";
      sg.drawImage(img, 0, 0, cells, cells);

      let data: ImageData;
      try {
        data = sg.getImageData(0, 0, cells, cells);
      } catch {
        return;
      }

      const cell = px / cells;
      const gutter = cell * gap;
      const step = 255 / levels;

      ctx.clearRect(0, 0, px, px);
      for (let y = 0; y < cells; y++) {
        for (let x = 0; x < cells; x++) {
          const i = (y * cells + x) * 4;
          const a = data.data[i + 3];
          if (a < 24) continue; // outside the blob: leave it empty

          // Posterise, so a gradient becomes steps rather than a smooth ramp.
          const r = Math.round(Math.round(data.data[i] / step) * step);
          const g = Math.round(Math.round(data.data[i + 1] / step) * step);
          const b = Math.round(Math.round(data.data[i + 2] / step) * step);

          ctx.globalAlpha = a / 255;
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.fillRect(
            Math.round(x * cell + gutter / 2),
            Math.round(y * cell + gutter / 2),
            Math.ceil(cell - gutter),
            Math.ceil(cell - gutter),
          );
        }
      }
      ctx.globalAlpha = 1;
    };

    // The gaze driver writes custom properties onto the SVG, so a pointer move
    // is a DOM mutation and can be observed rather than polled for.
    const mo = new MutationObserver(() => {
      dirty = true;
    });
    mo.observe(host, {
      attributes: true,
      subtree: true,
      attributeFilter: ["style", "class", "d", "transform"],
    });

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      visible = !document.hidden;
      dirty = true;
    };
    document.addEventListener("visibilitychange", onVisibility);

    const tick = (now: number) => {
      raf = 0;
      if (!alive) return;
      if (visible) {
        if (dirty || now - last > HEARTBEAT) {
          last = now;
          snapshot();
        }
        paint();
      }
      raf = requestAnimationFrame(tick);
    };

    snapshot();
    raf = requestAnimationFrame(tick);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      mo.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      if (url) URL.revokeObjectURL(url);
    };
  }, [source, size, cells, gap, levels]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
    />
  );
}
