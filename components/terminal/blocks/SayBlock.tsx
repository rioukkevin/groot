import { HL_CLOSE, HL_OPEN } from "@/lib/terminal/highlight";

import { GlyphRain } from "../GlyphRain";

import type { GlyphAside } from "@/lib/terminal/types";

/**
 * The claimed fact inside an answer is wrapped in ⟦ ⟧ by the answer layer;
 * here it becomes a lit span. The markers are never shown.
 */
function segments(shown: string): { text: string; hl: boolean }[] {
  const out: { text: string; hl: boolean }[] = [];
  let hl = false;
  let buf = "";
  for (const ch of shown) {
    if (ch === HL_OPEN || ch === HL_CLOSE) {
      if (buf) out.push({ text: buf, hl });
      buf = "";
      hl = ch === HL_OPEN;
      continue;
    }
    buf += ch;
  }
  if (buf) out.push({ text: buf, hl });
  return out;
}

export function SayBlock({ full, n, aside }: { full: string; n: number; aside?: GlyphAside }) {
  const shown = full.slice(0, n);
  const caret = n < full.length ? "▏" : "";
  const text = (
    <span className="min-w-0 flex-1 whitespace-pre-wrap">
        {segments(shown).map((s, i) =>
          s.hl ? (
            <mark
              key={i}
              style={{
                background: "color-mix(in oklab, var(--accent) 22%, transparent)",
                color: "var(--fg)",
                fontWeight: 500,
                padding: "0 2px",
              }}
            >
              {s.text}
            </mark>
          ) : (
            <span key={i}>{s.text}</span>
          ),
        )}
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
