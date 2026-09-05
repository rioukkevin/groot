import { parseInline } from "@/lib/terminal/markdown";

import type { Inline } from "@/lib/terminal/markdown";
import type { ReactNode } from "react";

/**
 * One line of markdown, inline markup only: bold, italic, code, strike,
 * links and highlights. Block syntax is left as written — a `#` at the
 * start of a role title is a `#`. This is the renderer for summaries, list
 * rows and titles; documents go through `Markdown`.
 */
export function InlineMarkdown({ text }: { text: string }): ReactNode {
  return render(parseInline(text));
}

/** A highlight's tint from the theme, the accent unless named otherwise. */
export const hlStyle = (color: string) => ({
  background: `color-mix(in oklab, var(--${color}) 22%, transparent)`,
  color: "var(--fg)",
  fontWeight: 500,
  padding: "0 2px",
});

export function render(nodes: Inline[]): ReactNode {
  return nodes.map((n, i) => {
    switch (n.t) {
      case "text":
        return n.s;
      case "code":
        return (
          <span key={i} style={{ background: "var(--echo)", color: "var(--accent2)", padding: "0 4px" }}>
            {n.s}
          </span>
        );
      case "b":
        return (
          <span key={i} style={{ fontWeight: 700, color: "color-mix(in oklab, var(--fg) 85%, white)" }}>
            {render(n.c)}
          </span>
        );
      case "i":
        return (
          <span key={i} style={{ fontStyle: "italic", color: "var(--dim)" }}>
            {render(n.c)}
          </span>
        );
      case "s":
        return (
          <span key={i} style={{ textDecoration: "line-through", color: "var(--faint)" }}>
            {render(n.c)}
          </span>
        );
      case "hl":
        return (
          <mark key={i} style={hlStyle(n.color)}>
            {render(n.c)}
          </mark>
        );
      case "a":
        return (
          <a key={i} href={n.href} target="_blank" rel="noopener noreferrer">
            {render(n.c)}
          </a>
        );
    }
  });
}
