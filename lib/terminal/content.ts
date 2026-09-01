// Pure content dataset for the terminal portfolio. Transcribed 1:1 from the
// "Terminal Portfolio v2" design mockup: every string here is load-bearing,
// including the multi-space column alignment inside the `detail` arrays.

import type { DiffRow } from "./types";

export interface Project {
  stack: string;
  year: string;
  status: string;
  statusColor: string;
  what: string;
  detail: readonly string[];
}

export interface Experience {
  key: string;
  when: string;
  what: string;
  where: string;
  detail: readonly string[];
}

export interface Post {
  slug: string;
  date: string;
  title: string;
  mins: string;
  detail: readonly string[];
}

/** [command, description] pairs listed by /help. */
export const CMDS: ReadonlyArray<readonly [string, string]> = [
  ["/projects", "selected work — stack, year, status"],
  ["/project", "one project in detail · /project ferme-du-clos"],
  ["/experience", "roles, dates, what I actually did"],
  ["/role", "one role in detail · /role freelance"],
  ["/post", "read a post · /post boring"],
  ["/about", "the short version, with a face"],
  ["/skills", "stack proficiency, honestly rated"],
  ["/stack", "tools I reach for by default"],
  ["/writing", "notes I've published"],
  ["/now", "what changed this month (diff)"],
  ["/photos", "desk, site visits, film"],
  ["/rates", "day rate and how I price work"],
  ["/contact", "email, github, calendar"],
  ["/resume", "download a plain-text CV"],
  ["/theme", "green · ember · paper"],
  ["/voice", "warm · terse"],
  ["/clear", "clear the transcript"],
  ["/components", "the terminal UI kit, live"],
  ["/help", "everything above"],
] as const;

/** Insertion order drives the /projects select list. */
export const PROJECTS: Record<string, Project> = {
  "ferme-du-clos": {
    stack: "Next.js 15 · Stripe · Sanity · Vercel",
    year: "2026",
    status: "live",
    statusColor: "var(--add)",
    what: "Farm shop selling 400 orders a week on pickup slots instead of delivery.",
    detail: [
      "Problem   Orders came in by text message. One person, no stock truth,",
      "          Saturday chaos.",
      "Built     Slot-based checkout, live stock per pickup window, Stripe",
      "          payment intents, Sanity for the catalogue so they edit it",
      "          themselves. Printable pick lists for the barn.",
      "Result    Order volume 3x, zero double-sold items since launch.",
      "Mine      All of it — schema, UI, deploys, and the support line.",
    ],
  },
  "atlas-booking": {
    stack: "Remix · Postgres · Fly.io · Playwright",
    year: "2025",
    status: "live",
    statusColor: "var(--add)",
    what: "Booking backend for a network of 40 climbing gyms.",
    detail: [
      "Problem   Each gym ran its own spreadsheet. No shared availability.",
      "Built     Multi-tenant Postgres schema, transactional slot locking,",
      "          staff dashboard, ICS feeds, Playwright suite on every PR.",
      "Result    Double bookings went from ~15/week to 0.",
      "Mine      Backend and data model; shared the frontend with their team.",
    ],
  },
  "nomad-invoices": {
    stack: "SvelteKit · Supabase · Puppeteer",
    year: "2025",
    status: "sunset",
    statusColor: "var(--dim)",
    what: "Invoicing for French freelancers. Sunset after Qonto shipped the same thing.",
    detail: [
      "Problem   URSSAF-compliant invoices without a €30/month subscription.",
      "Built     PDF generation, recurring invoices, VAT rules, CSV export.",
      "Result    310 paying users at peak. Shut down cleanly, data exported.",
      "Learned   Don't build in a lane a bank is walking into.",
    ],
  },
  "kr-ui": {
    stack: "TypeScript · Vite · CSS layers",
    year: "2024",
    status: "maintained",
    statusColor: "var(--accent2)",
    what: "My own component library — the reason client projects start fast.",
    detail: [
      "Why       Every project rebuilt the same 20 components badly.",
      "Built     34 components, no runtime dependencies, 11 kB gzipped.",
      "Result    New client project scaffolds in about two hours.",
      "Mine      Everything. Used on 9 client projects.",
    ],
  },
};

export const EXP: readonly Experience[] = [
  {
    key: "freelance",
    when: "2023 — now",
    what: "Freelance fullstack developer",
    where: "Nantes / remote",
    detail: [
      "Scope     Whole stack, start to support call. Scoping, schema, UI,",
      "          deploys, and the maintenance nobody quotes for.",
      "Clients   9 to date · 3 on retainer · smallest 2 days, largest 7 months.",
      "Typical   A team of 4–20 with no in-house developer, or one who is",
      "          already underwater.",
      "Proud of  ferme-du-clos and atlas-booking, both still running with",
      "          no rewrite and no ops team.",
    ],
  },
  {
    key: "agency",
    when: "2021 — 2023",
    what: "Senior frontend · agency",
    where: "Nantes",
    detail: [
      "Scope     Design systems and ecommerce frontends for retail clients.",
      "Led       Migration of 6 client sites off a legacy template stack.",
      "          Halved build times, killed jQuery, wrote the handover docs.",
      "Team      4 developers, 2 designers. Mentored two juniors.",
      "Learned   How to say no to a scope change in front of a client.",
    ],
  },
  {
    key: "saas",
    when: "2019 — 2021",
    what: "Fullstack developer · SaaS",
    where: "Remote",
    detail: [
      "Scope     Node + Postgres backend, React dashboard, on-call rotation.",
      "Context   First hire. Team went from 2 to 11 while I was there.",
      "Shipped   Billing, permissions, and the reporting layer everyone",
      "          said was impossible on the existing schema.",
      "Learned   Migrations are a product feature. Test them like one.",
    ],
  },
] as const;

export const POSTS: readonly Post[] = [
  {
    slug: "boring",
    date: "2026-06",
    title: "Ship the boring version first",
    mins: "6 min",
    detail: [
      "The version you can build in a week teaches you more than the",
      "version you can describe in a meeting. Constraints only become",
      "real once something is in front of a user.",
      "",
      "On ferme-du-clos the first release was a form and a printed list.",
      "The pickup-slot logic that now runs the whole shop came from",
      "watching two Saturdays go wrong.",
    ],
  },
  {
    slug: "postgres",
    date: "2026-02",
    title: "Postgres is enough until it isn't",
    mins: "11 min",
    detail: [
      "Queues, full-text search, JSON documents, cron, pub/sub: one",
      "database does all of it well enough for the first hundred",
      "thousand users, and one database is one thing to operate.",
      "",
      "Where it stops being enough, and how to tell the difference",
      "between a scaling problem and a missing index.",
    ],
  },
  {
    slug: "design-system",
    date: "2025-11",
    title: "A design system for one developer",
    mins: "8 min",
    detail: [
      "Component libraries fail solo developers because they are built",
      "for consensus. Alone, you need the opposite: 30 components you",
      "have already argued with yourself about, and no theme layer.",
      "",
      "kr-ui is 34 components, 11 kB, no runtime dependencies. It is",
      "the reason a new client project starts on day one, not day four.",
    ],
  },
] as const;

/** [label, percentage] rows rendered as bars by /skills. */
export const SKILL_ROWS: ReadonlyArray<readonly [string, number]> = [
  ["TypeScript", 95],
  ["React / Next.js", 92],
  ["Node / Fastify", 86],
  ["Postgres / Prisma", 78],
  ["CSS & interface", 74],
  ["Infra & CI", 68],
] as const;

/** Boxed lines for /stack (box width 68). */
export const STACK_ROWS: readonly string[] = [
  "runtime    TypeScript · Node 22 · Bun for scripts",
  "frontend   Next.js / Remix · kr-ui · CSS layers, no Tailwind",
  "data       Postgres · Prisma · Supabase when speed matters",
  "infra      Fly.io · Vercel · GitHub Actions · Terraform",
  "testing    Playwright · Vitest",
  "design     Figma · hand-written CSS, always",
] as const;

/** Boxed lines for /rates (box width 62). */
export const RATES_ROWS: readonly string[] = [
  "day rate      €550 · remote, CET hours",
  "fixed price   when the scope is clear enough to be honest",
  "retainer      from €1 400/month · 3 slots, 1 open",
  "small fixes   under half a day, I usually just do them",
] as const;

/** Boxed lines for /contact (box width 62). The blank line is intentional. */
export const CONTACT_ROWS: readonly string[] = [
  "email      hello@kevinriou.dev",
  "github     github.com/kevinriou",
  "linkedin   in/kevinriou",
  "calendar   cal.com/kevinriou/30min",
  "",
  "Nantes, France · CET · replies within a day",
] as const;

/** Diff rows for /now — work/status.md. */
export const NOW_ROWS: readonly DiffRow[] = [
  { num: 19, sign: " ", text: "## Availability" },
  { num: 20, sign: " ", text: "" },
  { num: 21, sign: "-", text: "Open for new work from September 2026." },
  { num: 22, sign: "-", text: "Two afternoon slots free most weeks." },
  { num: 23, sign: "-", text: "Happy to take on short audits." },
  { num: 21, sign: "+", text: "Booked through October 2026 — atlas-booking v2 has the" },
  { num: 22, sign: "+", text: "mornings, ferme-du-clos the Thursday afternoons." },
  { num: 23, sign: "+", text: "Taking new work from November. Scoping calls are free." },
  { num: 24, sign: "+", text: "" },
  { num: 25, sign: "+", text: "## Learning" },
  { num: 26, sign: "+", text: "Postgres logical replication, mostly so I stop being" },
  { num: 27, sign: "+", text: "nervous about zero-downtime migrations." },
  { num: 28, sign: " ", text: "" },
  { num: 29, sign: " ", text: "## Shipping" },
  { num: 30, sign: "+", text: "atlas-booking v2 · Remix → Next 15, staging is green." },
  { num: 31, sign: " ", text: "ferme-du-clos · pickup-slot rewrite, live since June." },
  { num: 32, sign: " ", text: "" },
  { num: 33, sign: " ", text: "## Dropped" },
  { num: 34, sign: "-", text: "WordPress maintenance retainers" },
  { num: 35, sign: " ", text: "" },
] as const;

/** Body of the plain-text CV offered by /resume. */
export const RESUME_TXT: string = `KEVIN RIOU — FULLSTACK WEB DEVELOPER (FREELANCE)
Nantes, France · hello@kevinriou.dev · github.com/kevinriou

EXPERIENCE
2023—now   Freelance fullstack developer · Nantes / remote
2021—2023  Senior frontend · agency · Nantes
2019—2021  Fullstack developer · SaaS · remote

SELECTED WORK
ferme-du-clos   Next.js, Stripe, Sanity     2026  live
atlas-booking   Remix, Postgres, Fly.io     2025  live
nomad-invoices  SvelteKit, Supabase         2025  sunset
kr-ui           TypeScript, Vite            2024  maintained

STACK
TypeScript, React/Next.js, Node, Postgres, Prisma, CI/CD, CSS`;

/** [name, description] rows listed by /theme with no valid argument. */
export const THEME_ROWS: ReadonlyArray<readonly [string, string]> = [
  ["green", "phosphor green on near-black (default)"],
  ["ember", "warm amber, softer contrast"],
  ["paper", "light, printed-manual feel"],
] as const;

/** [name, description] rows listed by /voice with no valid argument. */
export const VOICE_ROWS: ReadonlyArray<readonly [string, string]> = [
  ["warm", "full sentences, first person (default)"],
  ["terse", "clipped, sysadmin energy"],
] as const;
