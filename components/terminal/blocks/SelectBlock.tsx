"use client";

import { useEffect, useRef } from "react";

import { HL_STYLE } from "@/lib/terminal/highlight";

import type { ShellContent } from "@/lib/terminal/shell-content";
import type { SelectItem } from "@/lib/terminal/types";

interface SelectBlockProps {
  header: string;
  sep: string;
  hint: string;
  items: SelectItem[];
  /** Only the newest select block responds to the arrow keys. */
  live: boolean;
  /** An answer from an earlier turn: read-only, no claim, no hint to click. */
  frozen?: boolean;
  selIdx: number;
  onHover: (i: number) => void;
  onPick: (i: number, cmd: string) => void;
  /** Called when the user clicks the list, to take the arrow keys back. */
  onClaim: () => void;
  content: ShellContent;
}

export function SelectBlock({
  header,
  sep,
  hint,
  items,
  live,
  frozen = false,
  selIdx,
  onHover,
  onPick,
  onClaim,
  content,
}: SelectBlockProps) {
  const idx = Math.min(selIdx, items.length - 1);
  const activeRow = useRef<HTMLButtonElement>(null);

  // UX addition: keep the highlighted row in view as the selection moves.
  // `nearest` scrolls only when the row is actually outside the viewport, so a
  // selection that is already visible never jolts the transcript.
  useEffect(() => {
    if (!live) return;
    activeRow.current?.scrollIntoView({ block: "nearest" });
  }, [live, idx]);

  return (
    <div className="mb-[10px] pl-5" onClick={onClaim}>
      <div className="whitespace-pre" style={{ color: "var(--faint)" }}>
        {header}
      </div>
      <div className="whitespace-pre" style={{ color: "var(--faint)" }}>
        {sep}
      </div>
      <div role="listbox" aria-label="results">
        {items.map((it, i) => {
          const on = live && i === idx;
          return (
            <button
              key={it.key}
              ref={on ? activeRow : null}
              role="option"
              aria-selected={on}
              className="block whitespace-pre"
              style={
                it.hl && !on
                  ? HL_STYLE
                  : {
                      background: on
                        ? "color-mix(in oklab, var(--accent) 15%, transparent)"
                        : "transparent",
                      color: it.color,
                    }
              }
              onClick={() => onPick(i, it.cmd)}
              onMouseEnter={() => onHover(i)}
            >
              <span style={{ color: "var(--accent)" }}>{on ? "❯ " : "  "}</span>
              <span style={{ color: it.kcolor }}>{it.k}</span>
              {it.text}
            </button>
          );
        })}
      </div>
      <div
        className="whitespace-pre pt-1"
        style={{ color: "var(--faint)" }}
      >
        {live
          ? hint
          : "  " + (frozen ? content.s("hint.past", "earlier answer · read-only") : content.s("hint.listReleased", "↑↓ released · click a row to open"))}
      </div>
    </div>
  );
}
