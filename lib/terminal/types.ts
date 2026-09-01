// Shape of every renderable unit in the transcript. Ported 1:1 from the
// "Terminal Portfolio v2" design so colours stay CSS-var strings the blocks
// hand straight to `style`.

export interface Line {
  text: string;
  color: string;
  k: string;
  kcolor: string;
}

export interface SelectItem {
  key: string;
  cmd: string;
  k: string;
  kcolor: string;
  text: string;
  color: string;
}

export interface DiffRow {
  num: number;
  sign: string;
  text: string;
}

export interface PhotoItem {
  w: number;
  h: number;
  cols: number;
  label: string;
  caption: string;
}

export interface ShotItem {
  w: number;
  h: number;
  cellW: number;
  cellH: number;
  gap: number;
  label: string;
  caption: string;
  src: string;
}

import type { ChoiceOption } from "./contact";

/** One slide in a carousel: either a rendered photo or a block of text. */
export type CarouselSlide =
  | { key: string; label: string; kind: "shot"; shot: ShotItem }
  | { key: string; label: string; kind: "lines"; lines: Line[] };

export type BlockSpec =
  | { kind: "echo"; text: string }
  | { kind: "think"; text: string }
  | { kind: "say"; full: string; n?: number }
  | {
      kind: "tool";
      name: string;
      arg: string;
      meta: string;
      out: Line[];
      dur: number;
      done?: boolean;
    }
  | { kind: "lines"; lines: Line[] }
  | {
      kind: "diff";
      path: string;
      summary: string;
      rows: DiffRow[];
      footer: string;
    }
  | {
      kind: "select";
      domain: string;
      header: string;
      sep: string;
      items: SelectItem[];
      hint: string;
    }
  | { kind: "photos"; items: PhotoItem[] }
  | { kind: "shots"; items: ShotItem[] }
  | { kind: "action"; actionLabel: string; act: () => void }
  | { kind: "scroll"; title: string; lines: Line[]; rows: number }
  | { kind: "carousel"; title: string; slides: CarouselSlide[] }
  | { kind: "demo"; panel: "primitives" }
  | { kind: "contact" }
  | { kind: "chips"; groups: [string, string[]][] }
  | { kind: "voice"; current: Voice; onSelect: (v: Voice) => void }
  | {
      kind: "picker";
      title: string;
      options: ChoiceOption[];
      perRow: number;
      current: string;
      onSelect: (value: string) => void;
    }
  | {
      kind: "project";
      title: string;
      slides: CarouselSlide[];
      /** Fixed head matter — stack, year, links. Never re-wrapped. */
      meta: Line[];
      /** Prose, wrapped to the measured width at render time. */
      paragraphs: string[];
      rows: number;
    };

export type Block = BlockSpec & { id: number };

export type SelectBlock = Extract<Block, { kind: "select" }>;
export type ScrollBlock = Extract<Block, { kind: "scroll" }>;
export type CarouselBlock = Extract<Block, { kind: "carousel" }>;

/**
 * Block kinds that can own the arrow keys. The newest one on screen holds
 * them until esc releases it, so there is only ever one arrow target.
 */
export const INTERACTIVE_KINDS = [
  "select",
  "scroll",
  "carousel",
  "contact",
  "project",
  "picker",
  "voice",
] as const;

export type InteractiveBlock = Extract<
  Block,
  { kind: (typeof INTERACTIVE_KINDS)[number] }
>;

export function isInteractive(b: Block): b is InteractiveBlock {
  return (INTERACTIVE_KINDS as readonly string[]).includes(b.kind);
}
export type SayBlock = Extract<Block, { kind: "say" }>;
export type ToolBlock = Extract<Block, { kind: "tool" }>;

export type Theme =
  | "green"
  | "ember"
  | "ice"
  | "plum"
  | "mono"
  | "paper"
  | "white"
  | "linen";
export type Voice = "warm" | "brief" | "terse";

/** [label, colour] pairs cycled with shift+tab. */
export const MODES: ReadonlyArray<readonly [string, string]> = [
  ["browse mode on", "var(--accent)"],
  ["deep-dive mode on", "var(--accent2)"],
  ["hire mode on", "var(--warn)"],
] as const;

export const SPINNER_FRAMES = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏";
