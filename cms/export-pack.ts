/**
 * Writes the CMS content as a folder a person can read and hand around: one
 * folder per project with its write-up in both languages and its screenshots
 * beside it, then roles, education, skills, the site profile and the UI text.
 * A zip of the whole thing sits next to the folder.
 *
 *   bun run content:pack        → content-export/pack/ and content-export/content-pack.zip
 *
 * Reads Payload directly, both locales, French falling back to English where
 * it is not written — the same read the site does. Nothing here writes to the
 * CMS; it is an export, so the pack can be regenerated at any time.
 */
import { copyFileSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

import { getPayload } from "payload";

import config from "@payload-config";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "content-export", "pack");
const LOCALES = ["en", "fr"] as const;

const str = (v: unknown, fallback = ""): string => (typeof v === "string" && v.length ? v : fallback);
const arr = <T,>(v: T[] | null | undefined): T[] => v ?? [];

const write = (rel: string, text: string) => {
  const file = path.join(OUT, rel);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, text.endsWith("\n") ? text : text + "\n");
};
const json = (rel: string, data: unknown) => write(rel, JSON.stringify(data, null, 2));

const meta = (rows: [string, string | undefined][]) =>
  rows
    .filter(([, v]) => v)
    .map(([k, v]) => `- **${k}:** ${v}`)
    .join("\n");

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const payload = await getPayload({ config });

for (const locale of LOCALES) {
  const [projects, roles, education, site, ui] = await Promise.all([
    payload.find({ collection: "projects", locale, limit: 100, sort: "order" }),
    payload.find({ collection: "roles", locale, limit: 100, sort: "order" }),
    payload.find({ collection: "education", locale, limit: 100, sort: "order" }),
    payload.findGlobal({ slug: "site-content", locale }),
    payload.findGlobal({ slug: "ui-text", locale }),
  ]);

  // ── projects: one folder each, images copied in once ───────────────────
  for (const p of projects.docs) {
    const dir = `projects/${p.key}`;
    const images: string[] = [];
    for (const i of arr(p.images)) {
      const src =
        typeof i.image === "object" && i.image && "url" in i.image ? str(i.image.url) : str(i.path);
      if (!src) continue;
      const name = path.basename(src);
      if (src.startsWith("/") && existsSync(path.join(ROOT, "public", src))) {
        mkdirSync(path.join(OUT, dir, "images"), { recursive: true });
        copyFileSync(path.join(ROOT, "public", src), path.join(OUT, dir, "images", name));
        images.push(`images/${name}`);
      } else {
        // An upload that lives in Blob: keep the address, there is no local file.
        images.push(src);
      }
    }
    write(
      `${dir}/project.${locale}.md`,
      [
        `# ${str(p.name)}`,
        "",
        meta([
          ["key", p.key],
          ["stack", str(p.stack)],
          ["year", str(p.year, "—")],
          ["status", str(p.status)],
          ["links", arr(p.links).map((l) => (l.url ? `[${str(l.label)}](${str(l.url)})` : str(l.label))).join(" · ") || undefined],
          ["images", images.join(", ") || undefined],
        ]),
        "",
        `> ${str(p.what)}`,
        "",
        ...arr(p.detail).map((d) => str(d.text) + "\n"),
      ].join("\n"),
    );
  }

  // ── roles ───────────────────────────────────────────────────────────────
  for (const r of roles.docs) {
    write(
      `roles/${r.key}/role.${locale}.md`,
      [
        `# ${str(r.what)}`,
        "",
        meta([
          ["key", r.key],
          ["when", str(r.when)],
          ["where", str(r.where)],
        ]),
        "",
        ...arr(r.detail).map((d) => (d.label ? `**${d.label}** — ${str(d.text)}` : str(d.text)) + "\n"),
      ].join("\n"),
    );
  }

  // ── education, skills ───────────────────────────────────────────────────
  write(
    `education/education.${locale}.md`,
    ["# Education", "", ...education.docs.map((e) => `- **${str(e.when)}** · ${str(e.what)} — ${str(e.where)}`)].join("\n"),
  );
  const chips = (groups: { group?: string | null; items?: { label?: string | null }[] | null }[] | null | undefined) =>
    arr(groups).map((g) => `## ${str(g.group)}\n\n${arr(g.items).map((i) => `- ${str(i.label)}`).join("\n")}`).join("\n\n");
  write(`skills/stack.${locale}.md`, `# Stack\n\n${chips(site.stack)}`);
  write(`skills/soft-skills.${locale}.md`, `# Soft skills\n\n${chips(site.softSkills)}`);

  // ── site profile ────────────────────────────────────────────────────────
  write(
    `site/profile.${locale}.md`,
    [
      `# ${str(site.name, "Kévin Riou")}`,
      "",
      meta([
        ["tagline", str(site.tagline)],
        ["location", str(site.location)],
        ["availability", str(site.headline)],
        ["banner", str(ui.banner)],
      ]),
      "",
      "## About",
      "",
      str(site.about),
      "",
      "## Now",
      "",
      "```diff",
      ...arr(site.nowRows).map((r) => `${str(r.sign, " ")} ${str(r.text)}`),
      "```",
      "",
      "## Rates",
      "",
      ...arr(site.rates).map((r) => `- **${str(r.label)}** · ${str(r.value)}`),
      "",
      "## Contact",
      "",
      ...arr(site.contact).map((c) => `- **${str(c.label)}** · ${str(c.value)}`),
      "",
      str(site.contactFooter),
    ].join("\n"),
  );
  if (site.resume) write(`site/resume.${locale}.txt`, str(site.resume));

  // ── UI text, as data: it is keyed, not prose ────────────────────────────
  json(`ui-text/ui-text.${locale}.json`, {
    promptPlaceholder: ui.promptPlaceholder,
    banner: ui.banner,
    modeHint: ui.modeHint,
    commands: arr(ui.commands).map((c) => ({ command: c.command, description: c.description, hidden: !!c.hidden })),
    introHints: arr(ui.introHints).map((h) => ({ key: h.key, label: h.label ?? "", text: h.text })),
    voiced: Object.fromEntries(
      ["intro", "help", "projects", "about", "skills", "stack", "rates", "contact", "now", "photos", "noMatch"].map((k) => [
        k,
        (ui as unknown as Record<string, unknown>)[k],
      ]),
    ),
    wizardSteps: ui.wizardSteps,
    themes: ui.themes,
    voices: ui.voices,
    strings: Object.fromEntries(arr(ui.strings).map((s) => [str(s.key), str(s.text)])),
  });
}

write(
  "README.md",
  `# Content pack

Everything the site says, exported from the CMS on ${new Date().toISOString().slice(0, 10)}. English is the
source of record; the French files fall back to English wherever a line is
not yet written, exactly as the site does.

| folder | what | CMS home |
| --- | --- | --- |
| \`projects/<key>/\` | \`project.en.md\`, \`project.fr.md\`, \`images/\` (the screenshots the site shows, thumbnail first) | Projects collection |
| \`roles/<key>/\` | \`role.en.md\`, \`role.fr.md\` | Roles collection |
| \`education/\` | the degrees, one file per language | Education collection |
| \`skills/\` | the stack and the soft skills, grouped as the chips are | Site content → stack, softSkills |
| \`site/\` | profile, availability, rates, contact, the plain-text CV | Site content |
| \`ui-text/\` | commands, voiced lines, hints, wizard, interface strings, as JSON | UI text |

Regenerate with \`bun run content:pack\`. The pack is an export: editing it
changes nothing until the change is made in the admin (or in \`cms/seed.ts\`
and reseeded).
`,
);

await payload.db.destroy?.();
console.log(`→ ${path.relative(ROOT, OUT)}`);
process.exit(0);
