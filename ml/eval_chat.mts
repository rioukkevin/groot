/**
 * Runs the shipped model files through the browser's own inference code and
 * checks every prediction against the trainer's, on the independent eval set.
 * Feature parity is necessary but not sufficient: this catches a wrong
 * offset, a transposed matrix, or a dequantisation the trainer did not do.
 *
 *   bun ml/eval_chat.mts
 */
import { readFileSync } from "node:fs";

import { parseChatModel, predictChat } from "../lib/terminal/chat-model";

import manifest from "../public/models/chat-manifest.json";

interface Row {
  text: string;
  gold: string;
  pred: string;
  p: number;
  /** Runner-up probability, for the shell's margin check. */
  p2: number;
}

let failed = false;
for (const lang of ["en", "fr"] as const) {
  const entry = manifest[lang];
  if (!entry) {
    console.log(`${lang}: no model in manifest`);
    continue;
  }
  const buf = readFileSync(`public${entry.file}`);
  const model = parseChatModel(
    buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength),
  );
  const rows = JSON.parse(readFileSync(`ml/out/eval-pred-${lang}.json`, "utf8")) as Row[];

  let agree = 0;
  let drift = 0;
  let correct = 0;
  for (const r of rows) {
    const p = predictChat(model, r.text);
    if (p.intent === r.pred) agree++;
    if (Math.abs(p.confidence - r.p) > 1e-3) drift++;
    if (r.p2 !== undefined && Math.abs(p.runnerUp - r.p2) > 1e-3) drift++;
    if (p.intent === r.gold) correct++;
  }
  const ok = agree === rows.length && drift === 0;
  if (!ok) failed = true;
  console.log(
    `${lang}: ${entry.bytes} bytes · ${rows.length} eval rows · agrees with trainer ${agree}/${rows.length}` +
      ` · confidence drift >1e-3 on ${drift} · top-1 ${((correct / rows.length) * 100).toFixed(1)}%` +
      (ok ? " · OK" : " · MISMATCH"),
  );
}
process.exit(failed ? 1 : 0);
