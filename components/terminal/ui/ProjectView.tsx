"use client";

import { useEffect, useRef, useState } from "react";

import { L, wrap } from "@/lib/terminal/format";

import { Carousel } from "./Carousel";
import { ScrollView } from "./ScrollView";

import type { ShellContent } from "@/lib/terminal/shell-content";
import type { CarouselSlide, Line } from "@/lib/terminal/types";

interface ProjectViewProps {
  /** An answer from an earlier turn: read-only, its hint says so. */
  frozen?: boolean;
  title: string;
  slides: CarouselSlide[];
  meta: Line[];
  paragraphs: string[];
  rows: number;
  /** True when this block owns the keyboard. */
  live: boolean;
  slide: number;
  offset: number;
  onSlide: (i: number) => void;
  onOffset: (i: number) => void;
  onClaim: () => void;
  content: ShellContent;
  /** Forwarded to the carousel: opens the current shot full screen. */
  openSignal?: number;
}

/** Carousel column width. Fixed, so the write-up gets everything else. */
const SHOT_W = 320;
/** Narrowest the prose is allowed to get before it stops being readable. */
const MIN_COLS = 34;

/**
 * A project: its screenshots beside its write-up.
 *
 * The carousel is a fixed column and the write-up takes the rest, re-wrapping
 * to whatever width it actually gets — measured, not assumed, so the prose
 * fills a wide screen instead of sitting in a 62-column ribbon with empty
 * space beside it.
 *
 * The two panes never compete for the keyboard: ←→ drives the carousel and ↑↓
 * the scroll box, both live at once, so there is no sub-focus to explain.
 */
export function ProjectView({
  title,
  slides,
  meta,
  paragraphs,
  rows,
  live,
  frozen = false,
  slide,
  offset,
  onSlide,
  onOffset,
  onClaim,
  openSignal = 0,
  content,
}: ProjectViewProps) {
  const hasShots = slides.length > 0;
  const paneRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(62);

  // Measure the pane in characters, from a probe in the same font.
  useEffect(() => {
    const pane = paneRef.current;
    if (!pane) return;

    const probe = document.createElement("span");
    probe.style.cssText =
      "position:absolute;visibility:hidden;white-space:pre;pointer-events:none";
    probe.textContent = "0".repeat(40);
    pane.appendChild(probe);

    const measure = () => {
      const cw = probe.getBoundingClientRect().width / 40;
      // Two characters of gutter for the scrollbar column.
      const usable = pane.clientWidth - cw * 3;
      if (cw > 2 && usable > 0) {
        const next = Math.max(MIN_COLS, Math.floor(usable / cw));
        setCols((prev) => (prev === next ? prev : next));
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(pane);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      ro.disconnect();
      probe.remove();
    };
  }, []);

  const lines: Line[] = [
    ...meta,
    ...paragraphs.flatMap((para) => [
      ...wrap(para, cols).map((l) => L(l, "var(--dim)")),
      L(""),
    ]),
  ];

  return (
    <div className="mb-3" onClick={onClaim}>
      <div className="flex flex-col gap-x-6 gap-y-2 lg:flex-row lg:items-start">
        {hasShots && (
          <div className="flex-none" style={{ width: SHOT_W }}>
            <Carousel
              title={title}
              slides={slides}
              live={live}
              frozen={frozen}
              index={slide}
              onIndexChange={onSlide}
              onClaim={onClaim}
              openSignal={openSignal}
              content={content}
            />
          </div>
        )}
        <div ref={paneRef} className="min-w-0 flex-1">
          <ScrollView
            title={hasShots ? content.s("label.writeUp", "WRITE-UP · ↑↓ pgup/pgdn") : title}
            lines={lines}
            rows={rows}
            live={live}
            frozen={frozen}
            offset={offset}
            onOffsetChange={onOffset}
            onClaim={onClaim}
            content={content}
          />
        </div>
      </div>
      {hasShots && (
        <div className="whitespace-pre pl-5" style={{ color: "var(--faint)" }}>
          {live
            ? "  " + content.s("hint.project", "←→ screenshots · ↑↓ write-up · ↵ open full screen")
            : "  " + (frozen ? content.s("hint.past", "earlier answer · read-only") : content.s("hint.released", "released · click to take the keyboard back"))}
        </div>
      )}
    </div>
  );
}
