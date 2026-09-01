import { SPINNER_FRAMES } from "@/lib/terminal/types";

import type { Line } from "@/lib/terminal/types";

interface ToolBlockProps {
  name: string;
  arg: string;
  meta: string;
  out: Line[];
  done: boolean;
  spin: number;
}

export function ToolBlock({ name, arg, meta, out, done, spin }: ToolBlockProps) {
  const glyph = done ? "⏺" : SPINNER_FRAMES[spin % SPINNER_FRAMES.length];
  return (
    <div className="mb-[10px]">
      <div className="flex gap-2">
        <span
          className="flex-none"
          style={{ color: done ? "var(--accent)" : "var(--warn)" }}
        >
          {glyph}
        </span>
        <span className="min-w-0 whitespace-pre-wrap">
          <span className="font-medium">{name}</span>
          <span style={{ color: "var(--dim)" }}>{" " + arg}</span>
        </span>
      </div>
      <div
        className="flex gap-1.5 pl-0.5"
        style={{ color: "var(--dim)" }}
      >
        <span className="flex-none" style={{ color: "var(--faint)" }}>
          ⎿
        </span>
        <span className="min-w-0 whitespace-pre-wrap">{meta}</span>
      </div>
      {out.map((o, i) => (
        <div
          key={i}
          className="overflow-hidden text-ellipsis whitespace-pre pl-[22px]"
          style={{ color: o.color }}
        >
          {o.text}
        </div>
      ))}
    </div>
  );
}
