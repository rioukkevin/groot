import { diff, lines, say, select, think, tool } from "./blocks";
import { EN_VOICED } from "../../cms/voiced.en";

import { L, box, pad } from "./format";

import type { Voiced } from "../../cms/voiced.en";
import type { ShellContent } from "./shell-content";
import type { BlockSpec, Line, SelectItem, Theme, Voice } from "./types";

/** Everything the command layer needs from the shell, so routing stays pure. */
export interface CommandContext {
  /** Everything the shell says, for the active locale, straight from the CMS. */
  content: ShellContent;
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

/** [value, label, ink, ground] — the hint comes from the CMS. */
const THEME_CARDS: ReadonlyArray<readonly [Theme, string, string, string]> = [
  ["green", "green", "oklch(0.80 0.115 152)", "#0c0c0c"],
  ["ember", "ember", "oklch(0.80 0.115 42)", "#0d0b0a"],
  ["ice", "ice", "oklch(0.82 0.10 220)", "#0a0c0e"],
  ["plum", "plum", "oklch(0.78 0.13 310)", "#0d0a0e"],
  ["mono", "mono", "oklch(0.88 0 0)", "#0b0b0b"],
  ["paper", "paper", "oklch(0.50 0.12 152)", "#f4f2ed"],
  ["white", "white", "oklch(0.55 0.15 252)", "#ffffff"],
  ["linen", "linen", "oklch(0.52 0.14 45)", "#faf7f2"],
];

/**
 * The line for `key` in the active voice.
 *
 * The CMS wins when it carries the line for the active locale; the English
 * file backs it, so an empty CMS still renders and a translation lands the
 * moment it is written. There is one register ladder, not two.
 */
const v = (ctx: CommandContext, key: string): string => {
  const pick = (o: Voiced | undefined) =>
    o
      ? ctx.voice === "terse"
        ? o.terse || o.warm
        : ctx.voice === "brief"
          ? o.brief || o.warm
          : o.warm
      : "";
  return pick(ctx.content.voiced[key]) || pick(EN_VOICED[key]);
};

function cHelp(ctx: CommandContext): BlockSpec[] {
  return [
    say(
      v(ctx, "help"),
    ),
    lines(
      ctx.content.commands.map((c) => L("  " + c[1], "var(--dim)", pad(c[0], 15), "var(--accent)")),
    ),
  ];
}

function cProjects(ctx: CommandContext): BlockSpec[] {
  const items: SelectItem[] = Object.keys(ctx.content.projects).map((k) => {
    const p = ctx.content.projects[k];
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
      Object.keys(ctx.content.projects).length + " records · 312 tokens",
      [L(Object.keys(ctx.content.projects).join(", "), "var(--faint)")],
      600,
    ),
    say(
      v(ctx, "projects"),
    ),
    select(
      "project",
      pad(ctx.content.s("col.name", "NAME"), 17) +
        pad(ctx.content.s("col.stack", "STACK"), 41) +
        pad(ctx.content.s("col.year", "YEAR"), 7) +
        ctx.content.s("col.status", "STATUS"),
      76,
      items,
      ctx.content.s("hint.selectProject", "↑↓ select · ↵ open case study · esc release"),
    ),
  ];
}

function cProject(name: string, ctx: CommandContext): BlockSpec[] {
  const keys = Object.keys(ctx.content.projects);
  const key = keys.filter((k) => k.indexOf((name || "").toLowerCase()) === 0)[0];
  if (!key)
    return [say(`${ctx.content.s("err.noProject", "No project by that name. Known:")} ${keys.join(", ")}.`)];
  const p = ctx.content.projects[key];

  const meta: Line[] = [
    L(p.what, "var(--fg)"),
    L(""),
    L(pad(ctx.content.s("meta.stack", "stack"), 10) + p.stack, "var(--dim)"),
    L(pad(ctx.content.s("meta.year", "year"), 10) + p.year + "   ● " + p.status, p.statusColor),
    ...(p.links.length
      ? [L(pad(ctx.content.s("meta.links", "links"), 10) + p.links.join(" · "), "var(--dim)")]
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
      slides: p.images.map((src: string, i: number) => ({
        key: src,
        label: i === 0 ? "thumbnail" : "screen " + i,
        kind: "shot" as const,
        shot: {
          w: 520,
          h: 360,
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

function cExperience(ctx: CommandContext): BlockSpec[] {
  const items: SelectItem[] = ctx.content.roles.map((e) => ({
    key: e.key,
    cmd: "/role " + e.key,
    k: pad(e.when, 14),
    kcolor: "var(--accent)",
    text: pad(e.what, 34) + e.where,
    color: "var(--fg)",
  }));
  return [
    tool("Read", "(cv/experience.md)", ctx.content.roles.length + " entries · 208 tokens", [], 480),
    select(
      "role",
      pad(ctx.content.s("col.when", "WHEN"), 14) +
        pad(ctx.content.s("col.role", "ROLE"), 34) +
        ctx.content.s("col.where", "WHERE"),
      62,
      items,
      ctx.content.s("hint.selectRole", "↑↓ select · ↵ open role · esc release"),
    ),
  ];
}

function cRole(key: string, ctx: CommandContext): BlockSpec[] {
  const e = ctx.content.roles.filter((x) => x.key.indexOf((key || "").toLowerCase()) === 0)[0];
  if (!e)
    return [
      say(
        `${ctx.content.s("err.noRole", "No role by that name. Known:")} ${ctx.content.roles
          .map((x) => x.key)
          .join(", ")}.`,
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

/**
 * The portrait beside the words, rained in as Braille. The parameters are
 * GlyphRain's; change them here, they are content, not layout.
 */
const PORTRAIT = {
  kind: "glyph" as const,
  src: "/about/head.png",
  width: 240,
  height: 300,
  mode: "braille" as const,
  cell: 5,
  saturation: 100,
  brightness: 145,
  contrast: 100,
  twinkle: 50,
  speed: 100,
  loop: 0,
};

function cAbout(ctx: CommandContext): BlockSpec[] {
  return [
    {
      kind: "say",
      full: v(ctx, "about"),
      aside: { ...PORTRAIT, alt: ctx.content.s("photo.portrait", "portrait") },
    },
  ];
}

function cSkills(ctx: CommandContext): BlockSpec[] {
  return [
    say(
      v(ctx, "skills"),
    ),
    {
      kind: "chips",
      groups: ctx.content.softSkills.map(
        (g) => [g[0], [...g[2]], g[1]] as [string, string[], string?],
      ),
    },
    lines([
      L(ctx.content.s("skills.footer", "/stack for the hard skills · /techs does the same"), "var(--faint)", "  ", ""),
    ]),
  ];
}

function cStack(ctx: CommandContext): BlockSpec[] {
  return [
    say(
      v(ctx, "stack"),
    ),
    {
      kind: "chips",
      groups: ctx.content.stack.map(
        (g) => [g[0], [...g[2]], g[1]] as [string, string[], string?],
      ),
    },
  ];
}

function cEducation(ctx: CommandContext): BlockSpec[] {
  return [
    tool("Read", "(cv/education.md)", ctx.content.education.length + " " + ctx.content.s("meta.entries", "entries"), [], 380),
    lines(
      ctx.content.education.flatMap((e) => [
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
      ctx.content.s("now.summary", "what changed this month"),
      ctx.content.nowRows,
      ctx.content.s("now.footer", "git log --since=1.month"),
    ),
    say(
      v(ctx, "now"),
    ),
  ];
}

function cRates(ctx: CommandContext): BlockSpec[] {
  return [
    lines(box(ctx.content.rates.map(([l, v]) => pad(l, 14) + v), 62)),
    say(
      v(ctx, "rates"),
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
      v(ctx, "photos"),
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
    ...Object.keys(ctx.content.projects).flatMap((k) => {
      const pr = ctx.content.projects[k];
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
      v(ctx, "components"),
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
        ...Object.keys(ctx.content.projects)
          .slice(0, 3)
          .map((k) => {
            const pr = ctx.content.projects[k];
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
      v(ctx, "componentsSpotlight"),
    ),
  ];
}

function cContact(ctx: CommandContext): BlockSpec[] {
  return [
    lines(
      box(
        [
          ...ctx.content.contact.map(([l, v]) => pad(l, 12) + v),
          "",
          ctx.content.contactFooter,
        ],
        62,
      ),
    ),
    say(
      v(ctx, "contact"),
    ),
    { kind: "contact" },
  ];
}

function cEmail(ctx: CommandContext): BlockSpec[] {
  const email =
    ctx.content.contact.find(([, v]) => v.includes("@"))?.[1] ?? "";
  return [lines([L(email, "var(--accent)", "  ", "")])];
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
      title: ctx.content.s("label.theme", "THEME · 5 dark · 3 light"),
      perRow: 4,
      current: ctx.theme,
      onSelect: (v) => ctx.setTheme(v as Theme),
      options: THEME_CARDS.map(([value, label, ink, ground]) => ({
        value,
        label,
        hint: ctx.content.themeHints[value] ?? "",
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
    return pre.concat(cRole(k === undefined ? "nareli" : k, ctx));
  }
  if (has("portfolio") || has("vscode") || has("twitch") || has("chariteam") || has("counter") || has("betting")) {
    const k = Object.keys(ctx.content.projects).filter((n) => has(n.split("-")[0]))[0];
    return pre.concat(cProject(k, ctx));
  }
  if (has("react") || has("next") || has("node") || has("stack") || has("postgres") || has("typescript") || has("tech") || has(" ai"))
    return pre.concat(cStack(ctx));
  if (has("soft skill") || has("leader") || has("manage") || has("mentor") || has("empath"))
    return pre.concat(cSkills(ctx));
  if (has("ship") || has("project") || has("work") || has("built"))
    return pre.concat(cProjects(ctx));
  if (has("experience") || has("worked") || has("job") || has("year"))
    return pre.concat(cExperience(ctx));
  if (has("stud") || has("school") || has("degree") || has("diplom") || has("education"))
    return pre.concat(cEducation(ctx));
  if (has("who") || has("about") || has("yourself")) return pre.concat(cAbout(ctx));
  if (has("contact") || has("email") || has("reach") || has("call"))
    return pre.concat(cContact(ctx));
  if (has("photo") || has("picture") || has("image")) return pre.concat(cPhotos(ctx));

  return pre.concat([
    tool("Search", '(index, "' + q.slice(0, 30) + '")', "no exact match", [], 520),
    say(
      v(ctx, "noMatch"),
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
      project: () => cProject(arg, ctx),
      roles: () => cExperience(ctx),
      education: () => cEducation(ctx),
      role: () => cRole(arg, ctx),
      about: () => cAbout(ctx),
      skills: () => cSkills(ctx),
      email: () => cEmail(ctx),
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
    return [
      say(
        `${ctx.content.s("err.unknownCommand", "Unknown command")} /${c} ${ctx.content.s("err.helpLists", "— /help lists them all.")}`,
      ),
    ];
  }

  return freeform(q, ctx);
}

/** Intro transcript, replayed on mount and after /clear. */
export function intro(ctx: CommandContext): BlockSpec[] {
  return [
    say(
      v(ctx, "intro"),
    ),
    // The blank line between the examples and the note is layout, so it is
    // inserted here rather than stored as an empty row in the CMS.
    lines(
      ctx.content.introHints.flatMap((h, i, all) => {
        const first = all.findIndex((x) => x[0] === "note");
        const row =
          h[0] === "note"
            ? L(h[1], "var(--faint)", "  ", "")
            : L(
                h[1],
                "var(--dim)",
                h[2] ? `  ${h[2]}  ` : "       ",
                "var(--faint)",
              );
        return i === first && i > 0 ? [L(""), row] : [row];
      }),
    ),
  ];
}

/** Command-palette matches for the current input, from the CMS command list. */
export function matches(
  vInput: string,
  commands: ReadonlyArray<readonly [string, string]>,
): ReadonlyArray<readonly [string, string]> {
  if (!vInput || vInput[0] !== "/" || vInput.indexOf(" ") >= 0) return [];
  const t = vInput.slice(1).toLowerCase();
  return commands.filter((c) => c[0].slice(1).indexOf(t) === 0);
}
