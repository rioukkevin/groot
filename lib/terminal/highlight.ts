import { norm } from "./slots";

import type { BlockSpec } from "./types";

/**
 * Marks, inside a command's output, the rows that carry what the answer just
 * claimed. The answer says "€600 / day" and the rates box lights that row;
 * it says "Technis" and the roles list lights that entry. The command's own
 * output is untouched otherwise — this is a flag on a row, not a rewrite.
 */

const hit = (text: string, terms: string[]): boolean => {
  const t = norm(text);
  return terms.some((term) => term && t.includes(term));
};

export function highlightBlocks(blocks: BlockSpec[], terms: string[]): BlockSpec[] {
  const ts = terms.map(norm).filter((t) => t.length >= 2);
  if (!ts.length) return blocks;
  return blocks.map((b) => {
    switch (b.kind) {
      case "lines":
        return { ...b, lines: b.lines.map((l) => (hit(l.k + l.text, ts) ? { ...l, hl: true } : l)) };
      case "select":
        return { ...b, items: b.items.map((it) => (hit(it.key + " " + it.k + it.text, ts) ? { ...it, hl: true } : it)) };
      case "diff":
        return { ...b, rows: b.rows.map((r) => (hit(r.text, ts) ? { ...r, hl: true } : r)) };
      case "chips": {
        // A chip is a whole label: "React" must not light "React Native".
        const hl = b.groups.flatMap(([, items]) => items.filter((it) => ts.includes(norm(it))));
        return hl.length ? { ...b, hl } : b;
      }
      case "project":
        return { ...b, meta: b.meta.map((l) => (hit(l.k + l.text, ts) ? { ...l, hl: true } : l)) };
      default:
        return b;
    }
  });
}

/** The inline style shared by every highlighted row. */
export const HL_STYLE = {
  background: "color-mix(in oklab, var(--accent) 22%, transparent)",
  color: "var(--fg)",
  boxShadow: "inset 2px 0 0 var(--accent)",
} as const;

/** Markers the answer text wraps its claimed fact in; SayBlock renders them. */
export const HL_OPEN = "⟦";
export const HL_CLOSE = "⟧";

/** Wraps a fact in the markers, for building an answer sentence. */
export const mark = (s: string): string => `${HL_OPEN}${s}${HL_CLOSE}`;

/** Removes the markers, for anywhere the sentence is shown without styling. */
export const unmark = (s: string): string => s.split(HL_OPEN).join("").split(HL_CLOSE).join("");
