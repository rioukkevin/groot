import { parseBlocks } from "@/lib/terminal/markdown";

import { InlineMarkdown } from "./InlineMarkdown";

/** A rule drawn in characters, clipped to the width it gets. */
const RULE = "━".repeat(240);
const THIN = "─".repeat(240);

/**
 * A markdown document as the terminal shows it: `#` marks dimmed beside
 * bold titles, a heavy rule under the first heading, `▎` before a quote,
 * `•`/`◦` bullets and accent numbers, a thin rule for `---`. Free layout,
 * for say blocks and the crawler document; the scrolling write-up pane
 * lays the same blocks out as lines with `toLines()`.
 */
export function Markdown({ text }: { text: string }) {
  const blocks = parseBlocks(text);
  return (
    <div className="flex flex-col">
      {blocks.map((b, i) => {
        switch (b.t) {
          case "h": {
            const mark = "#".repeat(b.level);
            const title =
              b.level === 1
                ? { color: "var(--accent)", fontWeight: 700 }
                : b.level === 2
                  ? { color: "color-mix(in oklab, var(--fg) 85%, white)", fontWeight: 700 }
                  : { color: "var(--fg)", fontWeight: 500 };
            return (
              <div key={i} className={i === 0 ? "" : "mt-1"}>
                <div className="flex items-baseline gap-2">
                  <span style={{ color: "var(--faint)" }}>{mark}</span>
                  <span style={title}>
                    <InlineMarkdown text={b.text} />
                  </span>
                </div>
                {b.level === 1 ? (
                  <div className="mb-[10px] mt-0.5 overflow-hidden whitespace-pre" style={{ color: "var(--hair)" }}>
                    {RULE}
                  </div>
                ) : (
                  <div className="h-1.5" />
                )}
              </div>
            );
          }
          case "hr":
            return (
              <div key={i} className="my-1 mb-[10px] overflow-hidden whitespace-pre" style={{ color: "var(--faint)" }}>
                {THIN}
              </div>
            );
          case "quote":
            return (
              <div key={i} className="mb-[10px] flex gap-2.5">
                <span className="flex-none" style={{ color: "var(--accent)" }}>
                  ▎
                </span>
                <div className="min-w-0 whitespace-pre-wrap" style={{ color: "var(--dim)", fontStyle: "italic" }}>
                  {b.lines.map((l, j) => (
                    <div key={j}>
                      <InlineMarkdown text={l} />
                    </div>
                  ))}
                </div>
              </div>
            );
          case "list":
            return (
              <div key={i} className="mb-[10px] flex flex-col">
                {b.items.map((it, j) => (
                  <div key={j} className="flex gap-2" style={{ paddingLeft: it.level * 20 }}>
                    <span
                      className="flex-none whitespace-pre"
                      style={{
                        color: it.level > 0 && !b.ordered ? "var(--dim)" : "var(--accent)",
                        minWidth: b.ordered ? 20 : 12,
                        textAlign: b.ordered ? "right" : "left",
                      }}
                    >
                      {b.ordered ? `${it.n}.` : it.level > 0 ? "◦" : "•"}
                    </span>
                    <span className="min-w-0 whitespace-pre-wrap" style={{ color: it.level > 0 ? "var(--dim)" : "var(--fg)" }}>
                      <InlineMarkdown text={it.text} />
                    </span>
                  </div>
                ))}
              </div>
            );
          case "p":
            return (
              <p key={i} className="mb-[10px] whitespace-pre-wrap">
                {b.lines.map((l, j) => (
                  <span key={j}>
                    {j > 0 && "\n"}
                    <InlineMarkdown text={l} />
                  </span>
                ))}
              </p>
            );
        }
      })}
    </div>
  );
}
