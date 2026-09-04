import { HL_CLOSE, HL_OPEN } from "@/lib/terminal/highlight";

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

export function SayBlock({ full, n }: { full: string; n: number }) {
  const shown = full.slice(0, n);
  const caret = n < full.length ? "▏" : "";
  return (
    <div className="mb-[10px] flex gap-2">
      <span className="flex-none" style={{ color: "var(--accent)" }}>
        ⏺
      </span>
      <span className="min-w-0 whitespace-pre-wrap">
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
    </div>
  );
}
