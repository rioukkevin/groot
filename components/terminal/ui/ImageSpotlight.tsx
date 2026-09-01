"use client";

/**
 * ImageSpotlight — click a thumbnail and the real photograph morphs out of it
 * to fill the screen. No shader, no cell grid, no dither: the point is the
 * photo. Zoom and pan once it is open, Escape / backdrop / [esc] to put it back.
 *
 * API — wrap the thumbnail you already have. In ShotsBlock that is two lines:
 *
 *   <ImageSpotlight key={p.label} src={p.src} caption={p.caption}>
 *     <ShaderPhoto src={p.src} width={p.w} ... />
 *   </ImageSpotlight>
 *
 * The wrapper never moves or unmounts the thumbnail — it only turns it into a
 * button and dims it to an outlined stand-in while the spotlight is up, so the
 * slot keeps its box and nothing around it reflows.
 *
 * Props
 *   src              full-resolution image. Falsy -> children render bare.
 *   caption          shown in the overlay chrome, also the dialog's label.
 *   label            fallback for `caption` in the chrome / aria text.
 *   measureSelector  which descendant counts as "the picture" for the morph.
 *                    Defaults to "canvas,img,video" so ShaderPhoto's canvas is
 *                    measured rather than its box plus the caption line.
 *   className        extra classes on the trigger.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type {
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  SyntheticEvent,
} from "react";

/* ── geometry ──────────────────────────────────────────────────────────── */

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}
interface Size {
  w: number;
  h: number;
}
interface Point {
  x: number;
  y: number;
}
/** Zoom factor and pan offset, applied on top of the fitted image box. */
interface View {
  z: number;
  tx: number;
  ty: number;
}
/** `base` is the fitted image box, `content` the padded area it lives in. */
interface Layout {
  base: Rect;
  content: Rect;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 8;
const TAP_ZOOM = 2.5;
const MORPH_MS = 340;
const FADE_MS = 160;
const DIM_MS = 160;
const PAD_X = 24;
const PAD_TOP = 52;
const PAD_BOTTOM = 44;
const EASE = "cubic-bezier(.22,.61,.36,1)";

function clampNum(v: number, lo: number, hi: number) {
  return v < lo ? lo : v > hi ? hi : v;
}

function rectOf(el: Element): Rect {
  const r = el.getBoundingClientRect();
  return { x: r.left, y: r.top, w: r.width, h: r.height };
}

/** The image at zoom 1: contained in `content` and centred there. */
function fitRect(natural: Size, content: Rect): Rect {
  const s = Math.min(content.w / natural.w, content.h / natural.h);
  const w = natural.w * s;
  const h = natural.h * s;
  return {
    x: content.x + (content.w - w) / 2,
    y: content.y + (content.h - h) / 2,
    w,
    h,
  };
}

/**
 * Keep the zoom in range and the pan honest: an axis smaller than the content
 * box is centred, a larger one may not expose a gap at either edge.
 */
function clampView(view: View, layout: Layout): View {
  const { base, content } = layout;
  const z = clampNum(view.z, MIN_ZOOM, MAX_ZOOM);
  const w = base.w * z;
  const h = base.h * z;
  const tx =
    w <= content.w
      ? content.x + (content.w - w) / 2 - base.x
      : clampNum(view.tx, content.x + content.w - w - base.x, content.x - base.x);
  const ty =
    h <= content.h
      ? content.y + (content.h - h) / 2 - base.y
      : clampNum(view.ty, content.y + content.h - h - base.y, content.y - base.y);
  return { z, tx, ty };
}

/** Zoom to `z` keeping the image point under (px, py) pinned to (px, py). */
function zoomAt(view: View, layout: Layout, z: number, px: number, py: number): View {
  const cur = clampView(view, layout);
  const next = clampNum(z, MIN_ZOOM, MAX_ZOOM);
  const u = (px - layout.base.x - cur.tx) / cur.z;
  const v = (py - layout.base.y - cur.ty) / cur.z;
  return clampView(
    { z: next, tx: px - layout.base.x - u * next, ty: py - layout.base.y - v * next },
    layout,
  );
}

function panBy(view: View, layout: Layout, dx: number, dy: number): View {
  const cur = clampView(view, layout);
  return clampView({ z: cur.z, tx: cur.tx + dx, ty: cur.ty + dy }, layout);
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * The thumbnail already fetched this src, so the decoded size is usually there
 * for the asking and the morph can start against the true aspect ratio. When
 * it is not, the thumbnail's own aspect stands in until `load` fires.
 */
function probeNatural(src: string): Size | null {
  if (typeof Image === "undefined") return null;
  const probe = new Image();
  probe.src = src;
  return probe.complete && probe.naturalWidth > 0
    ? { w: probe.naturalWidth, h: probe.naturalHeight }
    : null;
}

/** Distance and midpoint of the first two live pointers. */
function pinchOf(points: Map<number, Point>) {
  const list = Array.from(points.values());
  const a = list[0];
  const b = list[1];
  return {
    d: Math.hypot(b.x - a.x, b.y - a.y),
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  };
}

/**
 * position:fixed on <body> holds the page exactly where it was while the
 * overlay is up; the padding replaces the width the scrollbar gave back so
 * nothing behind the overlay shifts.
 */
function useBodyScrollLock() {
  useEffect(() => {
    const body = document.body;
    const scrollY = window.scrollY;
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };
    body.style.position = "fixed";
    body.style.top = `${-scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.overflow = "hidden";
    if (gutter > 0) body.style.paddingRight = `${gutter}px`;
    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.overflow = prev.overflow;
      body.style.paddingRight = prev.paddingRight;
      window.scrollTo(0, scrollY);
    };
  }, []);
}

/* ── overlay ───────────────────────────────────────────────────────────── */

interface SpotlightOverlayProps {
  src: string;
  title: string;
  /** Thumbnail rect measured at click time — the morph's starting box. */
  origin: Rect;
  seed: Size | null;
  /** Flipped by the parent to run the closing morph. */
  closing: boolean;
  /** Re-measures the thumbnail so the closing morph lands on it. */
  measureOrigin: () => Rect;
  onRequestClose: () => void;
  onClosed: () => void;
}

function SpotlightOverlay({
  src,
  title,
  origin,
  seed,
  closing,
  measureOrigin,
  onRequestClose,
  onClosed,
}: SpotlightOverlayProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  /** Carries the FLIP morph only — never the zoom/pan transform. */
  const morphRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const animsRef = useRef<Animation[]>([]);
  const layoutRef = useRef<Layout | null>(null);
  const pointersRef = useRef(new Map<number, Point>());
  const pinchRef = useRef<{ d: number; x: number; y: number } | null>(null);
  const downRef = useRef<Point | null>(null);
  const draggedRef = useRef(false);
  const tapRef = useRef<{ t: number; x: number; y: number } | null>(null);

  const [viewport, setViewport] = useState<Size>(() =>
    typeof window === "undefined"
      ? { w: 1024, h: 768 }
      : { w: window.innerWidth, h: window.innerHeight },
  );
  const [natural, setNatural] = useState<Size | null>(seed);
  const [failed, setFailed] = useState(false);
  const [view, setView] = useState<View>({ z: 1, tx: 0, ty: 0 });

  useBodyScrollLock();

  const content: Rect = {
    x: PAD_X,
    y: PAD_TOP,
    w: Math.max(48, viewport.w - PAD_X * 2),
    h: Math.max(48, viewport.h - PAD_TOP - PAD_BOTTOM),
  };
  const size: Size = natural ?? {
    w: Math.max(1, origin.w),
    h: Math.max(1, origin.h),
  };
  const layout: Layout = { base: fitRect(size, content), content };
  const shown = clampView(view, layout);

  // Handlers read the live layout from here rather than from a stale closure.
  useEffect(() => {
    layoutRef.current = layout;
  });

  useEffect(() => {
    const el = closeRef.current ?? dialogRef.current;
    el?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const anims = animsRef.current;
    return () => {
      for (const a of anims) a.cancel();
      anims.length = 0;
    };
  }, []);

  useEffect(() => {
    const onResize = () =>
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      onRequestClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onRequestClose]);

  // Wheel has to be non-passive to cancel the page's own zoom/scroll.
  useEffect(() => {
    const root = dialogRef.current;
    if (!root) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const l = layoutRef.current;
      if (!l) return;
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1;
      // Trackpad pinch arrives as ctrl+wheel with much smaller deltas.
      const k = e.ctrlKey ? 0.01 : 0.0022;
      const factor = Math.exp(-e.deltaY * unit * k);
      setView((v) => zoomAt(v, l, v.z * factor, e.clientX, e.clientY));
    };
    root.addEventListener("wheel", onWheel, { passive: false });
    return () => root.removeEventListener("wheel", onWheel);
  }, []);

  // FLIP in: the photo starts as the thumbnail's exact box and grows out of it.
  useEffect(() => {
    const el = morphRef.current;
    const back = backdropRef.current;
    const chrome = chromeRef.current;
    const reduce = prefersReducedMotion();
    const anims = animsRef.current;
    const target = el ? rectOf(el) : null;
    const morphable =
      !reduce && !!target && target.w > 0 && target.h > 0 && origin.w > 0 && origin.h > 0;

    if (el && target && morphable) {
      const sx = origin.w / target.w;
      const sy = origin.h / target.h;
      const dx = origin.x - target.x;
      const dy = origin.y - target.y;
      anims.push(
        el.animate(
          [
            {
              transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`,
              opacity: 0,
              offset: 0,
            },
            { opacity: 1, offset: 0.3 },
            { transform: "translate(0px, 0px) scale(1, 1)", opacity: 1, offset: 1 },
          ],
          { duration: MORPH_MS, easing: EASE, fill: "both" },
        ),
      );
    } else if (el) {
      anims.push(
        el.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: FADE_MS,
          easing: "ease-out",
          fill: "both",
        }),
      );
    }
    const chromeMs = morphable ? MORPH_MS : FADE_MS;
    if (back)
      anims.push(
        back.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: chromeMs,
          easing: "ease-out",
          fill: "both",
        }),
      );
    if (chrome)
      anims.push(
        chrome.animate([{ opacity: 0, offset: 0 }, { opacity: 0, offset: 0.4 }, { opacity: 1, offset: 1 }], {
          duration: chromeMs,
          easing: "ease-out",
          fill: "both",
        }),
      );
  }, [origin]);

  // FLIP out: measured from what is on screen right now, so it works mid-morph
  // and at any zoom level.
  useEffect(() => {
    if (!closing) return;
    const el = morphRef.current;
    const img = imgRef.current;
    const back = backdropRef.current;
    const chrome = chromeRef.current;
    const base = layoutRef.current?.base ?? null;
    const reduce = prefersReducedMotion();

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      onClosed();
    };

    // Measure before cancelling the opening morph, then let it go.
    const outer = el ? rectOf(el) : null;
    const cur = img ? rectOf(img) : null;
    for (const a of animsRef.current) a.cancel();
    animsRef.current.length = 0;
    const anims = animsRef.current;

    const dest = measureOrigin();
    const morphable =
      !reduce &&
      !!el &&
      !!base &&
      !!outer &&
      !!cur &&
      cur.w > 0 &&
      cur.h > 0 &&
      base.w > 0 &&
      base.h > 0 &&
      dest.w > 0 &&
      dest.h > 0;

    if (el && base && outer && cur && morphable) {
      // Where the morph layer sits now, relative to its own untransformed box.
      const s0x = outer.w / base.w;
      const s0y = outer.h / base.h;
      const t0x = outer.x - base.x;
      const t0y = outer.y - base.y;
      // The transform that drops the *visible* image onto `dest`.
      const kx = dest.w / cur.w;
      const ky = dest.h / cur.h;
      const sx = s0x * kx;
      const sy = s0y * ky;
      const mx = dest.x - base.x - kx * (cur.x - outer.x);
      const my = dest.y - base.y - ky * (cur.y - outer.y);
      anims.push(
        el.animate(
          [
            {
              transform: `translate(${t0x}px, ${t0y}px) scale(${s0x}, ${s0y})`,
              opacity: 1,
              offset: 0,
            },
            { opacity: 1, offset: 0.7 },
            { transform: `translate(${mx}px, ${my}px) scale(${sx}, ${sy})`, opacity: 0, offset: 1 },
          ],
          { duration: MORPH_MS, easing: EASE, fill: "both" },
        ),
      );
    } else if (el) {
      anims.push(
        el.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: FADE_MS,
          easing: "ease-in",
          fill: "both",
        }),
      );
    }
    const ms = morphable ? MORPH_MS : FADE_MS;
    for (const node of [back, chrome]) {
      if (!node) continue;
      anims.push(
        node.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: ms,
          easing: "ease-in",
          fill: "both",
        }),
      );
    }

    const primary = anims[0];
    if (primary) primary.addEventListener("finish", finish);
    // Never strand the overlay if an animation is dropped by the browser.
    const guard = window.setTimeout(finish, ms + 120);
    return () => window.clearTimeout(guard);
  }, [closing, measureOrigin, onClosed]);

  const zoomToggle = (px: number, py: number) => {
    const l = layoutRef.current;
    if (!l) return;
    setView((v) =>
      v.z > MIN_ZOOM + 0.05
        ? clampView({ z: MIN_ZOOM, tx: 0, ty: 0 }, l)
        : zoomAt(v, l, TAP_ZOOM, px, py),
    );
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLImageElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    downRef.current = { x: e.clientX, y: e.clientY };
    draggedRef.current = false;
    pinchRef.current =
      pointersRef.current.size >= 2 ? pinchOf(pointersRef.current) : null;
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLImageElement>) => {
    const points = pointersRef.current;
    const prev = points.get(e.pointerId);
    if (!prev) return;
    const cur = { x: e.clientX, y: e.clientY };
    points.set(e.pointerId, cur);
    const l = layoutRef.current;
    if (!l) return;

    if (points.size >= 2) {
      const next = pinchOf(points);
      const last = pinchRef.current;
      pinchRef.current = next;
      draggedRef.current = true;
      if (!last || last.d <= 0) return;
      const ratio = next.d / last.d;
      const px = next.x - last.x;
      const py = next.y - last.y;
      setView((v) => {
        const moved = panBy(v, l, px, py);
        return zoomAt(moved, l, moved.z * ratio, next.x, next.y);
      });
      return;
    }

    const down = downRef.current;
    if (!draggedRef.current && down && Math.hypot(cur.x - down.x, cur.y - down.y) > 4)
      draggedRef.current = true;
    const dx = cur.x - prev.x;
    const dy = cur.y - prev.y;
    if (dx === 0 && dy === 0) return;
    setView((v) => panBy(v, l, dx, dy));
  };

  const endPointer = (e: ReactPointerEvent<HTMLImageElement>) => {
    const points = pointersRef.current;
    points.delete(e.pointerId);
    if (points.size < 2) pinchRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
    if (e.type !== "pointerup" || e.pointerType !== "touch" || draggedRef.current) return;
    // dblclick is unreliable for touch, so pair the taps by hand.
    const now = performance.now();
    const last = tapRef.current;
    if (last && now - last.t < 320 && Math.hypot(e.clientX - last.x, e.clientY - last.y) < 32) {
      tapRef.current = null;
      zoomToggle(e.clientX, e.clientY);
      return;
    }
    tapRef.current = { t: now, x: e.clientX, y: e.clientY };
  };

  // A drag that started on the photo must not fall through as a backdrop
  // click; a press that starts on the backdrop clears that guard again.
  const onBackdropPointerDown = () => {
    draggedRef.current = false;
  };

  const onBackdropClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || draggedRef.current) return;
    onRequestClose();
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    const root = dialogRef.current;
    if (!root) return;
    const items = Array.from(
      root.querySelectorAll<HTMLElement>('button:not([disabled]), [href], [tabindex="0"]'),
    );
    const first = items[0];
    const last = items[items.length - 1];
    if (!first || !last) {
      e.preventDefault();
      root.focus({ preventScroll: true });
      return;
    }
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === root)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const onLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const el = e.currentTarget;
    if (el.naturalWidth > 0 && el.naturalHeight > 0)
      setNatural({ w: el.naturalWidth, h: el.naturalHeight });
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      className="fixed inset-0 outline-none"
      style={{ zIndex: 100, touchAction: "none", overscrollBehavior: "contain" }}
    >
      <div
        ref={backdropRef}
        onPointerDown={onBackdropPointerDown}
        onClick={onBackdropClick}
        className="absolute inset-0"
        style={{
          zIndex: 0,
          background: "color-mix(in oklab, var(--bg) 96%, transparent)",
        }}
      />
      <div
        ref={morphRef}
        className="absolute"
        style={{
          zIndex: 1,
          left: layout.base.x,
          top: layout.base.y,
          width: layout.base.w,
          height: layout.base.h,
          transformOrigin: "0 0",
          willChange: "transform, opacity",
        }}
      >
        <img
          ref={imgRef}
          src={src}
          alt={title}
          draggable={false}
          onLoad={onLoad}
          onError={() => setFailed(true)}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endPointer}
          onPointerCancel={endPointer}
          onDoubleClick={(e) => zoomToggle(e.clientX, e.clientY)}
          className="absolute inset-0 select-none"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            transformOrigin: "0 0",
            transform: `translate(${shown.tx}px, ${shown.ty}px) scale(${shown.z}, ${shown.z})`,
            cursor: shown.z > MIN_ZOOM + 0.05 ? "grab" : "zoom-in",
            touchAction: "none",
            willChange: "transform",
          }}
        />
      </div>
      <div ref={chromeRef} className="pointer-events-none absolute inset-0" style={{ zIndex: 2 }}>
        <div
          className="absolute inset-x-0 top-0 flex items-center gap-3 px-4 text-[10px] uppercase leading-[1.5] tracking-[.09em]"
          style={{ height: PAD_TOP, textShadow: "0 1px 3px var(--bg)" }}
        >
          <span className="truncate" style={{ color: "var(--dim)" }}>
            {title}
          </span>
          {failed && <span style={{ color: "var(--err)" }}>· unavailable</span>}
          <span className="flex-1" />
          <span style={{ color: "var(--faint)" }}>{shown.z.toFixed(1)}x</span>
          <button
            ref={closeRef}
            type="button"
            onClick={onRequestClose}
            className="pointer-events-auto uppercase tracking-[.09em] opacity-80 transition-opacity hover:opacity-100 focus-visible:underline"
            style={{ color: "var(--dim)" }}
          >
            <span style={{ color: "var(--faint)" }}>[esc]</span> close ✕
          </button>
        </div>
        <div
          className="absolute inset-x-0 bottom-0 flex items-center px-4 text-[10px] uppercase leading-[1.5] tracking-[.09em]"
          style={{ height: PAD_BOTTOM, color: "var(--faint)", textShadow: "0 1px 3px var(--bg)" }}
        >
          <span>wheel zoom · drag pan · dbl-click toggle</span>
        </div>
      </div>
    </div>
  );
}

/* ── wrapper ───────────────────────────────────────────────────────────── */

type Mode = "closed" | "open" | "closing";

interface ImageSpotlightProps {
  src?: string;
  caption?: string;
  label?: string;
  measureSelector?: string;
  className?: string;
  children: ReactNode;
}

export function ImageSpotlight({
  src,
  caption,
  label,
  measureSelector = "canvas,img,video",
  className,
  children,
}: ImageSpotlightProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("closed");
  const [shot, setShot] = useState<{ origin: Rect; seed: Size | null } | null>(null);

  const measureOrigin = useCallback((): Rect => {
    const host = triggerRef.current;
    if (!host) return { x: 0, y: 0, w: 0, h: 0 };
    return rectOf(host.querySelector<HTMLElement>(measureSelector) ?? host);
  }, [measureSelector]);

  const requestClose = useCallback(() => {
    setMode((m) => (m === "open" ? "closing" : m));
  }, []);

  const finishClose = useCallback(() => {
    setMode("closed");
    setShot(null);
    triggerRef.current?.focus({ preventScroll: true });
  }, []);

  const open = () => {
    if (!src || mode !== "closed") return;
    setShot({ origin: measureOrigin(), seed: probeNatural(src) });
    setMode("open");
  };

  const onTriggerKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    open();
  };

  const title = caption ?? label ?? "image";

  if (!src) return <>{children}</>;

  const dimmed = mode === "open";
  return (
    <>
      <div
        ref={triggerRef}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={mode !== "closed"}
        aria-label={`open ${title} full screen`}
        onClick={open}
        onKeyDown={onTriggerKeyDown}
        className={`relative cursor-zoom-in outline-none${className ? ` ${className}` : ""}`}
      >
        <div style={{ opacity: dimmed ? 0.14 : 1, transition: `opacity ${DIM_MS}ms ease` }}>
          {children}
        </div>
        {/* Stand-in so the slot keeps its box while the photo is elsewhere. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            border: "1px dashed var(--hair)",
            opacity: dimmed ? 1 : 0,
            transition: `opacity ${DIM_MS}ms ease`,
          }}
        />
      </div>
      {shot && mode !== "closed" && typeof document !== "undefined"
        ? createPortal(
            <SpotlightOverlay
              src={src}
              title={title}
              origin={shot.origin}
              seed={shot.seed}
              closing={mode === "closing"}
              measureOrigin={measureOrigin}
              onRequestClose={requestClose}
              onClosed={finishClose}
            />,
            document.body,
          )
        : null}
    </>
  );
}
