import { wrap } from "@/lib/terminal/format";
import { HL_STYLE } from "@/lib/terminal/highlight";

import type { RateCard, RateNote } from "@/lib/terminal/types";

interface CardsBlockProps {
  cards: RateCard[];
  notes: RateNote[];
  /** Width of one card, in characters. The command sizes it to the pane. */
  width: number;
}

/**
 * Rates as cards: a title in the top edge, the price in bold, what it covers
 * underneath. Cards sit side by side while the pane is wide enough and fall
 * under one another when it is not — the command picks the width, the flex
 * wrap does the rest. The frames are box-drawing characters so the cards sit
 * on the same character grid as everything around them.
 */
export function CardsBlock({ cards, notes, width }: CardsBlockProps) {
  const inner = Math.max(8, width - 4);
  const fit = (s: string) =>
    s.length > inner ? s.slice(0, inner - 1) + "…" : s + " ".repeat(inner - s.length);
  const bodies = cards.map((c) => wrap(c.text, inner));
  const rows = Math.max(1, ...bodies.map((b) => b.length));

  return (
    <div className="mb-[10px] pl-5">
      <div className="flex flex-wrap gap-x-[1ch] gap-y-2">
        {cards.map((c, i) => {
          const border = c.hl ? "var(--accent)" : "var(--faint)";
          const title = " " + (c.title.length > inner - 2 ? c.title.slice(0, inner - 3) + "…" : c.title) + " ";
          const edge = (s: string) => <span style={{ color: border }}>{s}</span>;
          return (
            <div key={i} className="whitespace-pre" style={c.hl ? { ...HL_STYLE } : undefined}>
              <div>
                {edge("┌─")}
                <span style={{ color: "var(--accent)" }}>{title}</span>
                {edge("─".repeat(Math.max(0, width - 3 - title.length)) + "┐")}
              </div>
              <div>
                {edge("│ ")}
                <span style={{ color: "var(--fg)", fontWeight: 700 }}>{fit(c.value)}</span>
                {edge(" │")}
              </div>
              <div>{edge("│ " + " ".repeat(inner) + " │")}</div>
              {Array.from({ length: rows }).map((_, r) => (
                <div key={r}>
                  {edge("│ ")}
                  <span style={{ color: c.hl ? "var(--fg)" : "var(--dim)" }}>{fit(bodies[i][r] ?? "")}</span>
                  {edge(" │")}
                </div>
              ))}
              <div>{edge("└" + "─".repeat(width - 2) + "┘")}</div>
            </div>
          );
        })}
      </div>
      {notes.map((n, i) => (
        <div key={i} className="whitespace-pre-wrap pt-2" style={n.hl ? { ...HL_STYLE } : undefined}>
          <span style={{ color: "var(--accent)" }}>{"  " + n.title}</span>
          <span style={{ color: n.hl ? "var(--fg)" : "var(--dim)" }}>{" · " + n.text}</span>
        </div>
      ))}
    </div>
  );
}
