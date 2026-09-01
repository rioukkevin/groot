import type { Line } from "./types";

/** Pad to a fixed monospace column width, truncating with an ellipsis. */
export function pad(value: string | number, n: number): string {
  let s = String(value);
  if (s.length > n - 1) s = s.slice(0, Math.max(1, n - 2)) + "…";
  return s + " ".repeat(Math.max(1, n - s.length));
}

/** A transcript line: `k` is the coloured key prefix, `text` the remainder. */
export function L(
  text?: string,
  color?: string,
  k?: string,
  kcolor?: string,
): Line {
  return {
    text: text || "",
    color: color || "var(--fg)",
    k: k || "",
    kcolor: kcolor || "var(--accent)",
  };
}

/** 20-cell proficiency meter. */
export function bar(p: number): string {
  const n = Math.round(p / 5);
  return "▓".repeat(n) + "░".repeat(20 - n);
}

/** Wrap rows in a single-line box-drawing frame. */
export function box(rows: readonly string[], w = 64): Line[] {
  const out = [L("┌" + "─".repeat(w - 2) + "┐", "var(--faint)")];
  rows.forEach((r) => out.push(L("│ " + pad(r, w - 4) + " │", "var(--fg)")));
  out.push(L("└" + "─".repeat(w - 2) + "┘", "var(--faint)"));
  return out;
}

/** Greedy word wrap, for prose that has to sit on the character grid. */
export function wrap(text: string, width: number): string[] {
  const out: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    if (!word) continue;
    if (line && line.length + 1 + word.length > width) {
      out.push(line);
      line = word;
    } else {
      line = line ? line + " " + word : word;
    }
  }
  if (line) out.push(line);
  return out;
}

/**
 * Upper bound on how many lines a project's write-up can occupy, used to stop
 * the scroll cursor running past the end.
 *
 * The real count depends on the measured width, which only the view knows, so
 * this assumes the narrowest wrap the view permits. That over-estimates, which
 * is the safe direction: the end always stays reachable, and the cursor still
 * cannot run away.
 */
export function maxWrappedLines(
  metaLines: number,
  paragraphs: readonly string[],
  minCols: number,
): number {
  return (
    metaLines +
    paragraphs.reduce((n, p) => n + Math.ceil(p.length / minCols) + 1, 0)
  );
}
