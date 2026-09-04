/**
 * The voiced copy in English: every line the shell speaks, in three registers.
 *
 * This is the fallback, not the source. The seed writes it into the CMS, and
 * the shell prefers whatever the CMS returns for the active locale — so an
 * edit in the admin wins, and an empty CMS still renders a working site.
 */
export interface Voiced {
  warm: string;
  brief: string;
  terse: string;
}

export const EN_VOICED: Record<string, Voiced> = {
  projects: {
    warm: "Side projects, mostly. The client work lives under /roles — this is what gets built when nobody is asking.",
    brief: "Side projects. The client work is under /roles — this is what gets built when nobody is asking.",
    terse: "Side projects. Client work is under /roles.",
  },
  about: {
    warm: "I'm Kévin — fullstack web and mobile developer, freelance, based in Paris.\n\nI run Nareli, and before that traded as ooof.dev. Nine years in, across a cooperative, a food manufacturer, a SaaS and a Swiss sensor company, the pattern is the same: small teams that need one person to own the architecture, the interface, the deploy, and the phone call when it breaks.\n\nI've led teams and projects end to end, and I still prefer writing the thing. Off the clock: side projects since 2016 — bots, tools, and nine versions of this portfolio.",
    brief: "Kévin — fullstack web and mobile developer, freelance, in Paris.\n\nI run Nareli, and traded as ooof.dev before that. Nine years across a cooperative, a manufacturer, a SaaS and a sensor company: small teams that need one person to own the whole thing.",
    terse: "Kévin Riou. Fullstack web and mobile, freelance, Paris.\nNareli, ex ooof.dev. Nine years, whole stack.\nArchitecture to support call.",
  },
  skills: {
    warm: "The part of the job that isn't typing. Nine years across a cooperative, a manufacturer, a SaaS and a sensor company taught me more about people than about frameworks.",
    brief: "The part of the job that isn't typing. Nine years taught me more about people than about frameworks.",
    terse: "Soft skills. The part that isn't typing.",
  },
  stack: {
    warm: "What I reach for without thinking about it. The soft side is under /skills.",
    brief: "The default toolkit. Soft skills are under /skills.",
    terse: "Hard stack. /skills for the rest.",
  },
  now: {
    warm: "Short version: I'm free from mid-September, and the work right now is Nareli — fullstack and mobile builds for small teams.",
    brief: "Free from mid-September. The work right now is Nareli — fullstack and mobile builds for small teams.",
    terse: "Free from mid-September. Current work: Nareli client builds.",
  },
  rates: {
    warm: "Three rates because they are three different jobs. I'd rather quote fixed price where the scope is clear — it means we both thought about it before starting.",
    brief: "Three rates because they are three different jobs. Fixed price where the scope is clear enough to be honest.",
    terse: "Three rates, three jobs. Fixed price where scope allows.",
  },
  photos: {
    warm: "Each block is one terminal cursor, same size as the one blinking below the prompt. Colours come straight off the image. Hover and the blocks dissolve into the photograph.",
    brief: "One cursor-sized block per cell, colours straight off the image. Hover and the blocks dissolve into the photograph.",
    terse: "One cursor-sized block per cell, original colours. Hover shows the photo.",
  },
  components: {
    warm: "Seven components, all built on the character grid. Each one below is live — the scroll view and the carousel take the arrow keys the same way the lists do, and esc hands them back.",
    brief: "Seven components, all on the character grid and all live. Arrows drive them, esc hands them back.",
    terse: "Seven components. Arrow keys drive them; esc releases.",
  },
  componentsSpotlight: {
    warm: "The images above and in /photos open full screen on click — the spotlight morphs the photo out of its slot, drops the shader so you see the original, and lets you zoom and pan.",
    brief: "Images open full screen on click — the shader drops away, so you get the original, with zoom and pan.",
    terse: "Click any image: spotlight, original resolution, zoom and pan.",
  },
  contact: {
    warm: "Email works if you'd rather. Otherwise answer the four questions below and it lands in my inbox — arrows to choose, ↵ to confirm.",
    brief: "Email works if you'd rather. Otherwise answer the four below — arrows to choose, ↵ to confirm.",
    terse: "Email, or answer below. ↑↓ choose, ↵ confirm.",
  },
  noMatch: {
    warm: "No canned answer for that one — email me and you'll get a real one. Meanwhile, here's what I do have:",
    brief: "No canned answer for that one — email me and you'll get a real one. Meanwhile:",
    terse: "No match. Available:",
  },
  intro: {
    warm: "Hey — I'm Kévin. This is my portfolio, but it runs like a shell, so you drive it.\n\nType a command or just ask a question in plain words. /roles is the usual first stop; /now tells you whether I'm free.",
    brief: "Hey — I'm Kévin. A portfolio that runs like a shell, so you drive it.\n\nType a command or ask a question in plain words. /roles is the usual first stop; /now says whether I'm free.",
    terse: "Kévin Riou. Fullstack web and mobile developer, freelance.\nType a command or a question. /help lists everything.",
  },
  help: {
    warm: "Everything I can pull up is below. Plain questions work too — try \"are you free in September?\" or \"what do you charge?\".",
    brief: "Everything I can pull up is below. Plain questions route too — try \"are you free in September?\".",
    terse: "Commands below. Plain questions also route.",
  },
};
