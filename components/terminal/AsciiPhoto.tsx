"use client";

import { useEffect, useRef } from "react";

/** Luminance ramp, darkest to brightest. */
const RAMP = " .:-~=+*co#%@";

interface AsciiPhotoProps {
  src?: string;
  width: number;
  height: number;
  cols: number;
  label?: string;
  caption?: string;
}

/**
 * A photo rendered as a field of ASCII characters that dissolves on hover to
 * reveal the image underneath. Ported from the design's <ascii-photo>.
 */
export function AsciiPhoto({
  src,
  width,
  height,
  cols,
  label = "image",
  caption,
}: AsciiPhotoProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // Offscreen copy of the source image, sampled per cell.
    const off = document.createElement("canvas");
    off.width = width;
    off.height = height;
    const g = off.getContext("2d");
    if (!g) return;

    let alive = true;
    let raf = 0;
    let t = 0;
    let target = 0;
    let chars: string[] = [];
    let lum: number[] = [];
    let rnd: number[] = [];
    let cw = 0;
    let ch = 0;
    let rows = 0;

    const placeholder = () => {
      g.fillStyle = "#000";
      g.fillRect(0, 0, width, height);
      const rad = g.createRadialGradient(
        width * 0.45,
        height * 0.38,
        4,
        width * 0.5,
        height * 0.5,
        height * 0.95,
      );
      rad.addColorStop(0, "rgba(255,255,255,0.92)");
      rad.addColorStop(0.45, "rgba(255,255,255,0.42)");
      rad.addColorStop(1, "rgba(255,255,255,0.05)");
      g.fillStyle = rad;
      g.fillRect(0, 0, width, height);
      g.save();
      g.globalAlpha = 0.22;
      g.strokeStyle = "#fff";
      g.lineWidth = 3;
      for (let x = -height; x < width + height; x += 11) {
        g.beginPath();
        g.moveTo(x, 0);
        g.lineTo(x + height, height);
        g.stroke();
      }
      g.restore();
      g.fillStyle = "rgba(0,0,0,0.55)";
      g.fillRect(0, height - 26, width, 26);
      g.fillStyle = "#fff";
      g.font = "11px ui-monospace,Menlo,monospace";
      g.fillText(label.toLowerCase(), 8, height - 9);
    };

    const sample = () => {
      cw = width / cols;
      ch = cw * 1.92;
      rows = Math.max(1, Math.floor(height / ch));
      const d = g.getImageData(0, 0, width, height).data;
      chars = [];
      lum = [];
      rnd = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let sum = 0;
          let n = 0;
          const x0 = Math.floor(c * cw);
          const x1 = Math.min(width, Math.ceil((c + 1) * cw));
          const y0 = Math.floor(r * ch);
          const y1 = Math.min(height, Math.ceil((r + 1) * ch));
          for (let y = y0; y < y1; y += 2) {
            for (let x = x0; x < x1; x += 2) {
              const i = (y * width + x) * 4;
              sum += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
              n++;
            }
          }
          const l = n ? sum / n / 255 : 0;
          lum.push(l);
          chars.push(RAMP[Math.min(RAMP.length - 1, Math.floor(l * RAMP.length))]);
          rnd.push(Math.random() * 0.82 + l * 0.18);
        }
      }
    };

    const draw = () => {
      if (!chars.length) return;
      ctx.clearRect(0, 0, width, height);
      if (t > 0.001) {
        ctx.globalAlpha = Math.pow(t, 1.3);
        ctx.drawImage(off, 0, 0, width, height);
        ctx.globalAlpha = 1;
      }
      // Read the colour live so a theme switch is picked up on the next frame.
      ctx.fillStyle = getComputedStyle(host).color;
      ctx.font = `${Math.round(ch * 0.86)}px ui-monospace,SFMono-Regular,Menlo,monospace`;
      ctx.textBaseline = "top";
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          if (rnd[i] < t) continue;
          const glyph = chars[i];
          if (glyph === " ") continue;
          ctx.globalAlpha = (0.28 + lum[i] * 0.72) * (1 - t * 0.55);
          ctx.fillText(glyph, c * cw, r * ch);
        }
      }
      ctx.globalAlpha = 1;
    };

    const tick = () => {
      raf = 0;
      if (!alive) return;
      const d = target - t;
      t += d * 0.14;
      if (Math.abs(d) < 0.004) t = target;
      draw();
      if (t !== target) raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (raf || !alive) return;
      raf = requestAnimationFrame(tick);
    };

    const enter = () => {
      target = 1;
      wake();
    };
    const leave = () => {
      target = 0;
      wake();
    };
    const tap = () => {
      target = target ? 0 : 1;
      wake();
    };

    canvas.addEventListener("mouseenter", enter);
    canvas.addEventListener("mouseleave", leave);
    canvas.addEventListener("touchstart", tap, { passive: true });

    const ready = () => {
      if (!alive) return;
      sample();
      draw();
    };

    if (src) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        if (!alive) return;
        const s = Math.max(width / img.width, height / img.height);
        const dw = img.width * s;
        const dh = img.height * s;
        g.drawImage(img, (width - dw) / 2, (height - dh) / 2, dw, dh);
        ready();
      };
      img.onerror = () => {
        if (!alive) return;
        placeholder();
        ready();
      };
      img.src = src;
    } else {
      placeholder();
      ready();
    }

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mouseenter", enter);
      canvas.removeEventListener("mouseleave", leave);
      canvas.removeEventListener("touchstart", tap);
    };
  }, [src, width, height, cols, label]);

  return (
    <div ref={hostRef} className="inline-block">
      <canvas ref={canvasRef} className="block cursor-crosshair rounded-[2px]" />
      {caption && (
        <div className="pt-[7px] text-[10px] uppercase leading-[1.5] tracking-[.09em] opacity-[.42]">
          {caption}
        </div>
      )}
    </div>
  );
}
