import type { Line } from "@/lib/terminal/types";

export function LinesBlock({ lines }: { lines: Line[] }) {
  return (
    <div className="mb-[10px] pl-5">
      {lines.map((l, i) => (
        <div
          key={i}
          className="min-h-[1.5em] whitespace-pre"
          style={{ color: l.color }}
        >
          <span style={{ color: l.kcolor }}>{l.k}</span>
          {l.text}
        </div>
      ))}
    </div>
  );
}
