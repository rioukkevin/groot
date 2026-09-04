import type { DiffRow } from "./types";

export interface Project {
  name: string;
  stack: string;
  year: string;
  status: string;
  statusColor: string;
  what: string;
  /** Prose paragraphs, wrapped to the viewport at render time. */
  detail: string[];
  /** Screenshots, newest-first, served from public/projects. */
  images: string[];
  links: string[];
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

/**
 * Drives both /help and the command palette. /photos and /components are
 * deliberately absent: they still route, they are just not advertised.
 */
export const CMDS: ReadonlyArray<readonly [string, string]> = [
  ["/projects", "side projects — stack, status, what they solved"],
  ["/project", "one project in detail · /project portfolio"],
  ["/roles", "roles, dates, what I actually did"],
  ["/role", "one role in detail · /role nareli"],
  ["/education", "degrees and where they came from"],
  ["/about", "the short version, with a face"],
  ["/skills", "soft skills — how I work with people"],
  ["/stack", "hard skills, AI included · alias /techs"],
  ["/email", "just the address, nothing else"],
  ["/now", "what changed this month (diff)"],
  ["/rates", "day rates and how I price work"],
  ["/contact", "email, github, linkedin"],
  ["/resume", "download a plain-text CV"],
  ["/theme", "eight palettes, five dark and three light"],
  ["/voice", "warm · brief · terse"],
  ["/clear", "clear the transcript"],
  ["/help", "everything above"],
] as const;

const IMG_VSCODE = ["/projects/vscodeGitCommitMessage/Thumbnail.png", "/projects/vscodeGitCommitMessage/Screen1.png", "/projects/vscodeGitCommitMessage/Screen2.png", "/projects/vscodeGitCommitMessage/Demo.gif"];
const IMG_BRITCH = ["/projects/britch/Thumbnail.png", "/projects/britch/Screen1.png", "/projects/britch/Screen2.png"];
const IMG_CONTROLLER = ["/projects/controller/Thumbnail.png", "/projects/controller/Screen1.png", "/projects/controller/Screen2.png", "/projects/controller/Screen3.png", "/projects/controller/Screen4.png"];
const IMG_OUTRANS = ["/projects/outransCounter/Thumbnail.png", "/projects/outransCounter/Screen1.png", "/projects/outransCounter/Screen2.png", "/projects/outransCounter/Screen3.png"];
const IMG_DIAGEVOL = ["/projects/diagevol/Thumbnail.png", "/projects/diagevol/Screen1.png", "/projects/diagevol/Screen2.png", "/projects/diagevol/Screen3.png", "/projects/diagevol/Screen4.png", "/projects/diagevol/Screen5.png"];
const IMG_OOOF = ["/projects/ooof/Thumbnail.png", "/projects/ooof/Screen1.png", "/projects/ooof/Screen2.png", "/projects/ooof/Screen3.png"];
const IMG_PV6 = ["/projects/portfoliov6/Thumbnail.png", "/projects/portfoliov6/Screen1.png", "/projects/portfoliov6/Screen2.png", "/projects/portfoliov6/Screen3.png"];
const IMG_PV5 = ["/projects/portfoliov5/Thumbnail.png", "/projects/portfoliov5/Screen1.png", "/projects/portfoliov5/Screen2.png", "/projects/portfoliov5/Screen3.png", "/projects/portfoliov5/Screen4.png"];

export const PROJECTS: Record<string, Project> = {
  "vscode-commit": {
    name: "VSCode Git Commit",
    stack: "TypeScript · VSCode API",
    year: "2022",
    status: "on hold",
    statusColor: "var(--warn)",
    what: "A VSCode extension that templates commit messages in the editor.",
    detail: [
      "An extension that standardises Git commit messages from inside VSCode: an interface that generates structured, consistent messages, so a project's history stays readable.",
      "The idea came out of company work, where every developer wrote commit messages their own way and the history became hard to follow. A uniform frame makes the convention the path of least resistance rather than a document nobody opens.",
      "Over 40 stars on GitHub and more than 20 000 downloads. The numbers say it found the developers who had the same problem.",
      "After the first release I added a dedicated site: a configuration generator with a real interface, and a web version of the documentation.",
      "Development is on hold, deliberately. The successor extends the same idea across multiple editors from a single, more flexible configuration file.",
    ],
    images: IMG_VSCODE,
    links: ["Marketplace", "Documentation", "UI settings generator"],
  },
  britch: {
    name: "Britch",
    stack: "Chrome extension · JavaScript",
    year: "—",
    status: "live",
    statusColor: "var(--add)",
    what: "A Chrome extension adding a brightness and contrast gauge to Twitch.",
    detail: [
      "Britch gives Twitch viewers precise control over the brightness and contrast of a live stream, so the picture can be tuned to the screen it is actually being watched on.",
      "It started from a complaint heard often: viewers could not clearly make out what was happening on screen.",
      "Twitch's video is frequently darker than what the streamer sent, which hurts most on horror games and dark scenes. Every viewer's display is different too, so the adjustment has to be per-person rather than global.",
    ],
    images: IMG_BRITCH,
    links: ["Chrome Web Store"],
  },
  overlays: {
    name: "Custom controller overlays",
    stack: "JavaScript · animated sprites",
    year: "—",
    status: "ongoing",
    statusColor: "var(--accent2)",
    what: "Interactive controller overlays built for Twitch streamers.",
    detail: [
      "Overlays I build now and then for streamers — a way of putting something back into the community that adds visible value to a stream.",
      "They render the streamer's inputs in real time, so viewers can see the movements behind the play rather than only its result. It turns skill into something legible.",
      "Technically they are images animated with JavaScript, which keeps them flexible enough to tailor per streamer.",
      "For Dgifou, a bespoke overlay following his graphic charter exactly, so it reads as part of his channel rather than an add-on.",
      "For Amphirae the project evolved with the hardware: a PS4 version first, then a PS5 one.",
      "Oxidya_ shows how far the customisation goes — a general version first, then a specific build for each game she streams daily.",
    ],
    images: IMG_CONTROLLER,
    links: ["GitHub"],
  },
  "outrans-counter": {
    name: "Outrans Counter",
    stack: "Web · multi-device sync",
    year: "—",
    status: "shipped",
    statusColor: "var(--dim)",
    what: "A synced entry counter for the Outrans association's 15-year event.",
    detail: [
      "A mobile web app built for the Outrans association's fifteenth anniversary. Capacity was limited, so volunteers needed a counter synchronised across several devices to manage entries precisely.",
      "Access is gated with hashed codes — light, but enough that only the volunteers running the door can reach the data.",
      "Beyond counting, custom scripts generate detailed statistics, giving the association a picture of how the event actually ran and something to plan the next one against.",
    ],
    images: IMG_OUTRANS,
    links: ["Outrans website"],
  },
  diagevol: {
    name: "Diagevol",
    stack: "Web · design & build",
    year: "2021",
    status: "live",
    statusColor: "var(--add)",
    what: "The showcase site for Alpha8's SaaS product, DiagEvol.",
    detail: [
      "Built during full-time work at Alpha8: the showcase site diagevol.fr, taken from partial mockups through to production.",
      "Diagevol is Alpha8's questionnaire and diagnostics SaaS. The site had to make its features legible — custom questionnaires, automatic analysis of responses, generated professional reports — and show how it changes the way a company collects and reads its own data.",
      "I produced the graphics and built most of the site alone, against a tight deadline, which meant prioritising the modules that carried the business case and letting the rest wait.",
    ],
    images: IMG_DIAGEVOL,
    links: ["Website"],
  },
  ooof: {
    name: "OOOF.dev",
    stack: "Next.js · React",
    year: "2024",
    status: "succeeded by Nareli",
    statusColor: "var(--dim)",
    what: "The site for ooof.dev, the freelance practice that became Nareli.",
    detail: [
      "An interactive portfolio for the freelance practice — skills, projects, and a way in for clients looking for someone to build the thing.",
      "The name is the sound of the moment a client finds the developer they had been looking for. Memorable, and honest about what the job is.",
      "The site sets out the method in full: needs analysis, short development cycles, transparent communication, delivery. Structure is what makes the collaboration predictable.",
      "Services ran from responsive sites and iOS/Android applications to training and architecture work.",
    ],
    images: IMG_OOOF,
    links: ["GitHub profile"],
  },
  "portfolio-v6": {
    name: "Portfolio V6",
    stack: "Next.js · Storyblok · i18n",
    year: "2022",
    status: "retired 2024",
    statusColor: "var(--dim)",
    what: "The portfolio that ran for two years, until October 2024.",
    detail: [
      "Designed in 2022 to catch the attention of recruiters for a full-time role, and online for two years.",
      "Deliberately minimal: a clean design so a visitor looks at the work rather than the wrapper.",
      "Performance and SEO got real attention — partly to learn them properly, partly because most of the traffic was mobile. The result was fast, responsive and well indexed.",
      "It carried endorsements for projects worth backing, including the poachiclash.com tournament and an Alsatian artisan's products.",
      "The hardest and best part was writing a translation system from scratch, which meant taking apart how the existing packages actually work.",
      "Storyblok handled content — a headless CMS chosen to learn on, and the experience carried straight into freelance work.",
    ],
    images: IMG_PV6,
    links: ["GitHub"],
  },
  "portfolio-v5": {
    name: "Portfolio V5",
    stack: "CSS animation · Docker → Vercel",
    year: "2021",
    status: "retired",
    statusColor: "var(--dim)",
    what: "The 2021 portfolio, built for the Brioche Pasquier application.",
    detail: [
      "Version five, from 2021 — the digital business card written for the Brioche Pasquier recruitment process.",
      "It was also a laboratory: an excuse to push CSS animation further than any client project would have allowed, and to find out what could be built without reaching for a library.",
      "Its hosting tells its own story — a Docker machine first, then Netlify, then Vercel, each move buying simpler deploys and better performance.",
    ],
    images: IMG_PV5,
    links: ["GitHub"],
  },
  "twitch-bot": {
    name: "Poachimpa stream bot",
    stack: "Node · Socket.io · Twitch API",
    year: "—",
    status: "live",
    statusColor: "var(--add)",
    what: "An engagement bot for Poachimpa's stream — events, stats, viewers.",
    detail: [
      "A live channel produces events faster than anyone can watch them, and none of it was being kept.",
      "The bot tracks what happens, manages viewers, builds statistics, and runs the engagement mechanics during a stream.",
      "Mine end to end, including the support when it breaks mid-broadcast.",
    ],
    images: [],
    links: [],
  },
  chariteam: {
    name: "Chariteam",
    stack: "Web · events & donations",
    year: "—",
    status: "live",
    statusColor: "var(--add)",
    what: "A site for the Chariteam association to track events and donations.",
    detail: [
      "Donations and events were tracked by hand, across whoever happened to be organising them.",
      "One place for the events and the donations attached to them, built and run for the association.",
    ],
    images: [],
    links: [],
  },
};

export const EXP: readonly Experience[] = [
  {
    key: "nareli",
    when: "2024 — now",
    what: "CEO · Nareli",
    where: "Paris / remote",
    detail: [
      "Scope     Founded Nareli. All",
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

/** Soft skills, shown as chips. Grouped by what they are for. */
export const SOFT_SKILLS: ReadonlyArray<
  readonly [string, readonly string[]]
> = [
  [
    "leading",
    ["Team management", "Project ownership", "Technical direction", "Hiring input"],
  ],
  [
    "working with people",
    ["Mentoring", "Teaching", "Empathy", "Client communication", "Saying no to scope creep"],
  ],
  [
    "how I work",
    ["Documentation", "Pragmatism", "Autonomy", "Support after delivery", "Ship the small version"],
  ],
] as const;

/** [group, tint, items] — the tint colours that group's chips. */
export const STACK_GROUPS: ReadonlyArray<
  readonly [string, string, readonly string[]]
> = [
  ["languages", "var(--accent)", ["TypeScript", "JavaScript", "PHP", "C#"]],
  [
    "frontend",
    "var(--accent2)",
    ["React", "Next.js", "Vue", "Nuxt", "Tailwind", "Sass", "CSS-in-JS"],
  ],
  [
    "backend",
    "var(--add)",
    ["Node", "NestJS", "Express", "Koa", "GraphQL", "REST", "Socket.io"],
  ],
  ["mobile", "var(--warn)", ["React Native", "Expo", "Cordova", "NativeScript"]],
  [
    "data",
    "var(--accent2)",
    ["PostgreSQL", "MongoDB", "Prisma", "Firebase", "Supabase"],
  ],
  [
    "ai",
    "var(--accent)",
    ["LLM APIs", "Agents & MCP", "RAG", "Embeddings", "AI-assisted delivery"],
  ],
  [
    "infra",
    "var(--warn)",
    ["Docker", "Kubernetes", "Helm", "Vercel", "Netlify", "OVHcloud", "Scaleway"],
  ],
  ["testing", "var(--add)", ["Playwright", "Vitest", "Jest"]],
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
  { num: 25, sign: "+", text: "Running Nareli." },
  { num: 26, sign: "+", text: "Fullstack and mobile work for small teams." },
  { num: 27, sign: " ", text: "" },
  { num: 28, sign: " ", text: "## Shipping" },
  { num: 29, sign: "+", text: "Portfolio v9 · a terminal you drive. You are in it." },
  { num: 30, sign: " ", text: "Side projects · bots, tools, and the counter." },
  { num: 31, sign: " ", text: "" },
  { num: 32, sign: " ", text: "## Rates" },
  { num: 33, sign: " ", text: "€600 dev · €500 management · €1 000 consulting" },
] as const;

/** The first line /now reports — shown beside the prompt. */
export const NOW_HEADLINE: string =
  NOW_ROWS.find((r) => r.sign === "+" && r.text.trim())?.text ?? "";

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

