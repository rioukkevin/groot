import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

import { answerQuestion } from "@/lib/terminal/answer";
import { predictChat } from "@/lib/terminal/chat-model";
import { unmark } from "@/lib/terminal/highlight";

import { contextFor } from "./fixtures/content";
import { full, light, litRows, marked, models, said, toolNames } from "./helpers";

import type { Answer, Classifier } from "@/lib/terminal/answer";
import type { Locale } from "@/lib/terminal/locale";

/**
 * Prompts in, actions out.
 *
 * Each case feeds a question through the shipped full model and the answer
 * layer, then asserts the tool calls the transcript would show, the command
 * whose output follows, and the fact the answer lights up. The content is the
 * exported snapshot, so a test fails when the routing changes, not when the
 * CV does.
 */

interface Case {
  q: string;
  tools: string[];
  command: string | null;
  /** Substring the highlighted fact must contain. */
  mark?: string;
  /** Substring some lit row of the command output must contain. */
  lit?: string;
  last?: string;
  unresolved?: boolean;
  effect?: Answer["effect"];
}

const EN: Case[] = [
  { q: "what did you do at technis", tools: ["classify", "list_roles", "get_role"], command: "/role technis", mark: "Technis", lit: "Technis" },
  { q: "tell me about britch", tools: ["classify", "list_projects", "get_project"], command: "/project britch", mark: "Britch", lit: "brightness" },
  { q: "do you know kubernetes", tools: ["classify", "get_skills"], command: "/stack", mark: "Kubernetes", lit: "Kubernetes" },
  { q: "do you know rust", tools: ["classify", "get_skills", "search_content"], command: "/stack", mark: "rust" },
  { q: "are you free in october?", tools: ["classify", "get_availability"], command: "/now", mark: "September" },
  { q: "what do you charge for consulting", tools: ["classify", "get_rates"], command: "/rates", mark: "1 000", lit: "1 000" },
  { q: "how much for a mobile app", tools: ["classify", "get_rates"], command: "/rates", mark: "600", lit: "600" },
  { q: "how do I reach you", tools: ["classify", "get_contact"], command: "/contact", mark: "kevin@nare.li", lit: "kevin@nare.li" },
  { q: "your email", tools: ["classify", "get_contact"], command: "/email", mark: "kevin@nare.li" },
  { q: "where did you study", tools: ["classify", "get_skills"], command: "/education", mark: "MBA", lit: "MBA" },
  { q: "who are you", tools: ["classify", "get_profile"], command: "/about", mark: "Kévin Riou" },
  { q: "what have you built", tools: ["classify", "list_projects"], command: "/projects" },
  { q: "your work history", tools: ["classify", "list_roles"], command: "/roles", lit: "nareli" },
  { q: "what is your latest project", tools: ["classify", "list_projects", "get_project"], command: "/project ooof", mark: "OOOF" },
  { q: "where do you work now", tools: ["classify", "list_roles", "get_role"], command: "/role nareli", mark: "Nareli" },
  { q: "hello", tools: ["classify"], command: null },
  { q: "thanks a lot", tools: ["classify"], command: null },
  { q: "tell me more", tools: ["classify"], command: "/skills", last: "/stack" },
  { q: "tell me more", tools: ["classify"], command: null, last: "/projects" },
  { q: "what is this site", tools: ["classify"], command: null, mark: "neural net" },
  { q: "parlez-vous français ?", tools: ["classify"], command: null, effect: "switch-locale" },
  { q: "clear the screen", tools: ["classify"], command: null, effect: "clear" },
  { q: "sefsef", tools: ["classify", "search_content"], command: null, unresolved: true },
];

const FR: Case[] = [
  { q: "Quel est le dernier projet ?", tools: ["classify", "list_projects", "get_project"], command: "/project ooof", mark: "OOOF" },
  { q: "qu'as-tu fait chez alpha8", tools: ["classify", "list_roles", "get_role"], command: "/role alpha8", lit: "Alpha8" },
  { q: "c'est quoi diagevol", tools: ["classify", "list_projects", "get_project"], command: "/project diagevol" },
  { q: "tu connais react native ?", tools: ["classify", "get_skills"], command: "/stack", lit: "React Native" },
  { q: "quels sont tes tarifs pour du conseil", tools: ["classify", "get_rates"], command: "/rates", lit: "1 000" },
  { q: "ton mail", tools: ["classify", "get_contact"], command: "/email", mark: "kevin@nare.li" },
  { q: "es-tu disponible en novembre", tools: ["classify", "get_availability"], command: "/now" },
  { q: "où as-tu étudié", tools: ["classify", "get_skills"], command: "/education", lit: "MBA" },
  { q: "ton poste actuel", tools: ["classify", "list_roles", "get_role"], command: "/role nareli" },
  { q: "salut", tools: ["classify"], command: null },
  { q: "dis-m'en plus", tools: ["classify"], command: "/roles", last: "/education" },
  { q: "do you speak english", tools: ["classify"], command: null, effect: "switch-locale" },
  { q: "azerty", tools: ["classify", "search_content"], command: null, unresolved: true },
];

async function check(locale: Locale, c: Case, classifier: Classifier = full) {
  const a = await answerQuestion(c.q, contextFor(locale), c.last ?? null, classifier);
  expect(toolNames(a)).toEqual(c.tools);
  expect(a.command).toBe(c.command);
  expect(a.unresolved).toBe(Boolean(c.unresolved));
  expect(a.effect).toBe(c.effect);
  if (c.mark) expect(marked(a).join(" · ")).toContain(c.mark);
  if (c.lit) expect(litRows(a).join(" · ")).toContain(c.lit);
  // No placeholder or marker survives into what the visitor reads.
  for (const s of said(a)) {
    expect(unmark(s)).not.toMatch(/\{[a-z]+\}/i);
  }
  return a;
}

describe("full model · en", () => {
  for (const c of EN) test(c.q, () => check("en", c));
});

describe("full model · fr", () => {
  for (const c of FR) test(c.q, () => check("fr", c));
});

describe("light tier stand-in", () => {
  test("a named company beats a list intent", () =>
    check("en", { q: "what did you do at technis", tools: ["classify", "list_roles", "get_role"], command: "/role technis" }, light("list_roles")));
  test("a named project beats unknown", () =>
    check("en", { q: "britch?", tools: ["classify", "list_projects", "get_project"], command: "/project britch" }, light("unknown")));
  test("low confidence with no clue is unresolved", () =>
    check("en", { q: "sefsef", tools: ["classify", "search_content"], command: null, unresolved: true }, light("get_rates", 0.3)));
  test("low confidence with a topic word gets a hedged answer", () =>
    check("en", { q: "hmm rates?", tools: ["classify", "get_rates"], command: "/rates", mark: "600" }, light("get_contact", 0.3)));
  test("a current-job question resolves to the newest role", () =>
    check("en", { q: "where do you work currently", tools: ["classify", "list_roles", "get_role"], command: "/role nareli" }, light("get_profile")));
  test("a missing model is unresolved, not a crash", () =>
    check("en", { q: "who are you", tools: ["classify"], command: null, unresolved: true }, async () => null));
  test("the classify line names the tier", async () => {
    const a = await answerQuestion("who are you", contextFor("en"), null, light("get_profile"));
    const intro = a.intro[0];
    expect(intro.kind === "tool" && intro.meta).toContain("light model");
  });
});

describe("eval set through the browser code", () => {
  for (const locale of ["en", "fr"] as const) {
    test(`${locale} top-1 stays above 90%`, () => {
      const rows = JSON.parse(readFileSync(`ml/data/${locale}/eval.json`, "utf8")) as { text: string; intent: string }[];
      const correct = rows.filter((r) => predictChat(models[locale], r.text).intent === r.intent).length;
      expect(correct / rows.length).toBeGreaterThan(0.9);
    });
  }
});
