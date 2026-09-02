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

import { EN_VOICED } from "./voiced.en";
import {
  FR_COMMANDS,
  FR_EDUCATION,
  FR_PROJECTS,
  FR_ROLES,
  FR_SITE,
  FR_THEMES,
  FR_UI,
  FR_VOICES,
  FR_VOICED,
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
      strings: [
        { key: "sent.title", text: "Message sent" },
        { key: "sent.lead", text: "It landed with Kévin. He'll reply to" },
        { key: "sent.you", text: "you" },
        { key: "sent.when", text: "usually within a day." },
        { key: "sent.again", text: "run /contact to send another" },
        { key: "wizard.review", text: "Ready to send?" },
        { key: "wizard.type", text: "type your answer at the prompt below" },
        { key: "wizard.skip", text: "↵ to skip" },
        { key: "wizard.answers", text: "YOUR ANSWERS" },
        { key: "wizard.selections", text: "YOUR SELECTIONS" },
        { key: "wizard.sending", text: "sending…" },
        { key: "wizard.sendHint", text: "↵ send · ⌫ back to change an answer" },
        { key: "wizard.typing", text: "typing…" },
        { key: "wizard.optional", text: "optional" },
        { key: "hint.cards", text: "←→ ↑↓ choose · ↵ confirm · ⌫ back · esc release" },
        { key: "hint.text", text: "↵ confirm · ⌫ back · esc release" },
        { key: "hint.released", text: "released · click to take the keyboard back" },
        { key: "hint.picker", text: "←→ ↑↓ move · ↵ apply · esc release" },
        { key: "hint.voice", text: "↑↓ move · ↵ apply · esc release" },
        { key: "hint.scroll", text: "↑↓ scroll · pgup/pgdn page" },
        { key: "hint.carousel", text: "←→ move · ↵ open full screen · esc release" },
        { key: "hint.project", text: "←→ screenshots · ↑↓ write-up · ↵ open full screen" },
        { key: "hint.listReleased", text: "↑↓ released · click a row to open" },
        { key: "label.writeUp", text: "WRITE-UP · ↑↓ pgup/pgdn" },
        { key: "label.voice", text: "VOICE · the shape of the answer" },
        { key: "label.theme", text: "THEME · 5 dark · 3 light" },
        { key: "label.inUse", text: "in use" },
        { key: "mood.thinking", text: "thinking…" },
        { key: "mood.done", text: "done" },
        { key: "mood.sleepy", text: "zzz" },
        { key: "header.prefix", text: "portfolio shell" },
        { key: "prompt.runNow", text: "run /now" },
        { key: "err.noProject", text: "No project by that name. Known:" },
        { key: "err.noRole", text: "No role by that name. Known:" },
        { key: "err.unknownCommand", text: "Unknown command" },
        { key: "err.helpLists", text: "— /help lists them all." },
        { key: "err.requestFailed", text: "request failed" },
        { key: "err.couldNotSend", text: "could not send" },
        { key: "err.needed", text: "is needed" },
        { key: "err.interrupted", text: "interrupted by user" },
        { key: "skills.footer", text: "/stack for the hard skills · /techs does the same" },
        { key: "shortcuts", text: "↑↓ move selection   ↵ open selected row     → / space open too\n↵ send (typing)     ⇥ complete command      ↑↓ history when typing\nesc release list    shift+⇥ language        ? toggle this\n/ commands          ctrl+l clear transcript  ctrl+c reset input" },,
        { key: "hint.selectProject", text: "↑↓ select · ↵ open case study · esc release" },
        { key: "hint.selectRole", text: "↑↓ select · ↵ open role · esc release" },
        { key: "hint.scrollReleased", text: "↑↓ released · click to take the arrows" },
        { key: "word.escRelease", text: "esc release" },
        { key: "col.name", text: "NAME" },
        { key: "col.stack", text: "STACK" },
        { key: "col.year", text: "YEAR" },
        { key: "col.status", text: "STATUS" },
        { key: "col.when", text: "WHEN" },
        { key: "col.role", text: "ROLE" },
        { key: "col.where", text: "WHERE" },
        { key: "meta.stack", text: "stack" },
        { key: "meta.year", text: "year" },
        { key: "meta.links", text: "links" },
        { key: "meta.entries", text: "entries" },
        { key: "now.summary", text: "what changed this month" },
        { key: "now.footer", text: "git log --since=1.month" },
        { key: "photo.portrait", text: "portrait" },
        { key: "photo.portraitCaption", text: "portrait · hover to resolve" },
        { key: "spotlight.unavailable", text: "unavailable" },
        { key: "spotlight.close", text: "close" },
        { key: "spotlight.controls", text: "wheel zoom · drag pan · dbl-click toggle" },
        { key: "ask.fromContent", text: "from the site's content" },
        { key: "ask.noMatch", text: "no match in the site's content" },
        { key: "ask.unknown", text: "I didn't understand that — try /help for what I can answer." },
        { key: "ask.unsure", text: "I'm not sure what you're asking — try /help for what I can answer." },
        { key: "ask.routed", text: "matched to a command" }
      ],
      introHints: [
        { key: "try", label: "try", text: "/roles" },
        { key: "try", text: '"are you free in September?"' },
        { key: "try", text: "/photos" },
        { key: "note", text: "lists are selectable — ↑↓ to move, ↵ to open" },
      ],
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
      ...Object.fromEntries(
        Object.entries(EN_VOICED).map(([k, v]) => [k, v]),
      ),
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
      strings: [
        { key: "sent.title", text: "Message envoyé" },
        { key: "sent.lead", text: "C'est arrivé chez Kévin. Il répondra à" },
        { key: "sent.you", text: "vous" },
        { key: "sent.when", text: "généralement sous un jour." },
        { key: "sent.again", text: "lancez /contact pour en envoyer un autre" },
        { key: "wizard.review", text: "Prêt à envoyer ?" },
        { key: "wizard.type", text: "saisissez votre réponse dans l'invite ci-dessous" },
        { key: "wizard.skip", text: "↵ pour passer" },
        { key: "wizard.answers", text: "VOS RÉPONSES" },
        { key: "wizard.selections", text: "VOS CHOIX" },
        { key: "wizard.sending", text: "envoi…" },
        { key: "wizard.sendHint", text: "↵ envoyer · ⌫ retour pour modifier" },
        { key: "wizard.typing", text: "saisie…" },
        { key: "wizard.optional", text: "facultatif" },
        { key: "hint.cards", text: "←→ ↑↓ choisir · ↵ valider · ⌫ retour · échap relâcher" },
        { key: "hint.text", text: "↵ valider · ⌫ retour · échap relâcher" },
        { key: "hint.released", text: "relâché · cliquez pour reprendre le clavier" },
        { key: "hint.picker", text: "←→ ↑↓ déplacer · ↵ appliquer · échap relâcher" },
        { key: "hint.voice", text: "↑↓ déplacer · ↵ appliquer · échap relâcher" },
        { key: "hint.scroll", text: "↑↓ défiler · pgup/pgdn page" },
        { key: "hint.carousel", text: "←→ déplacer · ↵ plein écran · échap relâcher" },
        { key: "hint.project", text: "←→ captures · ↑↓ texte · ↵ plein écran" },
        { key: "hint.listReleased", text: "↑↓ relâché · cliquez une ligne pour l'ouvrir" },
        { key: "label.writeUp", text: "TEXTE · ↑↓ pgup/pgdn" },
        { key: "label.voice", text: "VOIX · la forme de la réponse" },
        { key: "label.theme", text: "THÈME · 5 sombres · 3 clairs" },
        { key: "label.inUse", text: "actif" },
        { key: "mood.thinking", text: "réflexion…" },
        { key: "mood.done", text: "terminé" },
        { key: "mood.sleepy", text: "zzz" },
        { key: "header.prefix", text: "shell portfolio" },
        { key: "prompt.runNow", text: "lancer /now" },
        { key: "err.noProject", text: "Aucun projet de ce nom. Connus :" },
        { key: "err.noRole", text: "Aucun poste de ce nom. Connus :" },
        { key: "err.unknownCommand", text: "Commande inconnue" },
        { key: "err.helpLists", text: "— /help les liste toutes." },
        { key: "err.requestFailed", text: "la requête a échoué" },
        { key: "err.couldNotSend", text: "envoi impossible" },
        { key: "err.needed", text: "est obligatoire" },
        { key: "err.interrupted", text: "interrompu par l'utilisateur" },
        { key: "skills.footer", text: "/stack pour les compétences techniques · /techs fait la même chose" },
        { key: "shortcuts", text: "↑↓ déplacer la sélection   ↵ ouvrir la ligne          → / espace aussi\n↵ envoyer (saisie)         ⇥ compléter la commande    ↑↓ historique en saisie\néchap relâcher la liste    shift+⇥ langue            ? afficher ceci\n/ commandes                ctrl+l effacer            ctrl+c vider la saisie" },,
        { key: "hint.selectProject", text: "↑↓ sélectionner · ↵ ouvrir l'étude de cas · échap relâcher" },
        { key: "hint.selectRole", text: "↑↓ sélectionner · ↵ ouvrir le poste · échap relâcher" },
        { key: "hint.scrollReleased", text: "↑↓ relâché · cliquez pour reprendre les flèches" },
        { key: "word.escRelease", text: "échap relâcher" },
        { key: "col.name", text: "NOM" },
        { key: "col.stack", text: "STACK" },
        { key: "col.year", text: "ANNÉE" },
        { key: "col.status", text: "STATUT" },
        { key: "col.when", text: "QUAND" },
        { key: "col.role", text: "POSTE" },
        { key: "col.where", text: "OÙ" },
        { key: "meta.stack", text: "stack" },
        { key: "meta.year", text: "année" },
        { key: "meta.links", text: "liens" },
        { key: "meta.entries", text: "entrées" },
        { key: "now.summary", text: "ce qui a changé ce mois-ci" },
        { key: "now.footer", text: "git log --since=1.month" },
        { key: "photo.portrait", text: "portrait" },
        { key: "photo.portraitCaption", text: "portrait · survolez pour révéler" },
        { key: "spotlight.unavailable", text: "indisponible" },
        { key: "spotlight.close", text: "fermer" },
        { key: "spotlight.controls", text: "molette zoom · glisser déplacer · double-clic basculer" },
        { key: "ask.fromContent", text: "depuis le contenu du site" },
        { key: "ask.noMatch", text: "aucune correspondance dans le contenu du site" },
        { key: "ask.unknown", text: "Je n'ai pas compris — essayez /help pour voir ce que je sais répondre." },
        { key: "ask.unsure", text: "Je ne suis pas sûr de la question — essayez /help pour voir ce que je sais répondre." },
        { key: "ask.routed", text: "correspond à une commande" }
      ],
      introHints: [
        { key: "try", label: "essayez", text: "/roles" },
        { key: "try", text: '"êtes-vous libre en septembre ?"' },
        { key: "try", text: "/photos" },
        {
          key: "note",
          text: "les listes sont sélectionnables — ↑↓ pour se déplacer, ↵ pour ouvrir",
        },
      ],
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
      ...Object.fromEntries(
        Object.entries(EN_VOICED).map(([k, en]) => [
          k,
          FR_VOICED[k] ?? en,
        ]),
      ),
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
