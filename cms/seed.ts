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

import type { Where } from "payload";

import config from "@payload-config";

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
  const upsert = async (
    collection: "projects" | "roles" | "education",
    where: Where,
    data: Record<string, unknown>,
  ) => {
    const found = await payload.find({ collection, where, limit: 1, locale });
    if (found.docs.length) {
      await payload.update({
        collection,
        id: found.docs[0].id,
        data,
        locale,
      });
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
        statusColor: p.statusColor,
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
      nowRows: data.now.map((r) => ({ num: r.num, sign: r.sign, text: r.text })),
      softSkills: data.softSkills.map(([group, items]) => ({
        group,
        tint: "var(--accent)",
        items: items.map((label) => ({ label })),
      })),
      stack: data.stack.map(([group, tint, items]) => ({
        group,
        tint,
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
  console.log("\nSeeded English. French is empty and falls back until filled.");
  process.exit(0);
};

// Not top-level await: `payload run` transpiles this to CJS, where top-level
// await is a syntax error.
seed().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
