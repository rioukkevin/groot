"use client";

import { useEffect, useRef } from "react";

interface PaletteProps {
  items: ReadonlyArray<readonly [string, string]>;
  idx: number;
  onPick: (cmd: string) => void;
  onHover: (i: number) => void;
}

export function Palette({ items, idx, onPick, onHover }: PaletteProps) {
  const activeRow = useRef<HTMLButtonElement>(null);

  // UX addition: the list is capped at 200px and scrolls, so the highlighted
  // command has to follow the arrow keys or it walks off the visible area.
  useEffect(() => {
    activeRow.current?.scrollIntoView({ block: "nearest" });
  }, [idx]);

  return (
    <div
      className="max-h-[200px] flex-none overflow-y-auto border-t"
      style={{ borderTopColor: "var(--hair)" }}
      role="listbox"
      aria-label="commands"
    >
      {items.map((p, i) => {
        const on = i === idx;
        return (
          <button
            key={p[0]}
            ref={on ? activeRow : null}
            role="option"
            aria-selected={on}
            className="box-border flex w-full gap-3 px-4 py-px"
            style={{ background: on ? "var(--accent)" : "transparent" }}
            onClick={() => onPick(p[0])}
            onMouseEnter={() => onHover(i)}
          >
            <span
              className="w-[110px] flex-none"
              style={{ color: on ? "var(--bg)" : "var(--accent)" }}
            >
              {p[0]}
            </span>
            <span
              className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
              style={{ color: on ? "var(--bg)" : "var(--dim)" }}
            >
              {p[1]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
