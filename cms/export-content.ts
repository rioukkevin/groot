/**
 * Snapshots everything the shell serves into content-export/content.json.
 *
 * That file is what `cms/seed.ts` reads, so this is the bridge between the
 * content still living in TypeScript and the content living in Payload. Run it
 * after editing lib/terminal/content.ts, before re-seeding.
 *
 *   bun run content:export
 */
import { writeFileSync } from "node:fs";

import { CONTACT_GROUPS, CONTACT_STEPS } from "../lib/terminal/contact";
import * as C from "../lib/terminal/content";

const out = {
  exportedAt: new Date().toISOString(),
  note: "Snapshot of the shell's content. Regenerate with `bun run content:export`.",
  commands: C.CMDS,
  projects: C.PROJECTS,
  roles: C.EXP,
  education: C.EDUCATION,
  softSkills: C.SOFT_SKILLS,
  stack: C.STACK_GROUPS,
  rates: C.RATES_ROWS,
  contact: C.CONTACT_ROWS,
  now: C.NOW_ROWS,
  nowHeadline: C.NOW_HEADLINE,
  resume: C.RESUME_TXT,
  contactWizard: {
    groups: CONTACT_GROUPS,
    steps: CONTACT_STEPS.map((s) => ({
      key: s.key,
      group: s.group,
      kind: s.kind,
      question: s.question,
      ...(s.kind === "choice"
        ? { perRow: s.perRow, options: s.options }
        : { label: s.label, required: s.required }),
    })),
  },
};

writeFileSync("content-export/content.json", JSON.stringify(out, null, 2));
console.log(
  "projects",
  Object.keys(out.projects).length,
  "| roles",
  out.roles.length,
  "| stack groups",
  out.stack.length,
  "| soft groups",
  out.softSkills.length,
);
