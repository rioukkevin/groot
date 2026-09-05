import { HL_STYLE } from "@/lib/terminal/highlight";

import { InlineText } from "../ui/InlineText";

import type { Line } from "@/lib/terminal/types";

export function LinesBlock({ lines }: { lines: Line[] }) {
  return (
    <div className="mb-[10px] pl-5">
      {lines.map((l, i) => (
        <div
          key={i}
          className="min-h-[1.5em] whitespace-pre"
          style={l.hl ? { ...HL_STYLE } : { color: l.color }}
        >
          <span style={{ color: l.hl ? "var(--accent)" : l.kcolor }}>{l.k}</span>
          <InlineText text={l.text} />
        </div>
      ))}
    </div>
  );
}
