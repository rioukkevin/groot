"use client";

import { useEffect, useRef } from "react";

interface EdgePhotoProps {
  src: string;
  /** Box the image is fitted into; whole cells, so it sits on the text grid. */
  width: number;
  height: number;
  cellW: number;
  cellH: number;
  gap: number;
  caption?: string;
  label?: string;
}

/**
 * The photo as itself, fitted inside its box.
 *
 * Contain, not cover: a portrait screenshot stands centred between two empty
 * margins, a landscape one sits centred between top and bottom, and nothing
 * is cropped away — a screenshot's edges are where its information is. The
 * earlier fray of cells around the frame is gone; the picture is the subject
 * and needs no border. The canvas keeps its aspect and shrinks with the pane,
 * so a wide carousel still fits a phone.
 */
export function EdgePhoto({
  src,
  width,
  height,
  cellW,
  cellH,
  caption,
  label = "image",
}: EdgePhotoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cols = Math.max(6, Math.round(width / cellW));
  const rows = Math.max(4, Math.round(height / cellH));
  const boxW = cols * cellW;
  const boxH = rows * cellH;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(boxW * dpr);
    canvas.height = Math.round(boxH * dpr);
    canvas.style.width = `min(100%, ${boxW}px)`;
    canvas.style.height = "auto";
    canvas.style.aspectRatio = `${boxW} / ${boxH}`;

    const g = canvas.getContext("2d");
    if (!g) return;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);

    let alive = true;

    const draw = (img: HTMLImageElement | null) => {
      if (!alive) return;
      g.clearRect(0, 0, boxW, boxH);
      if (!img) {
        g.fillStyle = "rgba(128,128,128,0.25)";
        g.fillRect(0, 0, boxW, boxH);
        return;
      }
      // Contain-fit: the smaller ratio wins, and the slack is split evenly.
      const s = Math.min(boxW / img.width, boxH / img.height);
      const dw = Math.round(img.width * s);
      const dh = Math.round(img.height * s);
      g.imageSmoothingEnabled = true;
      g.imageSmoothingQuality = "high";
      g.drawImage(img, Math.round((boxW - dw) / 2), Math.round((boxH - dh) / 2), dw, dh);
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
  }, [src, boxW, boxH]);

  return (
    <div className="inline-block max-w-full">
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
