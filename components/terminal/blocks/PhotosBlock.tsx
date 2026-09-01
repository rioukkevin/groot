import { AsciiPhoto } from "../AsciiPhoto";

import type { PhotoItem } from "@/lib/terminal/types";

export function PhotosBlock({ items }: { items: PhotoItem[] }) {
  return (
    <div
      className="mb-3 flex flex-wrap gap-[18px] pl-5"
      style={{ color: "var(--accent)" }}
    >
      {items.map((p) => (
        <AsciiPhoto
          key={p.label}
          width={p.w}
          height={p.h}
          cols={p.cols}
          label={p.label}
          caption={p.caption}
        />
      ))}
    </div>
  );
}
