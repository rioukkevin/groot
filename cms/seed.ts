/**
 * Loads content-export/content.json into Payload as the English locale, and
 * creates the first admin.
 *
 * Idempotent: every write is keyed, so running it twice updates rather than
 * duplicating. French is left empty on purpose — `fallback: true` means the
 * site reads in English until those fields are filled over MCP.
 *
 *   bun run db:up && bun run cms:seed
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { getPayload } from "payload";

import type { RequiredDataFromCollectionSlug, Where } from "payload";

import config from "@payload-config";

import {
  FR_COMMANDS,
  FR_EDUCATION,
  FR_PROJECTS,
  FR_ROLES,
  FR_SITE,
  FR_THEMES,
  FR_UI,
  FR_VOICES,
  FR_WIZARD,
} from "./translations.fr";

interface Export {
  projects: Record<
    string,
    {
      name: string;
      stack: string;
      year: string;
      status: string;
      statusColor: string;
      what: string;
      detail: string[];
      images: string[];
      links: string[];
    }
  >;
  roles: {
    key: string;
    when: string;
    what: string;
    where: string;
    detail: string[];
  }[];
  education: { when: string; what: string; where: string }[];
  softSkills: [string, string[]][];
  stack: [string, string, string[]][];
  rates: string[];
  contact: string[];
  now: { num: number; sign: string; text: string }[];
  nowHeadline: string;
  resume: string;
  commands: [string, string][];
  contactWizard: {
    steps: {
      key: string;
      group: string;
      kind: string;
      question: string;
      label?: string;
      options?: { value: string; label: string; hint?: string; icon: string }[];
    }[];
  };
}

/** The colour tokens the schema actually offers, as the generated types spell them. */
type StatusColor = "var(--add)" | "var(--accent2)" | "var(--warn)" | "var(--del)" | "var(--dim)";
type Tint = "var(--accent)" | "var(--accent2)" | "var(--warn)" | "var(--add)";

const STATUS_COLORS = new Set<string>([
  "var(--add)", "var(--accent2)", "var(--warn)", "var(--del)", "var(--dim)",
]);
const TINTS = new Set<string>([
  "var(--accent)", "var(--accent2)", "var(--warn)", "var(--add)",
]);

const statusColor = (v: string): StatusColor =>
  STATUS_COLORS.has(v) ? (v as StatusColor) : "var(--dim)";
const tint = (v: string): Tint => (TINTS.has(v) ? (v as Tint) : "var(--accent)");

/** "Problem   Orders came in…" → { label: "Problem", text: "Orders came in…" } */
function splitDetail(line: string): { label: string; text: string } {
  const m = /^(\S[^\s]*)\s{2,}(.*)$/.exec(line);
  return m ? { label: m[1], text: m[2] } : { label: "", text: line.trim() };
}

/**
 * "day rate      €600 · remote" → { label, value }. Only lines with a real
 * two-space column split are pairs; anything else is prose and is returned as
 * null so the caller can route it to a footer instead of failing validation on
 * an empty label.
 */
function splitPair(line: string): { label: string; value: string } | null {
  const m = /^(\S+(?:\s\S+)?)\s{2,}(.*)$/.exec(line);
  return m ? { label: m[1], value: m[2] } : null;
}

/** Every line that is a pair, in order. */
const pairs = (lines: string[]) =>
  lines.map(splitPair).filter((p): p is { label: string; value: string } => p !== null);

/** Everything that was not a pair, joined — the trailing prose. */
const trailing = (lines: string[]) =>
  lines.filter((l) => l.trim() && splitPair(l) === null).join(" ");

const seed = async () => {
  const payload = await getPayload({ config });
  const raw = readFileSync(
    path.resolve(process.cwd(), "content-export/content.json"),
    "utf8",
  );
  const data = JSON.parse(raw) as Export;
  const locale = "en" as const;

  // ── first admin ────────────────────────────────────────────────────────
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (email && password) {
    const existing = await payload.find({
      collection: "users",
      where: { email: { equals: email } },
      limit: 1,
    });
    if (existing.docs.length === 0) {
      if (password.length < 12) {
        throw new Error("SEED_ADMIN_PASSWORD must be at least 12 characters.");
      }
      await payload.create({
        collection: "users",
        data: { email, password, name: "Kévin Riou", totpEnabled: false },
      });
      console.log("· created admin", email);
    } else {
      console.log("· admin already exists, left alone");
    }
  } else {
    console.log("! SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD unset, no admin made");
  }

  /** Update by key, or create. Keeps re-runs from duplicating. */
  const upsert = async <S extends "projects" | "roles" | "education">(
    collection: S,
    where: Where,
    data: RequiredDataFromCollectionSlug<S>,
  ) => {
    const found = await payload.find({ collection, where, limit: 1, locale });
    if (found.docs.length) {
      // update() is overloaded on `draft`, and TypeScript cannot relate the
      // generic slug across both branches — the data is the create shape,
      // which is a superset of the partial update takes. One cast, here, so
      // the call sites stay checked.
      await payload.update({
        collection,
        id: found.docs[0].id,
        data,
        locale,
      } as Parameters<typeof payload.update>[0]);
      return "updated";
    }
    await payload.create({ collection, data, locale });
    return "created";
  };

  // ── projects ───────────────────────────────────────────────────────────
  let n = 0;
  for (const [key, p] of Object.entries(data.projects)) {
    await upsert(
      "projects",
      { key: { equals: key } },
      {
        key,
        order: n,
        name: p.name,
        what: p.what,
        stack: p.stack,
        year: p.year,
        status: p.status,
        statusColor: statusColor(p.statusColor),
        detail: p.detail.map((text) => ({ text })),
        links: p.links.map((label) => ({ label })),
        images: p.images.map((path) => ({ path })),
      },
    );
    n++;
  }
  console.log(`· projects ${n}`);

  // ── roles ──────────────────────────────────────────────────────────────
  for (const [i, r] of data.roles.entries()) {
    await upsert(
      "roles",
      { key: { equals: r.key } },
      {
        key: r.key,
        order: i,
        when: r.when,
        what: r.what,
        where: r.where,
        detail: r.detail.map(splitDetail),
      },
    );
  }
  console.log(`· roles ${data.roles.length}`);

  // ── education ──────────────────────────────────────────────────────────
  for (const [i, e] of data.education.entries()) {
    await upsert(
      "education",
      { when: { equals: e.when } },
      { order: i, when: e.when, what: e.what, where: e.where },
    );
  }
  console.log(`· education ${data.education.length}`);

  const sign = (v: string): " " | "+" | "-" =>
    v === "+" || v === "-" ? v : " ";

  // ── site content ───────────────────────────────────────────────────────
  await payload.updateGlobal({
    slug: "site-content",
    locale,
    data: {
      name: "Kévin Riou",
      tagline: "fullstack web & mobile, freelance",
      location: "Paris, France",
      about:
        "Fullstack web and mobile developer, freelance, based in Paris. Runs Nareli, in partnership with @StartAndBrand.",
      headline: data.nowHeadline,
      nowRows: data.now.map((r) => ({
        num: r.num,
        sign: sign(r.sign),
        text: r.text,
      })),
      softSkills: data.softSkills.map(([group, items]) => ({
        group,
        tint: "var(--accent)" as Tint,
        items: items.map((label) => ({ label })),
      })),
      stack: data.stack.map(([group, t, items]) => ({
        group,
        tint: tint(t),
        items: items.map((label) => ({ label })),
      })),
      rates: pairs(data.rates),
      contact: pairs(data.contact),
      contactFooter: trailing(data.contact),
      resume: data.resume,
    },
  });
  console.log("· site content");

  // ── ui text ────────────────────────────────────────────────────────────
  await payload.updateGlobal({
    slug: "ui-text",
    locale,
    data: {
      promptPlaceholder: "ask anything, or / for commands",
      banner: "Available for new work from mid-September",
      modeHint: "(shift+tab to switch language) · ? for shortcuts",
      commands: data.commands.map(([command, description]) => ({
        command,
        description,
        hidden: false,
      })),
      wizardSteps: data.contactWizard.steps.map((s) => ({
        key: s.key,
        group: s.group,
        question: s.question,
        label: s.label ?? "",
        options: (s.options ?? []).map((o) => ({
          value: o.value,
          label: o.label,
          hint: o.hint ?? "",
          icon: o.icon,
        })),
      })),
      themes: [
        { value: "green", label: "green", hint: "phosphor on near-black" },
        { value: "ember", label: "ember", hint: "warm amber, softer" },
        { value: "ice", label: "ice", hint: "cool blue, low glare" },
        { value: "plum", label: "plum", hint: "violet on near-black" },
        { value: "mono", label: "mono", hint: "greyscale, no hue" },
        { value: "paper", label: "paper", hint: "light, printed manual" },
        { value: "white", label: "white", hint: "clean white, blue ink" },
        { value: "linen", label: "linen", hint: "warm white, rust ink" },
      ],
      voices: [
        { value: "warm", label: "warm", hint: "full sentences, first person" },
        { value: "brief", label: "brief", hint: "complete, but nothing spare" },
        { value: "terse", label: "terse", hint: "clipped, sysadmin energy" },
      ],
    },
  });
  console.log("· ui text");

  // ── french ─────────────────────────────────────────────────────────────
  // Written into the same documents under the `fr` locale. Anything not
  // translated is simply not written, and Payload's fallback serves English.
  const fr = "fr" as const;

  let frProjects = 0;
  for (const [key, t] of Object.entries(FR_PROJECTS)) {
    const found = await payload.find({
      collection: "projects",
      where: { key: { equals: key } },
      limit: 1,
    });
    if (!found.docs.length) continue;
    await payload.update({
      collection: "projects",
      id: found.docs[0].id,
      locale: fr,
      data: {
        // `name` is required per locale, and Payload does not fall back on
        // write. Most of these are proper nouns that do not translate, so the
        // English value is carried across unless a French one was written.
        name: t.name ?? found.docs[0].name,
        what: t.what,
        status: t.status,
        detail: t.detail.map((text) => ({ text })),
        ...(t.links ? { links: t.links.map((label) => ({ label })) } : {}),
      },
    });
    frProjects++;
  }
  console.log(`· fr projects ${frProjects}`);

  let frRoles = 0;
  for (const [key, t] of Object.entries(FR_ROLES)) {
    const found = await payload.find({
      collection: "roles",
      where: { key: { equals: key } },
      limit: 1,
    });
    if (!found.docs.length) continue;
    await payload.update({
      collection: "roles",
      id: found.docs[0].id,
      locale: fr,
      data: {
        when: t.when,
        what: t.what,
        where: t.where,
        detail: t.detail.map(([label, text]) => ({ label, text })),
      },
    });
    frRoles++;
  }
  console.log(`· fr roles ${frRoles}`);

  let frEdu = 0;
  for (const [when, what] of Object.entries(FR_EDUCATION)) {
    const found = await payload.find({
      collection: "education",
      where: { when: { equals: when } },
      limit: 1,
    });
    if (!found.docs.length) continue;
    await payload.update({
      collection: "education",
      id: found.docs[0].id,
      locale: fr,
      data: { what },
    });
    frEdu++;
  }
  console.log(`· fr education ${frEdu}`);

  // The /now diff keeps its line numbers and signs from English; only the
  // prose is translated, positionally.
  const frNow = data.now.map((r, i) => ({
    num: r.num,
    sign: sign(r.sign),
    text: FR_SITE.nowRows[i] ?? r.text,
  }));

  await payload.updateGlobal({
    slug: "site-content",
    locale: fr,
    data: {
      tagline: FR_SITE.tagline,
      location: FR_SITE.location,
      about: FR_SITE.about,
      headline: FR_SITE.headline,
      nowRows: frNow,
      softSkills: FR_SITE.softSkills.map(([group, items], i) => ({
        group,
        tint: tint(["var(--accent)", "var(--accent2)", "var(--warn)"][i % 3]),
        items: items.map((label) => ({ label })),
      })),
      stack: FR_SITE.stackGroups.map(([group, items], i) => ({
        group,
        tint: tint(data.stack[i]?.[1] ?? "var(--accent)"),
        items: items.map((label) => ({ label })),
      })),
      rates: FR_SITE.rates.map(([label, value]) => ({ label, value })),
      contactFooter: FR_SITE.contactFooter,
      resume: FR_SITE.resume,
    },
  });
  console.log("· fr site content");

  await payload.updateGlobal({
    slug: "ui-text",
    locale: fr,
    data: {
      promptPlaceholder: FR_UI.promptPlaceholder,
      banner: FR_UI.banner,
      modeHint: FR_UI.modeHint,
      commands: data.commands.map(([command, description]) => ({
        command,
        description: FR_COMMANDS[command] ?? description,
        hidden: false,
      })),
      wizardSteps: data.contactWizard.steps.map((s) => {
        const t = FR_WIZARD[s.key];
        return {
          key: s.key,
          group: t?.group ?? s.group,
          question: t?.question ?? s.question,
          label: t?.label ?? s.label ?? "",
          options: (s.options ?? []).map((o, i) => {
            const to = t?.options?.[i];
            return {
              value: o.value,
              label: to?.label ?? o.label,
              hint: to?.hint ?? o.hint ?? "",
              icon: o.icon,
            };
          }),
        };
      }),
      themes: Object.entries(FR_THEMES).map(([value, hint]) => ({
        value,
        label: value,
        hint,
      })),
      voices: Object.entries(FR_VOICES).map(([value, hint]) => ({
        value,
        label: value,
        hint,
      })),
    },
  });
  console.log("· fr ui text");

  console.log("\nSeeded English and French.");
  process.exit(0);
};

// Not top-level await: `payload run` transpiles this to CJS, where top-level
// await is a syntax error.
seed().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
