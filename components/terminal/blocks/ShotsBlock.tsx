import { ShaderPhoto } from "../ShaderPhoto";
import { ImageSpotlight } from "../ui/ImageSpotlight";

import type { ShotItem } from "@/lib/terminal/types";

export function ShotsBlock({ items }: { items: ShotItem[] }) {
  return (
    <div
      className="mb-3 flex flex-wrap gap-[18px] pl-5"
      style={{ color: "var(--accent)" }}
    >
      {items.map((p) => (
        <ImageSpotlight key={p.label} src={p.src} caption={p.caption}>
          <ShaderPhoto
            src={p.src}
            width={p.w}
            height={p.h}
            cellW={p.cellW}
            cellH={p.cellH}
            gap={p.gap}
            label={p.label}
            caption={p.caption}
          />
        </ImageSpotlight>
      ))}
    </div>
  );
}
