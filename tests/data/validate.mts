/**
 * Checks a question file: valid JSON, known intents, slots that exist in the
 * content, no duplicates once normalised, and the per-intent quota.
 *
 *   bun tests/data/validate.mts tests/data/questions.en.core.json
 */
import { readFileSync } from "node:fs";

import { contentFor } from "../fixtures/content";

interface Row {
  q: string;
  intent: string;
  slot?: string;
  last?: string;
}

const INTENTS = new Set([
  "get_profile", "get_availability", "get_rates", "get_contact", "get_email",
  "list_roles", "get_role", "list_projects", "get_project", "get_skills",
  "get_soft_skills", "get_education", "get_photos", "get_resume",
  "set_theme", "set_voice", "help", "clear",
  "greeting", "thanks", "goodbye", "how_are_you", "about_site",
  "compliment", "affirm", "deny", "more", "language", "unknown",
]);
const THEMES = new Set(["green", "ember", "ice", "plum", "mono", "paper", "white", "linen"]);
const VOICES = new Set(["warm", "brief", "terse"]);
const RATES = new Set(["development", "management", "consulting", "fixed"]);
const CHANNELS = new Set(["email", "linkedin", "github"]);
const LASTS = new Set(["/about", "/now", "/rates", "/contact", "/email", "/stack", "/skills", "/education", "/projects", "/roles", "/project britch", "/help", "/photos", "/resume", "/theme", "/voice"]);

const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/\p{Mn}/gu, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim();

const file = process.argv[2];
const quota = process.argv[3] ? (JSON.parse(process.argv[3]) as Record<string, number>) : null;
const c = contentFor("en");
const projects = new Set(Object.keys(c.projects));
const roles = new Set(c.roles.map((r) => r.key));
const stack = new Set(c.stack.flatMap(([, , items]) => items));

let rows: Row[];
try {
  rows = JSON.parse(readFileSync(file, "utf8")) as Row[];
} catch (e) {
  console.log(`INVALID JSON: ${(e as Error).message}`);
  process.exit(1);
}

const problems: string[] = [];
const seen = new Map<string, number>();
const counts: Record<string, number> = {};
rows.forEach((r, i) => {
  const where = `#${i + 1} ${JSON.stringify(r.q)}`;
  if (typeof r.q !== "string" || !r.q.trim()) problems.push(`${where}: empty question`);
  if (!INTENTS.has(r.intent)) problems.push(`${where}: unknown intent ${r.intent}`);
  counts[r.intent] = (counts[r.intent] ?? 0) + 1;
  const key = norm(r.q ?? "");
  if (seen.has(key)) problems.push(`${where}: duplicate of #${seen.get(key)}`);
  else seen.set(key, i + 1);
  if (r.q && r.q.split(/\s+/).length > 30) problems.push(`${where}: over 30 words`);

  const s = r.slot;
  switch (r.intent) {
    case "get_role":
      if (s !== undefined && !roles.has(s) && s !== "latest" && s !== "first") problems.push(`${where}: get_role slot must be a role key (${[...roles].join("|")}) or latest|first`);
      break;
    case "get_project":
      if (s !== undefined && !projects.has(s) && s !== "latest" && s !== "first") problems.push(`${where}: get_project slot must be a project key (${[...projects].join("|")}) or latest|first`);
      break;
    case "get_skills":
      if (s !== undefined && !stack.has(s) && !s.startsWith("other:")) problems.push(`${where}: get_skills slot must be an exact stack label or other:<word>`);
      break;
    case "get_rates":
      if (s !== undefined && !RATES.has(s)) problems.push(`${where}: get_rates slot must be development|management|consulting|fixed`);
      break;
    case "get_contact":
      if (s !== undefined && !CHANNELS.has(s)) problems.push(`${where}: get_contact slot must be email|linkedin|github`);
      break;
    case "set_theme":
      if (s !== undefined && !THEMES.has(s)) problems.push(`${where}: set_theme slot must be a theme name`);
      break;
    case "set_voice":
      if (s !== undefined && !VOICES.has(s)) problems.push(`${where}: set_voice slot must be warm|brief|terse`);
      break;
    case "language":
      if (s !== "en" && s !== "fr") problems.push(`${where}: language needs slot en|fr`);
      break;
    case "more":
      if (!r.last || !LASTS.has(r.last)) problems.push(`${where}: more needs last from ${[...LASTS].join(" ")}`);
      break;
    default:
      if (s !== undefined) problems.push(`${where}: ${r.intent} takes no slot`);
  }
});

if (quota) {
  for (const [intent, n] of Object.entries(quota)) {
    const have = counts[intent] ?? 0;
    if (have < n) problems.push(`quota: ${intent} has ${have}, needs ${n}`);
  }
  for (const intent of Object.keys(counts)) {
    if (!(intent in quota)) problems.push(`quota: ${intent} is not in this file's assignment`);
  }
}

console.log(`${rows.length} rows · ` + Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(", "));
if (problems.length) {
  console.log(`${problems.length} PROBLEMS:`);
  for (const p of problems.slice(0, 60)) console.log("  " + p);
  process.exit(1);
}
console.log("OK");
