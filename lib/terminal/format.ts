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
