import { readFileSync } from "node:fs";

import { parseChatModel, predictChat } from "@/lib/terminal/chat-model";

import manifest from "@/public/models/chat-manifest.json";

import type { Answer, Classifier } from "@/lib/terminal/answer";
import type { Locale } from "@/lib/terminal/locale";
import type { BlockSpec } from "@/lib/terminal/types";

/** Shared plumbing for the answer-layer tests: the shipped models and the
 *  readers that turn an `Answer` into something assertable. */

function loadModel(locale: Locale) {
  const buf = readFileSync(`public${manifest[locale].file}`);
  return parseChatModel(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer);
}
export const models = { en: loadModel("en"), fr: loadModel("fr") };

/** The full tier, exactly as the browser runs it. */
export const full: Classifier = async (q, locale) => {
  const p = predictChat(models[locale], q);
  return { intent: p.intent, confidence: p.confidence, runnerUp: p.runnerUp, tier: "full" };
};

/** A stand-in for the light tier: nine intents, whatever confidence we say. */
export const light =
  (intent: string, confidence = 0.9): Classifier =>
  async () => ({ intent, confidence, runnerUp: 1 - confidence, tier: "light" });

type ToolSpec = Extract<BlockSpec, { kind: "tool" }>;

/** The loop's own calls: `classify` and the snake_case data tools. The
 *  command's tool lines (Read, Update…) are its output, not the loop. */
const isLoopTool = (b: BlockSpec): b is ToolSpec =>
  b.kind === "tool" && (b.name === "classify" || /^[a-z_]+$/.test(b.name));

export const toolNames = (a: Answer) => [...a.intro, ...a.blocks].filter(isLoopTool).map((b) => b.name);

/** "name(arg)" per loop call, e.g. get_role(technis). */
export const toolCalls = (a: Answer) =>
  [...a.intro, ...a.blocks].filter(isLoopTool).map((b) => `${b.name}${b.arg}`);

export const said = (a: Answer) => a.blocks.filter((b) => b.kind === "say").map((b) => b.full);
export const thought = (a: Answer) => a.blocks.filter((b) => b.kind === "think").map((b) => b.text);
export const marked = (a: Answer) => said(a).flatMap((s) => [...s.matchAll(/⟦([^⟧]*)⟧/g)].map((m) => m[1]));

/** The command's output: everything after the loop's calls and the answer. */
export function display(a: Answer): BlockSpec[] {
  let start = 0;
  a.blocks.forEach((b, i) => {
    if (isLoopTool(b)) start = i + 1;
  });
  const rest = a.blocks.slice(start);
  // One say (or think) is the answer sentence; what follows is the display.
  if (rest[0]?.kind === "say" || rest[0]?.kind === "think") return rest.slice(1);
  return rest;
}

export const displayKinds = (a: Answer) => display(a).map((b) => b.kind);

export const litRows = (a: Answer): string[] =>
  a.blocks.flatMap((b) => {
    switch (b.kind) {
      case "lines":
        return b.lines.filter((l) => l.hl).map((l) => l.k + l.text);
      case "select":
        return b.items.filter((i) => i.hl).map((i) => i.key);
      case "diff":
        return b.rows.filter((r) => r.hl).map((r) => r.text);
      case "chips":
        return b.hl ?? [];
      case "project":
        return b.meta.filter((l) => l.hl).map((l) => l.text);
      default:
        return [];
    }
  });
