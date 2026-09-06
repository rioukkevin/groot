import { readFileSync } from "node:fs";

import { hydrate } from "@/lib/terminal/shell-content";

import type { CommandContext } from "@/lib/terminal/commands";
import type { Locale } from "@/lib/terminal/locale";
import type { ShellContent, ShellContentData } from "@/lib/terminal/shell-content";

/**
 * The shell's content as the tests see it: the exported snapshot in
 * content-export/content.json, shaped like what the CMS hands the client.
 * Interface strings are left empty so the code's own fallbacks are what is
 * tested — the CMS copy can change without breaking a test.
 */
interface Export {
  commands: [string, string][];
  projects: ShellContentData["projects"];
  roles: ShellContentData["roles"];
  education: ShellContentData["education"];
  softSkills: [string, string[]][];
  stack: [string, string, string[]][];
  rates: string[];
  contact: string[];
  now: ShellContentData["nowRows"];
  nowHeadline: string;
  resume: string;
  contactWizard: { steps: ShellContentData["wizard"] };
}

const raw = JSON.parse(readFileSync("content-export/content.json", "utf8")) as Export;

/** "label   value" rows become [label, value] pairs; blank rows are dropped. */
const pairs = (rows: string[]): [string, string][] =>
  rows
    .filter((r) => r.trim() && /\s{2,}/.test(r))
    .map((r) => {
      const [label, ...rest] = r.split(/\s{2,}/);
      return [label.trim(), rest.join(" ").trim()];
    });

export function contentFor(locale: Locale): ShellContent {
  const data: ShellContentData = {
    locale,
    commands: raw.commands,
    // The export keys the map by project key without repeating it inside.
    projects: Object.fromEntries(
      Object.entries(raw.projects).map(([key, p]) => [key, { ...p, key }]),
    ),
    roles: raw.roles,
    education: raw.education,
    softSkills: raw.softSkills.map(([g, items]) => [g, "var(--accent)", items]),
    stack: raw.stack,
    rates: pairs(raw.rates),
    contact: pairs(raw.contact),
    contactFooter: raw.contact[raw.contact.length - 1] ?? "",
    nowRows: raw.now,
    nowHeadline: raw.nowHeadline,
    resume: raw.resume,
    name: "Kévin Riou",
    location: "Paris, France",
    about: "Fullstack web and mobile developer, freelance, based in Paris.",
    tagline: "fullstack web & mobile, freelance",
    ui: { promptPlaceholder: "", banner: "", modeHint: "" },
    strings: {},
    introHints: [],
    voiced: {},
    wizard: raw.contactWizard.steps,
    themeHints: {},
    voiceHints: {},
  };
  return hydrate(data);
}

export function contextFor(locale: Locale): CommandContext {
  return {
    content: contentFor(locale),
    cols: 100,
  theme: "green",
    voice: "warm",
    photoGap: 3,
    download: () => {},
    setTheme: () => {},
    setVoice: () => {},
  };
}
