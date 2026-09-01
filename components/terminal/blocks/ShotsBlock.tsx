import { ShaderPhoto } from "../ShaderPhoto";
import { ImageSpotlight, spotlightStrings } from "../ui/ImageSpotlight";

import type { ShellContent } from "@/lib/terminal/shell-content";
import type { ShotItem } from "@/lib/terminal/types";

export function ShotsBlock({
  items,
  content,
}: {
  items: ShotItem[];
  content: ShellContent;
}) {
  return (
    <div
      className="mb-3 flex flex-wrap gap-[18px] pl-5"
      style={{ color: "var(--accent)" }}
    >
      {items.map((p) => (
        <ImageSpotlight
          key={p.label}
          src={p.src}
          caption={p.caption}
          className="[&_canvas]:cursor-zoom-in"
          strings={spotlightStrings(content)}
        >
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
