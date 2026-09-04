import type { ShellContentData } from "./shell-content";
import type { Theme, Voice } from "./types";

/**
 * Slot filling: the named things inside a question.
 *
 * The classifier says a question is about a project, a role or a technology;
 * it does not say which. That part is a lookup against the content itself —
 * the project keys, the companies, the stack — plus the handful of aliases
 * people actually use ("the vscode extension", "k8s", "next"). Deterministic
 * by design: a name either is in the content or it is not.
 */

/** Lowercase, accent-free, one space between words. */
export const norm = (s: string): string =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Mn}/gu, "")
    .replace(/[^\p{L}\p{N}#+.]/gu, " ")
    // A dot inside a name stays (next.js, socket.io); one ending a sentence
    // goes, or "britch." would never match "britch".
    .replace(/\.(?![\p{L}\p{N}])/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const words = (s: string): string[] => norm(s).split(" ").filter(Boolean);

/** Words too common to identify anything on their own. */
export const STOP = new Set([
  "the", "and", "for", "with", "about", "your", "you", "what", "tell", "more",
  "this", "that", "these", "those", "have", "does", "know", "which", "where",
  "when", "from", "into", "some", "any", "can", "could", "would", "should",
  "please", "thanks", "hello", "there", "here", "like", "want", "need", "show",
  "give", "make", "work", "works", "working", "did", "done", "been", "being",
  "les", "des", "une", "sur", "avec", "pour", "vous", "votre", "quoi", "est",
  "quel", "quelle", "quels", "quelles", "avez", "êtes", "etes", "comment",
  "dans", "faire", "fait", "faites", "peux", "peut", "pouvez", "voudrais",
  "savoir", "dire", "dites", "parle", "parlez", "montre", "montrez", "merci",
  "bonjour", "salut", "aussi", "encore", "plus", "moins", "tout", "tous",
  "toute", "toutes", "cette", "ceci", "cela", "elle", "elles", "nous", "ils",
  "project", "projet", "portfolio", "extension", "version", "site", "web",
  // Generic words that happen to sit inside project names.
  "custom", "controller", "stream", "commit", "counter", "message", "messages",
]);

// ── projects ──────────────────────────────────────────────────────────────

/** Alias word → project key: the ways people name them without the name. */
const PROJECT_ALIAS: Record<string, string> = {
  vscode: "vscode-commit",
  vs: "vscode-commit",
  commit: "vscode-commit",
  commits: "vscode-commit",
  git: "vscode-commit",
  bot: "twitch-bot",
  counter: "outrans-counter",
  compteur: "outrans-counter",
  outrans: "outrans-counter",
  overlay: "overlays",
  overlays: "overlays",
  manette: "overlays",
  manettes: "overlays",
  controller: "overlays",
  brightness: "britch",
  luminosite: "britch",
  contrast: "britch",
  contraste: "britch",
  gauge: "britch",
  jauge: "britch",
  chrome: "britch",
  brand: "ooof",
  marque: "ooof",
  v6: "portfolio-v6",
  v5: "portfolio-v5",
  sixth: "portfolio-v6",
  sixieme: "portfolio-v6",
  fifth: "portfolio-v5",
  cinquieme: "portfolio-v5",
};

/** Words that sit in several project names and so name none: "twitch" is
 *  three projects, "portfolio" is two. */
const SHARED = new Set(["twitch", "portfolio"]);

/**
 * The one project a question names, or null — also when it names two, which
 * is a request for the list rather than for either.
 */
export function findProject(question: string, c: ShellContentData): string | null {
  const ws = words(question);
  const hits = new Set<string>();
  for (const key of Object.keys(c.projects)) {
    const p = c.projects[key];
    const own = new Set([...words(key.replace(/-/g, " ")), ...words(p.name)]);
    for (const w of ws) {
      if (STOP.has(w) || SHARED.has(w) || w.length < 4) continue;
      if (own.has(w)) hits.add(key);
    }
  }
  for (const w of ws) {
    const key = PROJECT_ALIAS[w];
    if (key && c.projects[key]) hits.add(key);
  }
  return hits.size === 1 ? [...hits][0] : null;
}

// ── roles ─────────────────────────────────────────────────────────────────

const ROLE_ALIAS: Record<string, string> = {
  alpha: "alpha8",
  alpha8: "alpha8",
  cdg: "cdg29",
  cdg29: "cdg29",
  brioche: "pasquier",
  pasquier: "pasquier",
  technis: "technis",
  swiss: "technis",
  suisse: "technis",
  sensor: "technis",
  sensors: "technis",
  capteur: "technis",
  capteurs: "technis",
  triskalia: "triskalia",
  cooperative: "triskalia",
  coop: "triskalia",
  nareli: "nareli",
  independent: "freelance",
  independant: "freelance",
  independante: "freelance",
  indep: "freelance",
  indie: "freelance",
};

/** Words that are also a role key but too generic to name it: "have you
 *  always been freelance" is about the whole history. */
const GENERIC_ROLE = new Set(["freelance"]);

/**
 * The one role a question names, or null. A company, an alias for it, or a
 * year that falls inside exactly one role ("in 2019", "between 2020 and 2022"
 * is two roles and so nothing).
 */
export function findRole(question: string, c: ShellContentData, allowGeneric = false): string | null {
  const ws = words(question);
  const keys = new Set(c.roles.map((r) => r.key));
  for (const w of ws) {
    if (keys.has(w) && (allowGeneric || !GENERIC_ROLE.has(w))) return w;
    const k = ROLE_ALIAS[w];
    if (k && keys.has(k)) return k;
  }
  // "alpha 8", "cdg 29" arrive as two words.
  const joined = ws.join(" ");
  if (/\balpha 8\b/.test(joined) && keys.has("alpha8")) return "alpha8";
  if (/\bcdg 29\b/.test(joined) && keys.has("cdg29")) return "cdg29";
  // "went independent in 2020", "between 2020 and 2022": years narrow the
  // field — unless they open a span to today, which is the whole history.
  const years = ws.filter((w) => /^(19|20)\d\d$/.test(w)).map(Number);
  const span = /\b(aujourd|today|since|depuis|until|jusqu|now|maintenant|onwards|present)\b/.test(joined);
  if (years.length >= 1 && years.length <= 2 && !span) {
    const now = new Date().getFullYear();
    const inside = c.roles.filter((r) => {
      const [a, b] = r.when.match(/\d{4}/g) ?? [];
      const from = Number(a);
      const to = b ? Number(b) : now;
      return from && years.every((y) => y >= from && y <= to);
    });
    if (inside.length === 1) return inside[0].key;
    // Two roles share the years; "on your own" picks the freelance one.
    if (inside.length > 1 && /\b(own|independent|independant|solo|compte|freelance)\b/.test(joined)) {
      const f = inside.find((r) => r.key === "freelance");
      if (f) return f.key;
    }
  }
  return null;
}

// ── technologies ──────────────────────────────────────────────────────────

/** Alias → the label as it appears in the stack, in every locale's spelling
 *  when they differ; `lookup()` tries each. */
const LLM = ["LLM APIs", "API de LLM"];
const AGENTS = ["Agents & MCP"];
const ASSISTED = ["AI-assisted delivery", "Développement assisté par IA"];
const TECH_ALIAS: Record<string, string | string[]> = {
  next: "Next.js",
  nextjs: "Next.js",
  "next.js": "Next.js",
  node: "Node",
  nodejs: "Node",
  "node.js": "Node",
  nest: "NestJS",
  nestjs: "NestJS",
  ts: "TypeScript",
  typescript: "TypeScript",
  js: "JavaScript",
  javascript: "JavaScript",
  rn: "React Native",
  "react native": "React Native",
  reactnative: "React Native",
  postgres: "PostgreSQL",
  postgresql: "PostgreSQL",
  pg: "PostgreSQL",
  mongo: "MongoDB",
  mongodb: "MongoDB",
  k8s: "Kubernetes",
  kubernetes: "Kubernetes",
  tailwindcss: "Tailwind",
  tailwind: "Tailwind",
  csharp: "C#",
  "c#": "C#",
  ".net": "C#",
  dotnet: "C#",
  ai: LLM,
  ia: LLM,
  llm: LLM,
  llms: LLM,
  openai: LLM,
  anthropic: LLM,
  claude: LLM,
  gpt: LLM,
  copilot: ASSISTED,
  cursor: ASSISTED,
  windsurf: ASSISTED,
  "claude code": ASSISTED,
  "ai tools": ASSISTED,
  "ai assisted": ASSISTED,
  "outils ia": ASSISTED,
  "assiste par ia": ASSISTED,
  assisted: ASSISTED,
  vibe: ASSISTED,
  mcp: AGENTS,
  agent: AGENTS,
  agents: AGENTS,
  rag: "RAG",
  embedding: "Embeddings",
  embeddings: "Embeddings",
  socket: "Socket.io",
  websocket: "Socket.io",
  websockets: "Socket.io",
  rest: "REST",
  graphql: "GraphQL",
  docker: "Docker",
  vercel: "Vercel",
  netlify: "Netlify",
  playwright: "Playwright",
  jest: "Jest",
  vitest: "Vitest",
  prisma: "Prisma",
  firebase: "Firebase",
  supabase: "Supabase",
  react: "React",
  vue: "Vue",
  vuejs: "Vue",
  nuxt: "Nuxt",
  sass: "Sass",
  scss: "Sass",
  php: "PHP",
  expo: "Expo",
  cordova: "Cordova",
  nativescript: "NativeScript",
  express: "Express",
  koa: "Koa",
  helm: "Helm",
  ovh: "OVHcloud",
  ovhcloud: "OVHcloud",
  scaleway: "Scaleway",
};

/**
 * Technologies a visitor may ask about that are not in the stack. Known so
 * the answer can name them ("Rust isn't in my stack") instead of shrugging.
 */
const OTHER_TECH = [
  "rust", "golang", "java", "kotlin", "swift", "flutter", "dart", "angular",
  "svelte", "solid", "astro", "remix", "laravel", "symfony", "django", "flask",
  "rails", "ruby", "python", "wordpress", "shopify", "drupal", "magento",
  "prestashop", "webflow", "aws", "gcp", "azure", "terraform", "ansible", "redis",
  "mysql", "sqlite", "elasticsearch", "kafka", "rabbitmq", "unity", "unreal",
  "c++", "scala", "elixir", "haskell", "clojure", "cypress", "storybook",
  "figma", "ionic", "capacitor", "electron", "tauri", "deno", "bun", "webpack",
  "vite", "redux", "zustand", "mobx", "trpc", "hasura", "strapi", "sanity",
  "contentful", "payload", "stripe", "twilio", "sendgrid", "resend", "auth0",
  "clerk", "keycloak", "oauth", "jwt", "seo", "accessibility", "webgl", "three.js",
  "threejs", "d3", "chart.js", "tensorflow", "pytorch", "langchain", "openai",
  "html", "css", "sql", "nosql", "linux", "bash", "git", "github", "gitlab",
];

export interface TechHit {
  /** What the visitor said, as they said it. */
  asked: string;
  /** The stack label if it is there, else null. */
  item: string | null;
  /** The stack group the item sits in. */
  group: string | null;
}

export function findTech(question: string, c: ShellContentData): TechHit | null {
  const ws = words(question);
  const stack = new Map<string, string>(); // lowercase label → group
  const label = new Map<string, string>(); // lowercase label → label
  for (const [group, , items] of c.stack) {
    for (const it of items) {
      stack.set(norm(it), group);
      label.set(norm(it), it);
    }
  }
  const lookup = (raw: string): TechHit | null => {
    const w = norm(raw);
    const aliased = TECH_ALIAS[w];
    const candidates = (Array.isArray(aliased) ? aliased : [aliased ?? w]).map(norm);
    const key =
      candidates.find((k) => stack.has(k)) ??
      // A translated label the alias table does not know yet, found by the
      // alias word inside it ("ia" in "developpement assiste par ia").
      (w.length >= 3 ? [...stack.keys()].find((k) => new RegExp(`(^|\\s)${w}(\\s|$)`).test(k)) : undefined);
    if (key && stack.has(key)) {
      return { asked: raw, item: label.get(key) ?? raw, group: stack.get(key) ?? null };
    }
    return null;
  };
  // Tools that mean AI-assisted work outrank the bare "ai" they come with.
  for (const w of ws) {
    if (["copilot", "cursor", "windsurf", "assisted", "assiste", "vibe"].includes(w)) {
      const hit = lookup(w);
      if (hit) return hit;
    }
  }
  // Two-word names first ("react native", "next js"), then single words.
  for (let i = 0; i + 1 < ws.length; i++) {
    const hit = lookup(`${ws[i]} ${ws[i + 1]}`);
    if (hit) return hit;
  }
  for (const w of ws) {
    if (STOP.has(w)) continue;
    const hit = lookup(w);
    if (hit) return hit;
  }
  for (const w of ws) {
    if (OTHER_TECH.includes(w)) return { asked: w, item: null, group: null };
  }
  // "kubernets", "typescirpt": one slip in a long word still names it.
  for (const w of ws) {
    if (w.length < 6 || STOP.has(w)) continue;
    for (const k of stack.keys()) {
      if (Math.abs(k.length - w.length) <= 1 && editDistance(w, k) === 1) {
        return { asked: w, item: label.get(k) ?? k, group: stack.get(k) ?? null };
      }
    }
  }
  return null;
}

/** Levenshtein, capped at 2 — enough to tell a slip from a different word. */
function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > 2) return 3;
  const prev = new Array<number>(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = tmp;
    }
  }
  return prev[b.length];
}

// ── small enumerations ────────────────────────────────────────────────────

const MONTHS: [RegExp, string][] = [
  [/\bjan(uary|vier)?\b/, "january"], [/\bfeb(ruary)?\b|\bfev(rier)?\b|\bfévr?(ier)?\b/, "february"],
  [/\bmar(ch|s)?\b/, "march"], [/\bapr(il)?\b|\bavr(il)?\b/, "april"], [/\bma[iy]\b/, "may"],
  [/\bjui?n(e)?\b/, "june"], [/\bjul(y)?\b|\bjuil(let)?\b/, "july"], [/\bao[uû]t\b|\baug(ust)?\b/, "august"],
  [/\bsep(t|tember|tembre)?\b/, "september"], [/\boct(ober|obre)?\b/, "october"],
  [/\bnov(ember|embre)?\b/, "november"], [/\bdec(ember|embre)?\b|\bdéc(embre)?\b/, "december"],
];

/** The month named in a question, in English, or null. */
export function findMonth(question: string): string | null {
  const q = norm(question);
  for (const [re, name] of MONTHS) if (re.test(q)) return name;
  return null;
}

const THEMES: Theme[] = ["green", "ember", "ice", "plum", "mono", "paper", "white", "linen"];

/** The ways people name a palette without naming it. */
const THEME_WORDS: [RegExp, Theme][] = [
  [/\b(mono|monochrome|monochromatic|grayscale|greyscale|gray|grey|gris|noir et blanc|black and white)\b/, "mono"],
  [/\b(ember|amber|orange|braise|ambre|warm colou?rs?|chaud|chaude)\b/, "ember"],
  [/\b(ice|icy|blue|bleu|bleue|glace|cold|froid|froide)\b/, "ice"],
  [/\b(plum|purple|violet|violette|mauve|prune)\b/, "plum"],
  [/\b(paper|papier|beige|cream|creme|soft|softer|doux|douce|sepia)\b/, "paper"],
  [/\b(white|blanc|blanche)\b/, "white"],
  [/\b(linen|lin|ivory|ivoire)\b/, "linen"],
  [/\b(green|vert|verte|default|defaut|dark|sombre|noir|black|night|nuit)\b/, "green"],
  [/\b(light|lighter|clair|claire|bright|brighter|lumineux|lumineuse)\b/, "paper"],
];

export function findTheme(question: string): Theme | null {
  const q = norm(question);
  // Phrases first: "black and white" is mono, not white.
  for (const [re, t] of THEME_WORDS.slice(0, 1)) if (re.test(q)) return t;
  const ws = new Set(q.split(" "));
  for (const t of THEMES) if (ws.has(t)) return t;
  for (const [re, t] of THEME_WORDS) if (re.test(q)) return t;
  return null;
}

export function findVoice(question: string): Voice | null {
  const q = norm(question);
  // Warmth asked for by contrast comes first: "less dry" is not "less".
  if (
    /\b(less (dry|cold|formal|robotic|stiff|clinical)|moins (sec|froid|formel|robotique)|warm|warmer|chaleureux|chaleureuse|friendly|friendlier|casual|relaxed|loosen|informal|informel|sympa|human|humain|personality|personnalite|robot|robotic|tutoie|tutoyer)\b/.test(q)
  ) {
    return "warm";
  }
  if (
    /\b(terse|shortest|minimal|minimum|bare|telegraphic|telegraphique|one sentence|one word|une phrase|un mot|tres court|very short|lapidaire|laconique|droit au but|to the point|man page|just (the )?(data|facts)|no (chit chat|fluff|filler|small talk)|sans blabla|pas de blabla|juste les faits|court|courte|fais court|plus court)\b/.test(q)
  ) {
    return "terse";
  }
  if (
    /\b(short|shorter|brief|breif|bref|breve|concis|concise|less|moins|condense|resume|succinct|tl dr|tldr|skim|skimming|a line or two|two lines|deux lignes|une ligne)\b/.test(q)
  ) {
    return "brief";
  }
  if (/\b(long|longer|detail|detailed|detaille|detaillee|verbose|more|plus|davantage|elaborate)\b/.test(q)) {
    return "warm";
  }
  return null;
}

const FR_WORD = "(french|frnech|frensh|frech|francais|francaise|franc|fr)";
const EN_WORD = "(english|englsh|engish|anglais|angl|en)";

/**
 * The language a question is about. "Switch to English" names one; "do you
 * speak English or only French" names both and asks for neither, so it is
 * null and the shell simply answers.
 */
export function findLanguage(question: string): "en" | "fr" | null {
  const q = norm(question);
  // A directive — switch to, reply in, passer en — settles it outright.
  const directive = q.match(new RegExp(`\\b(switch to|reply in|answer in|talk in|speak in|passer en|passe en|repondre en|reponds en|parler en|parle en|continue in|continuer en|version|en|in|to)\\s+(${FR_WORD}|${EN_WORD})\\b`));
  if (directive) return new RegExp(`^${FR_WORD}$`).test(directive[2]) ? "fr" : "en";
  const fr = new RegExp(`\\b${FR_WORD}\\b`).test(q);
  const en = new RegExp(`\\b${EN_WORD}\\b`).test(q);
  if (fr && en) return null;
  if (fr) return "fr";
  if (en) return "en";
  return null;
}

/** "the latest / the first" — a superlative standing in for a name. */
export function findOrdinal(question: string): "latest" | "first" | null {
  const q = norm(question);
  if (/\b(dernier|derniere|derniers|dernieres|latest|last|newest|recent|recente|recently|recemment|dernierement|current|curent|currently|presently|actuel|actuelle|actuellement|now|maintenant|today|aujourd|nowadays|lately|moment)\b/.test(q)) return "latest";
  if (/\b(en ce moment|most recent|plus recent|plus recente|du moment)\b/.test(q)) return "latest";
  if (/\b(first|premier|premiere|oldest|earliest|plus ancien|plus ancienne|debut|debuts|debute|started|start|began|beginning|commence|commencé)\b/.test(q)) return "first";
  return null;
}

/** The project a superlative points at: the newest or oldest by year. */
export function projectByOrdinal(ordinal: "latest" | "first", c: ShellContentData): string | null {
  const dated = Object.values(c.projects)
    .map((p) => ({ key: p.key, year: Number((p.year.match(/\d{4}/) ?? [NaN])[0]) }))
    .filter((p) => Number.isFinite(p.year));
  if (!dated.length) return Object.keys(c.projects)[0] ?? null;
  dated.sort((a, b) => (ordinal === "latest" ? b.year - a.year : a.year - b.year));
  return dated[0].key;
}

/** Roles are stored newest first. */
export function roleByOrdinal(ordinal: "latest" | "first", c: ShellContentData): string | null {
  const r = ordinal === "latest" ? c.roles[0] : c.roles[c.roles.length - 1];
  return r?.key ?? null;
}
