"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const FILL = "▓";
const EMPTY = "░";

const DEFAULT_WIDTH = 20;
/** Cells lit by the indeterminate sweep, and how fast it travels (cells/sec). */
const SWEEP = 4;
const SWEEP_RATE = 14;

const REDUCED = "(prefers-reduced-motion: reduce)";

function subscribeReduced(onChange: () => void): () => void {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/** `useSyncExternalStore` keeps this out of an effect, so nothing cascades. */
function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  width?: number;
  label?: string;
  showPercent?: boolean;
  color?: string;
  indeterminate?: boolean;
}

/**
 * A character-cell meter: `▓` filled, `░` empty, exactly like
 * `lib/terminal/format.ts` `bar()`, with an optional label column and a
 * right-aligned percentage.
 */
export function ProgressBar({
  value,
  max = 100,
  width = DEFAULT_WIDTH,
  label,
  showPercent = false,
  color = "var(--accent)",
  indeterminate = false,
}: ProgressBarProps) {
  const cells =
    Number.isFinite(width) && width >= 1 ? Math.floor(width) : DEFAULT_WIDTH;
  const travel = Math.max(1, cells - SWEEP);
  const reduced = usePrefersReducedMotion();
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!indeterminate || reduced) return;
    let raf = 0;
    let start = 0;
    // One there-and-back trip, derived from the timestamp so it cannot drift.
    const period = (travel * 2 * 1000) / SWEEP_RATE;
    raf = requestAnimationFrame(function loop(t: number) {
      if (start === 0) start = t;
      const phase = ((t - start) % period) / period;
      const tri = phase < 0.5 ? phase * 2 : 2 - phase * 2;
      setOffset(Math.round(tri * travel));
      raf = requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(raf);
  }, [indeterminate, reduced, travel]);

  const safeMax = Number.isFinite(max) && max > 0 ? max : 1;
  const safeValue = Number.isFinite(value)
    ? Math.min(Math.max(value, 0), safeMax)
    : 0;
  const ratio = safeValue / safeMax;

  // Three segments so the empty cells keep their own colour without slicing
  // the rendered string back apart.
  let lead: number;
  let fill: number;
  if (indeterminate) {
    // Held still under reduced motion: a static partial track.
    lead = Math.min(reduced ? Math.floor(travel / 3) : offset, cells - 1);
    fill = Math.min(SWEEP, cells - lead);
  } else {
    lead = 0;
    fill = Math.min(cells, Math.round(ratio * cells));
  }
  const trail = Math.max(0, cells - lead - fill);

  const percent = `${Math.round(ratio * 100)}%`;

  return (
    <span
      className="whitespace-pre"
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : safeValue}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-label={label}
    >
      {label !== undefined && (
        <span style={{ color: "var(--dim)" }}>{label + " "}</span>
      )}
      <span style={{ color: "var(--faint)" }}>{EMPTY.repeat(lead)}</span>
      <span style={{ color }}>{FILL.repeat(fill)}</span>
      <span style={{ color: "var(--faint)" }}>{EMPTY.repeat(trail)}</span>
      {showPercent && (
        <span style={{ color: "var(--dim)" }}>{" " + percent.padStart(4)}</span>
      )}
    </span>
  );
}
