import type { BlockSpec, Line, SelectItem, DiffRow } from "./types";

export const say = (full: string): BlockSpec => ({ kind: "say", full });

export const think = (text: string): BlockSpec => ({ kind: "think", text });

export const echo = (text: string): BlockSpec => ({ kind: "echo", text });

export const lines = (ls: Line[]): BlockSpec => ({ kind: "lines", lines: ls });

export const tool = (
  name: string,
  arg: string,
  meta: string,
  out: Line[] = [],
  dur = 520,
): BlockSpec => ({ kind: "tool", name, arg, meta, out, dur });

export const diff = (
  path: string,
  summary: string,
  rows: readonly DiffRow[],
  footer = "",
): BlockSpec => ({ kind: "diff", path, summary, rows: [...rows], footer });

export const select = (
  domain: string,
  header: string,
  sepW: number,
  items: SelectItem[],
  hint: string,
): BlockSpec => ({
  kind: "select",
  domain,
  header: "  " + header,
  sep: "  " + "─".repeat(sepW),
  items,
  hint: "  " + hint,
});
