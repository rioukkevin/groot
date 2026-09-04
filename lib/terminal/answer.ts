import { toolByName } from "@/lib/mcp-tools";

import { CLEAR, route } from "./commands";
import { L } from "./format";
import { highlightBlocks, mark } from "./highlight";
import { classify } from "./intent";
import { LOCALE_LABEL, otherLocale } from "./locale";
import { manifestFor } from "./model-tiers";
import {
  findLanguage,
  findMonth,
  findOrdinal,
  findProject,
  findRole,
  findTech,
  findTheme,
  findVoice,
  norm,
  projectByOrdinal,
  roleByOrdinal,
  STOP,
} from "./slots";
import { say, think, tool } from "./blocks";

import type { CommandContext } from "./commands";
import type { Prediction } from "./intent";
import type { Locale } from "./locale";
import type { ShellContent } from "./shell-content";
import type { BlockSpec } from "./types";

/**
 * Answers a plain question the way an agent would, visibly.
 *
 * The classifier — whichever tier is on duty — says what the question is
 * about. This module then calls the site's tools until it holds the fact
 * (roles, then the one role; projects, then the one project; the stack, then
 * a content search when the technology is not in it), shows each call in the
 * transcript, states the fact in one sentence with the fact itself lit, and
 * runs the command that displays it in full with the same fact lit there.
 *
 * Nothing here is generated prose. Every sentence is a template from the CMS
 * with the tool's own values dropped in, so the answer can be wrong about
 * which fact the visitor wanted, but never about the fact.
 */

/** The shell's two floors: below either, it says it is unsure. */
const MIN_CONFIDENCE = 0.5;
const MIN_MARGIN = 0.15;

export interface Answer {
  /** The classify call, shown first — separately so the shell can keep it
   *  while handing an unplaced question to another answerer. */
  intro: BlockSpec[];
  /** Tool calls, the answer sentence, the command's highlighted output. */
  blocks: BlockSpec[];
  /** The command whose output is included, for the follow-up "tell me more". */
  command: string | null;
  /** Set when the classifier could not place the question. */
  unresolved: boolean;
  effect?: "clear" | "switch-locale";
}

/** A tool call the transcript shows, plus what it returned. */
interface Call {
  block: BlockSpec;
  result: unknown;
}

const fill = (template: string, vars: Record<string, string | number>): string =>
  Object.entries(vars).reduce(
    (acc, [k, v]) => acc.split(`{${k}}`).join(String(v)),
    template,
  );

/** Runs a tool and describes the call for the transcript. */
function call(
  c: ShellContent,
  name: string,
  args: Record<string, unknown>,
  meta: (r: unknown) => string,
  out: (r: unknown) => string[] = () => [],
  dur = 380,
): Call {
  const t = toolByName(name);
  const result = t ? t.run(args, c) : { error: "no such tool" };
  const argLabel = Object.values(args)
    .map((v) => String(v))
    .join(", ");
  return {
    result,
    block: tool(name, `(${argLabel})`, meta(result), out(result).map((o) => L(o, "var(--faint)")), dur),
  };
}

const short = (s: string, n = 34) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

/** Months in both languages, so a row in either can be lit. */
const MONTH_FR: Record<string, string> = {
  january: "janvier", february: "février", march: "mars", april: "avril", may: "mai",
  june: "juin", july: "juillet", august: "août", september: "septembre",
  october: "octobre", november: "novembre", december: "décembre",
};

/** Follow-up depth: "tell me more" after a command goes here. */
const DEEPER: Record<string, string> = {
  "/about": "/roles",
  "/now": "/rates",
  "/rates": "/contact",
  "/contact": "/email",
  "/email": "/contact",
  "/stack": "/skills",
  "/techs": "/skills",
  "/skills": "/stack",
  "/education": "/roles",
  "/resume": "/roles",
  "/photos": "/projects",
  "/theme": "/voice",
  "/voice": "/theme",
  "/role": "/roles",
};

interface Plan {
  calls: Call[];
  answer: string | null;
  command: string | null;
  /** Values to light in the command's output. */
  terms: string[];
  /** Keep the command's own preamble; by default the answer replaces it. */
  keepSay?: boolean;
  effect?: Answer["effect"];
  unresolved?: boolean;
}

const reply = (text: string): Plan => ({ calls: [], answer: text, command: null, terms: [] });

// ── the plans, one per intent ─────────────────────────────────────────────

function availability(c: ShellContent, q: string): Plan {
  const k = call(
    c,
    "get_availability",
    {},
    (r) => `${(r as { detail: string[] }).detail.length} lines`,
    (r) => [(r as { headline: string }).headline],
  );
  const headline = (k.result as { headline: string }).headline;
  const month = findMonth(q);
  return {
    calls: [k],
    answer: fill(c.s("ans.availability", "Short answer: ⟦{headline}⟧ Here is what changed this month:"), { headline }),
    command: "/now",
    terms: month ? [month, MONTH_FR[month]] : [],
  };
}

function rates(c: ShellContent, q: string): Plan {
  const k = call(c, "get_rates", {}, (r) => `${(r as unknown[]).length} lines`);
  const rows = (k.result as { label: string; value: string }[]).filter((r) => r.value);
  const n = norm(q);
  const by = (re: RegExp) => rows.find((r) => re.test(norm(r.label)));
  const pick =
    (/\b(consult|conseil|architect|audit|direction|advice|avis|cto|strateg)/.test(n) && by(/consult|conseil/)) ||
    (/\b(manag|lead|leading|team|equipe|gestion|gerer|encadr|pilot|coordin|diriger|chef de projet|de a a z|end to end)/.test(n) && by(/manag|gestion|lead/)) ||
    (/\b(fixed|forfait|flat|package|project price|prix fixe|devis|quote|quotation|clear spec|spec|cahier des charges|vitrine|budget global)/.test(n) && by(/fixed|forfait/)) ||
    rows[0];
  if (!pick) return { calls: [k], answer: null, command: "/rates", terms: [] };
  const value = pick.value.split("·")[0].trim();
  return {
    calls: [k],
    answer: fill(c.s("ans.rates", "⟦{label} · {value}⟧ — the other rates, for the record:"), {
      label: pick.label,
      value,
    }),
    command: "/rates",
    terms: [value],
  };
}

function contact(c: ShellContent, q: string, emailOnly: boolean): Plan {
  const k = call(
    c,
    "get_contact",
    {},
    (r) => `${(r as { channels: unknown[] }).channels.length} channels`,
  );
  const channels = (k.result as { channels: { label: string; value: string }[] }).channels.filter(
    (x) => x.value,
  );
  const email = channels.find((x) => x.value.includes("@"));
  const n = norm(q);
  const CHANNEL_ALIAS: Record<string, string> = { gh: "github", "git hub": "github", "linked in": "linkedin", lkdn: "linkedin" };
  const said = Object.entries(CHANNEL_ALIAS).reduce((acc, [alias, label]) => acc.replace(new RegExp(`\\b${alias}\\b`), label), n);
  const named = channels.find((x) => x.label && said.includes(norm(x.label)));
  if (emailOnly || !email) {
    return {
      calls: [k],
      answer: email ? mark(email.value) : null,
      command: "/email",
      terms: email ? [email.value] : [],
    };
  }
  const chosen = named && !named.value.includes("@") ? named : email;
  return {
    calls: [k],
    answer:
      chosen === email
        ? fill(c.s("ans.contact", "Email is the fastest: ⟦{email}⟧ — or answer the four questions below and it lands in my inbox."), { email: email.value })
        : fill(c.s("ans.channel", "⟦{label} · {value}⟧ — or use the form below."), {
            label: chosen.label,
            value: chosen.value,
          }),
    command: "/contact",
    terms: [chosen.value],
  };
}

function profile(c: ShellContent): Plan {
  const k = call(c, "get_profile", {}, (r) => `${(r as { name: string }).name}`);
  return {
    calls: [k],
    answer: fill(c.s("ans.profile", "⟦{name}⟧ — {tagline}, based in ⟦{location}⟧."), {
      name: c.name,
      tagline: c.tagline,
      location: c.location || "Paris",
    }),
    command: "/about",
    terms: [],
    keepSay: true,
  };
}

function roles(c: ShellContent): Plan {
  const k = call(c, "list_roles", {}, (r) => `${(r as unknown[]).length} roles`);
  const all = c.roles;
  const latest = all[0];
  const oldest = all[all.length - 1];
  const first = oldest?.when.match(/\d{4}/)?.[0] ?? "";
  return {
    calls: [k],
    answer: latest
      ? fill(c.s("ans.roles", "⟦{count} roles⟧ since {first}, the latest at ⟦{where}⟧ ({when}) — ↑↓ opens one:"), {
          count: all.length,
          first,
          where: latest.where,
          when: latest.when,
        })
      : null,
    command: "/roles",
    terms: latest ? [latest.key] : [],
  };
}

function role(c: ShellContent, key: string): Plan {
  const list = call(c, "list_roles", {}, (r) => `${(r as unknown[]).length} roles · ${key} found`, () => [], 320);
  const one = call(
    c,
    "get_role",
    { key },
    (r) => {
      const x = r as { when?: string; where?: string };
      return `${x.when ?? ""} · ${x.where ?? ""}`;
    },
    (r) => [(r as { role?: string }).role ?? ""],
  );
  const r = one.result as { role?: string; when?: string; where?: string };
  return {
    calls: [list, one],
    answer: fill(c.s("ans.role", "{when}, {where}: ⟦{what}⟧."), {
      where: r.where ?? key,
      when: r.when ?? "",
      what: r.role ?? "",
    }),
    command: `/role ${key}`,
    terms: [r.role ?? key],
  };
}

function projects(c: ShellContent): Plan {
  const k = call(c, "list_projects", {}, (r) => `${(r as unknown[]).length} projects`);
  const all = Object.values(c.projects);
  const names = all.slice(0, 3).map((p) => p.name).join(", ");
  return {
    calls: [k],
    answer: fill(c.s("ans.projects", "⟦{count} side projects⟧ — {names} and more below. ↑↓ opens a case study:"), {
      count: all.length,
      names,
    }),
    command: "/projects",
    terms: [],
    keepSay: true,
  };
}

function project(c: ShellContent, key: string): Plan {
  const list = call(c, "list_projects", {}, (r) => `${(r as unknown[]).length} projects · ${key} found`, () => [], 320);
  const one = call(
    c,
    "get_project",
    { key },
    (r) => {
      const x = r as { detail?: string[]; images?: string[] };
      return `${x.detail?.length ?? 0} sections · ${x.images?.length ?? 0} screenshots`;
    },
    (r) => [(r as { what?: string }).what ?? ""],
  );
  const p = one.result as { name?: string; what?: string };
  return {
    calls: [list, one],
    answer: fill(c.s("ans.project", "⟦{name}⟧ — {what}"), { name: p.name ?? key, what: p.what ?? "" }),
    command: `/project ${key}`,
    terms: [p.what ?? ""],
  };
}

function skills(c: ShellContent, q: string): Plan {
  const count = c.stack.reduce((n, [, , items]) => n + items.length, 0);
  const k = call(c, "get_skills", {}, () => `${count} technologies · ${c.stack.length} groups`);
  const tech = findTech(q, c);
  if (!tech) {
    return {
      calls: [k],
      answer: fill(c.s("ans.skills", "⟦{count} technologies⟧ across {groups} groups — the ones I reach for without thinking:"), {
        count,
        groups: c.stack.length,
      }),
      command: "/stack",
      terms: [],
    };
  }
  if (tech.item) {
    return {
      calls: [k],
      answer: fill(c.s("ans.skillYes", "Yes — ⟦{item}⟧ is part of my {group} stack:"), {
        item: tech.item,
        group: tech.group ?? "",
      }),
      command: "/stack",
      terms: [tech.item],
    };
  }
  // Not in the stack: look through the projects and roles before saying no.
  const search = call(
    c,
    "search_content",
    { query: tech.asked },
    (r) => {
      const x = r as { projects: unknown[]; roles: unknown[]; skills: unknown[] };
      const n = x.projects.length + x.roles.length + x.skills.length;
      return n ? `${n} mentions` : "no match";
    },
  );
  const found = search.result as { projects: { name: string }[]; roles: { key: string }[] };
  const where = [...found.projects.map((p) => p.name), ...found.roles.map((r) => r.key)].slice(0, 3).join(", ");
  return {
    calls: [k, search],
    answer: where
      ? fill(c.s("ans.skillNear", "Not in the core stack, but ⟦{tech}⟧ shows up in {where}. The stack itself:"), {
          tech: tech.asked,
          where,
        })
      : fill(c.s("ans.skillNo", "⟦{tech}⟧ isn't in my stack. Here is what I do reach for:"), { tech: tech.asked }),
    command: "/stack",
    terms: [],
  };
}

function softSkills(c: ShellContent): Plan {
  const count = c.softSkills.reduce((n, [, , items]) => n + items.length, 0);
  const k = call(c, "get_skills", {}, () => `${count} soft skills · ${c.softSkills.length} groups`);
  return {
    calls: [k],
    answer: fill(c.s("ans.softSkills", "The part that isn't typing — ⟦{count} soft skills⟧ in {groups} groups:"), {
      count,
      groups: c.softSkills.length,
    }),
    command: "/skills",
    terms: [],
  };
}

function education(c: ShellContent): Plan {
  const k = call(c, "get_skills", {}, () => `${c.education.length} degrees`);
  const latest = c.education[0];
  return {
    calls: [k],
    answer: latest
      ? fill(c.s("ans.education", "⟦{what}⟧ — {where}, {when}. The full path:"), { ...latest })
      : null,
    command: "/education",
    terms: latest ? [latest.what] : [],
  };
}

function more(c: ShellContent, lastCommand: string | null): Plan {
  const base = lastCommand?.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
  if (base === "/projects" || base === "/roles") {
    return reply(c.s("reply.pickAbove", "Pick one from the list above — ↑↓ then ↵ — or ask about it by name."));
  }
  if (base === "/project") {
    return reply(c.s("reply.projectMore", "←→ flips the screenshots and ↑↓ scrolls the write-up above. The other projects are under /projects."));
  }
  const next = DEEPER[base];
  if (!next) return reply(c.s("reply.moreWhat", "More about what? Name it — a project, a role, the rates — or pick from /help."));
  return {
    calls: [],
    answer: fill(c.s("ans.more", "One level deeper — ⟦{command}⟧:"), { command: next }),
    command: next,
    terms: [],
    keepSay: true,
  };
}

/**
 * The words of a question that name something in the content outright — a
 * project's name or stack, a role's company or title. Prose is deliberately
 * not searched here: "food" appears in a role's write-up, and a question
 * about favourite food is not a question about that role.
 */
function strongMatches(c: ShellContent, words: string[]) {
  const has = (text: string) => {
    const toks = new Set(norm(text).split(" "));
    return words.some((w) => toks.has(w));
  };
  return {
    projects: Object.values(c.projects).filter((p) => has(`${p.key.replace(/-/g, " ")} ${p.name} ${p.stack}`)),
    roles: c.roles.filter((r) => has(`${r.key} ${r.where} ${r.what}`)),
  };
}

/** A content search over the question's significant words, shown as one call. */
function search(c: ShellContent, q: string, unsure: boolean): Plan {
  const words = norm(q)
    .split(" ")
    .filter((w) => w.length >= 4 && !STOP.has(w));
  const fallback = reply(
    unsure
      ? c.s("ask.unsure", "I'm not sure what you're asking — try /help for what I can answer.")
      : c.s("ask.unknown", "I didn't understand that — try /help for what I can answer."),
  );

  // A topic word — rates, projects, contact — is a surer guide than a
  // substring found in some project's prose, so it is consulted first. Only
  // when the model was unsure, though: a confident "unknown" is an answer.
  const hinted = unsure ? hint(c, q) : null;
  if (hinted) {
    return {
      ...hinted,
      answer: `${c.s("ans.probably", "Not sure I read that right — the closest I have:")} ${hinted.answer ?? ""}`.trim(),
    };
  }
  if (!words.length) return { ...fallback, unresolved: true };

  const t = toolByName("search_content");
  const merged = { projects: new Map<string, string>(), roles: new Map<string, string>(), skills: new Set<string>() };
  for (const w of words.slice(0, 5)) {
    const r = t?.run({ query: w }, c) as
      | { projects: { key: string; name: string }[]; roles: { key: string }[]; skills: string[] }
      | undefined;
    if (!r) continue;
    for (const p of r.projects) merged.projects.set(p.key, p.name);
    for (const x of r.roles) merged.roles.set(x.key, x.key);
    for (const s of r.skills) merged.skills.add(s);
  }
  const n = merged.projects.size + merged.roles.size + merged.skills.size;
  const block = tool(
    "search_content",
    `("${short(words.slice(0, 5).join(" "), 30)}")`,
    n ? `${n} ${c.s("ask.matches", "matches")}` : c.s("ask.noMatch", "no match in the site's content"),
    [],
    420,
  );
  const searched: Call = { block, result: merged };

  // The model was sure this is not a question the site answers. The search
  // is shown for honesty, but a stray word in some write-up does not make
  // it one.
  if (!unsure) return { ...fallback, calls: [searched], unresolved: true };

  // Route only on matches in names, companies, titles and stacks; keep the
  // full count in the transcript line above.
  const strong = strongMatches(c, words);
  merged.projects = new Map(strong.projects.map((p) => [p.key, p.name]));
  merged.roles = new Map(strong.roles.map((r) => [r.key, r.key]));

  if (merged.projects.size === 1) {
    const [key, name] = [...merged.projects.entries()][0];
    const p = project(c, key);
    return {
      ...p,
      calls: [searched, ...p.calls.slice(1)],
      answer: fill(c.s("ans.searchHit", "Closest match in the site's content: ⟦{name}⟧."), { name }),
    };
  }
  if (merged.projects.size > 1) {
    return {
      calls: [searched],
      answer: fill(c.s("ans.searchMany", "{count} projects mention that — the lit rows. ↑↓ opens one:"), {
        count: merged.projects.size,
      }),
      command: "/projects",
      terms: [...merged.projects.keys()],
    };
  }
  if (merged.roles.size >= 1) {
    const key = [...merged.roles.keys()][0];
    const r = role(c, key);
    return {
      ...r,
      calls: [searched, ...r.calls.slice(1)],
      answer: fill(c.s("ans.searchHit", "Closest match in the site's content: ⟦{name}⟧."), { name: key }),
    };
  }
  if (merged.skills.size >= 1) {
    const items = [...merged.skills].map((s) => s.split(": ").slice(1).join(": "));
    // Soft skills live under /skills, the stack under /stack; light the one
    // that can actually show the hit.
    const soft = new Set(c.softSkills.flatMap(([, , i]) => i));
    return {
      calls: [searched],
      answer: fill(c.s("ans.searchHit", "Closest match in the site's content: ⟦{name}⟧."), {
        name: items.slice(0, 3).join(", "),
      }),
      command: items.every((i) => soft.has(i)) ? "/skills" : "/stack",
      terms: items,
    };
  }
  return { ...fallback, calls: [searched], unresolved: true };
}

/** Topic words that point at a command even when the sentence did not parse. */
const HINTS: [RegExp, (c: ShellContent, q: string) => Plan][] = [
  [/\b(projets?|projects?|portfolio|realisations?)\b/, (c) => projects(c)],
  [/\b(postes?|roles?|jobs?|experiences?|employeurs?|employers?|career|carriere|parcours)\b/, (c) => roles(c)],
  [/\b(tarifs?|rates?|prix|price|pricing|tjm|budget|cost|couts?)\b/, rates],
  [/\b(contact|contacter|joindre|reach|email|mail|linkedin|github)\b/, (c, q) => contact(c, q, false)],
  [/\b(stack|technos?|technologies?|skills?|competences?|langages?|languages?|frameworks?)\b/, skills],
  [/\b(dispo|disponible|disponibilite|available|availability|libre|free)\b/, availability],
  [/\b(etudes?|studies|studied|diplomes?|degrees?|ecole|school|university|universite|formation)\b/, (c) => education(c)],
];

function hint(c: ShellContent, q: string): Plan | null {
  const nq = norm(q);
  for (const [re, make] of HINTS) if (re.test(nq)) return make(c, q);
  return null;
}

// ── putting it together ───────────────────────────────────────────────────

function plan(intent: string, q: string, ctx: CommandContext, lastCommand: string | null, unsure: boolean): Plan {
  const c = ctx.content;
  const named = findProject(q, c);
  // "freelance" names a role only when the model heard a question about one
  // role; in "have you always been freelance" it is the whole history.
  const company = findRole(q, c, intent === "get_role" && !unsure);
  const nq = norm(q);

  // A named thing settles it: a question that names britch is about britch,
  // whichever shape the sentence took and whichever tier read it.
  // …unless the model is sure the question is off-topic: "your salary at
  // Technis" names Technis and is still not a question about the role.
  // A bare name ("britch?") is the exception: two or three words that name a
  // thing are a question about it, whatever the model made of so little.
  const bare = nq.split(" ").length <= 3;
  const openIntent = (xs: string[]) => xs.includes(intent) || (intent === "unknown" && (unsure || bare));
  if (named && openIntent(["get_project", "list_projects", "more"])) return project(c, named);
  if (company && openIntent(["get_role", "list_roles", "more"])) return role(c, company);

  // "The latest project", "your current job": a superlative names a thing
  // as surely as a name does, once the topic is clear.
  const ordinal = findOrdinal(q);
  const aboutProjects =
    /\b(projets?|projects?|realisations?|built|build|made|ship|shipped|shipping|construit|fait|livre|sorti|release|released|publie|side)\b/.test(nq);
  const aboutRoles =
    /\b(postes?|positions?|roles?|jobs?|emploi|boites?|company|companies|employers?|employeurs?|experiences?|travail|travailles|work|working|mission|missions|career|carriere|bosses?|bossais)\b/.test(nq);
  // A confident one-thing intent is topic enough on its own; a list intent
  // with "since the start" or "lately" still wants the list.
  const projectIntent = intent === "get_project" && !unsure;
  const roleIntent = intent === "get_role" && !unsure;
  if (ordinal && !named && (projectIntent || (aboutProjects && (unsure || ["get_project", "more"].includes(intent))))) {
    const key = projectByOrdinal(ordinal, c);
    if (key) {
      const p = project(c, key);
      const proj = c.projects[key];
      return {
        ...p,
        answer: fill(
          c.s(
            ordinal === "latest" ? "ans.projectLatest" : "ans.projectFirst",
            ordinal === "latest" ? "The most recent: ⟦{name}⟧ ({year}) — {what}" : "The first one: ⟦{name}⟧ ({year}) — {what}",
          ),
          { name: proj.name, year: proj.year, what: proj.what },
        ),
      };
    }
  }
  if (ordinal && !company && (roleIntent || (aboutRoles && (unsure || ["get_role", "get_profile"].includes(intent))))) {
    const key = roleByOrdinal(ordinal, c);
    if (key) {
      const r = role(c, key);
      return {
        ...r,
        answer: `${c.s(ordinal === "latest" ? "ans.roleLatest" : "ans.roleFirst", ordinal === "latest" ? "The current one —" : "The first one —")} ${r.answer ?? ""}`,
      };
    }
  }

  if (unsure) {
    if (named) return project(c, named);
    if (company) return role(c, company);
    return search(c, q, true);
  }

  switch (intent) {
    case "get_availability":
      return availability(c, q);
    case "get_rates":
      return rates(c, q);
    case "get_contact":
      return contact(c, q, false);
    case "get_email":
      return contact(c, q, true);
    case "get_profile":
      return profile(c);
    case "list_roles":
      return roles(c);
    case "get_role":
      return company ? role(c, company) : roles(c);
    case "list_projects":
      return projects(c);
    case "get_project":
      return named ? project(c, named) : projects(c);
    case "get_skills":
      return skills(c, q);
    case "get_soft_skills":
      return softSkills(c);
    case "get_education":
      return education(c);
    case "get_photos":
      return { calls: [], answer: c.s("ans.photos", "Every block is one terminal cursor — hover to resolve the photo:"), command: "/photos", terms: [] };
    case "get_resume":
      return { calls: [], answer: c.s("ans.resume", "A plain-text CV, one file:"), command: "/resume", terms: [] };
    case "set_theme": {
      const t = findTheme(q);
      return t
        ? { calls: [], answer: fill(c.s("ans.themeSet", "Theme: ⟦{theme}⟧."), { theme: t }), command: `/theme ${t}`, terms: [] }
        : { calls: [], answer: c.s("ans.theme", "Pick a palette — ←→ ↑↓ then ↵:"), command: "/theme", terms: [] };
    }
    case "set_voice": {
      const v = findVoice(q);
      return v
        ? { calls: [], answer: fill(c.s("ans.voiceSet", "Voice: ⟦{voice}⟧."), { voice: v }), command: `/voice ${v}`, terms: [] }
        : { calls: [], answer: c.s("ans.voice", "Pick a register — ↑↓ then ↵:"), command: "/voice", terms: [] };
    }
    case "help":
      return { calls: [], answer: c.s("ans.help", "Everything I can pull up:"), command: "/help", terms: [] };
    case "clear":
      return { calls: [], answer: null, command: null, terms: [], effect: "clear" };
    case "greeting":
      return reply(c.s("reply.greeting", "Hey! Ask me anything about my work — /help lists the shortcuts."));
    case "thanks":
      return reply(c.s("reply.thanks", "Anytime. /contact if you want to take it further."));
    case "goodbye":
      return reply(c.s("reply.goodbye", "See you. The email is in /contact if something comes up."));
    case "how_are_you":
      return reply(c.s("reply.howAreYou", "Good, thanks — busy shipping. /now says what changed this month."));
    case "compliment":
      return reply(c.s("reply.compliment", "Thanks — this is the ninth version; the earlier ones are under /projects."));
    case "affirm":
      return reply(c.s("reply.affirm", "Go on — ask away, or pick a command from /help."));
    case "deny":
      return reply(c.s("reply.deny", "Alright. /help lists what else I can pull up."));
    case "about_site": {
      const m = manifestFor(c.locale);
      const full = fullTier();
      const tier = full
        ? fill(c.s("ask.tierFullSized", "neural net · {size}"), { size: m ? `${(m.bytes / 1e6).toFixed(1)} MB` : "" })
        : c.s("ask.tierLightSized", "light model · 200 KB");
      return reply(
        fill(
          c.s(
            "reply.aboutSite",
            "This is my portfolio, built as a shell: Next.js in front, a CMS behind, and a neural net on your device that routes each question to the right command — nothing you type leaves the page. Reading you right now: the ⟦{tier}⟧.",
          ),
          { tier },
        ),
      );
    }
    case "more":
      return more(c, lastCommand);
    case "language": {
      const asked = findLanguage(q);
      const other = otherLocale(c.locale);
      if (asked && asked !== c.locale) {
        return {
          ...reply(fill(c.s("reply.switching", "Switching to {other} — shift+tab brings {current} back."), {
            other: LOCALE_LABEL[other],
            current: LOCALE_LABEL[c.locale],
          })),
          effect: "switch-locale",
        };
      }
      return reply(fill(c.s("reply.language", "Both — shift+tab switches the whole shell to {other}."), { other: LOCALE_LABEL[other] }));
    }
    default:
      return search(c, q, false);
  }
}

/** Which tier read the last question, so about_site can say so truthfully. */
let lastTier: "light" | "full" = "light";
const fullTier = () => lastTier === "full";

/** Anything that classifies; the default is whichever tier is on duty. */
export type Classifier = (question: string, locale: Locale) => Promise<Prediction | null>;

export async function answerQuestion(
  question: string,
  ctx: CommandContext,
  lastCommand: string | null,
  classifier: Classifier = classify,
): Promise<Answer> {
  const c = ctx.content;
  const predicted = await classifier(question, c.locale);
  lastTier = predicted?.tier ?? "light";

  const tierLabel =
    predicted?.tier === "full" ? c.s("ask.tierFull", "neural net") : c.s("ask.tierLight", "light model");
  const pct = predicted ? `${Math.round(predicted.confidence * 100)}%` : "";
  const unsure =
    !predicted ||
    (predicted.intent !== "unknown" &&
      (predicted.confidence < MIN_CONFIDENCE || predicted.confidence - predicted.runnerUp < MIN_MARGIN));
  const intent = predicted?.intent ?? "unknown";

  const intro: BlockSpec[] = [
    tool(
      "classify",
      `("${short(question)}")`,
      unsure
        ? `${c.s("ask.unsure.short", "unsure")}${predicted ? ` · ${intent} ${pct}` : ""} · ${tierLabel}`
        : `${intent} · ${pct} · ${tierLabel}`,
      [],
      240,
    ),
  ];

  const p = plan(intent, question, ctx, lastCommand, unsure);
  const blocks: BlockSpec[] = p.calls.map((k) => k.block);
  if (p.answer) blocks.push(p.unresolved ? think(p.answer) : say(p.answer));

  if (p.command) {
    const out = route(p.command, ctx);
    if (out === CLEAR) return { intro, blocks, command: null, unresolved: false, effect: "clear" };
    const shown = p.keepSay ? out : out.filter((b) => b.kind !== "say");
    blocks.push(...highlightBlocks(shown, p.terms));
  }

  return {
    intro,
    blocks,
    command: p.command,
    unresolved: Boolean(p.unresolved),
    effect: p.effect,
  };
}
