"use client";

import { useEffect, useRef } from "react";

import type { ChoiceOption } from "@/lib/terminal/contact";

interface CardGridProps {
  options: readonly ChoiceOption[];
  perRow: number;
  index: number;
  /** True when the grid owns the keyboard. */
  live: boolean;
  onPick: (index: number) => void;
}

/** Inner width of a card, in characters. Titles and hints are padded to it. */
const INNER = 28;

const pad = (s: string, n: number) =>
  s.length > n ? s.slice(0, Math.max(1, n - 1)) + "…" : s + " ".repeat(n - s.length);

/**
 * A grid of selectable cards — the terminal reading of a card picker: a sigil,
 * a title and a muted hint, framed in box-drawing characters, with the current
 * card lit by border, tint and cursor rather than by a mouse hover.
 *
 * The frame is drawn as literal characters rather than CSS borders so it sits
 * on the same character grid as everything else in the transcript.
 */
export function CardGrid({
  options,
  perRow,
  index,
  live,
  onPick,
}: CardGridProps) {
  const activeCard = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!live) return;
    activeCard.current?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [live, index]);

  const top = "┌" + "─".repeat(INNER + 2) + "┐";
  const bottom = "└" + "─".repeat(INNER + 2) + "┘";

  return (
    <div
      className="overflow-x-auto py-1"
      style={{ maxWidth: "100%" }}
      role="listbox"
      aria-label="options"
    >
      <div
        className="grid gap-x-2"
        style={{
          gridTemplateColumns: `repeat(${perRow}, max-content)`,
          width: "max-content",
        }}
      >
        {options.map((opt, i) => {
          const on = live && i === index;
          const border = on ? "var(--accent)" : "var(--hair)";
          const body = on ? "var(--fg)" : "var(--dim)";
          return (
            <button
              key={opt.value}
              ref={on ? activeCard : null}
              role="option"
              aria-selected={on}
              className="block whitespace-pre text-left"
              style={{
                background: on
                  ? "color-mix(in oklab, var(--accent) 12%, transparent)"
                  : "transparent",
              }}
              onClick={() => onPick(i)}
            >
              <div style={{ color: border }}>{top}</div>
              <div>
                <span style={{ color: border }}>│ </span>
                <span style={{ color: on ? "var(--accent)" : "var(--faint)" }}>
                  {pad(opt.icon, INNER)}
                </span>
                <span style={{ color: border }}> │</span>
              </div>
              <div>
                <span style={{ color: border }}>│ </span>
                <span style={{ color: body, fontWeight: on ? 500 : 400 }}>
                  {pad((on ? "❯ " : "  ") + opt.label, INNER)}
                </span>
                <span style={{ color: border }}> │</span>
              </div>
              <div>
                <span style={{ color: border }}>│ </span>
                <span style={{ color: "var(--faint)" }}>
                  {pad("  " + (opt.hint ?? ""), INNER)}
                </span>
                <span style={{ color: border }}> │</span>
              </div>
              <div style={{ color: border }}>{bottom}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
