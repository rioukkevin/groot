import { GlyphRain } from "../GlyphRain";
import { Markdown } from "../markdown/Markdown";

import type { GlyphAside } from "@/lib/terminal/types";

/**
 * What the shell says, streamed. The text is markdown — the answer layer's
 * ⟦fact⟧ marks included — and is rendered as it arrives: an opener with no
 * closer yet applies to the end, so nothing flickers between raw and styled.
 */
export function SayBlock({ full, n, aside }: { full: string; n: number; aside?: GlyphAside }) {
  const shown = full.slice(0, n);
  const caret = n < full.length ? "▏" : "";
  const text = (
    <span className="min-w-0 flex-1 [&>div>:last-child]:mb-0">
      <Markdown text={shown} />
      <span style={{ color: "var(--accent)" }}>{caret}</span>
    </span>
  );
  return (
    <div className="mb-[10px] flex gap-2">
      <span className="flex-none" style={{ color: "var(--accent)" }}>
        ⏺
      </span>
      {aside ? (
        // The portrait sits right of the words on a wide screen and above
        // them on a phone, where a column is all there is.
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:gap-6">
          <div className="flex-none self-center sm:order-last sm:self-start" style={{ color: "var(--accent)" }}>
            <GlyphRain
              src={aside.src}
              width={aside.width}
              height={aside.height}
              mode={aside.mode}
              cell={aside.cell}
              saturation={aside.saturation}
              brightness={aside.brightness}
              contrast={aside.contrast}
              twinkle={aside.twinkle}
              speed={aside.speed}
              loop={aside.loop}
              label={aside.alt}
            />
          </div>
          {text}
        </div>
      ) : (
        text
      )}
    </div>
  );
}
