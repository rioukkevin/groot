/**
 * Pushes the content pack to a Payload instance over its MCP endpoint.
 *
 *   GROOT_CMS_MCP_KEY=… bun run cms/push-pack.ts            # plan only
 *   GROOT_CMS_MCP_KEY=… bun run cms/push-pack.ts --apply    # do it
 *
 * The pack (content-export/pack/) is the source: projects, site profile,
 * skills and education, in English and French. Roles and UI text are left
 * alone — they are not in scope of a content edit and have their own files.
 * Projects missing from the pack are deleted, so the site shows exactly what
 * the pack holds. Talks to the same MCP server a coding agent would
 * (`@payloadcms/plugin-mcp` at /api/mcp) with a bearer API key.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const PACK = path.join(ROOT, "content-export", "pack");
const URL = process.env.GROOT_CMS_MCP_URL ?? "https://www.nare.li/api/mcp";
const KEY = process.env.GROOT_CMS_MCP_KEY;
const APPLY = process.argv.includes("--apply");
const LOCALES = ["en", "fr"] as const;
type Locale = (typeof LOCALES)[number];

if (!KEY) throw new Error("GROOT_CMS_MCP_KEY is not set (mint one in the admin: MCP → API keys)");

/** Display order on /projects: newest and most telling first. */
const ORDER = ["muscintime", "gantt-mcp", "aliases", "portfolio", "vscode-commit", "diagevol", "britch", "outrans-counter"];

/** Two projects predate the key-named folders under public/projects. */
const FOLDER: Record<string, string> = {
  "vscode-commit": "vscodeGitCommitMessage",
  "outrans-counter": "outransCounter",
};
const folderOf = (dir: string) => FOLDER[dir] ?? dir;

/** The English status decides the colour; the French status is just words. */
const STATUS_COLOR: Record<string, string> = {
  live: "var(--add)",
  shipped: "var(--dim)",
  ongoing: "var(--accent2)",
  "on hold": "var(--warn)",
  retired: "var(--dim)",
};

/** The group tints the site has always used; a new group falls back to accent. */
const STACK_TINT: Record<string, string> = {
  languages: "var(--accent)", langages: "var(--accent)",
  frontend: "var(--accent2)", front: "var(--accent2)",
  backend: "var(--add)", back: "var(--add)",
  mobile: "var(--warn)",
  data: "var(--accent2)", données: "var(--accent2)", donnees: "var(--accent2)",
  ai: "var(--accent)", ia: "var(--accent)",
  infra: "var(--warn)",
  testing: "var(--add)", tests: "var(--add)",
};

// ── MCP client ─────────────────────────────────────────────────────────────

let rpcId = 0;
async function call<T = unknown>(tool: string, args: Record<string, unknown>): Promise<T> {
  const res = await fetch(URL, {
    method: "POST",
    headers: {
      authorization: `Bearer ${KEY}`,
      "content-type": "application/json",
      accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({ jsonrpc: "2.0", id: ++rpcId, method: "tools/call", params: { name: tool, arguments: args } }),
  });
  const raw = await res.text();
  if (!res.ok) throw new Error(`${tool}: HTTP ${res.status} ${raw.slice(0, 300)}`);
  // Streamable HTTP answers either plain JSON or one SSE frame.
  const data = raw.startsWith("event:") || raw.startsWith("data:")
    ? raw.split("\n").filter((l) => l.startsWith("data:")).map((l) => l.slice(5).trim()).join("")
    : raw;
  const msg = JSON.parse(data) as { result?: { content?: { type: string; text: string }[]; isError?: boolean }; error?: { message: string } };
  if (msg.error) throw new Error(`${tool}: ${msg.error.message}`);
  const text = msg.result?.content?.map((c) => c.text).join("\n") ?? "";
  if (msg.result?.isError || /^(Error|❌)/.test(text.trim())) throw new Error(`${tool}: ${text.slice(0, 500)}`);
  return extract(text) as T;
}

/**
 * The plugin answers in prose with the JSON after it: a list comes as one
 * fenced block per document under a "Total: N documents" line, a single
 * document as the object after the first blank line.
 */
function extract(text: string): { docs: unknown[]; doc: unknown } {
  const fenced = [...text.matchAll(/```json\n([\s\S]*?)\n```/g)].map((m) => JSON.parse(m[1]) as unknown);
  if (fenced.length || /Total: \d+ documents/.test(text)) return { docs: fenced, doc: fenced[0] ?? null };
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  const doc = start >= 0 && end > start ? (JSON.parse(text.slice(start, end + 1)) as unknown) : null;
  return { docs: doc ? [doc] : [], doc };
}

// ── the pack, parsed ───────────────────────────────────────────────────────

interface ProjectDoc {
  key: string;
  name: string;
  stack: string;
  year: string;
  status: string;
  what: string;
  detail: string[];
  links: { label: string; url?: string }[];
  images: string[];
}

const read = (rel: string) => readFileSync(path.join(PACK, rel), "utf8");
const has = (rel: string) => existsSync(path.join(PACK, rel));

/** The project markdown the pack exporter writes, read back. */
function parseProject(md: string): ProjectDoc {
  const lines = md.split("\n");
  const name = lines[0].replace(/^#\s*/, "").trim();
  const meta: Record<string, string> = {};
  let i = 1;
  for (; i < lines.length; i++) {
    const m = lines[i].match(/^- \*\*(\w+):\*\*\s*(.*)$/);
    if (m) meta[m[1]] = m[2].trim();
    else if (lines[i].trim() && !lines[i].startsWith("- **")) break;
  }
  const rest = lines.slice(i).join("\n").trim();
  const [whatLine, ...body] = rest.split("\n");
  const what = whatLine.replace(/^>\s*/, "").trim();
  // Paragraphs are blank-line separated; a bullet block stays one paragraph
  // with its line breaks, which the project view honours.
  const detail = body
    .join("\n")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const links = (meta.links ?? "")
    .split(" · ")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const m = s.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      return m ? { label: m[1], url: m[2] } : { label: s };
    });
  const images = (meta.images ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return { key: meta.key, name, stack: meta.stack ?? "", year: meta.year ?? "—", status: meta.status ?? "", what, detail, links, images };
}

/** "## group\n\n- item" sections → chip groups. */
function parseChips(md: string): { group: string; items: string[] }[] {
  const out: { group: string; items: string[] }[] = [];
  for (const line of md.split("\n")) {
    const g = line.match(/^##\s+(.*)$/);
    if (g) out.push({ group: g[1].trim(), items: [] });
    else if (line.startsWith("- ") && out.length) out[out.length - 1].items.push(line.slice(2).trim());
  }
  return out;
}

interface Profile {
  name: string;
  tagline: string;
  location: string;
  headline: string;
  about: string;
  nowRows: { num: number; sign: string; text: string }[];
  rates: { label: string; value: string }[];
  contact: { label: string; value: string }[];
  contactFooter: string;
}

function parseProfile(md: string): Profile {
  const name = md.split("\n")[0].replace(/^#\s*/, "").trim();
  const meta = (k: string) => md.match(new RegExp(`^- \\*\\*${k}:\\*\\*\\s*(.*)$`, "m"))?.[1].trim() ?? "";
  // Sections by position, not by heading: the French file translates the
  // headings, and the exporter always writes About, Now, Rates, Contact.
  const sections = md.split(/^## .*$/m).slice(1).map((s) => s.trim());
  const section = (title: string) => sections[["About", "Now", "Rates", "Contact"].indexOf(title)] ?? "";
  const diff = section("Now").replace(/^```diff\n?/, "").replace(/\n?```$/, "").split("\n");
  // Line numbers as the /now diff shows them: the old side and the new side
  // each count, removed lines carry the old number, added lines the new.
  let oldN = 19;
  let newN = 19;
  const nowRows = diff.map((l) => {
    const sign = l[0] === "+" || l[0] === "-" ? l[0] : " ";
    const text = l.replace(/^[+\- ]\s?/, "");
    let num: number;
    if (sign === "-") num = oldN++;
    else if (sign === "+") num = newN++;
    else {
      num = newN;
      oldN++;
      newN++;
    }
    return { num, sign, text };
  });
  const pairs = (title: string) =>
    section(title)
      .split("\n")
      .map((l) => l.match(/^- \*\*(.+?)\*\*\s*·\s*(.*)$/))
      .filter((m): m is RegExpMatchArray => !!m)
      .map((m) => ({ label: m[1].trim(), value: m[2].trim() }));
  const contactSection = section("Contact");
  const footer = contactSection.split("\n").filter((l) => l.trim() && !l.startsWith("- ")).pop() ?? "";
  return {
    name,
    tagline: meta("tagline"),
    location: meta("location"),
    headline: meta("availability"),
    about: section("About"),
    nowRows,
    rates: pairs("Rates"),
    contact: pairs("Contact"),
    contactFooter: footer.trim(),
  };
}

interface RoleDoc { key: string; when: string; what: string; where: string; detail: { label?: string; text: string }[] }

/** The role markdown: title is the role, meta lines, then "**Label** — text" lines. */
function parseRole(md: string): RoleDoc {
  const lines = md.split("\n");
  const what = lines[0].replace(/^#\s*/, "").trim();
  const meta = (k: string) => md.match(new RegExp(`^- \\*\\*${k}:\\*\\*\\s*(.*)$`, "m"))?.[1].trim() ?? "";
  const detail = lines
    .filter((l) => l.trim() && !l.startsWith("#") && !l.startsWith("- **"))
    .map((l) => {
      const m = l.match(/^\*\*(.+?)\*\*\s+—\s+(.*)$/);
      return m ? { label: m[1].trim(), text: m[2].trim() } : { text: l.trim() };
    });
  return { key: meta("key"), when: meta("when"), what, where: meta("where"), detail };
}

function parseEducation(md: string): { when: string; what: string; where: string }[] {
  return md
    .split("\n")
    .map((l) => l.match(/^- \*\*(.+?)\*\*\s*·\s*(.+?)\s+—\s+(.+)$/))
    .filter((m): m is RegExpMatchArray => !!m)
    .map((m) => ({ when: m[1].trim(), what: m[2].trim(), where: m[3].trim() }));
}

// ── plan ───────────────────────────────────────────────────────────────────

const projects: Record<Locale, Record<string, ProjectDoc>> = { en: {}, fr: {} };
for (const dir of ORDER) {
  for (const l of LOCALES) {
    const rel = `projects/${dir}/project.${l}.json`.replace(".json", ".md");
    if (!has(rel)) throw new Error(`missing ${rel}`);
    projects[l][dir] = parseProject(read(rel));
  }
}
const profile = { en: parseProfile(read("site/profile.en.md")), fr: parseProfile(read("site/profile.fr.md")) };
const resume = { en: read("site/resume.en.txt").trimEnd(), fr: read("site/resume.fr.txt").trimEnd() };
const stack = { en: parseChips(read("skills/stack.en.md")), fr: parseChips(read("skills/stack.fr.md")) };
const soft = { en: parseChips(read("skills/soft-skills.en.md")), fr: parseChips(read("skills/soft-skills.fr.md")) };
const education = { en: parseEducation(read("education/education.en.md")), fr: parseEducation(read("education/education.fr.md")) };
const ROLE_ORDER = ["nareli", "technis", "freelance", "alpha8", "pasquier", "triskalia", "cdg29"];
const roles: Record<Locale, Record<string, RoleDoc>> = { en: {}, fr: {} };
for (const k of ROLE_ORDER) for (const l of LOCALES) roles[l][k] = parseRole(read(`roles/${k}/role.${l}.md`));
const uiText = { en: JSON.parse(read("ui-text/ui-text.en.json")) as Record<string, unknown>, fr: JSON.parse(read("ui-text/ui-text.fr.json")) as Record<string, unknown> };

const projectBody = (p: ProjectDoc, dir: string, locale: Locale, order: number) => ({
  ...(locale === "en"
    ? {
        key: p.key,
        order,
        stack: p.stack,
        year: p.year || "—",
        statusColor: STATUS_COLOR[projects.en[dir].status.toLowerCase()] ?? "var(--dim)",
        images: p.images.map((img) => ({ path: `/projects/${folderOf(dir)}/${path.basename(img)}` })),
      }
    : {}),
  name: p.name,
  what: p.what,
  status: p.status,
  detail: p.detail.map((text) => ({ text })),
  links: p.links.map((l) => ({ label: l.label, url: l.url ?? null })),
});

const siteBody = (locale: Locale) => {
  const pr = profile[locale];
  return {
    name: pr.name,
    tagline: pr.tagline,
    location: pr.location,
    about: pr.about,
    headline: pr.headline,
    nowRows: pr.nowRows,
    softSkills: soft[locale].map((g, i) => ({ group: g.group, tint: ["var(--accent)", "var(--accent2)", "var(--warn)"][i % 3], items: g.items.map((label) => ({ label })) })),
    stack: stack[locale].map((g) => ({ group: g.group, tint: STACK_TINT[g.group.toLowerCase()] ?? "var(--accent)", items: g.items.map((label) => ({ label })) })),
    rates: pr.rates,
    contact: pr.contact,
    contactFooter: pr.contactFooter,
    resume: resume[locale],
  };
};

console.log(`pack → ${URL}${APPLY ? "" : "  (plan only; add --apply to write)"}\n`);
for (const dir of ORDER) {
  const en = projects.en[dir];
  const fr = projects.fr[dir];
  console.log(`project ${dir}: "${en.name}" / "${fr.name}" · ${en.status}/${fr.status} · ${en.detail.length}/${fr.detail.length} paragraphs · ${en.links.length} links · ${en.images.length} images`);
  if (en.detail.length !== fr.detail.length) console.log(`  ! paragraph count differs between en and fr`);
  for (const img of en.images) {
    if (!existsSync(path.join(ROOT, "public", "projects", folderOf(dir), path.basename(img)))) console.log(`  ! public/projects/${folderOf(dir)}/${path.basename(img)} is missing`);
  }
}
for (const l of LOCALES) {
  const pr = profile[l];
  console.log(`\nsite (${l}): "${pr.about.slice(0, 70)}…" · headline "${pr.headline}" · ${pr.nowRows.length} now rows · ${pr.rates.length} rates · ${pr.contact.length} contacts · footer "${pr.contactFooter}"`);
  console.log(`  stack ${stack[l].map((g) => `${g.group}(${g.items.length})`).join(" ")} · soft ${soft[l].map((g) => `${g.group}(${g.items.length})`).join(" ")} · ${education[l].length} degrees · resume ${resume[l].split("\n").length} lines`);
}

if (!APPLY) process.exit(0);

// ── apply ──────────────────────────────────────────────────────────────────

interface Found<T> { docs: T[]; doc: T | null }
const existing = await call<Found<{ id: number; key: string }>>("findProjects", { limit: 100, locale: "en" });
const byKey = new Map(existing.docs.map((d) => [d.key, d.id]));
console.log(`\nproduction has ${existing.docs.length} projects: ${existing.docs.map((d) => d.key).join(", ")}`);

for (const [i, dir] of ORDER.entries()) {
  const en = projectBody(projects.en[dir], dir, "en", i);
  let id = byKey.get(projects.en[dir].key);
  if (id) {
    await call("updateProjects", { id, locale: "en", ...en });
    console.log(`· updated ${dir} (en)`);
  } else {
    const created = await call<Found<{ id: number }>>("createProjects", { locale: "en", ...en });
    id = created.doc?.id;
    if (!id) throw new Error(`createProjects(${dir}) returned no id`);
    console.log(`· created ${dir} (en) → #${id}`);
  }
  await call("updateProjects", { id, locale: "fr", ...projectBody(projects.fr[dir], dir, "fr", i) });
  console.log(`· updated ${dir} (fr)`);
}
const wanted = new Set(ORDER.map((d) => projects.en[d].key));
for (const d of existing.docs) {
  if (!wanted.has(d.key)) {
    await call("deleteProjects", { id: d.id });
    console.log(`· deleted ${d.key} — not in the pack`);
  }
}

for (const locale of LOCALES) {
  await call("updateSiteContent", { locale, ...siteBody(locale) });
  console.log(`· site content (${locale})`);
}

// Education is recreated rather than updated: its "where" field (the school)
// collides with the update tool's own "where" clause parameter. Three rows,
// ids nobody links to — cheap to replace. The French skips "where": the
// school names are the same in both languages and fall back to English.
const edu = await call<Found<{ id: number }>>("findEducation", { limit: 100, locale: "en" });
for (const old of edu.docs) await call("deleteEducation", { id: old.id });
for (const [i, e] of education.en.entries()) {
  const created = await call<Found<{ id: number }>>("createEducation", { locale: "en", order: i, ...e });
  const id = created.doc?.id;
  if (!id) throw new Error("createEducation returned no id");
  const fr = education.fr[i];
  await call("updateEducation", { id, locale: "fr", when: fr.when, what: fr.what });
}
console.log(`· education (${education.en.length} rows, en + fr)`);

// UI text: the export of the local CMS, both locales. Payload's row ids come
// out with the export and are refused on the way back in, so they go; the
// voiced groups are top-level fields of the global, not one object.
const stripIds = (v: unknown): unknown =>
  Array.isArray(v)
    ? v.map(stripIds)
    : v && typeof v === "object"
      ? Object.fromEntries(Object.entries(v as Record<string, unknown>).filter(([k]) => k !== "id").map(([k, x]) => [k, stripIds(x)]))
      : v;
/**
 * The interface strings the code ships with live in cms/seed.ts; the pack's
 * UI text may predate the newest keys. Read the seed's two `strings: [...]`
 * tables so a push never leaves production behind the code.
 */
function seedStrings(locale: Locale): Record<string, string> {
  const src = readFileSync(path.join(ROOT, "cms", "seed.ts"), "utf8");
  const blocks = [...src.matchAll(/strings: \[\n([\s\S]*?)\n\s*\],/g)].map((m) => m[1]);
  const block = blocks[locale === "en" ? 0 : 1] ?? "";
  const out: Record<string, string> = {};
  for (const m of block.matchAll(/\{ key: "([^"]+)", text: ("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*') \}/g)) {
    out[m[1]] = JSON.parse(m[2].startsWith("'") ? JSON.stringify(m[2].slice(1, -1).replace(/\\'/g, "'")) : m[2]) as string;
  }
  return out;
}

for (const locale of LOCALES) {
  const { voiced, strings: stringMap, ...rest } = uiText[locale];
  const merged = { ...((stringMap as Record<string, string>) ?? {}), ...seedStrings(locale) };
  const strings = Object.entries(merged).map(([key, text]) => ({ key, text }));
  const voicedGroups = Object.fromEntries(Object.entries((voiced as Record<string, unknown>) ?? {}).filter(([, g]) => g));
  await call("updateUiText", { locale, ...(stripIds({ ...rest, ...voicedGroups }) as Record<string, unknown>), strings });
  console.log(`· ui text (${locale}) · ${strings.length} strings`);
}

// Roles: same "where" collision as education, same answer — recreate, and
// let the French "where" fall back to English (only Nareli's differs:
// "Paris / remote" vs "Paris / à distance"; fix that one in the admin).
const existingRoles = await call<Found<{ id: number }>>("findRoles", { limit: 100, locale: "en" });
for (const old of existingRoles.docs) await call("deleteRoles", { id: old.id });
for (const [i, k] of ROLE_ORDER.entries()) {
  const en = roles.en[k];
  const created = await call<Found<{ id: number }>>("createRoles", { locale: "en", key: en.key, order: i, when: en.when, what: en.what, where: en.where, detail: en.detail });
  const id = created.doc?.id;
  if (!id) throw new Error(`createRoles(${k}) returned no id`);
  const fr = roles.fr[k];
  try {
    await call("updateRoles", { id, locale: "fr", when: fr.when, what: fr.what, detail: fr.detail });
  } catch (e) {
    // Until the schema making "where" optional is deployed, the French
    // update is refused; the English row stands and the run goes on.
    console.log(`  ! ${k} (fr) not updated: ${(e as Error).message.split("\n")[0].slice(0, 120)}`);
  }
}
console.log(`· roles (${ROLE_ORDER.length} rows, en + fr)`);

const check = await call<Found<{ key: string; name: string; status: string }>>("findProjects", { limit: 100, locale: "fr", sort: "order" });
console.log(`\nproduction now (fr): ${check.docs.map((d) => `${d.key} "${d.name}" · ${d.status}`).join("\n                     ")}`);
