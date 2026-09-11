/**
 * Renders the share card with sample copy, without the CMS, to look at it:
 *
 *   bun scripts/preview-og.tsx [out.png]
 */
import { writeFile } from "node:fs/promises";

import { loadCardAssets } from "@/lib/og/assets";
import { renderCard } from "@/lib/og/card";

const out = process.argv[2] ?? "og-preview.png";
const res = renderCard(
  {
    name: "Kévin Riou",
    tagline: "fullstack web & mobile, freelance",
    location: "Paris, France",
    prefix: "shell portfolio",
    banner: "Disponible pour de nouvelles missions à partir de mi-septembre",
    placeholder: "posez une question, ou tapez /help",
    host: "nare.li",
  },
  await loadCardAssets(),
);
await writeFile(out, Buffer.from(await res.arrayBuffer()));
console.log(`→ ${out}`);
