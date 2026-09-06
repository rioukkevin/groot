"use client";

import { useEffect, useRef } from "react";

import { HL_STYLE } from "@/lib/terminal/highlight";

import { InlineMarkdown } from "../markdown/InlineMarkdown";

import type { ShellContent } from "@/lib/terminal/shell-content";
import type { Line } from "@/lib/terminal/types";
import type React from "react";

interface ScrollViewProps {
  /** An answer from an earlier turn: read-only, its hint says so. */
  frozen?: boolean;
  title: string;
  lines: Line[];
  /** Height of the viewport, in character rows. */
  rows: number;
  /** True when this view owns the arrow keys. */
  live: boolean;
  /** Index of the first visible line. */
  offset: number;
  onOffsetChange: (offset: number) => void;
  /** Called when the user clicks the view, to take the arrow keys back. */
  onClaim: () => void;
  content: ShellContent;
}

/**
 * A fixed-height window over a long run of lines, with an ASCII scrollbar.
 *
 * Scrolling is expressed in whole lines rather than pixels so the viewport can
 * never come to rest half-way through a row and break the character grid. The
 * arrow keys are handled by the shell, which owns key routing; this component
 * renders the resulting offset and keeps the wheel and the keys in sync.
 */

/** How a block-level line looks, on top of its colour. */
function lineStyle(l: Line): React.CSSProperties {
  switch (l.style) {
    case "h1":
      return { color: "var(--accent)", fontWeight: 700 };
    case "h2":
      return { color: "color-mix(in oklab, var(--fg) 85%, white)", fontWeight: 700 };
    case "h3":
      return { color: "var(--fg)", fontWeight: 500 };
    case "quote":
      return { color: "var(--dim)", fontStyle: "italic" };
    default:
      return { color: l.color };
  }
}

export function ScrollView({
  title,
  lines,
  rows,
  live,
  frozen = false,
  offset,
  onOffsetChange,
  onClaim,
  content,
}: ScrollViewProps) {
  const maxOffset = Math.max(0, lines.length - rows);
  const clamped = Math.min(Math.max(0, offset), maxOffset);
  const visible = lines.slice(clamped, clamped + rows);
  const boxRef = useRef<HTMLDivElement>(null);

  // Wheel scrolls in whole lines, and only while this view holds the arrows,
  // so a stray wheel over an old view cannot move it.
  useEffect(() => {
    const el = boxRef.current;
    if (!el || !live) return;
    const onWheel = (e: WheelEvent) => {
      if (maxOffset === 0) return;
      e.preventDefault();
      const step = e.deltaY > 0 ? 1 : -1;
      onOffsetChange(Math.min(maxOffset, Math.max(0, clamped + step)));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    // A finger drags the lines instead of the page: each line height of
    // travel moves one line, and the leftover carries to the next move.
    let touchY: number | null = null;
    const lineH = () => el.querySelector(".min-h-\\[1\\.5em\\]")?.getBoundingClientRect().height || 20;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchY === null || maxOffset === 0) return;
      const dy = touchY - e.touches[0].clientY;
      const lines = Math.trunc(dy / lineH());
      if (!lines) return;
      e.preventDefault();
      touchY = e.touches[0].clientY;
      onOffsetChange(Math.min(maxOffset, Math.max(0, clamped + lines)));
    };
    const onTouchEnd = () => {
      touchY = null;
    };
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [live, clamped, maxOffset, onOffsetChange]);

  // Scrollbar thumb: at least one cell, positioned proportionally.
  const thumbSize = maxOffset === 0 ? rows : Math.max(1, Math.round((rows / lines.length) * rows));
  const thumbAt =
    maxOffset === 0 ? 0 : Math.round((clamped / maxOffset) * (rows - thumbSize));

  const pct = maxOffset === 0 ? 100 : Math.round((clamped / maxOffset) * 100);

  return (
    <div className="mb-[10px] pl-5" onClick={onClaim}>
      <div className="whitespace-pre" style={{ color: "var(--faint)" }}>
        {`  ${title}`}
      </div>
      <div ref={boxRef} className="flex gap-2">
        <div
          className="min-w-0 flex-1 whitespace-pre-wrap"
          style={{ color: live ? "var(--fg)" : "var(--dim)" }}
        >
          {visible.map((l, i) => (
            <div
              key={clamped + i}
              className="min-h-[1.5em]"
              style={l.hl ? HL_STYLE : lineStyle(l)}
            >
              <span style={{ color: l.hl ? "var(--accent)" : l.kcolor, fontWeight: 400, fontStyle: "normal" }}>{l.k}</span>
              <InlineMarkdown text={l.text} />
            </div>
          ))}
          {/* Hold the box open when the tail is shorter than the viewport. */}
          {Array.from({ length: Math.max(0, rows - visible.length) }).map((_, i) => (
            <div key={`pad-${i}`} className="min-h-[1.5em]">
              {" "}
            </div>
          ))}
        </div>
        <div className="whitespace-pre" aria-hidden="true">
          {Array.from({ length: rows }).map((_, i) => {
            const on = i >= thumbAt && i < thumbAt + thumbSize;
            return (
              <div
                key={i}
                className="min-h-[1.5em]"
                style={{ color: on ? "var(--accent)" : "var(--hair)" }}
              >
                {on ? "▐" : "│"}
              </div>
            );
          })}
        </div>
      </div>
      <div className="whitespace-pre-wrap pt-1" style={{ color: "var(--faint)" }}>
        {live
          ? `  ${content.s("hint.scroll", "↑↓ scroll · pgup/pgdn page")} · ${pct}% · ${content.s("word.escRelease", "esc release")}`
          : `  ${frozen ? content.s("hint.past", "earlier answer · read-only") : content.s("hint.scrollReleased", "↑↓ released · click to take the arrows")} · ${pct}%`}
      </div>
    </div>
  );
}
