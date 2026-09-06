"use client";

import { useRef } from "react";

import { EdgePhoto } from "./EdgePhoto";
import { ImageSpotlight, spotlightStrings } from "./ImageSpotlight";

import type { ShellContent } from "@/lib/terminal/shell-content";
import type { CarouselSlide } from "@/lib/terminal/types";

interface CarouselProps {
  /** An answer from an earlier turn: read-only, its hint says so. */
  frozen?: boolean;
  title: string;
  slides: CarouselSlide[];
  /** True when this carousel owns the arrow keys. */
  live: boolean;
  index: number;
  onIndexChange: (index: number) => void;
  /** Called when the user clicks the carousel, to take the arrow keys back. */
  onClaim: () => void;
  /** Bumped by the shell to open the current slide full screen from a key. */
  openSignal?: number;
  content: ShellContent;
}

/**
 * One slide at a time, driven by ←/→ while live. A slide is either a rendered
 * photo or a run of text, so a whole project can occupy a slide rather than
 * just an image.
 */
export function Carousel({
  title,
  slides,
  live,
  frozen = false,
  index,
  onIndexChange,
  onClaim,
  openSignal = 0,
  content,
}: CarouselProps) {
  // A swipe steps the carousel: the start is remembered, the end decides.
  const touch = useRef<{ x: number; y: number } | null>(null);
  if (!slides.length) return null;
  const i = Math.min(Math.max(0, index), slides.length - 1);
  const slide = slides[i];
  const step = (d: number) =>
    onIndexChange((i + d + slides.length) % slides.length);

  return (
    <div
      className="mb-3 pl-5"
      onClick={onClaim}
      onTouchStart={(e) => {
        touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }}
      onTouchEnd={(e) => {
        const from = touch.current;
        touch.current = null;
        if (!from) return;
        const dx = e.changedTouches[0].clientX - from.x;
        const dy = e.changedTouches[0].clientY - from.y;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
      }}
    >
      <div className="whitespace-pre" style={{ color: "var(--faint)" }}>
        {`  ${title}`}
      </div>

      <div className="flex items-center gap-3">
        <button
          aria-label="previous slide"
          className="tap flex-none px-1"
          style={{ color: live ? "var(--accent)" : "var(--faint)" }}
          onClick={() => step(-1)}
        >
          ‹
        </button>

        <div className="min-w-0 flex-1">
          {slide.kind === "shot" ? (
            <div className="flex justify-center" style={{ color: "var(--accent)" }}>
              <ImageSpotlight
                key={slide.key}
                src={slide.shot.src}
                caption={slide.shot.caption}
                openSignal={openSignal}
                strings={spotlightStrings(content)}
              >
                <EdgePhoto
                  src={slide.shot.src}
                  width={slide.shot.w}
                  height={slide.shot.h}
                  cellW={slide.shot.cellW}
                  cellH={slide.shot.cellH}
                  gap={slide.shot.gap}
                  label={slide.shot.label}
                  caption={slide.shot.caption}
                />
              </ImageSpotlight>
            </div>
          ) : (
            <div className="whitespace-pre">
              {slide.lines.map((l, n) => (
                <div key={n} className="min-h-[1.5em]" style={{ color: l.color }}>
                  <span style={{ color: l.kcolor }}>{l.k}</span>
                  {l.text}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          aria-label="next slide"
          className="tap flex-none px-1"
          style={{ color: live ? "var(--accent)" : "var(--faint)" }}
          onClick={() => step(1)}
        >
          ›
        </button>
      </div>

      <div className="flex flex-col items-center gap-0.5 pt-1">
        <div className="flex items-center gap-2 whitespace-pre">
          <span aria-hidden="true">
            {slides.map((s, n) => (
              <span
                key={s.key}
                style={{ color: n === i ? "var(--accent)" : "var(--hair)" }}
              >
                {n === i ? "●" : "○"}
              </span>
            ))}
          </span>
          <span style={{ color: "var(--dim)" }}>
            {`${i + 1}/${slides.length} · ${slide.label}`}
          </span>
        </div>
        <div
          className="max-w-full truncate text-center"
          style={{ color: "var(--faint)" }}
        >
          {live
            ? content.s("hint.carousel", "←→ move · ↵ open full screen · esc release")
            : frozen
              ? content.s("hint.past", "earlier answer · read-only")
              : content.s("hint.released", "released · click to take the keyboard back")}
        </div>
      </div>
    </div>
  );
}
