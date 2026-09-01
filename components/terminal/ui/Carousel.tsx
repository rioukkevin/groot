"use client";

import { ShaderPhoto } from "../ShaderPhoto";
import { ImageSpotlight } from "./ImageSpotlight";

import type { CarouselSlide } from "@/lib/terminal/types";

interface CarouselProps {
  title: string;
  slides: CarouselSlide[];
  /** True when this carousel owns the arrow keys. */
  live: boolean;
  index: number;
  onIndexChange: (index: number) => void;
  /** Called when the user clicks the carousel, to take the arrow keys back. */
  onClaim: () => void;
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
  index,
  onIndexChange,
  onClaim,
}: CarouselProps) {
  if (!slides.length) return null;
  const i = Math.min(Math.max(0, index), slides.length - 1);
  const slide = slides[i];
  const step = (d: number) =>
    onIndexChange((i + d + slides.length) % slides.length);

  return (
    <div className="mb-3 pl-5" onClick={onClaim}>
      <div className="whitespace-pre" style={{ color: "var(--faint)" }}>
        {`  ${title}`}
      </div>

      <div className="flex items-center gap-3">
        <button
          aria-label="previous slide"
          className="flex-none px-1"
          style={{ color: live ? "var(--accent)" : "var(--faint)" }}
          onClick={() => step(-1)}
        >
          ‹
        </button>

        <div className="min-w-0 flex-1">
          {slide.kind === "shot" ? (
            <div style={{ color: "var(--accent)" }}>
              <ImageSpotlight
                key={slide.key}
                src={slide.shot.src}
                caption={slide.shot.caption}
                className="[&_canvas]:cursor-zoom-in"
              >
                <ShaderPhoto
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
          className="flex-none px-1"
          style={{ color: live ? "var(--accent)" : "var(--faint)" }}
          onClick={() => step(1)}
        >
          ›
        </button>
      </div>

      <div className="flex gap-2 whitespace-pre pt-1">
        <span style={{ color: "var(--faint)" }}>{"  "}</span>
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
        <span style={{ color: "var(--dim)" }}>{slide.label}</span>
        <span style={{ color: "var(--faint)" }}>
          {live
            ? `· ←→ move · ${i + 1}/${slides.length} · esc release`
            : `· ←→ released · ${i + 1}/${slides.length} · click to take the arrows`}
        </span>
      </div>
    </div>
  );
}
