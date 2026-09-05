import { HL_STYLE } from "@/lib/terminal/highlight";

import { InlineMarkdown } from "../markdown/InlineMarkdown";

import type { Line } from "@/lib/terminal/types";
import type React from "react";


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

export function LinesBlock({ lines }: { lines: Line[] }) {
  return (
    <div className="mb-[10px] pl-5">
      {lines.map((l, i) => (
        <div
          key={i}
          className="min-h-[1.5em] whitespace-pre"
          style={l.hl ? { ...HL_STYLE } : lineStyle(l)}
        >
          <span style={{ color: l.hl ? "var(--accent)" : l.kcolor, fontWeight: 400, fontStyle: "normal" }}>{l.k}</span>
          <InlineMarkdown text={l.text} />
        </div>
      ))}
    </div>
  );
}
