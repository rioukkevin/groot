/**
 * The shape of the shell's content, and the lookup the client attaches.
 *
 * Kept out of `cms.ts` because that module is `server-only`: the client needs
 * these types and `hydrate`, but must never pull in the Payload runtime.
 */
import type { Locale } from "./locale";
import type { DiffRow } from "./types";

export interface CmsProject {
  key: string;
  name: string;
  stack: string;
  year: string;
  status: string;
  statusColor: string;
  what: string;
  detail: string[];
  images: string[];
  /** Markdown links, `[label](url)`; a bare label when there is no URL yet. */
  links: string[];
}

export interface CmsRole {
  key: string;
  when: string;
  what: string;
  where: string;
  detail: string[];
}

export interface CmsStudy {
  when: string;
  what: string;
  where: string;
}

/** [group, tint, items] */
export type CmsChipGroup = [string, string, string[]];

export interface CmsWizardStep {
  key: string;
  group: string;
  question: string;
  label: string;
  options: { value: string; label: string; hint: string; icon: string }[];
}

export interface ShellContentData {
  locale: Locale;
  commands: [string, string][];
  projects: Record<string, CmsProject>;
  roles: CmsRole[];
  education: CmsStudy[];
  softSkills: CmsChipGroup[];
  stack: CmsChipGroup[];
  rates: [string, string][];
  contact: [string, string][];
  contactFooter: string;
  nowRows: DiffRow[];
  nowHeadline: string;
  resume: string;
  name: string;
  location: string;
  about: string;
  tagline: string;
  ui: {
    promptPlaceholder: string;
    banner: string;
    modeHint: string;
  };
  /**
   * Short interface strings by key. Plain data, because a function cannot
   * cross the server-to-client boundary — the lookup is attached on the client
   * by `hydrate()`.
   */
  strings: Record<string, string>;
  /** The lines under the intro: [kind, text, label] per row. */
  introHints: [string, string, string][];
  /** The voiced copy for this locale, keyed. Empty entries fall back to code. */
  voiced: Record<string, { warm: string; brief: string; terse: string }>;
  wizard: CmsWizardStep[];
  themeHints: Record<string, string>;
  voiceHints: Record<string, string>;
}

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

/** `ShellContent` is the data plus the string lookup the client attaches. */
export type ShellContent = ShellContentData & {
  s: (key: string, fallback: string) => string;
};

/**
 * Adds the string lookup to the serialised content. Called once on the client:
 * the server can only send data across, not functions.
 */
export function hydrate(data: ShellContentData): ShellContent {
  return {
    ...data,
    s: (key, fallback) => data.strings[key] || fallback,
  };
}
