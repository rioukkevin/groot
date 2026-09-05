import { L } from "./format";

import type { Line } from "./types";

/**
 * The markdown the content is written in, read for the terminal.
 *
 * Small on purpose: headings to three levels, bold, italic, inline code,
 * strikethrough, links, highlights, blockquotes, bulleted and numbered lists,
 * a rule. Inline markup is streaming-tolerant — an opener with no closer
 * applies to the end of the string — so a say block can render the text
 * while it is still being typed out. Italic is `*text*` only: an underscore
 * inside a word (get_profile, snake_case) is never markup here.
 *
 * Highlights: `==text==` takes the accent; `=={warn}text==` names a theme
 * colour — accent, accent2, warn, err, add, del, dim, fg. The answer layer's
 * own `⟦text⟧` marker is the same thing as `==text==`.
 */

export type Inline =
  | { t: "text"; s: string }
  | { t: "code"; s: string }
  | { t: "b" | "i" | "s"; c: Inline[] }
  | { t: "hl"; color: string; c: Inline[] }
  | { t: "a"; href: string; c: Inline[] };

export type Block =
  | { t: "h"; level: 1 | 2 | 3; text: string }
  | { t: "hr" }
  | { t: "quote"; lines: string[] }
  | { t: "list"; ordered: boolean; items: { text: string; level: number; n: number }[] }
  | { t: "p"; lines: string[] };

export const HL_COLORS = ["accent", "accent2", "warn", "err", "add", "del", "dim", "fg"] as const;

/** Delimiters, longest first so `**` wins over `*`. */
const DELIMS: { open: string; close: string; t: "b" | "i" | "s" | "hl" }[] = [
  { open: "**", close: "**", t: "b" },
  { open: "~~", close: "~~", t: "s" },
  { open: "==", close: "==", t: "hl" },
  { open: "⟦", close: "⟧", t: "hl" },
  { open: "*", close: "*", t: "i" },
];

const LINK = /^\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/;

/** Inline markup → nodes. Unclosed markers run to the end (streaming). */
export function parseInline(src: string): Inline[] {
  const out: Inline[] = [];
  let text = "";
  const flush = () => {
    if (text) out.push({ t: "text", s: text });
    text = "";
  };
  let i = 0;
  while (i < src.length) {
    const ch = src[i];

    if (ch === "`") {
      const end = src.indexOf("`", i + 1);
      flush();
      out.push({ t: "code", s: end < 0 ? src.slice(i + 1) : src.slice(i + 1, end) });
      i = end < 0 ? src.length : end + 1;
      continue;
    }

    if (ch === "[") {
      const m = LINK.exec(src.slice(i));
      if (m) {
        flush();
        out.push({ t: "a", href: m[2], c: parseInline(m[1]) });
        i += m[0].length;
        continue;
      }
    }

    let matched = false;
    for (const d of DELIMS) {
      if (!src.startsWith(d.open, i)) continue;
      let at = i + d.open.length;
      let color = "accent";
      if (d.t === "hl" && d.open === "==" && src[at] === "{") {
        const brace = src.indexOf("}", at);
        if (brace > at) {
          const name = src.slice(at + 1, brace);
          if ((HL_COLORS as readonly string[]).includes(name)) {
            color = name;
            at = brace + 1;
          }
        }
      }
      // An opener followed by a space is punctuation, not markup: "5 * 3".
      if (at >= src.length || src[at] === " ") continue;
      const end = findClose(src, at, d.close);
      const inner = end < 0 ? src.slice(at) : src.slice(at, end);
      flush();
      const c = parseInline(inner);
      out.push(d.t === "hl" ? { t: "hl", color, c } : { t: d.t, c });
      i = end < 0 ? src.length : end + d.close.length;
      matched = true;
      break;
    }
    if (matched) continue;

    text += ch;
    i++;
  }
  flush();
  return out;
}

/** The closer for a delimiter, skipping code spans, or -1 when unclosed. */
function findClose(src: string, from: number, close: string): number {
  let i = from;
  while (i < src.length) {
    if (src[i] === "`") {
      const end = src.indexOf("`", i + 1);
      if (end < 0) return -1;
      i = end + 1;
      continue;
    }
    if (src.startsWith(close, i)) {
      // `**` closes bold; a lone `*` inside bold is italic's business.
      if (close === "*" && src.startsWith("**", i)) {
        i += 2;
        continue;
      }
      return i;
    }
    i++;
  }
  return -1;
}

/** The text with the markup removed, for measuring and matching. */
export function plain(src: string): string {
  const walk = (ns: Inline[]): string =>
    ns.map((n) => (n.t === "text" || n.t === "code" ? n.s : walk(n.c))).join("");
  return walk(parseInline(src));
}

// ── blocks ────────────────────────────────────────────────────────────────

const HEADING = /^(#{1,3})\s+(.*)$/;
const RULE = /^(?:-{3,}|\*{3,}|_{3,})\s*$/;
const BULLET = /^(\s*)[-*+]\s+(.*)$/;
const NUMBERED = /^(\s*)(\d+)[.)]\s+(.*)$/;
const QUOTE = /^>\s?(.*)$/;

/** Lines → blocks. A blank line ends whatever is open. */
export function parseBlocks(src: string): Block[] {
  const out: Block[] = [];
  let para: string[] | null = null;
  let quote: string[] | null = null;
  let list: Extract<Block, { t: "list" }> | null = null;
  const closeAll = () => {
    if (para) out.push({ t: "p", lines: para });
    if (quote) out.push({ t: "quote", lines: quote });
    if (list) out.push(list);
    para = quote = list = null;
  };

  for (const raw of src.replace(/\r\n?/g, "\n").split("\n")) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      closeAll();
      continue;
    }
    let m: RegExpExecArray | null;
    if ((m = HEADING.exec(line))) {
      closeAll();
      out.push({ t: "h", level: m[1].length as 1 | 2 | 3, text: m[2].trim() });
    } else if (RULE.test(line)) {
      closeAll();
      out.push({ t: "hr" });
    } else if ((m = QUOTE.exec(line))) {
      if (para || list) closeAll();
      (quote ??= []).push(m[1]);
    } else if ((m = BULLET.exec(line)) && !RULE.test(line)) {
      if (para || quote || (list && list.ordered)) closeAll();
      list ??= { t: "list", ordered: false, items: [] };
      list.items.push({ text: m[2], level: Math.floor(m[1].length / 2), n: 0 });
    } else if ((m = NUMBERED.exec(line))) {
      if (para || quote || (list && !list.ordered)) closeAll();
      list ??= { t: "list", ordered: true, items: [] };
      list.items.push({ text: m[3], level: Math.floor(m[1].length / 2), n: Number(m[2]) });
    } else if (list && /^\s{2,}/.test(raw)) {
      // An indented continuation belongs to the last item.
      const last = list.items[list.items.length - 1];
      last.text += " " + line.trim();
    } else {
      if (quote || list) closeAll();
      (para ??= []).push(line);
    }
  }
  closeAll();
  return out;
}

// ── wrapping, for the character grid ──────────────────────────────────────

/** Unclosed openers at the end of a line, in order, so a wrap can close and reopen them. */
function openAt(src: string): string[] {
  const open: string[] = [];
  let i = 0;
  while (i < src.length) {
    if (src[i] === "`") {
      const end = src.indexOf("`", i + 1);
      if (end < 0) return open.concat("`");
      i = end + 1;
      continue;
    }
    if (src[i] === "[") {
      const m = LINK.exec(src.slice(i));
      if (m) {
        i += m[0].length;
        continue;
      }
    }
    const top = open[open.length - 1];
    let handled = false;
    for (const d of DELIMS) {
      if (!src.startsWith(d.open, i)) continue;
      if (top && closerOf(top) === (d.open === "⟦" ? "⟧" : d.close) && src.startsWith(closerOf(top), i)) {
        open.pop();
        i += closerOf(top).length;
        handled = true;
        break;
      }
      let at = i + d.open.length;
      if (d.open === "==" && src[at] === "{") {
        const brace = src.indexOf("}", at);
        if (brace > at) at = brace + 1;
      }
      if (at < src.length && src[at] !== " ") {
        open.push(src.slice(i, at) === "⟦" ? "⟦" : src.slice(i, at));
        i = at;
        handled = true;
        break;
      }
    }
    if (!handled) {
      if (top && src.startsWith(closerOf(top), i)) {
        open.pop();
        i += closerOf(top).length;
      } else i++;
    }
  }
  return open;
}

const closerOf = (opener: string) => (opener === "⟦" ? "⟧" : opener.startsWith("==") ? "==" : opener);

/** Breaks a line of markdown into lines of at most `cols` visible characters,
 *  each still valid markdown: a run that wraps is closed and reopened. */
export function wrapInline(src: string, cols: number): string[] {
  const atoms = atomsOf(src);
  const lines: string[] = [];
  let line = "";
  let width = 0;
  for (const atom of atoms) {
    const w = plain(atom).length;
    if (line && width + 1 + w > cols) {
      lines.push(line);
      line = atom;
      width = w;
    } else {
      line = line ? `${line} ${atom}` : atom;
      width = line === atom ? w : width + 1 + w;
    }
  }
  if (line) lines.push(line);

  // Close what a line leaves open and reopen it on the next.
  let carry: string[] = [];
  return lines.map((l) => {
    const reopened = carry.join("") + l;
    const open = openAt(reopened);
    carry = open;
    return reopened + open.slice().reverse().map(closerOf).join("");
  });
}

/** Words, except that a code span or a link is one unbreakable piece. */
function atomsOf(src: string): string[] {
  const out: string[] = [];
  let cur = "";
  let i = 0;
  while (i < src.length) {
    if (src[i] === "`") {
      const end = src.indexOf("`", i + 1);
      const take = end < 0 ? src.length : end + 1;
      cur += src.slice(i, take);
      i = take;
      continue;
    }
    if (src[i] === "[") {
      const m = LINK.exec(src.slice(i));
      if (m) {
        cur += m[0];
        i += m[0].length;
        continue;
      }
    }
    if (src[i] === " ") {
      if (cur) out.push(cur);
      cur = "";
      i++;
      continue;
    }
    cur += src[i];
    i++;
  }
  if (cur) out.push(cur);
  return out;
}

export type LineStyle = "h1" | "h2" | "h3" | "quote" | "rule";

/**
 * A markdown document laid out as transcript lines for the scrolling views:
 * glyphs in the key column, inline markdown in the text, a style for the
 * few block kinds the renderer must draw differently.
 */
export function toLines(src: string, cols: number): Line[] {
  const out: Line[] = [];
  const md = (text: string, color: string, k = "", kcolor = "var(--accent)", style?: LineStyle): Line => ({
    ...L(text, color, k, kcolor),
    md: true,
    ...(style ? { style } : {}),
  });
  const width = Math.max(8, cols);
  for (const b of parseBlocks(src)) {
    switch (b.t) {
      case "h": {
        const mark = "#".repeat(b.level) + " ";
        const style = (`h${b.level}` as LineStyle);
        for (const [i, l] of wrapInline(b.text, width - mark.length).entries()) {
          out.push(md(l, "var(--fg)", i === 0 ? mark : " ".repeat(mark.length), "var(--faint)", style));
        }
        if (b.level === 1) out.push({ ...L("━".repeat(width), "var(--hair)"), style: "rule" });
        break;
      }
      case "hr":
        out.push({ ...L("─".repeat(width), "var(--faint)"), style: "rule" });
        break;
      case "quote":
        for (const q of b.lines) {
          for (const l of wrapInline(q, width - 2)) out.push(md(l, "var(--dim)", "▎ ", "var(--accent)", "quote"));
        }
        break;
      case "list":
        for (const it of b.items) {
          const indent = "  ".repeat(it.level);
          const glyph = b.ordered ? `${it.n}.`.padStart(3) + " " : it.level > 0 ? "◦ " : "• ";
          const kcolor = it.level > 0 && !b.ordered ? "var(--dim)" : "var(--accent)";
          const lines = wrapInline(it.text, width - indent.length - glyph.length);
          for (const [i, l] of lines.entries()) {
            out.push(md(l, it.level > 0 ? "var(--dim)" : "var(--fg)", indent + (i === 0 ? glyph : " ".repeat(glyph.length)), kcolor));
          }
        }
        break;
      case "p":
        for (const p of b.lines) for (const l of wrapInline(p, width)) out.push(md(l, "var(--dim)"));
        break;
    }
    out.push(L(""));
  }
  return out;
}
