"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/* Only glyphs confirmed present in the project's JetBrains Mono are used here:
   the Unicode dice (⚀⚁⚂⚃⚄⚅) and braille spinners fall back to another face
   with a different advance width, which knocks the whole line off the grid. */
const PIP = "●";

/** Faces 1..6 as 3x3 pip grids. */
const FACES: readonly (readonly [string, string, string])[] = [
  ["   ", ` ${PIP} `, "   "],
  [`${PIP}  `, "   ", `  ${PIP}`],
  [`${PIP}  `, ` ${PIP} `, `  ${PIP}`],
  [`${PIP} ${PIP}`, "   ", `${PIP} ${PIP}`],
  [`${PIP} ${PIP}`, ` ${PIP} `, `${PIP} ${PIP}`],
  [`${PIP} ${PIP}`, `${PIP} ${PIP}`, `${PIP} ${PIP}`],
];

/* The inline variant is one cell wide, so it rolls the die's edge with the
   half-block set instead of shrinking a 3x3 grid into a single character. */
const EDGES = ["▌", "▀", "▐", "▄"] as const;

const DEFAULT_SPEED = 200;

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

interface DotLoaderProps {
  size?: "inline" | "block";
  speed?: number;
  color?: string;
  label?: string;
}

/**
 * A loader that rolls through die faces. `block` draws the 3x3 pip grid,
 * `inline` a single-cell variant that sits next to text without disturbing
 * the character grid.
 */
export function DotLoader({
  size = "inline",
  speed = DEFAULT_SPEED,
  color = "var(--accent)",
  label,
}: DotLoaderProps) {
  const reduced = usePrefersReducedMotion();
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const period = Number.isFinite(speed) && speed > 0 ? speed : DEFAULT_SPEED;
    let raf = 0;
    let last = 0;
    let acc = 0;
    // Timestamp accumulator: advances by whole faces however long a frame took.
    raf = requestAnimationFrame(function loop(t: number) {
      if (last > 0) acc += t - last;
      last = t;
      if (acc >= period) {
        const steps = Math.floor(acc / period);
        acc -= steps * period;
        setFrame((f) => f + steps);
      }
      raf = requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(raf);
  }, [reduced, speed]);

  if (size === "block") {
    const face = FACES[frame % FACES.length];
    return (
      <span
        className="inline-block align-top whitespace-pre"
        role="status"
        aria-label={label ?? "loading"}
      >
        <span aria-hidden style={{ color }}>
          {face.join("\n")}
        </span>
        {label !== undefined && (
          <span aria-hidden className="block" style={{ color: "var(--dim)" }}>
            {label}
          </span>
        )}
      </span>
    );
  }

  return (
    <span
      className="whitespace-pre"
      role="status"
      aria-label={label ?? "loading"}
    >
      <span aria-hidden style={{ color }}>
        {EDGES[frame % EDGES.length]}
      </span>
      {label !== undefined && (
        <span aria-hidden style={{ color: "var(--dim)" }}>
          {" " + label}
        </span>
      )}
    </span>
  );
}
