import type { DiffRow } from "./types";

export interface Project {
  stack: string;
  year: string;
  status: string;
  statusColor: string;
  what: string;
  detail: string[];
}

export interface Experience {
  key: string;
  when: string;
  what: string;
  where: string;
  detail: string[];
}

export interface Study {
  when: string;
  what: string;
  where: string;
}

export const CMDS: ReadonlyArray<readonly [string, string]> = [
  ["/projects", "side projects — stack, status, what they solved"],
  ["/project", "one project in detail · /project portfolio"],
  ["/experience", "roles, dates, what I actually did"],
  ["/role", "one role in detail · /role nareli"],
  ["/education", "degrees and where they came from"],
  ["/about", "the short version, with a face"],
  ["/skills", "stack proficiency, honestly rated"],
  ["/stack", "tools I reach for by default"],
  ["/now", "what changed this month (diff)"],
  ["/photos", "work, screens, logos"],
  ["/rates", "day rates and how I price work"],
  ["/contact", "email, github, linkedin"],
  ["/resume", "download a plain-text CV"],
  ["/theme", "green · ember · paper"],
  ["/voice", "warm · terse"],
  ["/clear", "clear the transcript"],
  ["/components", "the terminal UI kit, live"],
  ["/help", "everything above"],
] as const;

export const PROJECTS: Record<string, Project> = {
  portfolio: {
    stack: "Next.js · React · Tailwind · TypeScript",
    year: "2016 — now",
    status: "live",
    statusColor: "var(--add)",
    what: "This site. The ninth version, and the excuse to try things.",
    detail: [
      "Why       A portfolio is the one project with no client and no",
      "          deadline, so it is where new tools get tried first.",
      "Built     Six published versions since 2016, each a rewrite rather",
      "          than a reskin. This one runs as a shell you drive.",
      "Result    Every version taught the stack that came after it.",
      "Mine      All of it — design, build, deploy.",
    ],
  },
  "vscode-commits": {
    stack: "TypeScript · VSCode API",
    year: "—",
    status: "open source",
    statusColor: "var(--accent2)",
    what: "VSCode extension for writing commit messages from a template.",
    detail: [
      "Problem   Commit conventions live in a README nobody opens, so",
      "          messages drift within a week.",
      "Built     A customizable template the extension fills in from the",
      "          editor, so the convention is the path of least effort.",
      "Mine      Everything. Published open source.",
    ],
  },
  "twitch-bot": {
    stack: "Node · Socket.io · Twitch API",
    year: "—",
    status: "live",
    statusColor: "var(--add)",
    what: "Engagement bot for Poachimpa's stream — events, stats, viewers.",
    detail: [
      "Problem   A live channel generates events faster than anyone can",
      "          watch them, and none of it was being kept.",
      "Built     Event tracking, viewer management, statistics, and the",
      "          engagement mechanics that run during a stream.",
      "Mine      All of it, and the support when it breaks mid-stream.",
    ],
  },
  chariteam: {
    stack: "Web · events & donations",
    year: "—",
    status: "live",
    statusColor: "var(--add)",
    what: "Site for the Chariteam association to track events and donations.",
    detail: [
      "Problem   Donations and events were tracked by hand across the",
      "          people organising them.",
      "Built     One place for events and the donations attached to them.",
      "Mine      Built and run for the association.",
    ],
  },
  "outrans-counter": {
    stack: "Node · Socket.io · WebSockets",
    year: "—",
    status: "shipped",
    statusColor: "var(--dim)",
    what: "Multi-device synced entry counter for Outrans' 15-year event.",
    detail: [
      "Problem   Several doors, several phones, one number that had to",
      "          agree everywhere, live.",
      "Built     A counter synced across every device on the event, so",
      "          any door could add and everyone saw the same total.",
      "Result    Ran the event's entries end to end.",
    ],
  },
  "betting-app": {
    stack: "React Native · Expo",
    year: "—",
    status: "cancelled",
    statusColor: "var(--del)",
    what: "A betting mobile app, cancelled before it reached the stores.",
    detail: [
      "Built     A full React Native application, taken to working state.",
      "Ended     Cancelled before publication.",
      "Learned   Shipping is a decision, not a milestone — and it is not",
      "          always yours to make.",
    ],
  },
};

export const EXP: readonly Experience[] = [
  {
    key: "nareli",
    when: "2024 — now",
    what: "CEO · Nareli",
    where: "Paris / remote",
    detail: [
      "Scope     Founded Nareli, in partnership with @StartAndBrand. All",
      "          freelance fullstack work runs through it — scoping,",
      "          architecture, delivery, and the support call after.",
      "History   Traded as ooof.dev from August 2024; the practice became",
      "          Nareli in October 2025. Same work, one name.",
      "Doing     Fullstack and mobile builds for teams that need one",
      "          person to own the whole thing.",
    ],
  },
  {
    key: "technis",
    when: "2022 — 2024",
    what: "Fullstack developer · Technis",
    where: "Paris",
    detail: [
      "Company   Swiss smart-flooring company: sensor floors that track",
      "          movement across sport, healthcare and retail spaces.",
      "Scope     Web applications presenting the results of that data,",
      "          plus the architecture behind them for an experiment team.",
      "Led       A developer team for three months at international level,",
      "          and one project end to end — idea, production, support,",
      "          timeline, and the people on it.",
      "Shipped   Worked the Olympics project at its start, while the",
      "          company recruited a dedicated team for it.",
      "Left      A documentation habit in the web team, and better",
      "          frontend practice than I found.",
    ],
  },
  {
    key: "freelance",
    when: "2020 — 2022",
    what: "Freelance web developer",
    where: "France",
    detail: [
      "Scope     Independent web development, run alongside the Alpha8",
      "          contract for most of its length.",
      "Doing     Fullstack builds for whoever needed one, under my own",
      "          name before ooof.dev existed.",
    ],
  },
  {
    key: "alpha8",
    when: "2020 — 2022",
    what: "Fullstack developer · Alpha8",
    where: "Denée",
    detail: [
      "Company   An all-in-one SaaS in the shape of Google Workspace,",
      "          aimed at consultants.",
      "Scope     Fullstack on part of the platform, then the architecture",
      "          for scaling it. Two years, two contracts, same work.",
      "Led       A team building the customizable report generator — the",
      "          most complex section of the product.",
      "Solved    Made the systems talk to each other with Apollo",
      "          federation, and built a dev environment people would",
      "          actually use.",
      "Also      Designed the application's UI, and advised the founders",
      "          on where the company should go.",
    ],
  },
  {
    key: "pasquier",
    when: "2019 — 2020",
    what: "R&D assistant · Brioche Pasquier",
    where: "Les Cerqueux",
    detail: [
      "Company   French food manufacturer with an IT department running",
      "          its own R&D on internal tooling.",
      "Built     A UI kit in Vue 2, designed around how internal users",
      "          actually worked, and the ecosystem around it.",
      "Shipped   Modular reusable components teams assembled software",
      "          from, cutting build time on internal projects.",
      "Taught    Trained the department's developers on the ecosystem and",
      "          wrote the documentation for every choice in it.",
    ],
  },
  {
    key: "triskalia",
    when: "2018 — 2019",
    what: "Web developer · Triskalia",
    where: "Landerneau",
    detail: [
      "Company   Major French agricultural cooperative, now Eureden, in",
      "          the middle of a digital transformation.",
      "Scope     Frontend for web and mobile, and the architecture for",
      "          Vue-based applications.",
      "Led       The move to Vue as the primary frontend framework, with",
      "          the team.",
      "Built     An accounting management app, a parcel-tracking web app",
      "          farmers used to follow their land, and a complex timeline",
      "          view written in plain JavaScript for the old systems.",
    ],
  },
  {
    key: "cdg29",
    when: "2017 — 2018",
    what: "IT technician · CDG29",
    where: "Quimper",
    detail: [
      "Where     Centre de Gestion de la Fonction Publique Territoriale",
      "          du Finistère.",
      "Scope     IT technician, on apprenticeship. The first one.",
    ],
  },
];

export const EDUCATION: readonly Study[] = [
  {
    when: "2019 — 2021",
    what: "MBA · Expert en Système d'information",
    where: "MyDigitalSchool Angers",
  },
  {
    when: "2018 — 2019",
    what: "Licence pro · Web technologies",
    where: "Université de Rennes I",
  },
  {
    when: "2016 — 2018",
    what: "DUT Informatique",
    where: "Université de Rennes I",
  },
];

/**
 * Weightings are a read of the CV, not a measurement — years on the tool,
 * whether it was led or merely used, and how recently.
 */
export const SKILL_ROWS: ReadonlyArray<readonly [string, number]> = [
  ["TypeScript / JS", 95],
  ["React / Next.js", 92],
  ["Leadership", 88],
  ["Node / NestJS / GraphQL", 86],
  ["Vue / Nuxt", 80],
  ["React Native / Expo", 72],
  ["Infra & CI", 70],
] as const;

export const STACK_ROWS: readonly string[] = [
  "languages   TypeScript · JavaScript",
  "frontend    React · Next.js · Vue · Nuxt · Tailwind · Sass",
  "backend     Node · NestJS · Express · Koa · GraphQL · REST · Socket.io",
  "mobile      React Native · Expo",
  "data        PostgreSQL · MongoDB · Firebase · Supabase",
  "infra       Docker · Kubernetes · Helm · Vercel · OVHcloud · Scaleway",
] as const;

export const RATES_ROWS: readonly string[] = [
  "development   €600 / day · fullstack, web and mobile",
  "management    €500 / day · leading a team or a project",
  "consulting    €1 000 / day · architecture and technical direction",
  "",
  "fixed price   when the scope is clear enough to be honest",
] as const;

export const CONTACT_ROWS: readonly string[] = [
  "email       kevin@nare.li",
  "github      github.com/rioukkevin",
  "linkedin    in/kevinatooof",
  "",
  "Paris, France · CET · français, english",
] as const;

export const NOW_ROWS: readonly DiffRow[] = [
  { num: 19, sign: " ", text: "## Availability" },
  { num: 20, sign: " ", text: "" },
  { num: 21, sign: "-", text: "Booked through the summer." },
  { num: 22, sign: "-", text: "Not taking new scoping calls." },
  { num: 21, sign: "+", text: "Available from mid-September 2026." },
  { num: 22, sign: "+", text: "Taking new work now — scoping calls are free." },
  { num: 23, sign: "+", text: "" },
  { num: 24, sign: "+", text: "## Now" },
  { num: 25, sign: "+", text: "Running Nareli, in partnership with @StartAndBrand." },
  { num: 26, sign: "+", text: "Fullstack and mobile work for small teams." },
  { num: 27, sign: " ", text: "" },
  { num: 28, sign: " ", text: "## Shipping" },
  { num: 29, sign: "+", text: "Portfolio v9 · a terminal you drive. You are in it." },
  { num: 30, sign: " ", text: "Side projects · bots, tools, and the counter." },
  { num: 31, sign: " ", text: "" },
  { num: 32, sign: " ", text: "## Rates" },
  { num: 33, sign: " ", text: "€600 dev · €500 management · €1 000 consulting" },
] as const;

export const RESUME_TXT: string = [
  "KÉVIN RIOU — FULLSTACK WEB & MOBILE DEVELOPER (FREELANCE)",
  "Paris, France · kevin@nare.li · github.com/rioukkevin · in/kevinatooof",
  "",
  "EXPERIENCE",
  "2024—now   CEO · Nareli (ooof.dev until Oct 2025) · Paris / remote",
  "2022—2024  Fullstack developer · Technis · Paris",
  "2020—2022  Freelance web developer · France",
  "2020—2022  Fullstack developer · Alpha8 · Denée",
  "2019—2020  R&D assistant · Brioche Pasquier · Les Cerqueux",
  "2018—2019  Web developer · Triskalia (Eureden) · Landerneau",
  "2017—2018  IT technician · CDG29 · Quimper",
  "",
  "EDUCATION",
  "2019—2021  MBA Expert en Système d'information · MyDigitalSchool Angers",
  "2018—2019  Licence pro Web technologies · Université de Rennes I",
  "2016—2018  DUT Informatique · Université de Rennes I",
  "",
  "STACK",
  "TypeScript, React/Next.js, Vue/Nuxt, Node/NestJS, GraphQL, React Native,",
  "PostgreSQL, MongoDB, Docker, Kubernetes",
  "",
  "RATES",
  "€600/day development · €500/day management · €1 000/day consulting",
  "Available from mid-September 2026.",
].join("\n");

export const THEME_ROWS: ReadonlyArray<readonly [string, string]> = [
  ["green", "phosphor green on near-black (default)"],
  ["ember", "warm amber, softer contrast"],
  ["paper", "light, printed-manual feel"],
] as const;

export const VOICE_ROWS: ReadonlyArray<readonly [string, string]> = [
  ["warm", "full sentences, first person (default)"],
  ["terse", "clipped, sysadmin energy"],
] as const;
