import { describe, expect, test } from "bun:test";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";

import { answerQuestion } from "@/lib/terminal/answer";
import { unmark } from "@/lib/terminal/highlight";
import { projectByOrdinal, roleByOrdinal } from "@/lib/terminal/slots";

import { contextFor } from "./fixtures/content";
import { displayKinds, full, litRows, marked, said, toolCalls, toolNames } from "./helpers";

import type { Answer } from "@/lib/terminal/answer";
import type { Locale } from "@/lib/terminal/locale";
import type { ShellContent } from "@/lib/terminal/shell-content";

/**
 * The golden set: a thousand questions per language, the way visitors type
 * them, each labelled with its intent and slot (ml/data/<lang>/questions.*).
 *
 * Every question runs through the shipped model and the answer layer, and
 * what comes out is compared with one expectation table: which tools are
 * called and with what, which command runs, which fact is lit, and which
 * blocks make up the rich display. The same questions are in the training
 * data, so this is an acceptance test — the pass rate is asserted as a
 * floor and every miss is written to ml/out for the next training round.
 * Generalisation is measured elsewhere, on ml/data/<lang>/eval.json, which
 * is never trained on.
 *
 * Two kinds of assertion:
 *   - per language and per intent, the share of questions handled exactly
 *     as the table says must stay above a floor;
 *   - for every question, whatever the model decided, the display must be
 *     well-formed: known tools, no leaked placeholders, a command's blocks
 *     matching that command, a lit fact wherever the command shows one.
 */

interface Row {
  q: string;
  intent: string;
  slot?: string;
  last?: string;
}

interface Expected {
  tools: string[];
  command: string | null;
  display: string[];
  /** Substring the highlighted fact must contain, if any. */
  mark?: string;
  /** Substring some lit row of the display must contain, if any. */
  lit?: string;
  effect?: Answer["effect"];
  /** The question cannot be answered: unresolved, or a hedged best guess. */
  unknown?: boolean;
}

/** What each command's rich display is made of, once the answer sentence
 *  has replaced its preamble. */
const DISPLAY: Record<string, string[]> = {
  "/now": ["diff"],
  "/rates": ["cards"],
  "/contact": ["lines", "contact"],
  "/email": ["lines"],
  "/about": ["say"],
  "/roles": ["tool", "select"],
  "/role": ["tool", "lines"],
  "/projects": ["tool", "say", "select"],
  "/project": ["tool", "project"],
  "/stack": ["chips"],
  "/skills": ["chips", "lines"],
  "/education": ["tool", "lines"],
  "/photos": ["tool", "shots"],
  "/resume": ["tool", "action"],
  "/theme": ["picker"],
  "/voice": ["voice"],
  "/help": ["lines"],
};
/** The same commands when reached by "tell me more", preamble kept. */
const DISPLAY_DEEPER: Record<string, string[]> = {
  ...DISPLAY,
  "/rates": ["cards", "say"],
  "/contact": ["lines", "say", "contact"],
  "/stack": ["say", "chips"],
  "/skills": ["say", "chips", "lines"],
};
const DEEPER: Record<string, string | null> = {
  "/about": "/roles", "/now": "/rates", "/rates": "/contact", "/contact": "/email", "/email": "/contact",
  "/stack": "/skills", "/skills": "/stack", "/education": "/roles", "/resume": "/roles", "/photos": "/projects",
  "/theme": "/voice", "/voice": "/theme", "/projects": null, "/roles": null, "/project": null, "/help": null,
};

function expected(row: Row, c: ShellContent): Expected {
  const s = row.slot;
  const base = (cmd: string) => cmd.split(" ")[0];
  switch (row.intent) {
    case "get_availability":
      return { tools: ["get_availability"], command: "/now", display: DISPLAY["/now"], mark: "September" };
    case "get_rates": {
      // Without a slot any rate row may be lit; the picker's choice is not what is under test.
      const label = s ? { development: "development", management: "management", consulting: "consulting", fixed: "fixed price" }[s] : undefined;
      return { tools: ["get_rates"], command: "/rates", display: DISPLAY["/rates"], lit: label ?? " · " };
    }
    case "get_contact": {
      const value = s === "github" ? "github.com" : s === "linkedin" ? "in/kevinatooof" : "kevin@nare.li";
      return { tools: ["get_contact"], command: "/contact", display: DISPLAY["/contact"], mark: value, lit: value };
    }
    case "get_email":
      return { tools: ["get_contact"], command: "/email", display: DISPLAY["/email"], mark: "kevin@nare.li" };
    case "get_profile":
      return { tools: ["get_profile"], command: "/about", display: DISPLAY["/about"], mark: c.name };
    case "list_roles":
      return { tools: ["list_roles"], command: "/roles", display: DISPLAY["/roles"], lit: c.roles[0].key };
    case "get_role": {
      const key = s === "latest" || s === "first" ? roleByOrdinal(s, c) : s;
      if (!key) return { tools: ["list_roles"], command: "/roles", display: DISPLAY["/roles"] };
      const role = c.roles.find((r) => r.key === key);
      return { tools: ["list_roles", `get_role(${key})`], command: `/role ${key}`, display: DISPLAY["/role"], mark: role?.what, lit: role?.what };
    }
    case "list_projects":
      return { tools: ["list_projects"], command: "/projects", display: DISPLAY["/projects"] };
    case "get_project": {
      const key = s === "latest" || s === "first" ? projectByOrdinal(s, c) : s;
      if (!key) return { tools: ["list_projects"], command: "/projects", display: DISPLAY["/projects"] };
      const p = c.projects[key];
      return { tools: ["list_projects", `get_project(${key})`], command: `/project ${key}`, display: DISPLAY["/project"], mark: p.name, lit: p.what };
    }
    case "get_skills":
      if (!s) return { tools: ["get_skills"], command: "/stack", display: DISPLAY["/stack"] };
      if (s.startsWith("other:")) return { tools: ["get_skills", "search_content"], command: "/stack", display: DISPLAY["/stack"], mark: s.slice(6) };
      return { tools: ["get_skills"], command: "/stack", display: DISPLAY["/stack"], mark: s, lit: s };
    case "get_soft_skills":
      return { tools: ["get_skills"], command: "/skills", display: DISPLAY["/skills"] };
    case "get_education":
      return { tools: ["get_skills"], command: "/education", display: DISPLAY["/education"], mark: c.education[0].what, lit: c.education[0].what };
    case "get_photos":
      return { tools: [], command: "/photos", display: DISPLAY["/photos"] };
    case "get_resume":
      return { tools: [], command: "/resume", display: DISPLAY["/resume"] };
    case "set_theme":
      // Unlabelled: the picker, or a palette the synonyms resolved — either is the right route.
      return s ? { tools: [], command: `/theme ${s}`, display: [], mark: s } : { tools: [], command: "/theme*", display: [] };
    case "set_voice":
      return s ? { tools: [], command: `/voice ${s}`, display: [], mark: s } : { tools: [], command: "/voice*", display: [] };
    case "help":
      return { tools: [], command: "/help", display: DISPLAY["/help"] };
    case "clear":
      return { tools: [], command: null, display: [], effect: "clear" };
    case "about_site":
      return { tools: [], command: null, display: [], mark: "neural net" };
    case "more": {
      const last = row.last ?? "";
      const next = DEEPER[base(last)];
      return next
        ? { tools: [], command: next, display: DISPLAY_DEEPER[next] ?? [], mark: next }
        : { tools: [], command: null, display: [] };
    }
    case "language":
      return s && s !== c.locale
        ? { tools: [], command: null, display: [], effect: "switch-locale" }
        : { tools: [], command: null, display: [] };
    case "unknown":
      return { tools: [], command: null, display: [], unknown: true };
    default:
      // greeting, thanks, goodbye, how_are_you, compliment, affirm, deny
      return { tools: [], command: null, display: [] };
  }
}

const HEDGE = /not sure i read that right|pas sûr d'avoir bien lu/i;

/** Why a case missed, or null when it matched the table. */
function judge(a: Answer, e: Expected): string | null {
  if (e.unknown) {
    const hedged = said(a).some((s) => HEDGE.test(s));
    return a.unresolved || hedged ? null : `answered confidently: ${a.command ?? said(a)[0]?.slice(0, 60)}`;
  }
  const tools = toolNames(a).filter((t) => t !== "classify");
  const calls = toolCalls(a).filter((t) => !t.startsWith("classify"));
  const wantTools = e.tools.map((t) => t.replace(/\(.*\)$/, ""));
  if (JSON.stringify(tools) !== JSON.stringify(wantTools)) return `tools ${JSON.stringify(tools)} ≠ ${JSON.stringify(wantTools)}`;
  for (const t of e.tools) {
    if (t.includes("(") && !calls.includes(t)) return `call ${t} missing from ${JSON.stringify(calls)}`;
  }
  const wildcard = e.command?.endsWith("*") ? e.command.slice(0, -1) : null;
  if (wildcard ? !(a.command ?? "").startsWith(wildcard) : a.command !== e.command) return `command ${a.command} ≠ ${e.command}`;
  if ((a.effect ?? undefined) !== e.effect) return `effect ${a.effect} ≠ ${e.effect}`;
  if (a.unresolved) return "unresolved";
  const kinds = displayKinds(a);
  if (!wildcard && JSON.stringify(kinds) !== JSON.stringify(e.display)) return `display ${JSON.stringify(kinds)} ≠ ${JSON.stringify(e.display)}`;
  if (e.mark && !marked(a).join(" · ").toLowerCase().includes(e.mark.toLowerCase())) return `mark ${JSON.stringify(marked(a))} lacks ${e.mark}`;
  if (e.lit && !litRows(a).join(" · ").toLowerCase().includes(e.lit.toLowerCase())) return `lit ${JSON.stringify(litRows(a))} lacks ${e.lit}`;
  return null;
}

function load(locale: Locale): Row[] {
  const dir = `ml/data/${locale}`;
  return readdirSync(dir)
    .filter((f) => /^questions\..*\.json$/.test(f))
    .sort()
    .flatMap((f) => JSON.parse(readFileSync(`${dir}/${f}`, "utf8")) as Row[]);
}

/** The floors. Set just under what the shipped models reach, so a regression
 *  fails the suite while a lucky retrain does not move the bar. */
const FLOOR_OVERALL = 0.985;
const FLOOR_INTENT = 0.9;

for (const locale of ["en", "fr"] as const) {
  const rows = load(locale);
  const ctx = contextFor(locale);

  describe(`golden questions · ${locale} (${rows.length})`, () => {
    if (!rows.length) return;

    const results: { row: Row; miss: string | null; a: Answer }[] = [];

    test("every question is answered", async () => {
      for (const row of rows) {
        const a = await answerQuestion(row.q, ctx, row.last ?? null, full);
        results.push({ row, miss: judge(a, expected(row, ctx.content)), a });
      }
      expect(results.length).toBe(rows.length);
    });

    test("every answer is well-formed, whatever the model decided", () => {
      for (const { row, a } of results) {
        const texts = [...said(a), ...thoughtOf(a)];
        for (const s of texts) {
          expect(unmark(s), row.q).not.toMatch(/\{[a-z]+\}/i);
          expect(unmark(s), row.q).not.toMatch(/⟦|⟧/);
        }
        // A command's blocks are that command's, with its preamble replaced
        // by the answer — or kept when reached through "more".
        if (a.command) {
          const base = a.command.split(" ")[0];
          // The preamble say comes and goes with the path taken; the rest is fixed.
          const noSay = (k: string[]) => k.filter((x) => x !== "say");
          const kinds = noSay(displayKinds(a));
          // "/theme green" applies and shows nothing; "/theme" shows the picker.
          const applied = ["/theme", "/voice"].includes(base) && a.command.includes(" ");
          const want = applied ? [] : DISPLAY[base];
          const ok = want !== undefined && JSON.stringify(noSay(want)) === JSON.stringify(kinds);
          expect(ok, `${row.q} → ${a.command} shows ${JSON.stringify(kinds)}`).toBe(true);
          // A named role or project is fetched by name before it is shown.
          const arg = a.command.split(" ")[1];
          if (base === "/role" && arg) expect(toolCalls(a), row.q).toContain(`get_role(${arg})`);
          if (base === "/project" && arg) expect(toolCalls(a), row.q).toContain(`get_project(${arg})`);
          // Where the display carries the claimed fact, it is lit. A "tell me
          // more" answer marks the command name instead, and lights nothing.
          const facts = marked(a).filter((m) => !m.startsWith("/"));
          if (["/role", "/project", "/rates", "/email", "/contact", "/education"].includes(base) && facts.length) {
            expect(litRows(a).length > 0 || base === "/email", `${row.q} → ${a.command} lights nothing`).toBe(true);
          }
        }
        // The classify line names the tier and the intent it chose.
        const intro = a.intro[0];
        expect(intro.kind === "tool" && /neural net|light model/.test(intro.meta), row.q).toBe(true);
      }
    });

    test(`pass rate is at least ${FLOOR_OVERALL * 100}% overall and ${FLOOR_INTENT * 100}% per intent`, () => {
      const byIntent: Record<string, { n: number; ok: number }> = {};
      const misses: { q: string; intent: string; slot?: string; last?: string; why: string; classified: string }[] = [];
      for (const { row, miss, a } of results) {
        const b = (byIntent[row.intent] ??= { n: 0, ok: 0 });
        b.n++;
        if (miss) {
          const intro = a.intro[0];
          misses.push({ q: row.q, intent: row.intent, slot: row.slot, last: row.last, why: miss, classified: intro.kind === "tool" ? intro.meta : "" });
        } else b.ok++;
      }
      const passed = results.length - misses.length;
      const rate = passed / results.length;
      const report = {
        locale,
        total: results.length,
        passed,
        rate: Math.round(rate * 10000) / 100,
        byIntent: Object.fromEntries(
          Object.entries(byIntent)
            .sort((x, y) => x[1].ok / x[1].n - y[1].ok / y[1].n)
            .map(([k, v]) => [k, `${v.ok}/${v.n}`]),
        ),
        misses,
      };
      mkdirSync("ml/out", { recursive: true });
      writeFileSync(`ml/out/golden-${locale}.json`, JSON.stringify(report, null, 1));
      console.log(`${locale}: ${passed}/${results.length} (${report.rate}%) · weakest: ${Object.entries(report.byIntent).slice(0, 5).map(([k, v]) => `${k} ${v}`).join(", ")}`);

      expect(rate).toBeGreaterThanOrEqual(FLOOR_OVERALL);
      for (const [intent, v] of Object.entries(byIntent)) {
        expect(v.ok / v.n, `${intent}: ${v.ok}/${v.n}`).toBeGreaterThanOrEqual(FLOOR_INTENT);
      }
    });
  });
}

function thoughtOf(a: Answer): string[] {
  return a.blocks.filter((b) => b.kind === "think").map((b) => b.text);
}
