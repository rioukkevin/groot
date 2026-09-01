import { TOOLS, toolByName } from "@/lib/mcp-tools";

import type { ShellContentData } from "./shell-content";
import type { Locale } from "./locale";

/**
 * A conversational answer layer that runs entirely in the visitor's browser.
 *
 * Chrome ships an on-device model behind `LanguageModel` (the Prompt API).
 * Using it costs nothing to host, sends nothing to a server, and adds no bytes
 * to the bundle — the weights are the browser's, already on disk. That is the
 * whole reason this is the chosen route: a WebLLM or Transformers.js fallback
 * would mean shipping megabytes of runtime and downloading a model per
 * visitor, which is the opposite of light.
 *
 * The model does not answer from its own knowledge. It is given the same tools
 * the MCP endpoint exposes and told to call them, so every claim about Kévin
 * comes from the CMS rather than from the model's memory. If it has no tool for
 * a question, it is told to say so.
 */

/** Minimal shape of the Prompt API; it is not in TypeScript's lib yet. */
interface PromptSession {
  prompt: (input: string, opts?: { responseConstraint?: object }) => Promise<string>;
  destroy: () => void;
}
interface PromptApi {
  availability: () => Promise<"unavailable" | "downloadable" | "downloading" | "available">;
  create: (opts?: {
    initialPrompts?: { role: string; content: string }[];
    expectedInputs?: { type: string; languages?: string[] }[];
    monitor?: (m: { addEventListener: (e: string, cb: (ev: ProgressEvent) => void) => void }) => void;
  }) => Promise<PromptSession>;
}

const api = (): PromptApi | null => {
  const g = globalThis as unknown as { LanguageModel?: PromptApi };
  return typeof g.LanguageModel?.create === "function" ? g.LanguageModel : null;
};

export type LlmStatus =
  | "unsupported"
  | "downloadable"
  | "downloading"
  | "ready";

export async function llmStatus(): Promise<LlmStatus> {
  const a = api();
  if (!a) return "unsupported";
  try {
    const s = await a.availability();
    if (s === "unavailable") return "unsupported";
    if (s === "available") return "ready";
    return s;
  } catch {
    return "unsupported";
  }
}

/** Either a tool to run or a final answer — constrained, so parsing is safe. */
const STEP_SCHEMA = {
  type: "object",
  properties: {
    tool: { type: "string", description: "Name of a tool to call, or empty." },
    args: { type: "object", description: "Arguments for the tool." },
    answer: { type: "string", description: "The final answer, or empty." },
  },
  required: ["tool", "args", "answer"],
  additionalProperties: false,
} as const;

const systemPrompt = (locale: Locale) => {
  const tools = TOOLS.map(
    (t) =>
      `- ${t.name}(${Object.keys(t.inputSchema.properties).join(", ")}): ${t.description}`,
  ).join("\n");

  return [
    "You answer questions about Kévin Riou on his portfolio site.",
    "",
    "You have no knowledge of your own about him. Every fact must come from a",
    "tool result. If the tools do not cover a question, say so plainly and",
    "point the person at the contact form rather than guessing.",
    "",
    "Tools:",
    tools,
    "",
    "Reply with JSON only.",
    'To use a tool: {"tool":"name","args":{...},"answer":""}',
    'To answer: {"tool":"","args":{},"answer":"..."}',
    "",
    locale === "fr"
      ? "Répondez en français, à la première personne du singulier, comme Kévin. Deux ou trois phrases, sans emphase inutile."
      : "Answer in English, in the first person as Kévin. Two or three sentences, no filler.",
  ].join("\n");
};

export interface AskResult {
  answer: string;
  /** Tools the model actually called, in order — shown in the transcript. */
  calls: { name: string; args: Record<string, unknown> }[];
}

/**
 * Runs a short tool loop against the on-device model.
 *
 * Capped at four rounds: this answers portfolio questions, and anything that
 * cannot be settled in four tool calls is a question for a human.
 */
export async function ask(
  question: string,
  content: ShellContentData,
  locale: Locale,
  onProgress?: (note: string) => void,
): Promise<AskResult | null> {
  const a = api();
  if (!a) return null;

  let session: PromptSession | null = null;
  const calls: AskResult["calls"] = [];

  try {
    session = await a.create({
      initialPrompts: [{ role: "system", content: systemPrompt(locale) }],
      expectedInputs: [{ type: "text", languages: ["en", "fr"] }],
    });

    let turn = `Question: ${question}`;

    for (let round = 0; round < 4; round++) {
      const raw = await session.prompt(turn, { responseConstraint: STEP_SCHEMA });

      let step: { tool?: string; args?: Record<string, unknown>; answer?: string };
      try {
        step = JSON.parse(raw) as typeof step;
      } catch {
        // The constraint should prevent this; if the model still drifts, take
        // whatever it said as the answer rather than failing the question.
        return { answer: raw.trim(), calls };
      }

      if (step.answer && !step.tool) {
        return { answer: step.answer.trim(), calls };
      }

      const tool = step.tool ? toolByName(step.tool) : undefined;
      if (!tool) {
        return {
          answer:
            step.answer?.trim() ||
            (locale === "fr"
              ? "Je n'ai pas d'outil pour répondre à ça — écrivez-moi via /contact."
              : "I don't have a tool for that — use /contact and ask me directly."),
          calls,
        };
      }

      const args = step.args ?? {};
      calls.push({ name: tool.name, args });
      onProgress?.(tool.name);
      const result = tool.run(args, content);
      turn = `Tool ${tool.name} returned:\n${JSON.stringify(result).slice(0, 4000)}\n\nAnswer the question now, or call another tool.`;
    }

    return {
      answer:
        locale === "fr"
          ? "Je n'ai pas réussi à répondre avec les données du site. Essayez /contact."
          : "I couldn't settle that from the site's data. Try /contact.",
      calls,
    };
  } catch {
    return null;
  } finally {
    session?.destroy();
  }
}
