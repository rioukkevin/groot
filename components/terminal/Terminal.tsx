"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { answerQuestion } from "@/lib/terminal/answer";
import { ask, llmStatus } from "@/lib/terminal/browser-llm";
import { preloadIntent } from "@/lib/terminal/intent";
import { upgradeWhenIdle } from "@/lib/terminal/model-tiers";
import { CLEAR, intro, matches, route } from "@/lib/terminal/commands";
import { L } from "@/lib/terminal/format";
import { maxWrappedLines } from "@/lib/terminal/format";
import { gridStep } from "@/lib/terminal/grid";
import {
  initialContact,
  isReview,
  localizeSteps,
} from "@/lib/terminal/contact";

import {
  LOCALE_COOKIE,
  LOCALE_LABEL,
  otherLocale,
  pathForLocale,
} from "@/lib/terminal/locale";
import { SPINNER_FRAMES, isInteractive } from "@/lib/terminal/types";
import { useEngine } from "@/lib/terminal/useEngine";

import { useBuddyMood } from "./Buddy";
import { Header } from "./Header";
import { NeuralProgress } from "./NeuralProgress";
import { Palette } from "./Palette";
import { Prompt } from "./Prompt";
import { Shortcuts } from "./Shortcuts";
import { StatusBar } from "./StatusBar";
import { ActionBlock } from "./blocks/ActionBlock";
import { ChipsBlock } from "./blocks/ChipsBlock";
import { DemoBlock } from "./blocks/DemoBlock";
import { DiffBlock } from "./blocks/DiffBlock";
import { EchoBlock } from "./blocks/EchoBlock";
import { LinesBlock } from "./blocks/LinesBlock";
import { PhotosBlock } from "./blocks/PhotosBlock";
import { SayBlock } from "./blocks/SayBlock";
import { SelectBlock } from "./blocks/SelectBlock";
import { ShotsBlock } from "./blocks/ShotsBlock";
import { ThinkBlock } from "./blocks/ThinkBlock";
import { ToolBlock } from "./blocks/ToolBlock";
import { Carousel } from "./ui/Carousel";
import { ContactForm } from "./ui/ContactForm";
import { Picker } from "./ui/Picker";
import { ProjectView } from "./ui/ProjectView";
import { TONES, VoicePicker } from "./ui/VoicePicker";
import { ScrollView } from "./ui/ScrollView";

import type { CommandContext } from "@/lib/terminal/commands";
import type { ContactState } from "@/lib/terminal/contact";
import { hydrate } from "@/lib/terminal/shell-content";

import type { ShellContentData } from "@/lib/terminal/shell-content";
import type { Locale } from "@/lib/terminal/locale";
import type { Theme, Voice } from "@/lib/terminal/types";
import type { KeyboardEvent } from "react";

const STREAM_SPEED = 12;
const PHOTO_GAP = 3;
/** Distance from the bottom that still counts as "following the output". */
const STICK_PX = 48;
/**
 * Below this, a request is not worth a line in the transcript. Above it, the
 * wait is visible to a person, so the shell says what it is waiting on.
 */
const SLOW_MS = 35;

function downloadResume(text: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
  a.download = "kevin-riou.txt";
  a.click();
  URL.revokeObjectURL(a.href);
}

export function Terminal({
  initialLocale,
  content: byLocale,
}: {
  initialLocale: Locale;
  content: Record<Locale, ShellContentData>;
}) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  // The lookup is attached here: the server sent data, not functions.
  const content = useMemo(() => hydrate(byLocale[locale]), [byLocale, locale]);
  const next = otherLocale(locale);

  /**
   * Swaps language in place. The content for both locales is already here, so
   * there is nothing to fetch and no navigation: the transcript stays, and the
   * address bar is corrected with replaceState so the URL still tells the
   * truth and a reload or a shared link lands in the right language.
   */
  const switchLocale = useCallback(() => {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    window.history.replaceState(
      null,
      "",
      pathForLocale(window.location.pathname, next) + window.location.search,
    );
    document.documentElement.lang = next;
    setLocale(next);
  }, [next]);

  const engine = useEngine(STREAM_SPEED);
  const { blocks, busy, run, push, patch, halt, reset, lastInteractiveId } = engine;

  const [input, setInput] = useState("");
  const [caretPos, setCaretPos] = useState(0);
  const [theme, setTheme] = useState<Theme>("green");
  const [voice, setVoice] = useState<Voice>("warm");
  const [palIdx, setPalIdx] = useState(0);
  const [hist, setHist] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  /**
   * Arrow-key ownership, stamped with the newest interactive block's id so a
   * freshly pushed block resets it by derivation rather than by a cascading
   * effect.
   *
   * `claimId` lets an older block take the arrows back when it is clicked —
   * without it a transcript holding two interactive blocks could only ever
   * drive the last one. `idx` means row for a list, first visible line for a
   * scroll view, and slide for a carousel.
   */
  /** Bumped on every submitted command, so the buddy visibly reacts. */
  const [pulse, setPulse] = useState(0);
  /** Bumped by ↵ on a carousel, to open its current slide full screen. */
  const [openShot, setOpenShot] = useState(0);

  const [uiState, setUiState] = useState<{
    forId: number;
    claimId: number | null;
    idx: number;
    /** Second cursor, for a block driving two panes (project: shot + scroll). */
    idx2: number;
    off: boolean;
  }>({ forId: -1, claimId: null, idx: 0, idx2: 0, off: false });

  // The wizard's copy for this locale; its shape and validators stay in code.
  const wizardSteps = useMemo(
    () => localizeSteps(content.wizard),
    [content.wizard],
  );
  // The step callbacks live outside the render, so they read the list here.
  const wizardStepsRef = useRef(wizardSteps);
  useEffect(() => {
    wizardStepsRef.current = wizardSteps;
  }, [wizardSteps]);

  const [contact, setContact] = useState<ContactState>(initialContact);
  // Callbacks defined outside the render read the content through a ref.
  const contentRef = useRef(content);
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  const contactRef = useRef(contact);
  useEffect(() => {
    contactRef.current = contact;
  }, [contact]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const stick = useRef(true);
  /** The last command whose output is on screen, so "tell me more" has a topic. */
  const lastCommand = useRef<string | null>(null);
  /**
   * Stamps each submission. An answer that resolves after a newer submission
   * checks this and steps aside, so a slow classify or a slow browser model
   * can never overwrite what the visitor asked for next.
   */
  const seq = useRef(0);
  /** A pending language switch from "parlez-vous français", cancellable. */
  const switchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelSwitch = useCallback(() => {
    if (switchTimer.current) clearTimeout(switchTimer.current);
    switchTimer.current = null;
  }, []);
  useEffect(() => cancelSwitch, [cancelSwitch]);
  /** Empties the transcript and forgets the topic, so "more" has nothing stale to point at. */
  const clear = useCallback(() => {
    lastCommand.current = null;
    reset();
  }, [reset]);

  const ctx = useMemo<CommandContext>(
    () => ({
      content,
      theme,
      voice,
      photoGap: PHOTO_GAP,
      download: () => downloadResume(content.resume),
      setTheme,
      setVoice,
    }),
    [content, theme, voice],
  );
  const ctxRef = useRef(ctx);
  useEffect(() => {
    ctxRef.current = ctx;
  }, [ctx]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const uiCurrent = uiState.forId === lastInteractiveId;
  const selIdx = uiCurrent ? uiState.idx : 0;
  const selIdx2 = uiCurrent ? uiState.idx2 : 0;
  const selOff = uiCurrent ? uiState.off : false;
  const claimId = uiCurrent ? uiState.claimId : null;

  const moveSel = useCallback(
    (idx: number) =>
      setUiState((u) => ({
        forId: lastInteractiveId,
        claimId: u.forId === lastInteractiveId ? u.claimId : null,
        idx,
        idx2: u.forId === lastInteractiveId ? u.idx2 : 0,
        off: false,
      })),
    [lastInteractiveId],
  );
  /** Move the second cursor, leaving the first alone. */
  const moveSel2 = useCallback(
    (idx2: number) =>
      setUiState((u) => ({
        forId: lastInteractiveId,
        claimId: u.forId === lastInteractiveId ? u.claimId : null,
        idx: u.forId === lastInteractiveId ? u.idx : 0,
        idx2,
        off: false,
      })),
    [lastInteractiveId],
  );
  const releaseSel = useCallback(
    () =>
      setUiState((u) => ({
        forId: lastInteractiveId,
        claimId: u.forId === lastInteractiveId ? u.claimId : null,
        idx: u.forId === lastInteractiveId ? u.idx : 0,
        idx2: u.forId === lastInteractiveId ? u.idx2 : 0,
        off: true,
      })),
    [lastInteractiveId],
  );
  /** Clicking an interactive block hands it the arrows and resets its cursor. */
  const claim = useCallback(
    (id: number) =>
      setUiState({
        forId: lastInteractiveId,
        claimId: id,
        idx: 0,
        idx2: 0,
        off: false,
      }),
    [lastInteractiveId],
  );

  /**
   * Runs an async job and, only if it is still going after SLOW_MS, shows it in
   * the transcript the way a tool call appears — a spinner while it runs, then
   * the outcome and how long it took. Anything faster finishes without leaving
   * a trace, so the log stays quiet for work that was never worth mentioning.
   */
  const track = useCallback(
    async <T,>(name: string, arg: string, job: () => Promise<T>): Promise<T> => {
      const started = performance.now();
      let id: number | null = null;
      const timer = setTimeout(() => {
        id = push({
          kind: "tool",
          name,
          arg,
          meta: "running…",
          out: [],
          dur: 0,
          done: false,
        });
      }, SLOW_MS);

      const finish = (meta: string, detail?: string) => {
        clearTimeout(timer);
        const ms = Math.round(performance.now() - started);
        if (id === null) return;
        patch(id, {
          done: true,
          meta: `${meta} · ${ms}ms`,
          out: detail ? [L(detail, "var(--err)")] : [],
        });
      };

      try {
        const result = await job();
        finish("done");
        return result;
      } catch (err) {
        // A failed request is reported where the request is, not only in
        // whatever form started it.
        finish("failed", err instanceof Error ? err.message : content.s("err.requestFailed", "request failed"));
        throw err;
      }
    },
    [patch, push],
  );

  /**
   * Answers a plain question with the browser's own model, when it has one
   * (Chrome's Prompt API). It calls the same tools the MCP endpoint exposes,
   * so it answers from the CMS rather than from its memory. Returns false when
   * there is no such model. Only consulted for questions the classifier could
   * not place — on everything else the tool loop below is faster and richer.
   */
  const askLocally = useCallback(
    async (question: string, token: number): Promise<boolean> => {
      if ((await llmStatus()) !== "ready") return false;
      if (token !== seq.current) return true;

      const id = push({
        kind: "tool",
        name: "Ask",
        arg: "(on-device model)",
        meta: "thinking…",
        out: [],
        dur: 0,
        done: false,
      });

      const c = contentRef.current;
      const result = await ask(question, c, c.locale, (tool) =>
        patch(id, { meta: `${tool}…` }),
      );
      if (token !== seq.current) {
        // Superseded while it thought: close its line quietly, say nothing.
        patch(id, { done: true, meta: "superseded", out: [] });
        return true;
      }
      if (!result) {
        patch(id, { done: true, meta: "unavailable", out: [] });
        return false;
      }

      patch(id, {
        done: true,
        meta: result.calls.length
          ? result.calls.map((x) => x.name).join(" → ")
          : "answered",
        out: [],
      });
      run([{ kind: "say", full: result.answer }]);
      return true;
    },
    [patch, push, run],
  );

  /**
   * Answers a plain question the way an agent would, in the open.
   *
   * Whichever model is on duty classifies it; the answer layer then calls the
   * site's tools until it holds the fact, and the transcript shows each call
   * — roles, then the one role; projects, then the one project. It states the
   * fact in a sentence with the fact lit, and runs the command that shows it
   * in full, with the same fact lit there. A question the classifier cannot
   * place is offered to the browser's own model, if there is one, and
   * otherwise said to be not understood — never guessed at.
   */
  const answer = useCallback(
    async (question: string, token: number) => {
      const a = await answerQuestion(question, ctxRef.current, lastCommand.current);
      if (token !== seq.current) return;

      if (a.effect === "clear") {
        clear();
        return;
      }

      if (a.unresolved && (await llmStatus()) === "ready") {
        if (token !== seq.current) return;
        for (const b of a.intro) push({ ...b, ...(b.kind === "tool" ? { done: true } : {}) });
        if (await askLocally(question, token)) return;
        run(a.blocks);
        return;
      }

      // A routed /contact starts the wizard afresh, as a typed one does.
      if (a.command?.toLowerCase().startsWith("/contact")) setContact(initialContact());
      if (a.command) lastCommand.current = a.command;
      run([...a.intro, ...a.blocks]);

      if (a.effect === "switch-locale") {
        // Let the sentence land before the whole shell changes language.
        cancelSwitch();
        switchTimer.current = setTimeout(switchLocale, 1400);
      }
    },
    [askLocally, cancelSwitch, clear, push, run, switchLocale],
  );

  const submit = useCallback(
    (raw?: string) => {
      const q = (raw === undefined ? input : raw).trim();
      if (!q) return;
      if (busy) halt();
      cancelSwitch();
      const token = ++seq.current;

      stick.current = true;
      setPulse((n) => n + 1);
      push({ kind: "echo", text: q });
      setInput("");
      setHist((h) => h.concat([q]));
      setHistIdx(-1);
      setPalIdx(0);
      setCaretPos(0);

      if (q.trim().toLowerCase().startsWith("/contact")) setContact(initialContact());

      // A plain question goes through the classifier and the tool loop.
      if (!q.startsWith("/")) {
        void answer(q, token);
        return;
      }

      const out = route(q, ctxRef.current);
      if (out === CLEAR) {
        clear();
        return;
      }
      lastCommand.current = q;
      if (out.length) run(out);
    },
    [answer, busy, cancelSwitch, clear, halt, input, push, run],
  );

  // Intro transcript. Clearing first makes this idempotent: StrictMode's
  // simulated remount tears down the engine's timers mid-stream, so the second
  // pass has to be able to replay the intro from scratch rather than be
  // skipped by a guard.
  useEffect(() => {
    inputRef.current?.focus();
    preloadIntent(locale);
    // The full model is fetched once the page has loaded and gone quiet, and
    // replaces the light one without a word; the corner tells the story.
    upgradeWhenIdle(locale);
    clear();
    push({ kind: "echo", text: "/intro" });
    run(intro(ctxRef.current));
  }, [locale, push, clear, run]);

  // The design pinned the transcript to the bottom on every update, which
  // yanks the view away while you are reading back. Follow the output only
  // while the reader is already at the bottom.
  useEffect(() => {
    const el = scrollRef.current;
    if (el && stick.current) el.scrollTop = el.scrollHeight;
  });

  // Blocks keep growing after they are rendered — a canvas sizes itself once
  // its image loads, prose re-wraps when the pane is measured, a say block
  // streams. Scrolling once when the block appears therefore leaves the tail
  // off screen, so follow the height itself for as long as it is still moving.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (stick.current) el.scrollTop = el.scrollHeight;
    });
    for (const child of Array.from(el.children)) ro.observe(child);
    const mo = new MutationObserver(() => {
      for (const child of Array.from(el.children)) ro.observe(child);
      if (stick.current) el.scrollTop = el.scrollHeight;
    });
    mo.observe(el, { childList: true, subtree: true });
    return () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, []);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    stick.current =
      el.scrollHeight - el.scrollTop - el.clientHeight <= STICK_PX;
  }, []);

  const palAll = matches(input, content.commands);

  /**
   * Where the current turn starts: the newest echo is the latest thing the
   * visitor sent, and everything above it is an earlier answer. Those are
   * read-only — no arrows, no clicks — so the keyboard always drives what
   * was just asked for, and the transcript reads as a record.
   */
  const turnStart = useMemo(() => {
    let id = -1;
    for (const b of blocks) if (b.kind === "echo") id = b.id;
    return id;
  }, [blocks]);
  const isPast = useCallback((id: number) => id < turnStart, [turnStart]);

  /** The claimed block, else the newest one, unless esc has released it.
   *  Only blocks of the current turn qualify. */
  const active = useMemo(() => {
    if (selOff) return null;
    const xs = blocks.filter(isInteractive).filter((b) => !isPast(b.id));
    if (claimId != null) {
      const claimed = xs.find((b) => b.id === claimId);
      if (claimed) return claimed;
    }
    return xs.length ? xs[xs.length - 1] : null;
  }, [blocks, selOff, claimId, isPast]);

  const activeSelect = active?.kind === "select" ? active : null;
  // A slash typed into an answer should not raise the command palette.
  const inWizard =
    active?.kind === "contact" &&
    contact.status !== "sent" &&
    wizardSteps[Math.min(contact.step, wizardSteps.length - 1)]?.kind === "text";
  const pal = inWizard ? [] : palAll;
  const palSel = Math.min(palIdx, Math.max(0, pal.length - 1));
  const mood = useBuddyMood(busy, voice, pulse);

  const openSelected = useCallback(() => {
    if (!activeSelect) return;
    const it =
      activeSelect.items[Math.min(selIdx, activeSelect.items.length - 1)];
    if (it) submit(it.cmd);
  }, [activeSelect, selIdx, submit]);

  /** Advance past the current step, skipping to review when done. */
  const advance = useCallback(
    (value: string) => {
      setContact((c) => {
        const step = wizardStepsRef.current[c.step];
        if (!step) return c;
        const v = value.trim();
        const required = step.kind === "choice" || step.required;
        if (required && !v)
          return {
            ...c,
            error: `${step.kind === "choice" ? step.group : step.label} ${contentRef.current.s("err.needed", "is needed")}`,
          };
        const invalid = v && step.kind === "text" ? (step.validate?.(v) ?? null) : null;
        if (invalid) return { ...c, error: invalid };
        return {
          ...c,
          answers: v ? { ...c.answers, [step.key]: v } : c.answers,
          step: c.step + 1,
          choice: 0,
          error: null,
        };
      });
      setInput("");
      setCaretPos(0);
    },
    [],
  );

  const goBack = useCallback(() => {
    setContact((c) => {
      if (c.step === 0) return c;
      const prev = wizardStepsRef.current[c.step - 1];
      const restored = prev.kind === "text" ? (c.answers[prev.key] ?? "") : "";
      setInput(restored);
      setCaretPos(restored.length);
      return { ...c, step: c.step - 1, choice: 0, error: null, status: "editing" };
    });
  }, []);

  const send = useCallback(() => {
    setContact((c) => (c.status === "sending" ? c : { ...c, status: "sending", error: null }));
    const body = { ...contactRef.current.answers, website: "" };
    // The ok-check lives inside the tracked job: fetch resolves on a 502, so
    // checking afterwards would mark a refused send as "done".
    track("Send", "(api/contact)", async () => {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data: unknown = await r.json().catch(() => ({}));
      const err =
        typeof data === "object" && data !== null && "error" in data
          ? String((data as { error: unknown }).error)
          : null;
      if (!r.ok) throw new Error(err ?? `send failed (${r.status})`);
      return r;
    })
      .then(() => {
        setContact((c) => ({ ...c, status: "sent", error: null }));
      })
      .catch((e: unknown) => {
        setContact((c) => ({
          ...c,
          status: "error",
          error: e instanceof Error ? e.message : content.s("err.couldNotSend", "could not send"),
        }));
      });
  }, [track]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      const mm = matches(input, content.commands);
      const k = e.key;
      const sel = input ? null : activeSelect;
      const act = input ? null : active;
      const clamp = (n: number, hi: number) => Math.min(Math.max(0, n), hi);
      const stepHistory = (d: number) => {
        const i =
          d < 0
            ? histIdx < 0
              ? hist.length - 1
              : Math.max(0, histIdx - 1)
            : Math.min(hist.length - 1, histIdx + 1);
        setHistIdx(i);
        setInput(hist[i] || "");
      };

      // The contact wizard owns the prompt while it is running: Enter commits
      // the current answer instead of running a command, so a plain sentence
      // cannot be mistaken for one. It tests `active` rather than `act`
      // precisely because `act` is nulled the moment you type — the rule that
      // hands the arrows back to the prompt everywhere else would otherwise
      // send the answer off as a command.
      if (active?.kind === "contact" && contact.status !== "sent") {
        const step = wizardSteps[Math.min(contact.step, wizardSteps.length - 1)];
        if (k === "Enter") {
          e.preventDefault();
          if (isReview(contact)) send();
          else if (step?.kind === "choice")
            advance(step.options[contact.choice].value);
          else advance(input);
          return;
        }
        // Backspace is the wizard's back key everywhere: on a card step ← is
        // spent moving between cards, so it cannot also mean "previous step".
        if (k === "Backspace" && !input) {
          e.preventDefault();
          goBack();
          return;
        }
        // The cards are a grid, so ←→ step one card and ↑↓ step a whole row.
        // Both wrap, and ↑↓ clamps to the last card rather than falling off a
        // short final row.
        if (
          step?.kind === "choice" &&
          ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(k)
        ) {
          e.preventDefault();
          const { options, perRow } = step;
          setContact((c) => ({
            ...c,
            choice: gridStep(c.choice, options.length, perRow, k),
          }));
          return;
        }
        if (k === "ArrowLeft" && !input) {
          e.preventDefault();
          goBack();
          return;
        }
      }

      // The voice list is vertical, so it takes only ↑↓.
      if (act?.kind === "voice") {
        if (k === "Enter") {
          e.preventDefault();
          const tone = TONES[Math.min(selIdx, TONES.length - 1)];
          if (tone) act.onSelect(tone.value);
          return;
        }
        if (k === "ArrowUp" || k === "ArrowDown") {
          e.preventDefault();
          const d = k === "ArrowUp" ? -1 : 1;
          moveSel((selIdx + d + TONES.length) % TONES.length);
          return;
        }
      }

      // A picker applies the moment you confirm, and takes both axes.
      if (act?.kind === "picker") {
        if (k === "Enter") {
          e.preventDefault();
          const opt = act.options[Math.min(selIdx, act.options.length - 1)];
          if (opt) act.onSelect(opt.value);
          return;
        }
        if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(k)) {
          e.preventDefault();
          moveSel(gridStep(selIdx, act.options.length, act.perRow, k));
          return;
        }
      }

      // ↵ on a carousel opens the slide rather than submitting: with an empty
      // input there is nothing to send, and the picture is the obvious target.
      if (
        k === "Enter" &&
        !input &&
        !mm.length &&
        (act?.kind === "carousel" || act?.kind === "project") &&
        act.slides.length > 0
      ) {
        e.preventDefault();
        setOpenShot((n) => n + 1);
        return;
      }

      if (k === "Enter") {
        e.preventDefault();
        if (mm.length) submit(mm[Math.min(palIdx, mm.length - 1)][0]);
        else if (sel) openSelected();
        else submit();
      } else if ((k === "ArrowRight" || k === " ") && sel) {
        e.preventDefault();
        openSelected();
      } else if (k === "Tab" && e.shiftKey) {
        e.preventDefault();
        switchLocale();
      } else if (k === "Tab") {
        e.preventDefault();
        if (mm.length) setInput(mm[Math.min(palIdx, mm.length - 1)][0] + " ");
      } else if (k === "ArrowUp" || k === "ArrowDown") {
        e.preventDefault();
        const d = k === "ArrowUp" ? -1 : 1;
        // UX addition: the palette wraps, so a long list is reachable from
        // either end without walking the whole way back.
        if (mm.length) setPalIdx((i) => (i + d + mm.length) % mm.length);
        else if (act?.kind === "select")
          moveSel(clamp(selIdx + d, act.items.length - 1));
        else if (act?.kind === "scroll")
          moveSel(clamp(selIdx + d, Math.max(0, act.lines.length - act.rows)));
        else if (act?.kind === "project")
          moveSel2(
            clamp(
              selIdx2 + d,
              Math.max(
                0,
                maxWrappedLines(act.meta.length, act.paragraphs, 34) - act.rows,
              ),
            ),
          );
        // A carousel takes ↑↓ as well as ←→. Letting them fall through to
        // history instead would quietly fill the input, and a non-empty input
        // hands the arrows back to the prompt — so the carousel would stop
        // responding with no visible reason why.
        else if (act?.kind === "carousel")
          moveSel((selIdx + d + act.slides.length) % act.slides.length);
        else if (hist.length) stepHistory(d);
      } else if ((k === "PageUp" || k === "PageDown") && act?.kind === "scroll") {
        e.preventDefault();
        const d = k === "PageUp" ? -act.rows : act.rows;
        moveSel(clamp(selIdx + d, Math.max(0, act.lines.length - act.rows)));
      } else if ((k === "PageUp" || k === "PageDown") && act?.kind === "project") {
        e.preventDefault();
        const d = k === "PageUp" ? -act.rows : act.rows;
        moveSel2(
          clamp(
            selIdx2 + d,
            Math.max(
              0,
              maxWrappedLines(act.meta.length, act.paragraphs, 34) - act.rows,
            ),
          ),
        );
      } else if (
        (k === "ArrowLeft" || k === "ArrowRight") &&
        (act?.kind === "carousel" || act?.kind === "project") &&
        act.slides.length > 0 &&
        !input
      ) {
        e.preventDefault();
        const d = k === "ArrowLeft" ? -1 : 1;
        moveSel((selIdx + d + act.slides.length) % act.slides.length);
      } else if (k === "Home" && act && act.kind !== "contact") {
        e.preventDefault();
        moveSel(0);
      } else if (k === "End" && act && act.kind !== "contact") {
        e.preventDefault();
        if (act.kind === "select") moveSel(act.items.length - 1);
        else if (act.kind === "scroll")
          moveSel(Math.max(0, act.lines.length - act.rows));
        else if (act.kind === "project")
          moveSel2(
            Math.max(
              0,
              maxWrappedLines(act.meta.length, act.paragraphs, 34) - act.rows,
            ),
          );
        else if (act.kind === "carousel") moveSel(act.slides.length - 1);
      } else if (k === "Escape") {
        cancelSwitch();
        if (busy) halt(content.s("err.interrupted", "interrupted by user"));
        else if (act) {
          releaseSel();
          setShortcutsOpen(false);
        } else {
          setInput("");
          setShortcutsOpen(false);
        }
      } else if (k === "?" && !input) {
        e.preventDefault();
        setShortcutsOpen((s) => !s);
      } else if ((k === "l" || k === "L") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        clear();
      } else if (k === "c" && e.ctrlKey) {
        e.preventDefault();
        setInput("");
      }
    },
    [
      active,
      activeSelect,
      advance,
      busy,
      contact,
      goBack,
      send,
      halt,
      content,
      hist,
      histIdx,
      switchLocale,
      input,
      moveSel,
      moveSel2,
      openSelected,
      selIdx2,
      palIdx,
      releaseSel,
      cancelSwitch,
      clear,
      selIdx,
      submit,
    ],
  );

  const activeId = active ? active.id : -1;

  const contactStep =
    active?.kind === "contact" && contact.status !== "sent"
      ? wizardSteps[Math.min(contact.step, wizardSteps.length - 1)]
      : null;
  const contactPrompt =
    contactStep?.kind === "text"
      ? `${contactStep.label}${contactStep.required ? "" : " (optional)"} …`
      : null;
  const spinner = SPINNER_FRAMES[engine.spin % SPINNER_FRAMES.length];
  const kTokens = (engine.tokens / 1000).toFixed(1);

  return (
    <div
      /* fixed rather than h-screen: the shell is a viewport-sized app, and
         taking it out of flow means the page has nothing to scroll and macOS
         cannot rubber-band the content away from under the prompt. dvh so a
         mobile browser's collapsing toolbar does not cut the input off. */
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ height: "100dvh", background: "var(--bg)", color: "var(--fg)" }}
      onClick={() => inputRef.current?.focus()}
    >
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-4 pb-1"
        onScroll={onScroll}
      >
        <Header
          mood={mood}
          content={content}
          aside={<NeuralProgress locale={locale} content={content} />}
        />

        {blocks.map((b) => (
          <div
            key={b.id}
            // An earlier turn's answer cannot be clicked into; its hint says
            // so. Its links still open — a link is a way out, not a control.
            className={isPast(b.id) && isInteractive(b) ? "past" : undefined}
            style={isPast(b.id) && isInteractive(b) ? { pointerEvents: "none" } : undefined}
            aria-disabled={isPast(b.id) && isInteractive(b) ? true : undefined}
          >
            {b.kind === "echo" && <EchoBlock text={b.text} />}
            {b.kind === "think" && <ThinkBlock text={b.text} />}
            {b.kind === "say" && <SayBlock full={b.full} n={b.n ?? 0} aside={b.aside} />}
            {b.kind === "tool" && (
              <ToolBlock
                name={b.name}
                arg={b.arg}
                meta={b.meta}
                out={b.out}
                done={b.done ?? false}
                spin={engine.spin}
              />
            )}
            {b.kind === "lines" && <LinesBlock lines={b.lines} />}
            {b.kind === "diff" && (
              <DiffBlock
                path={b.path}
                summary={b.summary}
                rows={b.rows}
                footer={b.footer}
              />
            )}
            {b.kind === "select" && (
              <SelectBlock
                content={content}
                header={b.header}
                sep={b.sep}
                hint={b.hint}
                items={b.items}
                live={b.id === activeId}
                frozen={isPast(b.id)}
                selIdx={selIdx}
                onHover={(i) => {
                  if (b.id === activeId) moveSel(i);
                }}
                onClaim={() => b.id !== activeId && claim(b.id)}
                onPick={(i, cmd) => {
                  moveSel(i);
                  submit(cmd);
                }}
              />
            )}
            {b.kind === "demo" && <DemoBlock />}
            {b.kind === "chips" && <ChipsBlock groups={b.groups} hl={b.hl} />}
            {b.kind === "voice" && (
              <VoicePicker
                content={content}
                current={b.current}
                index={b.id === activeId ? selIdx : 0}
                live={b.id === activeId}
                frozen={isPast(b.id)}
                onPick={(n) => {
                  moveSel(n);
                  b.onSelect(TONES[n].value);
                }}
                onClaim={() => b.id !== activeId && claim(b.id)}
              />
            )}
            {b.kind === "picker" && (
              <Picker
                content={content}
                title={b.title}
                options={b.options}
                perRow={b.perRow}
                current={b.current}
                index={b.id === activeId ? selIdx : 0}
                live={b.id === activeId}
                frozen={isPast(b.id)}
                onPick={(i) => {
                  moveSel(i);
                  b.onSelect(b.options[i].value);
                }}
                onClaim={() => b.id !== activeId && claim(b.id)}
              />
            )}
            {b.kind === "project" && (
              <ProjectView
                content={content}
                title={b.title}
                slides={b.slides}
                meta={b.meta}
                paragraphs={b.paragraphs}
                rows={b.rows}
                live={b.id === activeId}
                frozen={isPast(b.id)}
                slide={b.id === activeId ? selIdx : 0}
                offset={b.id === activeId ? selIdx2 : 0}
                onSlide={moveSel}
                onOffset={moveSel2}
                openSignal={b.id === activeId ? openShot : 0}
                onClaim={() => b.id !== activeId && claim(b.id)}
              />
            )}
            {b.kind === "contact" && (
              <ContactForm
                steps={wizardSteps}
                content={content}
                state={contact}
                live={b.id === activeId}
                frozen={isPast(b.id)}
                onPick={(i) => {
                  const step = wizardSteps[Math.min(contact.step, wizardSteps.length - 1)];
                  if (step?.kind === "choice") advance(step.options[i].value);
                }}
                onClaim={() => b.id !== activeId && claim(b.id)}
              />
            )}
            {b.kind === "scroll" && (
              <ScrollView
                content={content}
                title={b.title}
                lines={b.lines}
                rows={b.rows}
                live={b.id === activeId}
                frozen={isPast(b.id)}
                offset={b.id === activeId ? selIdx : 0}
                onOffsetChange={moveSel}
                onClaim={() => b.id !== activeId && claim(b.id)}
              />
            )}
            {b.kind === "carousel" && (
              <Carousel
                content={content}
                title={b.title}
                slides={b.slides}
                live={b.id === activeId}
                frozen={isPast(b.id)}
                index={b.id === activeId ? selIdx : 0}
                onIndexChange={moveSel}
                onClaim={() => b.id !== activeId && claim(b.id)}
                openSignal={b.id === activeId ? openShot : 0}
              />
            )}
            {b.kind === "photos" && <PhotosBlock items={b.items} />}
            {b.kind === "shots" && <ShotsBlock items={b.items} content={content} />}
            {b.kind === "action" && (
              <ActionBlock actionLabel={b.actionLabel} act={b.act} />
            )}
          </div>
        ))}

        <div className="h-1.5" />
      </div>

      {busy && (
        <div className="flex flex-none gap-2 px-4 pb-1.5">
          <span className="flex-none" style={{ color: "var(--accent)" }}>
            {spinner}
          </span>
          <span style={{ color: "var(--fg)" }}>{engine.busyLabel}</span>
          <span style={{ color: "var(--faint)" }}>
            {`(${engine.elapsed.toFixed(1)}s · ↑ ${kTokens}k tokens · esc to interrupt)`}
          </span>
        </div>
      )}

      {shortcutsOpen && <Shortcuts content={content} />}

      {pal.length > 0 && (
        <Palette
          items={pal}
          idx={palSel}
          onPick={submit}
          onHover={setPalIdx}
        />
      )}

      <Prompt
        inputRef={inputRef}
        value={input}
        placeholder={
          busy
            ? ""
            : contactPrompt
              ? contactPrompt
              : content.ui.promptPlaceholder
        }
        caretPos={caretPos}
        onChange={(v, caret) => {
          setInput(v);
          setPalIdx(0);
          setCaretPos(caret);
        }}
        onCaret={setCaretPos}
        onKeyDown={onKeyDown}
        headline={content.nowHeadline}
        headlineTitle={content.s("prompt.runNow", "run /now")}
        onHeadline={() => submit("/now")}
      />

      <StatusBar
        usageLabel={`Est. usage: $${(engine.tokens * 0.000012).toFixed(4)}`}
        ctxLabel={`context ${Math.min(99, Math.round(engine.tokens / 240))}% · ${kTokens}k tokens`}
        modeLabel={LOCALE_LABEL[locale]}
        modeColor="var(--accent)"
        modeHint={content.ui.modeHint}
        onMode={switchLocale}
        onHelp={() => submit("/help")}
      />
    </div>
  );
}
