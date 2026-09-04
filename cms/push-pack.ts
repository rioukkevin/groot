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
  if (msg.result?.isError) throw new Error(`${tool}: ${text.slice(0, 500)}`);
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
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

interface Found<T> { docs: T[]; totalDocs?: number }
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
    const created = await call<{ id: number } | { doc: { id: number } }>("createProjects", { locale: "en", ...en });
    id = "doc" in created ? created.doc.id : created.id;
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

const edu = await call<Found<{ id: number; order?: number }>>("findEducation", { limit: 100, locale: "en", sort: "order" });
const rows = edu.docs.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
for (const [i, e] of education.en.entries()) {
  const target = rows[i];
  if (target) {
    await call("updateEducation", { id: target.id, locale: "en", order: i, ...e });
    await call("updateEducation", { id: target.id, locale: "fr", ...education.fr[i] });
  } else {
    const created = await call<{ id: number } | { doc: { id: number } }>("createEducation", { locale: "en", order: i, ...e });
    const id = "doc" in created ? created.doc.id : created.id;
    await call("updateEducation", { id, locale: "fr", ...education.fr[i] });
  }
}
for (const extra of rows.slice(education.en.length)) await call("deleteEducation", { id: extra.id });
console.log(`· education (${education.en.length} rows, en + fr)`);

const check = await call<Found<{ key: string; name: string; status: string }>>("findProjects", { limit: 100, locale: "fr", sort: "order" });
console.log(`\nproduction now (fr): ${check.docs.map((d) => `${d.key} "${d.name}" · ${d.status}`).join("\n                     ")}`);
