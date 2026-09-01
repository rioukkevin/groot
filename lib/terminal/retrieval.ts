import { TOOLS } from "@/lib/mcp-tools";

import { classify } from "./intent";

import type { ShellContentData } from "./shell-content";
import type { Locale } from "./locale";

/**
 * Answers a question from the site's own data, with no model at all.
 *
 * Chrome's on-device model is not available in Safari, Firefox, or Chrome
 * before the weights are downloaded — which is most visitors. Shipping a model
 * to cover them would mean megabytes of runtime and a per-visitor download,
 * which is exactly what "very light" rules out.
 *
 * So this does the two things a model was wanted for, without being one: it
 * picks the right tool for the question, and it extracts the answer from what
 * that tool returned. It does not generate prose — it selects and quotes. That
 * is a real limit and the phrasing is deliberately plain because of it, but the
 * answers are correct by construction: every sentence is content, not
 * inference.
 */

/** Words that carry no signal in either language. */
const STOP = new Set([
  "the","a","an","of","to","in","on","for","and","or","is","are","was","do","does",
  "did","you","your","what","which","who","how","can","could","would","with","at",
  "it","this","that","have","has","i","me","my","about","tell","give","show","me",
  "le","la","les","un","une","des","de","du","et","ou","est","sont","que","qui",
  "quoi","quel","quelle","quels","quelles","comment","vous","votre","vos","je",
  "tu","ton","ta","tes","avec","pour","dans","sur","au","aux","ce","cette","ces",
  "as","il","elle","on","nous","ils","elles","son","sa","ses","plus","moi","dis",
]);

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9+#. ]/g, " ");

const tokens = (s: string) =>
  norm(s)
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w));

/**
 * Which tool a question is asking for, by keyword weight in both languages.
 * A tool wins only if it clears a floor, so an unrelated question falls
 * through to search rather than being forced into the nearest bucket.
 */
const INTENTS: { tool: string; words: string[]; weight?: number }[] = [
  {
    tool: "get_availability",
    words: ["available","availability","free","hire","hiring","start","when","booked",
      "dispo","disponible","disponibilite","libre","embaucher","commencer","quand"],
  },
  {
    tool: "get_rates",
    words: ["rate","rates","price","pricing","cost","charge","fee","budget","day",
      "tarif","tarifs","prix","cout","facture","tjm","journalier","combien"],
  },
  {
    tool: "get_contact",
    words: ["contact","email","mail","reach","hire","linkedin","github","call",
      "contacter","joindre","ecrire","courriel","appeler"],
  },
  {
    tool: "list_roles",
    words: ["experience","work","worked","job","jobs","role","roles","career","cv",
      "resume","employer","company","companies","history","years",
      "poste","postes","travaille","emploi","carriere","parcours","annees"],
  },
  {
    tool: "list_projects",
    words: ["project","projects","built","build","made","portfolio","shipped","side",
      "projet","projets","construit","realise","realisations"],
  },
  {
    tool: "get_skills",
    words: ["skill","skills","stack","tech","technology","technologies","know","knows",
      "language","languages","framework","tools","education","degree","studied",
      "competence","competences","techno","connait","sait","langage","formation","diplome","etudes"],
  },
  {
    tool: "get_profile",
    words: ["who","about","yourself","bio","biography","introduce","kevin","riou",
      "qui","presente","presentation","parle"],
  },
];

/** Pull the few most relevant lines out of a tool result. */
function extract(value: unknown, want: string[], limit: number): string[] {
  const lines: string[] = [];

  const walk = (v: unknown, path: string) => {
    if (lines.length > 400) return;
    if (v === null || v === undefined) return;
    if (typeof v === "string" || typeof v === "number") {
      lines.push(path ? `${path}: ${String(v)}` : String(v));
      return;
    }
    if (Array.isArray(v)) {
      for (const item of v) walk(item, path);
      return;
    }
    if (typeof v === "object") {
      for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
        walk(val, k);
      }
    }
  };
  walk(value, "");

  if (!want.length) return lines.slice(0, limit);

  const scored = lines
    .map((line) => {
      const hay = norm(line);
      const score = want.reduce((n, w) => (hay.includes(w) ? n + 1 : n), 0);
      return { line, score };
    })
    .sort((a, b) => b.score - a.score);

  const hits = scored.filter((s) => s.score > 0);
  return (hits.length ? hits : scored).slice(0, limit).map((s) => s.line);
}

export interface RetrievalAnswer {
  /** The tool that was consulted, shown in the transcript. */
  tool: string;
  /** How the tool was chosen, so the transcript can say. */
  via: "model" | "keywords" | "name" | "search";
  confidence: number;
  lines: string[];
  /** True when nothing matched and the answer is a redirection. */
  empty: boolean;
}

/**
 * Below this the classifier is guessing, and searching the content is a better
 * answer than confidently opening the wrong drawer.
 */
const CONFIDENCE_FLOOR = 0.4;

export async function retrieve(
  question: string,
  content: ShellContentData,
  locale: Locale,
): Promise<RetrievalAnswer> {
  const q = tokens(question);

  let best = { tool: "", score: 0 };

  // The trained classifier first — it generalises to phrasings the keyword
  // table never enumerated. If the model is missing or unsure, the table below
  // still answers, so the feature degrades rather than disappearing.
  const predicted = await classify(question, locale);
  if (predicted && predicted.confidence >= CONFIDENCE_FLOOR) {
    best = { tool: predicted.intent, score: 99 };
  }

  for (const intent of INTENTS) {
    if (best.score === 99) break;
    const score = q.reduce(
      (n, w) =>
        intent.words.some((iw) => iw === w || (w.length > 4 && iw.startsWith(w)))
          ? n + (intent.weight ?? 1)
          : n,
      0,
    );
    if (score > best.score) best = { tool: intent.tool, score };
  }

  // Named project? That beats a generic intent — asking about "britch" is a
  // question about britch, whatever else the sentence contains.
  const named = Object.values(content.projects).find((p) =>
    q.some((w) => w.length > 3 && (norm(p.key).includes(w) || norm(p.name).includes(w))),
  );

  const run = (name: string, args: Record<string, unknown> = {}) => {
    const tool = TOOLS.find((t) => t.name === name);
    return tool ? tool.run(args, content) : null;
  };

  if (named) {
    const value = run("get_project", { key: named.key });
    return {
      tool: "get_project",
      via: "name",
      confidence: 1,
      lines: [named.what, ...named.detail.slice(0, 2)],
      empty: !value,
    };
  }

  if (best.tool) {
    const value = run(best.tool);
    return {
      tool: best.tool,
      via: best.score === 99 ? "model" : "keywords",
      confidence: predicted?.confidence ?? 0,
      lines: extract(value, q, 6),
      empty: false,
    };
  }

  // No intent: search the content and report what matched.
  const found = run("search_content", { query: question }) as {
    projects: { name: string; summary: string }[];
    roles: { role: string; when: string }[];
    skills: string[];
  } | null;

  const hits = [
    ...(found?.projects ?? []).map((p) => `${p.name} — ${p.summary}`),
    ...(found?.roles ?? []).map((r) => `${r.role} (${r.when})`),
    ...(found?.skills ?? []),
  ];

  if (hits.length) {
    return {
      tool: "search_content",
      via: "search",
      confidence: predicted?.confidence ?? 0,
      lines: hits.slice(0, 6),
      empty: false,
    };
  }

  return {
    tool: "search_content",
    via: "search",
    confidence: predicted?.confidence ?? 0,
    lines: [
      locale === "fr"
        ? "Rien dans le contenu du site ne répond à ça. Écrivez-moi via /contact et vous aurez une vraie réponse."
        : "Nothing in the site's content answers that. Use /contact and you'll get a real answer.",
    ],
    empty: true,
  };
}
