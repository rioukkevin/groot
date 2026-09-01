"use client";

import { Carousel } from "./Carousel";
import { ScrollView } from "./ScrollView";

import type { CarouselSlide, Line } from "@/lib/terminal/types";

interface ProjectViewProps {
  title: string;
  slides: CarouselSlide[];
  lines: Line[];
  rows: number;
  /** True when this block owns the keyboard. */
  live: boolean;
  slide: number;
  offset: number;
  onSlide: (i: number) => void;
  onOffset: (i: number) => void;
  onClaim: () => void;
}

/**
 * A project: its screenshots beside its write-up.
 *
 * Side by side from `lg` up, stacked below it — carousel first either way, so
 * the pictures lead. The two panes never compete for the keyboard: ←→ drives
 * the carousel and ↑↓ the scroll box, both live at once, so there is no
 * sub-focus to explain.
 */
export function ProjectView({
  title,
  slides,
  lines,
  rows,
  live,
  slide,
  offset,
  onSlide,
  onOffset,
  onClaim,
}: ProjectViewProps) {
  const hasShots = slides.length > 0;

  return (
    <div className="mb-3" onClick={onClaim}>
      <div className="flex flex-col gap-x-6 gap-y-2 lg:flex-row lg:items-start">
        {hasShots && (
          <div className="min-w-0 flex-none">
            <Carousel
              title={title}
              slides={slides}
              live={live}
              index={slide}
              onIndexChange={onSlide}
              onClaim={onClaim}
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <ScrollView
            title={hasShots ? "WRITE-UP · ↑↓ pgup/pgdn" : title}
            lines={lines}
            rows={rows}
            live={live}
            offset={offset}
            onOffsetChange={onOffset}
            onClaim={onClaim}
          />
        </div>
      </div>
      {hasShots && (
        <div className="whitespace-pre pl-5" style={{ color: "var(--faint)" }}>
          {live
            ? "  ←→ screenshots · ↑↓ write-up · click a shot to open it full screen"
            : "  released · click to take the keyboard back"}
        </div>
      )}
    </div>
  );
}
