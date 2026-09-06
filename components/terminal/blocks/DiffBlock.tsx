import { HL_STYLE } from "@/lib/terminal/highlight";

import type { DiffRow } from "@/lib/terminal/types";

interface DiffBlockProps {
  path: string;
  summary: string;
  rows: DiffRow[];
  footer: string;
}

export function DiffBlock({ path, summary, rows, footer }: DiffBlockProps) {
  return (
    <div className="mb-3">
      <div className="flex gap-2">
        <span className="flex-none" style={{ color: "var(--accent)" }}>
          ⏺
        </span>
        <span>
          <span className="font-medium">Update</span>
          <span style={{ color: "var(--dim)" }}>(</span>
          <span
            className="border-b"
            style={{ color: "var(--accent2)", borderBottomColor: "var(--hair)" }}
          >
            {path}
          </span>
          <span style={{ color: "var(--dim)" }}>)</span>
        </span>
      </div>
      <div className="flex gap-1.5 pb-[3px]" style={{ color: "var(--dim)" }}>
        <span className="flex-none" style={{ color: "var(--faint)" }}>
          ⎿
        </span>
        <span>{summary}</span>
      </div>
      <div className="mx-[-16px]">
        {rows.map((r, i) => {
          const add = r.sign === "+";
          const del = r.sign === "-";
          return (
            <div
              key={i}
              className="flex whitespace-pre-wrap pl-5 pr-4"
              style={
                r.hl
                  ? HL_STYLE
                  : {
                      background: add
                        ? "color-mix(in oklab, var(--add) 40%, var(--bg))"
                        : del
                          ? "color-mix(in oklab, var(--del) 40%, var(--bg))"
                          : "transparent",
                      color: add
                        ? "color-mix(in oklab, var(--add) 78%, var(--fg))"
                        : del
                          ? "color-mix(in oklab, var(--del) 78%, var(--fg))"
                          : "var(--dim)",
                    }
              }
            >
              <span
                className="w-[38px] flex-none text-right"
                style={{
                  color:
                    add || del
                      ? "color-mix(in oklab, var(--fg) 55%, transparent)"
                      : "var(--faint)",
                }}
              >
                {r.num}
              </span>
              <span className="w-5 flex-none text-center">{r.sign}</span>
              <span className="min-w-0">{r.text}</span>
            </div>
          );
        })}
      </div>
      <div className="pt-[5px]" style={{ color: "var(--faint)" }}>
        {footer}
      </div>
    </div>
  );
}
