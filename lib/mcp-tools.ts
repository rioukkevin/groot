import type { ShellContentData } from "./terminal/shell-content";

/**
 * The tools this site exposes to an agent, defined once.
 *
 * The same definitions serve two callers: the HTTP MCP endpoint, for an agent
 * running anywhere, and the in-page WebMCP registration, for an agent running
 * in the browser alongside the user. Defining them once means an agent gets the
 * same answer whichever door it came through.
 *
 * Everything is read-only. A portfolio wants to be asked about; it has nothing
 * an anonymous caller should be able to change.
 */

export interface ToolDef {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, { type: string; description: string }>;
    required?: string[];
  };
  run: (args: Record<string, unknown>, c: ShellContentData) => unknown;
}

const str = (v: unknown) => (typeof v === "string" ? v.toLowerCase() : "");

export const TOOLS: ToolDef[] = [
  {
    name: "get_profile",
    description:
      "Who Kévin Riou is: name, current role, location, languages, and a short biography.",
    inputSchema: { type: "object", properties: {} },
    run: (_a, c) => ({
      name: c.name,
      title: c.tagline,
      about: c.about,
      location: "Paris, France",
      languages: ["français", "english"],
      availability: c.nowHeadline,
    }),
  },
  {
    name: "get_availability",
    description:
      "Whether Kévin is available for work, from when, and what he is working on now.",
    inputSchema: { type: "object", properties: {} },
    run: (_a, c) => ({
      headline: c.nowHeadline,
      detail: c.nowRows.filter((r) => r.text).map((r) => r.text),
    }),
  },
  {
    name: "list_projects",
    description:
      "Every project, with its stack, year and status. Use get_project for the full write-up of one.",
    inputSchema: { type: "object", properties: {} },
    run: (_a, c) =>
      Object.values(c.projects).map((p) => ({
        key: p.key,
        name: p.name,
        summary: p.what,
        stack: p.stack,
        year: p.year,
        status: p.status,
      })),
  },
  {
    name: "get_project",
    description: "The full write-up of one project, by its key or name.",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "Project key or name, e.g. britch" },
      },
      required: ["key"],
    },
    run: (a, c) => {
      const q = str(a.key);
      const p =
        Object.values(c.projects).find((x) => x.key.toLowerCase() === q) ??
        Object.values(c.projects).find(
          (x) => x.key.toLowerCase().includes(q) || x.name.toLowerCase().includes(q),
        );
      if (!p) {
        return {
          error: "No such project.",
          known: Object.keys(c.projects),
        };
      }
      return { ...p, detail: p.detail };
    },
  },
  {
    name: "list_roles",
    description:
      "Employment and freelance history: each role, when, where, and what it involved.",
    inputSchema: { type: "object", properties: {} },
    run: (_a, c) =>
      c.roles.map((r) => ({
        key: r.key,
        when: r.when,
        role: r.what,
        where: r.where,
        detail: r.detail,
      })),
  },
  {
    name: "get_skills",
    description:
      "Technical stack and soft skills, grouped. Use this before claiming Kévin does or does not know a technology.",
    inputSchema: { type: "object", properties: {} },
    run: (_a, c) => ({
      stack: Object.fromEntries(c.stack.map(([g, , i]) => [g, i])),
      soft: Object.fromEntries(c.softSkills.map(([g, , i]) => [g, i])),
      education: c.education,
    }),
  },
  {
    name: "get_rates",
    description: "Day rates and how work is priced.",
    inputSchema: { type: "object", properties: {} },
    run: (_a, c) => c.rates.map(([label, value]) => ({ label, value })),
  },
  {
    name: "get_contact",
    description:
      "How to reach Kévin. Prefer giving the email; the contact form is at /contact in the site's terminal.",
    inputSchema: { type: "object", properties: {} },
    run: (_a, c) => ({
      channels: c.contact.map(([label, value]) => ({ label, value })),
      note: c.contactFooter,
    }),
  },
  {
    name: "search_content",
    description:
      "Free-text search across projects, roles and skills. Use when the question does not map to one of the other tools.",
    inputSchema: {
      type: "object",
      properties: { query: { type: "string", description: "What to look for" } },
      required: ["query"],
    },
    run: (a, c) => {
      const q = str(a.query);
      if (!q) return { matches: [] };
      const hit = (s: string) => s.toLowerCase().includes(q);
      return {
        projects: Object.values(c.projects)
          .filter(
            (p) => hit(p.name) || hit(p.what) || hit(p.stack) || p.detail.some(hit),
          )
          .map((p) => ({ key: p.key, name: p.name, summary: p.what })),
        roles: c.roles
          .filter((r) => hit(r.what) || hit(r.where) || r.detail.some(hit))
          .map((r) => ({ key: r.key, role: r.what, when: r.when })),
        skills: [...c.stack, ...c.softSkills]
          .flatMap(([g, , items]) => items.filter(hit).map((i) => `${g}: ${i}`)),
      };
    },
  },
];

export const toolByName = (name: string) => TOOLS.find((t) => t.name === name);

/** The wire shape: schemas only, no implementations. */
export const toolManifest = () =>
  TOOLS.map(({ name, description, inputSchema }) => ({
    name,
    description,
    inputSchema,
  }));
