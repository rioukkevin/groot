import { readFile } from "node:fs/promises";
import { join } from "node:path";

import type { CardAssets } from "./card";

/**
 * The card's bytes, from assets/og: the TTF subsets that scripts/subset-fonts.sh
 * writes (the renderer reads TTF, not WOFF2) and the buddy from
 * scripts/gen-icons.ts. Read through process.cwd() so the deployment's file
 * tracing keeps them next to the route.
 */
export async function loadCardAssets(): Promise<CardAssets> {
  const asset = (name: string) => readFile(join(process.cwd(), "assets/og", name));
  const [regular, bold, buddy] = await Promise.all([
    asset("JetBrainsMono-Regular.ttf"),
    asset("JetBrainsMono-Bold.ttf"),
    asset("buddy.png"),
  ]);
  return { regular, bold, buddy };
}
