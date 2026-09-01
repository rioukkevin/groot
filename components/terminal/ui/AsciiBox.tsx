"use client";

import { useEffect, useRef, useState } from "react";

/** Character-cell metrics plus the interior size of the frame, in cells. */
interface Metrics {
  cw: number;
  lh: number;
  cols: number;
  rows: number;
}

const ZERO: Metrics = { cw: 0, lh: 0, cols: 0, rows: 0 };

/* Wide enough to average out sub-pixel error, tall enough to read line-height.
   Measured at runtime rather than hardcoded so the frame survives a font-size
   or font-family change. */
const PROBE_COLS = 10;
const PROBE_ROWS = 2;
const PROBE_TEXT = "0".repeat(PROBE_COLS) + "\n" + "0".repeat(PROBE_COLS);

/** Ignore sub-pixel jitter so a resize loop cannot oscillate. */
function settled(a: Metrics, b: Metrics): boolean {
  return (
    a.cols === b.cols &&
    a.rows === b.rows &&
    Math.abs(a.cw - b.cw) < 0.01 &&
    Math.abs(a.lh - b.lh) < 0.01
  );
}

/** `┌─ title ─────┐`, truncating the title when it outgrows the top edge. */
function topEdge(cols: number, title?: string): [string, string, string] {
  if (!title) return ["┌" + "─".repeat(cols) + "┐", "", ""];
  const room = cols - 3; // "─", the space before, the space after
  if (room < 1) return ["┌" + "─".repeat(cols) + "┐", "", ""];
  const t =
    title.length > room ? title.slice(0, Math.max(1, room - 1)) + "…" : title;
  const fill = Math.max(0, cols - t.length - 3);
  return ["┌─ ", t, " " + "─".repeat(fill) + "┐"];
}

interface AsciiBoxProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  color?: string;
  borderColor?: string;
  padding?: number;
}

/**
 * Frames arbitrary children in a border made of real box-drawing characters.
 *
 * The children are laid out normally and the frame is an overlay sized from a
 * ResizeObserver, so nothing is clipped or stretched: the box grows to whatever
 * the content needs, rounded to the nearest character cell.
 */
export function AsciiBox({
  title,
  children,
  className = "",
  color,
  borderColor = "var(--faint)",
  padding = 1,
}: AsciiBoxProps) {
  const probeRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [m, setM] = useState<Metrics>(ZERO);

  useEffect(() => {
    const probe = probeRef.current;
    const box = boxRef.current;
    if (!probe || !box) return;

    let cancelled = false;
    const measure = () => {
      if (cancelled) return;
      const p = probe.getBoundingClientRect();
      const b = box.getBoundingClientRect();
      const cw = p.width / PROBE_COLS;
      const lh = p.height / PROBE_ROWS;
      if (cw <= 0 || lh <= 0) return;
      const next: Metrics = {
        cw,
        lh,
        cols: Math.max(1, Math.round(b.width / cw)),
        rows: Math.max(1, Math.round(b.height / lh)),
      };
      setM((prev) => (settled(prev, next) ? prev : next));
    };

    // Fires once per observed element on observe, so the first measurement
    // needs no setState in the effect body itself.
    const ro = new ResizeObserver(measure);
    ro.observe(probe);
    ro.observe(box);
    // Web fonts land after first paint and change the advance width.
    document.fonts.ready.then(measure, () => {});

    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, []);

  const ready = m.cw > 0;
  // `ch`/`lh` match the measured cell exactly in a monospace face, so the
  // pre-measurement paint lands on the same grid instead of jumping.
  const gutter = ready ? `${m.lh}px ${m.cw}px` : "1lh 1ch";
  const inner = ready
    ? `${padding * m.lh}px ${padding * m.cw}px`
    : `${padding}lh ${padding}ch`;

  const [head, name, tail] = topEdge(m.cols, title);
  const rail = "│" + " ".repeat(m.cols) + "│";
  const body = Array.from({ length: m.rows }, () => rail).join("\n");
  const foot = "└" + "─".repeat(m.cols) + "┘";

  return (
    <div
      className={`relative inline-block align-top ${className}`}
      style={{ color, padding: gutter }}
    >
      <div
        ref={probeRef}
        aria-hidden
        className="pointer-events-none invisible absolute top-0 left-0 select-none whitespace-pre"
      >
        {PROBE_TEXT}
      </div>

      <div ref={boxRef} style={{ padding: inner }}>
        {children}
      </div>

      {ready && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 select-none whitespace-pre"
          style={{ color: borderColor }}
        >
          {head}
          {name && <span style={{ color: color ?? "var(--dim)" }}>{name}</span>}
          {tail}
          {"\n"}
          {body}
          {"\n"}
          {foot}
        </div>
      )}
    </div>
  );
}
