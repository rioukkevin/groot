import "server-only";

import { getPayload } from "payload";

import config from "@payload-config";

import type { Locale } from "./locale";
import type {
  CmsChipGroup,
  CmsProject,
  ShellContentData,
} from "./shell-content";
import type { DiffRow } from "./types";

/**
 * Reads the shell's content out of Payload for one locale.
 *
 * Localisation is Payload's, not ours: asking for `fr` returns French where it
 * exists and English where it does not, because the config sets
 * `fallback: true`. Nothing here re-implements that rule — there is one locale
 * system and this is a read against it.
 */

/** The voiced groups the UI Text global carries. */
const VOICED_KEYS = [
  "intro",
  "help",
  "projects",
  "about",
  "skills",
  "stack",
  "rates",
  "contact",
  "now",
  "photos",
  "noMatch",
] as const;

/** Payload returns `T | null | undefined` for optional arrays; this flattens. */
const arr = <T,>(v: T[] | null | undefined): T[] => v ?? [];
const str = (v: string | null | undefined, fallback = ""): string =>
  typeof v === "string" && v.length ? v : fallback;

export async function getShellContent(
  locale: Locale,
): Promise<ShellContentData> {
  const payload = await getPayload({ config });

  const [projects, roles, education, site, ui] = await Promise.all([
    payload.find({ collection: "projects", locale, limit: 100, sort: "order" }),
    payload.find({ collection: "roles", locale, limit: 100, sort: "order" }),
    payload.find({ collection: "education", locale, limit: 100, sort: "order" }),
    payload.findGlobal({ slug: "site-content", locale }),
    payload.findGlobal({ slug: "ui-text", locale }),
  ]);

  const projectMap: Record<string, CmsProject> = {};
  for (const p of projects.docs) {
    projectMap[p.key] = {
      key: p.key,
      name: str(p.name),
      stack: str(p.stack),
      year: str(p.year, "—"),
      status: str(p.status),
      statusColor: str(p.statusColor, "var(--dim)"),
      what: str(p.what),
      detail: arr(p.detail).map((d) => str(d.text)),
      images: arr(p.images)
        .map((i) =>
          typeof i.image === "object" && i.image && "url" in i.image
            ? str(i.image.url)
            : str(i.path),
        )
        .filter(Boolean),
      // Carried as markdown, `[label](url)`, so every consumer — the shell,
      // llms.txt, the MCP tools — gets a real link in one string.
      links: arr(p.links).map((l) => (l.url ? `[${str(l.label)}](${str(l.url)})` : str(l.label))),
    };
  }

  const chips = (
    groups: { group?: string | null; tint?: string | null; items?: { label?: string | null }[] | null }[] | null | undefined,
  ): CmsChipGroup[] =>
    arr(groups).map((g) => [
      str(g.group),
      str(g.tint, "var(--accent)"),
      arr(g.items).map((i) => str(i.label)),
    ]);

  return {
    locale,
    strings: Object.fromEntries(
      arr(ui.strings).map((r) => [str(r.key), str(r.text)]),
    ),
    commands: arr(ui.commands)
      .filter((c) => !c.hidden)
      .map((c) => [str(c.command), str(c.description)] as [string, string]),
    projects: projectMap,
    roles: roles.docs.map((r) => ({
      key: r.key,
      when: str(r.when),
      what: str(r.what),
      where: str(r.where),
      // Label and text travel as one string, two spaces apart; the role
      // view splits them back and lays the label out as a hanging column.
      detail: arr(r.detail).map((d) => (d.label ? `${d.label}  ${str(d.text)}` : str(d.text))),
    })),
    education: education.docs.map((e) => ({
      when: str(e.when),
      what: str(e.what),
      where: str(e.where),
    })),
    softSkills: chips(site.softSkills),
    stack: chips(site.stack),
    rates: arr(site.rates).map((r) => [str(r.label), str(r.value)] as [string, string]),
    contact: arr(site.contact).map((c) => [str(c.label), str(c.value)] as [string, string]),
    contactFooter: str(site.contactFooter),
    nowRows: arr(site.nowRows).map(
      (r): DiffRow => ({
        num: typeof r.num === "number" ? r.num : 0,
        sign: str(r.sign, " "),
        text: str(r.text),
      }),
    ),
    nowHeadline: str(site.headline),
    resume: str(site.resume),
    name: str(site.name, "Kévin Riou"),
    location: str(site.location, "Paris, France"),
    about: str(site.about),
    tagline: str(site.tagline),
    ui: {
      promptPlaceholder: str(ui.promptPlaceholder, "ask anything, or / for commands"),
      banner: str(ui.banner),
      modeHint: str(ui.modeHint),
    },
    introHints: arr(ui.introHints).map(
      (h) => [str(h.key, "try"), str(h.text), str(h.label)] as [string, string, string],
    ),
    voiced: Object.fromEntries(
      VOICED_KEYS.map((k) => {
        const g = (ui as unknown as Record<string, unknown>)[k] as
          | { warm?: string | null; brief?: string | null; terse?: string | null }
          | undefined;
        return [
          k,
          {
            warm: str(g?.warm),
            brief: str(g?.brief),
            terse: str(g?.terse),
          },
        ];
      }),
    ),
    wizard: arr(ui.wizardSteps).map((s) => ({
      key: str(s.key),
      group: str(s.group),
      question: str(s.question),
      label: str(s.label),
      options: arr(s.options).map((o) => ({
        value: str(o.value),
        label: str(o.label),
        hint: str(o.hint),
        icon: str(o.icon, "*"),
      })),
    })),
    themeHints: Object.fromEntries(
      arr(ui.themes).map((t) => [str(t.value), str(t.hint)]),
    ),
    voiceHints: Object.fromEntries(
      arr(ui.voices).map((v) => [str(v.value), str(v.hint)]),
    ),
  };
}

