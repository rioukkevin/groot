"use client";

import { useEffect, useRef } from "react";

import type { SelectItem } from "@/lib/terminal/types";

interface SelectBlockProps {
  header: string;
  sep: string;
  hint: string;
  items: SelectItem[];
  /** Only the newest select block responds to the arrow keys. */
  live: boolean;
  selIdx: number;
  onHover: (i: number) => void;
  onPick: (i: number, cmd: string) => void;
}

export function SelectBlock({
  header,
  sep,
  hint,
  items,
  live,
  selIdx,
  onHover,
  onPick,
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
    <div className="mb-[10px] pl-5">
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
              style={{
                background: on
                  ? "color-mix(in oklab, var(--accent) 15%, transparent)"
                  : "transparent",
                color: it.color,
              }}
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
        {live ? hint : "  ↑↓ released · click a row to open"}
      </div>
    </div>
  );
}
