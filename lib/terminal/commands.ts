import { diff, lines, say, select, think, tool } from "./blocks";
import {
  CMDS,
  CONTACT_ROWS,
  EDUCATION,
  EXP,
  NOW_ROWS,
  PROJECTS,
  RATES_ROWS,
  SOFT_SKILLS,
  STACK_GROUPS,
} from "./content";
import { L, box, pad } from "./format";

import type { BlockSpec, Line, SelectItem, Theme, Voice } from "./types";

/** Everything the command layer needs from the shell, so routing stays pure. */
export interface CommandContext {
  theme: Theme;
  voice: Voice;
  photoGap: number;
  download: () => void;
  setTheme: (t: Theme) => void;
  setVoice: (v: Voice) => void;
}

const THEMES: readonly Theme[] = [
  "green",
  "ember",
  "ice",
  "plum",
  "mono",
  "paper",
  "white",
  "linen",
];

/** [value, label, hint, ink, ground] — the swatch previews both. */
const THEME_CARDS: ReadonlyArray<
  readonly [Theme, string, string, string, string]
> = [
  ["green", "green", "phosphor on near-black", "oklch(0.80 0.115 152)", "#0c0c0c"],
  ["ember", "ember", "warm amber, softer", "oklch(0.80 0.115 42)", "#0d0b0a"],
  ["ice", "ice", "cool blue, low glare", "oklch(0.82 0.10 220)", "#0a0c0e"],
  ["plum", "plum", "violet on near-black", "oklch(0.78 0.13 310)", "#0d0a0e"],
  ["mono", "mono", "greyscale, no hue", "oklch(0.88 0 0)", "#0b0b0b"],
  ["paper", "paper", "light, printed manual", "oklch(0.50 0.12 152)", "#f4f2ed"],
  ["white", "white", "clean white, blue ink", "oklch(0.55 0.15 252)", "#ffffff"],
  ["linen", "linen", "warm white, rust ink", "oklch(0.52 0.14 45)", "#faf7f2"],
];

/** Pick the phrasing for the active voice: three registers, long to short. */
const v = (
  ctx: CommandContext,
  warm: string,
  brief: string,
  terse: string,
) => (ctx.voice === "terse" ? terse : ctx.voice === "brief" ? brief : warm);

function cHelp(ctx: CommandContext): BlockSpec[] {
  return [
    say(
      v(
        ctx,
        'Everything I can pull up is below. Plain questions work too — try "are you free in November?" or "what do you charge?".',
        "Everything I can pull up is below. Plain questions route too — try \"are you free in September?\".",
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
      Object.keys(PROJECTS).length + " records · 312 tokens",
      [L(Object.keys(PROJECTS).join(", "), "var(--faint)")],
      600,
    ),
    say(
      v(
        ctx,
        "Side projects, mostly. The client work lives under /roles — this is what gets built when nobody is asking.",
        "Side projects. The client work is under /roles — this is what gets built when nobody is asking.",
        "Side projects. Client work is under /roles.",
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

  const meta: Line[] = [
    L(p.what, "var(--fg)"),
    L(""),
    L(pad("stack", 10) + p.stack, "var(--dim)"),
    L(pad("year", 10) + p.year + "   ● " + p.status, p.statusColor),
    ...(p.links.length
      ? [L(pad("links", 10) + p.links.join(" · "), "var(--dim)")]
      : []),
    L(""),
  ];

  return [
    tool(
      "Read",
      "(work/" + key + "/case-study.md)",
      p.detail.length + " sections · " + p.images.length + " screenshots",
      [],
      520,
    ),
    {
      kind: "project",
      title: p.name.toUpperCase() + " · ←→",
      rows: 14,
      meta,
      paragraphs: [...p.detail],
      slides: p.images.map((src, i) => ({
        key: src,
        label: i === 0 ? "thumbnail" : "screen " + i,
        kind: "shot" as const,
        shot: {
          w: 300,
          h: 220,
          cellW: 5,
          cellH: 9,
          gap: 1,
          label: p.name,
          caption: p.name + " · " + (i === 0 ? "thumbnail" : "screen " + i),
          src,
        },
      })),
    },
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
    tool("Read", "(cv/experience.md)", EXP.length + " entries · 208 tokens", [], 480),
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
        "I'm Kévin — fullstack web and mobile developer, freelance, based in Paris.\n\nI run Nareli, in partnership with @StartAndBrand, and before that traded as ooof.dev. Nine years in, across a cooperative, a food manufacturer, a SaaS and a Swiss sensor company, the pattern is the same: small teams that need one person to own the architecture, the interface, the deploy, and the phone call when it breaks.\n\nI've led teams and projects end to end, and I still prefer writing the thing. Off the clock: side projects since 2016 — bots, tools, and nine versions of this portfolio.",
        "Kévin — fullstack web and mobile developer, freelance, in Paris.\n\nI run Nareli, in partnership with @StartAndBrand, and traded as ooof.dev before that. Nine years across a cooperative, a manufacturer, a SaaS and a sensor company: small teams that need one person to own the whole thing.",
        "Kévin Riou. Fullstack web and mobile, freelance, Paris.\nNareli, ex ooof.dev. Nine years, whole stack.\nArchitecture to support call.",
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

function cSkills(ctx: CommandContext): BlockSpec[] {
  return [
    say(
      v(
        ctx,
        "The part of the job that isn't typing. Nine years across a cooperative, a manufacturer, a SaaS and a sensor company taught me more about people than about frameworks.",
        "The part of the job that isn't typing. Nine years taught me more about people than about frameworks.",
        "Soft skills. The part that isn't typing.",
      ),
    ),
    {
      kind: "chips",
      groups: SOFT_SKILLS.map(
        (g, i) =>
          [g[0], [...g[1]], ["var(--accent)", "var(--accent2)", "var(--warn)"][i % 3]] as [
            string,
            string[],
            string?,
          ],
      ),
    },
    lines([
      L("/stack for the hard skills · /techs does the same", "var(--faint)", "  ", ""),
    ]),
  ];
}

function cStack(ctx: CommandContext): BlockSpec[] {
  return [
    say(
      v(
        ctx,
        "What I reach for without thinking about it. The soft side is under /skills.",
        "The default toolkit. Soft skills are under /skills.",
        "Hard stack. /skills for the rest.",
      ),
    ),
    {
      kind: "chips",
      groups: STACK_GROUPS.map(
        (g) => [g[0], [...g[2]], g[1]] as [string, string[], string?],
      ),
    },
  ];
}

function cEducation(): BlockSpec[] {
  return [
    tool("Read", "(cv/education.md)", "3 entries", [], 380),
    lines(
      EDUCATION.flatMap((e) => [
        L(e.what, "var(--fg)", pad(e.when, 14), "var(--accent)"),
        L(pad("", 14) + e.where, "var(--dim)"),
      ]),
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
        "Short version: I'm free from mid-September, and the work right now is Nareli — fullstack and mobile builds for small teams.",
        "Free from mid-September. The work right now is Nareli — fullstack and mobile builds for small teams.",
        "Free from mid-September. Current work: Nareli client builds.",
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
        "Three rates because they are three different jobs. I'd rather quote fixed price where the scope is clear — it means we both thought about it before starting.",
        "Three rates because they are three different jobs. Fixed price where the scope is clear enough to be honest.",
        "Three rates, three jobs. Fixed price where scope allows.",
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
        "One cursor-sized block per cell, colours straight off the image. Hover and the blocks dissolve into the photograph.",
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
        "Seven components, all on the character grid and all live. Arrows drive them, esc hands them back.",
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
        "Images open full screen on click — the shader drops away, so you get the original, with zoom and pan.",
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
        "Email works if you'd rather. Otherwise answer the four questions below and it lands in my inbox — arrows to choose, ↵ to confirm.",
        "Email works if you'd rather. Otherwise answer the four below — arrows to choose, ↵ to confirm.",
        "Email, or answer below. ↑↓ choose, ↵ confirm.",
      ),
    ),
    { kind: "contact" },
  ];
}

function cEmail(): BlockSpec[] {
  return [lines([L("kevin@nare.li", "var(--accent)", "  ", "")])];
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
  if (THEMES.includes(arg as Theme)) {
    ctx.setTheme(arg as Theme);
    return [say("Theme: " + arg + ".")];
  }
  return [
    {
      kind: "picker",
      title: "THEME · 5 dark · 3 light",
      perRow: 4,
      current: ctx.theme,
      onSelect: (v) => ctx.setTheme(v as Theme),
      options: THEME_CARDS.map(([value, label, hint, ink, ground]) => ({
        value,
        label,
        hint,
        icon: "████████████",
        iconColor: ink,
        iconBg: ground,
      })),
    },
  ];
}

function cVoice(arg: string, ctx: CommandContext): BlockSpec[] {
  const VOICES: readonly Voice[] = ["warm", "brief", "terse"];
  if (VOICES.includes(arg as Voice)) {
    ctx.setVoice(arg as Voice);
    return [say("Voice: " + arg + ".")];
  }
  return [
    {
      kind: "voice",
      current: ctx.voice,
      onSelect: (v) => ctx.setVoice(v),
    },
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
  if (has("nareli") || has("ooof") || has("technis") || has("alpha8") || has("pasquier") || has("triskalia")) {
    const k = ["nareli", "technis", "alpha8", "pasquier", "triskalia"].filter((n) => has(n))[0];
    return pre.concat(cRole(k === undefined ? "nareli" : k));
  }
  if (has("portfolio") || has("vscode") || has("twitch") || has("chariteam") || has("counter") || has("betting")) {
    const k = Object.keys(PROJECTS).filter((n) => has(n.split("-")[0]))[0];
    return pre.concat(cProject(k));
  }
  if (has("react") || has("next") || has("node") || has("stack") || has("postgres") || has("typescript") || has("tech") || has(" ai"))
    return pre.concat(cStack(ctx));
  if (has("soft skill") || has("leader") || has("manage") || has("mentor") || has("empath"))
    return pre.concat(cSkills(ctx));
  if (has("ship") || has("project") || has("work") || has("built"))
    return pre.concat(cProjects(ctx));
  if (has("experience") || has("worked") || has("job") || has("year"))
    return pre.concat(cExperience());
  if (has("stud") || has("school") || has("degree") || has("diplom") || has("education"))
    return pre.concat(cEducation());
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
        "No canned answer for that one — email me and you'll get a real one. Meanwhile:",
        "No match. Available:",
      ),
    ),
    lines([
      L("/projects  /roles  /stack  /rates  /now  /contact", "var(--accent)", "  ", ""),
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
      roles: () => cExperience(),
      education: () => cEducation(),
      role: () => cRole(arg),
      about: () => cAbout(ctx),
      skills: () => cSkills(ctx),
      email: () => cEmail(),
      stack: () => cStack(ctx),
      techs: () => cStack(ctx),
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
        "Hey — I'm Kévin. This is my portfolio, but it runs like a shell, so you drive it.\n\nType a command or just ask a question in plain words. /roles is the usual first stop; /now tells you whether I'm free.",
        "Hey — I'm Kévin. A portfolio that runs like a shell, so you drive it.\n\nType a command or ask a question in plain words. /roles is the usual first stop; /now says whether I'm free.",
        "Kévin Riou. Fullstack web and mobile developer, freelance.\nType a command or a question. /help lists everything.",
      ),
    ),
    lines([
      L("/roles", "var(--dim)", "  try  ", "var(--faint)"),
      L('"are you free in September?"', "var(--dim)", "       ", "var(--faint)"),
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
