"use client";

import { useEffect, useRef, useState } from "react";

const VS = `attribute vec2 aPos;varying vec2 vUv;void main(){vUv=vec2(aPos.x*0.5+0.5,0.5-aPos.y*0.5);gl_Position=vec4(aPos,0.0,1.0);}`;

const FS = `precision highp float;
varying vec2 vUv;
uniform sampler2D uLow;
uniform sampler2D uTex;
uniform vec2 uGrid;
uniform vec2 uGapFrac;
uniform vec2 uCellPx;
uniform float uReveal;
uniform float uHi;

float bayer2(vec2 a){a=floor(a);return fract(a.x/2.0+a.y*a.y*0.75);}
float bayer4(vec2 a){return bayer2(0.5*a)*0.25+bayer2(a);}
float bayer8(vec2 a){return bayer4(0.5*a)*0.25+bayer2(a);}
float hash(vec2 p){return fract(sin(dot(p,vec2(41.3,289.1)))*43758.5453);}

void main(){
  vec2 cellId = floor(vUv*uGrid);
  vec3 raw = texture2D(uLow, (cellId+0.5)/uGrid).rgb;

  // single scalar gain, capped so no channel clips — hue and saturation stay as shot
  float gain = clamp(0.88/max(uHi,0.12), 1.0, min(3.2, 1.0/max(uHi,0.001)));
  vec3 c = clamp(raw*gain, 0.0, 1.0);

  float d = clamp(bayer8(cellId)/1.3125, 0.0, 1.0) - 0.5;
  float levels = 11.0;
  vec3 q = clamp(floor(c*levels + d*0.85 + 0.5)/levels, 0.0, 1.0);

  vec2 f = fract(vUv*uGrid);
  vec2 h = uGapFrac*0.5;
  vec2 aa = max(vec2(0.0005), 0.7/uCellPx);
  float box = smoothstep(h.x-aa.x, h.x+aa.x, f.x) * smoothstep(h.x-aa.x, h.x+aa.x, 1.0-f.x)
            * smoothstep(h.y-aa.y, h.y+aa.y, f.y) * smoothstep(h.y-aa.y, h.y+aa.y, 1.0-f.y);

  vec3 photo = texture2D(uTex, vUv).rgb;
  float th = hash(cellId)*0.85 + 0.08;
  float m = smoothstep(th-0.22, th+0.22, uReveal);

  vec3 col = mix(q, photo, m);
  float a = mix(box, 1.0, m);
  gl_FragColor = vec4(col*a, a);
}`;

interface ShaderPhotoProps {
  src?: string;
  width: number;
  height: number;
  cellW: number;
  cellH: number;
  gap: number;
  label?: string;
  caption?: string;
}

/**
 * An image resolved onto a terminal cell grid: every cell is one cursor-sized
 * block, colour taken from the source and quantized with an ordered dither.
 * Hover dissolves the grid to show the photograph. Ported from <shader-photo>.
 */
export function ShaderPhoto({
  src,
  width,
  height,
  cellW,
  cellH,
  gap,
  label = "image",
  caption,
}: ShaderPhotoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const clampedGap = Math.max(0, Math.min(6, gap));
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    let alive = true;
    let raf = 0;
    let reveal = 0;
    let target = 0;
    let mode: "gl" | "2d" = "2d";
    let gl: WebGLRenderingContext | null = null;
    let uReveal: WebGLUniformLocation | null = null;
    let fit: HTMLCanvasElement | null = null;
    let low: HTMLCanvasElement | null = null;
    let hi = 1;

    // Live dimensions, snapped to whole cells by reshape().
    let w = width;
    let h = height;
    let cols = Math.max(6, Math.round(w / cellW));
    let rows = Math.max(4, Math.round(h / cellH));

    const resizeCanvas = () => {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };
    resizeCanvas();

    /** Snap the card to the image's aspect in whole cells. */
    const reshape = (img: HTMLImageElement | HTMLCanvasElement) => {
      const iw = "naturalWidth" in img ? img.naturalWidth || img.width : img.width;
      const ih = "naturalHeight" in img ? img.naturalHeight || img.height : img.height;
      if (!iw || !ih) return;
      const s = Math.min(width / iw, height / ih);
      cols = Math.max(6, Math.round((iw * s) / cellW));
      rows = Math.max(4, Math.round((ih * s) / cellH));
      w = cols * cellW;
      h = rows * cellH;
      resizeCanvas();
    };

    const fitCanvas = (img: HTMLImageElement | HTMLCanvasElement) => {
      const W = w * 2;
      const H = h * 2;
      const cv = document.createElement("canvas");
      cv.width = W;
      cv.height = H;
      const g = cv.getContext("2d");
      if (!g) return cv;
      const iw = "naturalWidth" in img ? img.naturalWidth || img.width : img.width;
      const ih = "naturalHeight" in img ? img.naturalHeight || img.height : img.height;
      const s = Math.max(W / iw, H / ih);
      const dw = iw * s;
      const dh = ih * s;
      g.imageSmoothingEnabled = true;
      g.imageSmoothingQuality = "high";
      g.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
      return cv;
    };

    /**
     * 98th percentile of the per-pixel max channel: bright sources report ~0.9
     * and are left alone, only genuinely dark ones get lifted.
     */
    const measure = (g: CanvasRenderingContext2D) => {
      try {
        const d = g.getImageData(0, 0, cols, rows).data;
        const l: number[] = [];
        for (let i = 0; i < d.length; i += 4)
          l.push(Math.max(d[i], d[i + 1], d[i + 2]) / 255);
        if (!l.length) return 1;
        l.sort((a, b) => a - b);
        return Math.max(0.12, l[Math.floor(l.length * 0.98)]);
      } catch {
        return 1;
      }
    };

    const lowCanvas = (source: HTMLCanvasElement) => {
      const cv = document.createElement("canvas");
      cv.width = cols;
      cv.height = rows;
      const g = cv.getContext("2d");
      if (!g) return cv;
      g.imageSmoothingEnabled = true;
      g.imageSmoothingQuality = "high";
      g.drawImage(source, 0, 0, cols, rows);
      hi = measure(g);
      return cv;
    };

    const placeholder = () => {
      const pw = 512;
      const ph = Math.round((512 * height) / width);
      const cv = document.createElement("canvas");
      cv.width = pw;
      cv.height = ph;
      const g = cv.getContext("2d");
      if (!g) return cv;
      const name = label.toLowerCase();
      let seed = 0;
      for (let i = 0; i < name.length; i++) seed += name.charCodeAt(i);
      const rnd = (n: number) => {
        seed = (seed * 1103515245 + 12345) % 2147483648;
        return (seed / 2147483648) * n;
      };
      const lin = g.createLinearGradient(0, 0, pw * 0.8, ph);
      lin.addColorStop(0, "#c9c9c9");
      lin.addColorStop(0.55, "#5a5a5a");
      lin.addColorStop(1, "#171717");
      g.fillStyle = lin;
      g.fillRect(0, 0, pw, ph);
      for (let i = 0; i < 5; i++) {
        const cx = rnd(pw);
        const cy = rnd(ph);
        const r = 60 + rnd(190);
        const rad = g.createRadialGradient(cx, cy, 2, cx, cy, r);
        rad.addColorStop(0, "rgba(255,255,255,0.5)");
        rad.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = rad;
        g.fillRect(0, 0, pw, ph);
      }
      g.fillStyle = "rgba(0,0,0,0.55)";
      g.fillRect(0, ph - 44, pw, 44);
      g.fillStyle = "#fff";
      g.font = "20px ui-monospace,Menlo,monospace";
      g.fillText(name + " — drop a photo here", 14, ph - 16);
      return cv;
    };

    const startGL = () => {
      const context = canvas.getContext("webgl", {
        antialias: false,
        alpha: true,
        premultipliedAlpha: true,
      });
      if (!context || !low || !fit) return false;

      const sh = (type: number, source: string) => {
        const o = context.createShader(type);
        if (!o) throw new Error("shader");
        context.shaderSource(o, source);
        context.compileShader(o);
        if (!context.getShaderParameter(o, context.COMPILE_STATUS))
          throw new Error(context.getShaderInfoLog(o) || "compile");
        return o;
      };

      const p = context.createProgram();
      if (!p) return false;
      context.attachShader(p, sh(context.VERTEX_SHADER, VS));
      context.attachShader(p, sh(context.FRAGMENT_SHADER, FS));
      context.linkProgram(p);
      if (!context.getProgramParameter(p, context.LINK_STATUS))
        throw new Error("link");
      context.useProgram(p);

      const buf = context.createBuffer();
      context.bindBuffer(context.ARRAY_BUFFER, buf);
      context.bufferData(
        context.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        context.STATIC_DRAW,
      );
      const a = context.getAttribLocation(p, "aPos");
      context.enableVertexAttribArray(a);
      context.vertexAttribPointer(a, 2, context.FLOAT, false, 0, 0);

      const mk = (unit: number, source: TexImageSource, nearest: boolean) => {
        const t = context.createTexture();
        context.activeTexture(context.TEXTURE0 + unit);
        context.bindTexture(context.TEXTURE_2D, t);
        context.texParameteri(
          context.TEXTURE_2D,
          context.TEXTURE_WRAP_S,
          context.CLAMP_TO_EDGE,
        );
        context.texParameteri(
          context.TEXTURE_2D,
          context.TEXTURE_WRAP_T,
          context.CLAMP_TO_EDGE,
        );
        const f = nearest ? context.NEAREST : context.LINEAR;
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, f);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, f);
        context.texImage2D(
          context.TEXTURE_2D,
          0,
          context.RGB,
          context.RGB,
          context.UNSIGNED_BYTE,
          source,
        );
      };
      mk(0, low, true);
      mk(1, fit, false);
      if (context.getError()) throw new Error("tex");

      context.uniform1i(context.getUniformLocation(p, "uLow"), 0);
      context.uniform1i(context.getUniformLocation(p, "uTex"), 1);
      uReveal = context.getUniformLocation(p, "uReveal");
      context.viewport(0, 0, canvas.width, canvas.height);
      context.uniform2f(context.getUniformLocation(p, "uGrid"), cols, rows);
      context.uniform2f(
        context.getUniformLocation(p, "uGapFrac"),
        clampedGap / cellW,
        clampedGap / cellH,
      );
      context.uniform2f(
        context.getUniformLocation(p, "uCellPx"),
        cellW * dpr,
        cellH * dpr,
      );
      context.uniform1f(context.getUniformLocation(p, "uHi"), hi || 1);
      context.clearColor(0, 0, 0, 0);
      context.enable(context.BLEND);
      context.blendFunc(context.ONE, context.ONE_MINUS_SRC_ALPHA);
      gl = context;
      mode = "gl";
      return true;
    };

    /** No-CORS fallback: same grid of blocks, drawn one rect at a time. */
    const draw2D = () => {
      const g = canvas.getContext("2d");
      if (!g || !low) return;
      const W = canvas.width;
      const H = canvas.height;
      const gain = Math.max(1, Math.min(Math.min(3.2, 1 / (hi || 1)), 0.88 / (hi || 1)));
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.clearRect(0, 0, W, H);
      g.filter = gain > 1.02 ? `brightness(${gain.toFixed(2)})` : "none";
      const cw = W / cols;
      const chh = H / rows;
      const gx = clampedGap * dpr;
      const gy = clampedGap * dpr;
      const src2d = low.getContext("2d");
      let data: Uint8ClampedArray | null = null;
      try {
        data = src2d ? src2d.getImageData(0, 0, cols, rows).data : null;
      } catch {
        data = null;
      }
      if (data) {
        for (let j = 0; j < rows; j++) {
          for (let i = 0; i < cols; i++) {
            const k = (j * cols + i) * 4;
            g.fillStyle = `rgb(${data[k]},${data[k + 1]},${data[k + 2]})`;
            g.fillRect(
              Math.round(i * cw + gx / 2),
              Math.round(j * chh + gy / 2),
              Math.ceil(cw - gx),
              Math.ceil(chh - gy),
            );
          }
        }
      }
      g.filter = "none";
      if (reveal > 0.002 && fit) {
        g.globalAlpha = Math.pow(reveal, 1.2);
        g.imageSmoothingEnabled = true;
        g.drawImage(fit, 0, 0, W, H);
        g.globalAlpha = 1;
      }
    };

    const tick = () => {
      raf = 0;
      if (!alive) return;
      const d = target - reveal;
      reveal += d * 0.13;
      if (Math.abs(d) < 0.002) reveal = target;
      if (mode === "gl" && gl) {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(uReveal, reveal);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      } else {
        draw2D();
      }
      if (reveal !== target) raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (raf || !alive) return;
      raf = requestAnimationFrame(tick);
    };

    const begin = (img: HTMLImageElement | HTMLCanvasElement, sameOrigin: boolean) => {
      if (!alive) return;
      reshape(img);
      fit = fitCanvas(img);
      low = lowCanvas(fit);
      let ok = false;
      if (sameOrigin) {
        try {
          ok = startGL();
        } catch {
          ok = false;
        }
      }
      if (!ok) {
        mode = "2d";
        setNote("2d pass");
      }
      wake();
    };

    const enter = () => {
      target = 1;
      wake();
    };
    const leave = () => {
      target = 0;
      wake();
    };
    // No touch toggle: every ShaderPhoto is wrapped in an ImageSpotlight, so a
    // tap opens the real photograph. Keeping the reveal toggle here would give
    // one tap two meanings and leave the thumbnail in the opposite state after
    // the spotlight closes. Hover reveal stays for pointer devices.
    canvas.addEventListener("mouseenter", enter);
    canvas.addEventListener("mouseleave", leave);

    if (!src) {
      begin(placeholder(), true);
    } else {
      // Try CORS first so WebGL can read the pixels; fall back to a tainted
      // load that can still be drawn, then to the placeholder.
      const a = new Image();
      a.crossOrigin = "anonymous";
      a.onload = () => begin(a, true);
      a.onerror = () => {
        const b = new Image();
        b.onload = () => begin(b, false);
        b.onerror = () => begin(placeholder(), true);
        b.src = src;
      };
      a.src = src;
    }

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mouseenter", enter);
      canvas.removeEventListener("mouseleave", leave);
    };
  }, [src, width, height, cellW, cellH, gap, label]);

  return (
    <div className="inline-block">
      <canvas ref={canvasRef} className="block cursor-crosshair bg-transparent" />
      {caption && (
        <div className="flex gap-1.5 pt-[7px] text-[10px] uppercase leading-[1.5] tracking-[.09em] opacity-[.42]">
          <span>{caption}</span>
          {note && <span className="opacity-60">· {note}</span>}
        </div>
      )}
    </div>
  );
}
