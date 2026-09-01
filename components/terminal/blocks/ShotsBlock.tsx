import { ShaderPhoto } from "../ShaderPhoto";

import type { ShotItem } from "@/lib/terminal/types";

export function ShotsBlock({ items }: { items: ShotItem[] }) {
  return (
    <div
      className="mb-3 flex flex-wrap gap-[18px] pl-5"
      style={{ color: "var(--accent)" }}
    >
      {items.map((p) => (
        <ShaderPhoto
          key={p.label}
          src={p.src}
          width={p.w}
          height={p.h}
          cellW={p.cellW}
          cellH={p.cellH}
          gap={p.gap}
          label={p.label}
          caption={p.caption}
        />
      ))}
    </div>
  );
}
