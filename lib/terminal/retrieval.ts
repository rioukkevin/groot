import { classify } from "./intent";

import type { ShellContentData } from "./shell-content";
import type { Locale } from "./locale";

/**
 * Turns a plain question into the command that answers it.
 *
 * It routes rather than answering: asking "what have you built" runs
 * /projects, so the reply is the real, formatted project list — the same thing
 * the command produces, with its select list and its keyboard handling. The
 * earlier version extracted fields out of a tool result and printed them,
 * which produced lines like `statusColor: var(--warn)`: internals leaking into
 * a visitor's face.
 *
 * Nothing here composes prose. The classifier decides which command, and the
 * command owns the words.
 */

/** Which command answers each intent the model was trained on. */
const COMMAND: Record<string, string> = {
  get_profile: "/about",
  get_availability: "/now",
  get_rates: "/rates",
  get_contact: "/contact",
  list_roles: "/roles",
  list_projects: "/projects",
  get_skills: "/stack",
};

/**
 * Two floors, because a classifier can be wrong in two different ways.
 *
 * `MIN_CONFIDENCE` catches the case where nothing fits: with nine classes,
 * chance is 11%, so anything under half is closer to a shrug than a decision.
 * `MIN_MARGIN` catches the case where two intents fit equally — a question
 * that is genuinely between /rates and /contact should not be silently
 * resolved by a rounding error.
 */
const MIN_CONFIDENCE = 0.5;
const MIN_MARGIN = 0.15;

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9+#. ]/g, " ");

export interface Routed {
  /** The command to run, already argument-complete. */
  command: string;
  intent: string;
  confidence: number;
}

export interface NotUnderstood {
  command: null;
  /** Why nothing ran — the shell says this rather than guessing. */
  reason: "unknown" | "unsure";
  confidence: number;
}

export type RouteResult = Routed | NotUnderstood;

export async function routeQuestion(
  question: string,
  content: ShellContentData,
  locale: Locale,
): Promise<RouteResult> {
  // A named project beats everything: asking about "britch" is a question
  // about britch, whatever shape the sentence takes.
  const words = norm(question).split(/\s+/).filter((w) => w.length > 3);
  const named = Object.values(content.projects).find((p) =>
    words.some(
      (w) => norm(p.key).includes(w) || norm(p.name).includes(w),
    ),
  );
  if (named) {
    return { command: `/project ${named.key}`, intent: "get_project", confidence: 1 };
  }

  const predicted = await classify(question, locale);
  if (!predicted) return { command: null, reason: "unsure", confidence: 0 };

  // The model was taught what nonsense and off-topic questions look like, so
  // this is a class it chose rather than a threshold we imposed.
  if (predicted.intent === "unknown") {
    return { command: null, reason: "unknown", confidence: predicted.confidence };
  }

  if (
    predicted.confidence < MIN_CONFIDENCE ||
    predicted.confidence - predicted.runnerUp < MIN_MARGIN
  ) {
    return { command: null, reason: "unsure", confidence: predicted.confidence };
  }

  const command = COMMAND[predicted.intent];
  if (!command) {
    return { command: null, reason: "unsure", confidence: predicted.confidence };
  }

  // get_project without a name in the question is a request for the list.
  if (predicted.intent === "get_project") {
    return { command: "/projects", intent: predicted.intent, confidence: predicted.confidence };
  }

  return { command, intent: predicted.intent, confidence: predicted.confidence };
}
