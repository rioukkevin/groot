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
  | { kind: "action"; actionLabel: string; act: () => void };

export type Block = BlockSpec & { id: number };

export type SelectBlock = Extract<Block, { kind: "select" }>;
export type SayBlock = Extract<Block, { kind: "say" }>;
export type ToolBlock = Extract<Block, { kind: "tool" }>;

export type Theme = "green" | "ember" | "paper";
export type Voice = "warm" | "terse";

/** [label, colour] pairs cycled with shift+tab. */
export const MODES: ReadonlyArray<readonly [string, string]> = [
  ["browse mode on", "var(--accent)"],
  ["deep-dive mode on", "var(--accent2)"],
  ["hire mode on", "var(--warn)"],
] as const;

export const SPINNER_FRAMES = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏";
