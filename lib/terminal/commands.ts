import { diff, lines, say, select, think, tool } from "./blocks";
import {
  CMDS,
  CONTACT_ROWS,
  EXP,
  NOW_ROWS,
  POSTS,
  PROJECTS,
  RATES_ROWS,
  SKILL_ROWS,
  STACK_ROWS,
  THEME_ROWS,
  VOICE_ROWS,
} from "./content";
import { L, bar, box, pad } from "./format";

import type { BlockSpec, Line, SelectItem, Theme, Voice } from "./types";

/** Everything the command layer needs from the shell, so routing stays pure. */
export interface CommandContext {
  voice: Voice;
  photoGap: number;
  download: () => void;
  setTheme: (t: Theme) => void;
  setVoice: (v: Voice) => void;
}

const THEMES: readonly Theme[] = ["green", "ember", "paper"];

/** Pick the phrasing for the active voice. */
const v = (ctx: CommandContext, warm: string, terse: string) =>
  ctx.voice === "terse" ? terse : warm;

function cHelp(ctx: CommandContext): BlockSpec[] {
  return [
    say(
      v(
        ctx,
        'Everything I can pull up is below. Plain questions work too — try "are you free in November?" or "what do you charge?".',
        "Commands below. Plain questions also route.",
      ),
    ),
    lines(
      CMDS.map((c) => L("  " + c[1], "var(--dim)", pad(c[0], 15), "var(--accent)")),
    ),
  ];
}

function cProjects(ctx: CommandContext): BlockSpec[] {
  const items: SelectItem[] = Object.keys(PROJECTS).map((k) => {
    const p = PROJECTS[k];
    return {
      key: k,
      cmd: "/project " + k,
      k: pad(k, 17),
      kcolor: "var(--fg)",
      text: pad(p.stack, 41) + pad(p.year, 7) + "● " + p.status,
      color: p.statusColor,
    };
  });
  return [
    tool(
      "Read",
      "(work/projects.json)",
      "4 records · 312 tokens",
      [L("ferme-du-clos, atlas-booking, nomad-invoices, kr-ui", "var(--faint)")],
      600,
    ),
    say(
      v(
        ctx,
        "Four worth showing. The interesting part is usually the constraint, not the stack.",
        "Four projects.",
      ),
    ),
    select(
      "project",
      pad("NAME", 17) + pad("STACK", 41) + pad("YEAR", 7) + "STATUS",
      76,
      items,
      "↑↓ select · ↵ open case study · esc release",
    ),
  ];
}

function cProject(name: string): BlockSpec[] {
  const keys = Object.keys(PROJECTS);
  const key = keys.filter((k) => k.indexOf((name || "").toLowerCase()) === 0)[0];
  if (!key)
    return [say("No project by that name. Known: " + keys.join(", ") + ".")];
  const p = PROJECTS[key];
  return [
    tool(
      "Read",
      "(work/" + key + "/case-study.md)",
      p.detail.length + " sections · 1.2 kB",
      [],
      560,
    ),
    say(p.what),
    lines(
      [
        L(pad("stack", 10) + p.stack, "var(--dim)"),
        L(pad("year", 10) + p.year + "   ● " + p.status, p.statusColor),
        L(""),
      ].concat(
        p.detail.map((d) =>
          L(d, d.indexOf("  ") === 0 ? "var(--dim)" : "var(--fg)"),
        ),
      ),
    ),
  ];
}

function cExperience(): BlockSpec[] {
  const items: SelectItem[] = EXP.map((e) => ({
    key: e.key,
    cmd: "/role " + e.key,
    k: pad(e.when, 14),
    kcolor: "var(--accent)",
    text: pad(e.what, 34) + e.where,
    color: "var(--fg)",
  }));
  return [
    tool("Read", "(cv/experience.md)", "3 entries · 208 tokens", [], 480),
    select(
      "role",
      pad("WHEN", 14) + pad("ROLE", 34) + "WHERE",
      62,
      items,
      "↑↓ select · ↵ open role · esc release",
    ),
  ];
}

function cRole(key: string): BlockSpec[] {
  const e = EXP.filter((x) => x.key.indexOf((key || "").toLowerCase()) === 0)[0];
  if (!e)
    return [
      say(
        "No role by that name. Known: " +
          EXP.map((x) => x.key).join(", ") +
          ".",
      ),
    ];
  return [
    tool("Read", "(cv/roles/" + e.key + ".md)", e.detail.length + " lines", [], 420),
    lines(
      [
        L(e.what, "var(--fg)", e.when + "   ", "var(--accent)"),
        L(e.where, "var(--dim)"),
        L(""),
      ].concat(
        e.detail.map((d) =>
          L(d, d.indexOf("  ") === 0 ? "var(--dim)" : "var(--fg)"),
        ),
      ),
    ),
  ];
}

function cAbout(ctx: CommandContext): BlockSpec[] {
  return [
    say(
      v(
        ctx,
        "I'm Kevin — fullstack web developer, freelance, based in Nantes.\n\nI build for small teams who need one person to own the whole thing: the database, the interface, the deploy, and the phone call when it breaks. Six years in, I've stopped being precious about tools. I pick boring ones that will still be here in three years, and I ship the small version first.\n\nOff the clock: long walks, film photography, and a stubborn attachment to the terminal — which you may have noticed.",
        "Kevin Riou. Fullstack, freelance, Nantes.\nSix years. Small teams, whole stack, boring tools.\nShip small. Iterate.",
      ),
    ),
    {
      kind: "photos",
      items: [
        {
          w: 246,
          h: 188,
          cols: 46,
          label: "portrait",
          caption: "portrait · hover to resolve",
        },
      ],
    },
  ];
}

function cSkills(): BlockSpec[] {
  const ls = SKILL_ROWS.map((r) =>
    L(
      " " + bar(r[1]) + "  " + r[1] + "%",
      r[1] > 85 ? "var(--accent)" : "var(--dim)",
      pad(r[0], 20),
      "var(--fg)",
    ),
  );
  ls.push(L(""));
  ls.push(
    L(
      "Fluent enough to be useful: Go, Stripe, Playwright, Terraform, Figma.",
      "var(--dim)",
    ),
  );
  return [
    tool(
      "Analyze",
      "(git log --author=kevin --since=24.months)",
      "6 dimensions · 441 tokens",
      [L("2 148 commits across 14 repositories", "var(--faint)")],
      720,
    ),
    lines(ls),
  ];
}

const cStack = (): BlockSpec[] => [lines(box(STACK_ROWS, 68))];

function cWriting(ctx: CommandContext): BlockSpec[] {
  const items: SelectItem[] = POSTS.map((p) => ({
    key: p.slug,
    cmd: "/post " + p.slug,
    k: pad(p.date, 10),
    kcolor: "var(--dim)",
    text: pad(p.title, 38) + p.mins,
    color: "var(--fg)",
  }));
  return [
    say(v(ctx, "Three I'd stand behind.", "Three posts.")),
    select(
      "post",
      pad("DATE", 10) + pad("TITLE", 38) + "READ",
      52,
      items,
      "↑↓ select · ↵ read excerpt · esc release",
    ),
  ];
}

function cPost(slug: string): BlockSpec[] {
  const p = POSTS.filter(
    (x) => x.slug.indexOf((slug || "").toLowerCase()) === 0,
  )[0];
  if (!p)
    return [
      say(
        "No post by that name. Known: " +
          POSTS.map((x) => x.slug).join(", ") +
          ".",
      ),
    ];
  return [
    tool(
      "Read",
      "(writing/" + p.date + "-" + p.slug + ".md)",
      p.mins + " read · excerpt",
      [],
      440,
    ),
    lines(
      [
        L(p.title, "var(--fg)", "", ""),
        L(p.date + " · " + p.mins, "var(--faint)"),
        L(""),
      ].concat(p.detail.map((d) => L(d, "var(--dim)"))),
    ),
  ];
}

function cNow(ctx: CommandContext): BlockSpec[] {
  return [
    diff(
      "work/status.md",
      "Added 9 lines, removed 4 lines",
      NOW_ROWS,
      "Ran 1 shell command · git log --since=1.month",
    ),
    say(
      v(
        ctx,
        "Short version: the calendar is full until November, and the interesting work right now is the Remix → Next migration on atlas-booking.",
        "Full until November. Current work: atlas-booking v2 migration.",
      ),
    ),
  ];
}

function cRates(ctx: CommandContext): BlockSpec[] {
  return [
    lines(box(RATES_ROWS, 62)),
    say(
      v(
        ctx,
        "I'd rather quote fixed price. It means we both had to think about scope before starting.",
        "Fixed price preferred. Forces real scoping.",
      ),
    ),
  ];
}

function cPhotos(ctx: CommandContext): BlockSpec[] {
  const gap = ctx.photoGap;
  const cell = (label: string) =>
    L(
      pad(label, 16) + "8×19 cells · " + gap + "px gutter · colour preserved",
      "var(--faint)",
    );
  return [
    tool(
      "Render",
      "(media/* → gpu · one cursor cell per pixel)",
      "3 images · webgl · 0 tokens",
      [cell("thumbnail.png"), cell("screen3.png"), cell("logo.png")],
      820,
    ),
    say(
      v(
        ctx,
        "Each block is one terminal cursor, same size as the one blinking below the prompt. Colours come straight off the image. Hover and the blocks dissolve into the photograph.",
        "One cursor-sized block per cell, original colours. Hover shows the photo.",
      ),
    ),
    {
      kind: "shots",
      items: [
        {
          w: 424,
          h: 342,
          cellW: 8,
          cellH: 19,
          gap,
          label: "thumbnail",
          caption: "kevin.riou.pro · thumbnail",
          src: "https://kevin.riou.pro/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FThumbnail.8c8374b3.png&w=3840&q=75",
        },
        {
          w: 424,
          h: 342,
          cellW: 8,
          cellH: 19,
          gap,
          label: "screen",
          caption: "kevin.riou.pro · screen 3",
          src: "https://kevin.riou.pro/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FScreen3.d204b50f.png&w=3840&q=75",
        },
        {
          w: 264,
          h: 266,
          cellW: 8,
          cellH: 19,
          gap,
          label: "logo",
          caption: "nare.li · logo",
          src: "https://app.nare.li/_next/image?url=%2Flogo.png&w=96&q=75",
        },
      ],
    },
  ];
}

/** Showcase for the reusable terminal UI components. */
function cComponents(ctx: CommandContext): BlockSpec[] {
  const shot = (
    label: string,
    caption: string,
    src: string,
    w: number,
    h: number,
  ) => ({
    w,
    h,
    cellW: 8,
    cellH: 19,
    gap: ctx.photoGap,
    label,
    caption,
    src,
  });

  // A long enough run of lines that the viewport genuinely has to scroll.
  const manual: Line[] = [
    L("scroll view", "var(--fg)", "", ""),
    L("a fixed window over a long run of lines.", "var(--dim)"),
    L(""),
    ...Object.keys(PROJECTS).flatMap((k) => {
      const pr = PROJECTS[k];
      return [
        L(pr.what, "var(--fg)", pad(k, 17), "var(--accent)"),
        L(pad("", 17) + pr.stack + "  ·  " + pr.year, "var(--dim)"),
        ...pr.detail.map((d) => L(pad("", 17) + d, "var(--faint)")),
        L(""),
      ];
    }),
    L("end of buffer", "var(--faint)"),
  ];

  return [
    say(
      v(
        ctx,
        "Seven components, all built on the character grid. Each one below is live — the scroll view and the carousel take the arrow keys the same way the lists do, and esc hands them back.",
        "Seven components. Arrow keys drive them; esc releases.",
      ),
    ),
    { kind: "demo", panel: "primitives" },
    {
      kind: "scroll",
      title: "SCROLL VIEW · ↑↓ pgup/pgdn",
      lines: manual,
      rows: 12,
    },
    {
      kind: "carousel",
      title: "CAROUSEL · ←→ · images or whole projects",
      slides: [
        {
          key: "thumb",
          label: "image slide",
          kind: "shot",
          shot: shot(
            "thumbnail",
            "kevin.riou.pro · thumbnail",
            "https://kevin.riou.pro/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FThumbnail.8c8374b3.png&w=3840&q=75",
            336,
            266,
          ),
        },
        ...Object.keys(PROJECTS)
          .slice(0, 3)
          .map((k) => {
            const pr = PROJECTS[k];
            return {
              key: k,
              label: "project slide",
              kind: "lines" as const,
              lines: [
                L(pr.what, "var(--fg)", pad(k, 17), "var(--accent)"),
                L(pad("stack", 10) + pr.stack, "var(--dim)"),
                L(pad("year", 10) + pr.year + "   ● " + pr.status, pr.statusColor),
                L(""),
                ...pr.detail.map((d) =>
                  L(d, d.indexOf("  ") === 0 ? "var(--faint)" : "var(--fg)"),
                ),
              ],
            };
          }),
        {
          key: "logo",
          label: "image slide",
          kind: "shot",
          shot: shot(
            "logo",
            "nare.li · logo",
            "https://app.nare.li/_next/image?url=%2Flogo.png&w=96&q=75",
            264,
            266,
          ),
        },
      ],
    },
    say(
      v(
        ctx,
        "The images above and in /photos open full screen on click — the spotlight morphs the photo out of its slot, drops the shader so you see the original, and lets you zoom and pan.",
        "Click any image: spotlight, original resolution, zoom and pan.",
      ),
    ),
  ];
}

function cContact(ctx: CommandContext): BlockSpec[] {
  return [
    lines(box(CONTACT_ROWS, 62)),
    say(
      v(
        ctx,
        "Email is fastest. Tell me what you're building and roughly when you need it.",
        "Email. Include scope and timeline.",
      ),
    ),
  ];
}

function cResume(ctx: CommandContext): BlockSpec[] {
  return [
    tool("Write", "(dist/kevin-riou.txt)", "1 file · 4.1 kB", [], 620),
    {
      kind: "action",
      actionLabel: "↓ download kevin-riou.txt",
      act: ctx.download,
    },
  ];
}

function cTheme(arg: string, ctx: CommandContext): BlockSpec[] {
  if (!THEMES.includes(arg as Theme)) {
    return [
      lines(
        THEME_ROWS.map((t) => L(pad(t[0], 9) + t[1], "var(--dim)", "  ", "")).concat([
          L(""),
          L("/theme <name>", "var(--accent)", "  ", ""),
        ]),
      ),
    ];
  }
  ctx.setTheme(arg as Theme);
  return [say("Theme: " + arg + ".")];
}

function cVoice(arg: string, ctx: CommandContext): BlockSpec[] {
  if (arg !== "warm" && arg !== "terse") {
    return [
      lines(VOICE_ROWS.map((r) => L(pad(r[0], 9) + r[1], "var(--dim)", "  ", ""))),
    ];
  }
  ctx.setVoice(arg);
  return [
    say(
      arg === "terse"
        ? "Voice: terse. Fewer words from here."
        : "Voice: warm. Back to full sentences.",
    ),
  ];
}

function freeform(q: string, ctx: CommandContext): BlockSpec[] {
  const s = q.toLowerCase();
  const has = (w: string) => s.indexOf(w) >= 0;
  const pre = [think("thinking · matching against portfolio index…")];

  if (has("hire") || has("available") || has("free in") || has("dispo") || has("start"))
    return pre.concat(cNow(ctx));
  if (has("rate") || has("price") || has("cost") || has("charge") || has("tarif") || has("budget"))
    return pre.concat(cRates(ctx));
  if (has("ferme") || has("atlas") || has("nomad") || has("kr-ui")) {
    const k = Object.keys(PROJECTS).filter((n) => has(n.split("-")[0]))[0];
    return pre.concat(cProject(k));
  }
  if (has("react") || has("next") || has("node") || has("stack") || has("postgres") || has("typescript"))
    return pre.concat(cSkills());
  if (has("ship") || has("project") || has("work") || has("built") || has("portfolio"))
    return pre.concat(cProjects(ctx));
  if (has("experience") || has("worked") || has("job") || has("year"))
    return pre.concat(cExperience());
  if (has("who") || has("about") || has("yourself")) return pre.concat(cAbout(ctx));
  if (has("contact") || has("email") || has("reach") || has("call"))
    return pre.concat(cContact(ctx));
  if (has("photo") || has("picture") || has("image")) return pre.concat(cPhotos(ctx));

  return pre.concat([
    tool("Search", '(index, "' + q.slice(0, 30) + '")', "no exact match", [], 520),
    say(
      v(
        ctx,
        "No canned answer for that one — email me and you'll get a real one. Meanwhile, here's what I do have:",
        "No match. Available:",
      ),
    ),
    lines([
      L("/projects  /experience  /skills  /rates  /now  /contact", "var(--accent)", "  ", ""),
    ]),
  ]);
}

/** Sentinel returned for /clear, which the shell handles rather than rendering. */
export const CLEAR: unique symbol = Symbol("clear");

export function route(
  raw: string,
  ctx: CommandContext,
): BlockSpec[] | typeof CLEAR {
  const q = raw.trim();
  if (!q) return [];

  if (q[0] === "/") {
    const parts = q.slice(1).split(/\s+/);
    const c = parts[0].toLowerCase();
    const arg = (parts[1] || "").toLowerCase();

    if (c === "clear") return CLEAR;

    const map: Record<string, () => BlockSpec[]> = {
      help: () => cHelp(ctx),
      projects: () => cProjects(ctx),
      project: () => cProject(arg),
      experience: () => cExperience(),
      role: () => cRole(arg),
      post: () => cPost(arg),
      about: () => cAbout(ctx),
      skills: () => cSkills(),
      stack: () => cStack(),
      writing: () => cWriting(ctx),
      now: () => cNow(ctx),
      photos: () => cPhotos(ctx),
      rates: () => cRates(ctx),
      contact: () => cContact(ctx),
      components: () => cComponents(ctx),
      resume: () => cResume(ctx),
      theme: () => cTheme(arg, ctx),
      voice: () => cVoice(arg, ctx),
    };

    if (map[c]) return map[c]();
    return [say("Unknown command /" + c + " — /help lists them all.")];
  }

  return freeform(q, ctx);
}

/** Intro transcript, replayed on mount and after /clear. */
export function intro(ctx: CommandContext): BlockSpec[] {
  return [
    say(
      v(
        ctx,
        "Hey — I'm Kevin. This is my portfolio, but it runs like a shell, so you drive it.\n\nType a command or just ask a question in plain words. /projects is the usual first stop; /now tells you whether I'm free.",
        "Kevin Riou. Fullstack web developer, freelance.\nType a command or a question. /help lists everything.",
      ),
    ),
    lines([
      L("/projects", "var(--dim)", "  try  ", "var(--faint)"),
      L('"are you free in November?"', "var(--dim)", "       ", "var(--faint)"),
      L("/photos", "var(--dim)", "       ", "var(--faint)"),
      L(""),
      L("lists are selectable — ↑↓ to move, ↵ to open", "var(--faint)", "  ", ""),
    ]),
  ];
}

/** Command-palette matches for the current input. */
export function matches(vInput: string): ReadonlyArray<readonly [string, string]> {
  if (!vInput || vInput[0] !== "/" || vInput.indexOf(" ") >= 0) return [];
  const t = vInput.slice(1).toLowerCase();
  return CMDS.filter((c) => c[0].slice(1).indexOf(t) === 0);
}
