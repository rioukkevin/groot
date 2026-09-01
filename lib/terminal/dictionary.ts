import { DEFAULT_LOCALE } from "./locale";

import type { Locale } from "./locale";

/**
 * Interface wording, per locale.
 *
 * The English map is complete by construction — its keys are the type. The
 * French one is `Partial`, so it can be filled a line at a time and anything
 * missing falls through to English rather than rendering blank. That is the
 * same rule Payload applies to content, kept deliberately identical so the two
 * behave the same once the shell reads from the CMS.
 */
const en = {
  promptPlaceholder: "ask anything, or / for commands",
  promptRunNow: "run /now",
  banner: "Available for new work from mid-September",
  bannerRun: "· run /now for what changed",
  tagline: "portfolio shell · Kévin Riou · fullstack web & mobile, freelance",
  langHint: "(shift+tab to switch language) · ? for shortcuts",

  usage: "Est. usage:",
  context: "context",
  tokens: "tokens",
  working: "Working…",
  composing: "Composing…",
  interrupt: "esc to interrupt",
  interrupted: "interrupted by user",
  thinking: "thinking · matching against portfolio index…",

  listMove: "↑↓ move selection",
  listOpen: "↵ open selected row",
  released: "released · click to take the keyboard back",
  escRelease: "esc release",
  confirm: "↵ confirm",
  back: "⌫ back",
  apply: "↵ apply",
  inUse: "in use",
  move: "move",
  choose: "choose",
  send: "↵ send",
  sending: "sending…",
  openFullScreen: "↵ open full screen",
  screenshots: "←→ screenshots",
  writeUp: "↑↓ write-up",
  scroll: "↑↓ scroll",
  page: "pgup/pgdn page",

  yourSelections: "YOUR SELECTIONS",
  yourAnswers: "YOUR ANSWERS",
  readyToSend: "Ready to send?",
  optional: "optional",
  typing: "typing…",
  typeAnswer: "type your answer at the prompt below",
  skipWith: "· ↵ to skip",
  messageSent: "Message sent",
  replyTo: "He'll reply to",
  withinADay: "usually within a day.",
  sendAnother: "run /contact to send another",

  unknownCommand: "Unknown command",
  helpLists: "— /help lists them all.",
  writeUpTitle: "WRITE-UP · ↑↓ pgup/pgdn",
  voiceTitle: "VOICE · the shape of the answer",
  themeTitle: "THEME · 5 dark · 3 light",
} as const;

export type UiKey = keyof typeof en;

/**
 * French. Incomplete on purpose — every key not written here renders in
 * English, which is the intended behaviour rather than a gap to fix in one go.
 */
const fr: Partial<Record<UiKey, string>> = {
  promptPlaceholder: "posez une question, ou / pour les commandes",
  promptRunNow: "lancer /now",
  banner: "Disponible pour de nouvelles missions à partir de mi-septembre",
  bannerRun: "· lancez /now pour voir ce qui a changé",
  tagline: "shell portfolio · Kévin Riou · fullstack web & mobile, freelance",
  langHint: "(shift+tab pour changer de langue) · ? pour les raccourcis",

  usage: "Coût est. :",
  context: "contexte",
  tokens: "jetons",
  working: "Travail en cours…",
  composing: "Rédaction…",
  interrupt: "échap pour interrompre",
  interrupted: "interrompu par l'utilisateur",
  thinking: "réflexion · recherche dans l'index du portfolio…",

  listMove: "↑↓ déplacer la sélection",
  listOpen: "↵ ouvrir la ligne",
  released: "relâché · cliquez pour reprendre le clavier",
  escRelease: "échap relâcher",
  confirm: "↵ valider",
  back: "⌫ retour",
  apply: "↵ appliquer",
  inUse: "actif",
  move: "déplacer",
  choose: "choisir",
  send: "↵ envoyer",
  sending: "envoi…",
  openFullScreen: "↵ ouvrir en plein écran",
  screenshots: "←→ captures",
  writeUp: "↑↓ texte",
  scroll: "↑↓ défiler",
  page: "pgup/pgdn page",

  yourSelections: "VOS CHOIX",
  yourAnswers: "VOS RÉPONSES",
  readyToSend: "Prêt à envoyer ?",
  optional: "facultatif",
  typing: "saisie…",
  typeAnswer: "saisissez votre réponse dans l'invite ci-dessous",
  skipWith: "· ↵ pour passer",
  messageSent: "Message envoyé",
  replyTo: "Kévin répondra à",
  withinADay: "généralement sous un jour.",
  sendAnother: "lancez /contact pour en envoyer un autre",

  unknownCommand: "Commande inconnue",
  helpLists: "— /help les liste toutes.",
  writeUpTitle: "TEXTE · ↑↓ pgup/pgdn",
  voiceTitle: "VOIX · la forme de la réponse",
  themeTitle: "THÈME · 5 sombres · 3 clairs",
};

const DICTIONARIES: Record<Locale, Partial<Record<UiKey, string>>> = { en, fr };

/**
 * Returns a lookup for the locale. A missing French string yields the English
 * one, so callers never have to handle absence.
 */
export function dict(locale: Locale) {
  const layer = DICTIONARIES[locale] ?? {};
  return (key: UiKey): string => layer[key] ?? en[key];
}

/** How much of the interface this locale actually carries. */
export function coverage(locale: Locale): { done: number; total: number } {
  const keys = Object.keys(en) as UiKey[];
  const layer = DICTIONARIES[locale] ?? {};
  return {
    done: keys.filter((k) => layer[k] !== undefined).length,
    total: keys.length,
  };
}

export { DEFAULT_LOCALE };
