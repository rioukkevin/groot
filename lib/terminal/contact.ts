/**
 * The contact wizard, as data. Steps are declarative so the renderer, the key
 * handling and the email body all read the same definition — adding a question
 * means adding one entry here.
 */

/** One card in a choice grid: a sigil, a title, and a muted second line. */
export interface ChoiceOption {
  /** Stored and emailed; the card title plus its hint when there is one. */
  value: string;
  label: string;
  hint?: string;
  icon: string;
  /** Overrides the sigil colour — used for theme swatches and waveforms. */
  iconColor?: string;
  /** Backs the sigil, so a theme swatch previews its ground as well as its ink. */
  iconBg?: string;
}

export type ContactStep =
  | {
      key: ContactKey;
      group: string;
      kind: "choice";
      question: string;
      options: readonly ChoiceOption[];
      /** Cards per row, so arrow navigation and layout agree. */
      perRow: number;
    }
  | {
      key: ContactKey;
      group: string;
      kind: "text";
      question: string;
      label: string;
      required: boolean;
      /** Returns an error message, or null when the value is acceptable. */
      validate?: (value: string) => string | null;
    };

export type ContactKey =
  | "project"
  | "budget"
  | "timeline"
  | "name"
  | "email"
  | "company"
  | "details";

export type ContactAnswers = Partial<Record<ContactKey, string>>;

const MAX = 4000;

/** Deliberately permissive: reject what is obviously not an address, no more. */
function validateEmail(v: string): string | null {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "that doesn't look like an email address";
  if (v.length > 200) return "that address is too long";
  return null;
}

export const CONTACT_STEPS: readonly ContactStep[] = [
  {
    key: "project",
    group: "Project",
    kind: "choice",
    question: "What kind of project do you have in mind?",
    perRow: 3,
    options: [
      { value: "Web application", label: "Web application", hint: "fullstack, front to deploy", icon: "</>" },
      { value: "Mobile application", label: "Mobile app", hint: "React Native · Expo", icon: "[·]" },
      { value: "Architecture & consulting", label: "Architecture", hint: "consulting · direction", icon: "◈" },
      { value: "Team lead / management", label: "Team lead", hint: "leading a team or project", icon: "▲" },
      { value: "Something else", label: "Something else", hint: "tell me below", icon: "*" },
    ],
  },
  {
    key: "budget",
    group: "Budget",
    kind: "choice",
    question: "What budget range are you working with?",
    perRow: 3,
    options: [
      { value: "Under €6K", label: "Under €6K", hint: "around 10 days", icon: "▪" },
      { value: "€6K – €15K", label: "€6K – €15K", hint: "around a month", icon: "▪▪" },
      { value: "€15K – €40K", label: "€15K – €40K", hint: "two to three months", icon: "▪▪▪" },
      { value: "€40K+", label: "€40K+", hint: "a longer engagement", icon: "▪▪▪▪" },
      { value: "Not sure yet", label: "Not sure yet", hint: "we can scope it together", icon: "?" },
    ],
  },
  {
    key: "timeline",
    group: "Timeline",
    kind: "choice",
    question: "When do you need it?",
    perRow: 2,
    options: [
      { value: "As soon as possible", label: "As soon as possible", hint: "free from mid-September", icon: "⚡" },
      { value: "1–2 months", label: "1–2 months", hint: "starting soon", icon: "▶" },
      { value: "3–6 months", label: "3–6 months", hint: "planning ahead", icon: "▷" },
      { value: "Flexible", label: "Flexible", hint: "no fixed date", icon: "~" },
    ],
  },
  {
    key: "name",
    group: "Details",
    kind: "text",
    question: "Who am I talking to?",
    label: "name",
    required: true,
    validate: (v) => (v.length > 120 ? "that name is too long" : null),
  },
  {
    key: "email",
    group: "Details",
    kind: "text",
    question: "Where should I reply?",
    label: "email",
    required: true,
    validate: validateEmail,
  },
  {
    key: "company",
    group: "Details",
    kind: "text",
    question: "Company, if there is one.",
    label: "company",
    required: false,
    validate: (v) => (v.length > 120 ? "that is too long" : null),
  },
  {
    key: "details",
    group: "Details",
    kind: "text",
    question: "Tell me about it — what are you building, and what is in the way?",
    label: "details",
    required: true,
    validate: (v) =>
      v.length < 10
        ? "a sentence or two, so I can give you a useful answer"
        : v.length > MAX
          ? "that is longer than I can send — trim it a little"
          : null,
  },
] as const;

/** Stepper groups, in order, de-duplicated. */
export const CONTACT_GROUPS: readonly string[] = [
  ...new Set(CONTACT_STEPS.map((s) => s.group)),
];

export interface ContactState {
  /** Index into CONTACT_STEPS, or CONTACT_STEPS.length for the review step. */
  step: number;
  answers: ContactAnswers;
  /** Cursor within the current choice step. */
  choice: number;
  status: "editing" | "sending" | "sent" | "error";
  error: string | null;
}

export const initialContact = (): ContactState => ({
  step: 0,
  answers: {},
  choice: 0,
  status: "editing",
  error: null,
});

export const isReview = (s: ContactState) => s.step >= CONTACT_STEPS.length;

export const currentStep = (s: ContactState): ContactStep | null =>
  isReview(s) ? null : CONTACT_STEPS[s.step];

/** Every answered step, in order, for the selections panel and the email. */
export function summary(
  answers: ContactAnswers,
): ReadonlyArray<readonly [string, string]> {
  return CONTACT_STEPS.filter((s) => answers[s.key]).map(
    (s) => [s.kind === "choice" ? s.group : s.label, answers[s.key] as string] as const,
  );
}

export function missingRequired(answers: ContactAnswers): ContactKey[] {
  return CONTACT_STEPS.filter((s) => {
    const required = s.kind === "choice" || s.required;
    return required && !answers[s.key]?.trim();
  }).map((s) => s.key);
}
