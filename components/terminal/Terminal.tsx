"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { CLEAR, intro, matches, route } from "@/lib/terminal/commands";
import { gridStep } from "@/lib/terminal/grid";
import {
  CONTACT_STEPS,
  currentStep,
  initialContact,
  isReview,
} from "@/lib/terminal/contact";
import { RESUME_TXT } from "@/lib/terminal/content";
import { MODES, SPINNER_FRAMES, isInteractive } from "@/lib/terminal/types";
import { useEngine } from "@/lib/terminal/useEngine";

import { useBuddyMood } from "./Buddy";
import { Header } from "./Header";
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
import type { Theme, Voice } from "@/lib/terminal/types";
import type { KeyboardEvent } from "react";

const STREAM_SPEED = 12;
const PHOTO_GAP = 3;
/** Distance from the bottom that still counts as "following the output". */
const STICK_PX = 48;

function downloadResume() {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([RESUME_TXT], { type: "text/plain" }));
  a.download = "kevin-riou.txt";
  a.click();
  URL.revokeObjectURL(a.href);
}

export function Terminal() {
  const engine = useEngine(STREAM_SPEED);
  const { blocks, busy, run, push, halt, reset, lastInteractiveId } = engine;

  const [input, setInput] = useState("");
  const [caretPos, setCaretPos] = useState(0);
  const [theme, setTheme] = useState<Theme>("green");
  const [voice, setVoice] = useState<Voice>("warm");
  const [mode, setMode] = useState(0);
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
  const [uiState, setUiState] = useState<{
    forId: number;
    claimId: number | null;
    idx: number;
    /** Second cursor, for a block driving two panes (project: shot + scroll). */
    idx2: number;
    off: boolean;
  }>({ forId: -1, claimId: null, idx: 0, idx2: 0, off: false });

  const [contact, setContact] = useState<ContactState>(initialContact);
  const contactRef = useRef(contact);
  useEffect(() => {
    contactRef.current = contact;
  }, [contact]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const stick = useRef(true);

  const ctx = useMemo<CommandContext>(
    () => ({
      theme,
      voice,
      photoGap: PHOTO_GAP,
      download: downloadResume,
      setTheme,
      setVoice,
    }),
    [theme, voice],
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

  const submit = useCallback(
    (raw?: string) => {
      const q = (raw === undefined ? input : raw).trim();
      if (!q) return;
      if (busy) halt();

      stick.current = true;
      push({ kind: "echo", text: q });
      setInput("");
      setHist((h) => h.concat([q]));
      setHistIdx(-1);
      setPalIdx(0);
      setCaretPos(0);

      if (q.trim().toLowerCase().startsWith("/contact")) setContact(initialContact());

      const out = route(q, ctxRef.current);
      if (out === CLEAR) {
        reset();
        return;
      }
      if (out.length) run(out);
    },
    [busy, halt, input, push, reset, run],
  );

  // Intro transcript. Clearing first makes this idempotent: StrictMode's
  // simulated remount tears down the engine's timers mid-stream, so the second
  // pass has to be able to replay the intro from scratch rather than be
  // skipped by a guard.
  useEffect(() => {
    inputRef.current?.focus();
    reset();
    push({ kind: "echo", text: "/intro" });
    run(intro(ctxRef.current));
  }, [push, reset, run]);

  // UX addition: the design pinned the transcript to the bottom on every
  // update, which yanks the view away while you are reading back. Follow the
  // output only while the reader is already at the bottom.
  useEffect(() => {
    const el = scrollRef.current;
    if (el && stick.current) el.scrollTop = el.scrollHeight;
  });

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    stick.current =
      el.scrollHeight - el.scrollTop - el.clientHeight <= STICK_PX;
  }, []);

  const palAll = matches(input);

  /** The claimed block, else the newest one, unless esc has released it. */
  const active = useMemo(() => {
    if (selOff) return null;
    const xs = blocks.filter(isInteractive);
    if (claimId != null) {
      const claimed = xs.find((b) => b.id === claimId);
      if (claimed) return claimed;
    }
    return xs.length ? xs[xs.length - 1] : null;
  }, [blocks, selOff, claimId]);

  const activeSelect = active?.kind === "select" ? active : null;
  // A slash typed into an answer should not raise the command palette.
  const inWizard =
    active?.kind === "contact" &&
    contact.status !== "sent" &&
    currentStep(contact)?.kind === "text";
  const pal = inWizard ? [] : palAll;
  const palSel = Math.min(palIdx, Math.max(0, pal.length - 1));
  const mood = useBuddyMood(busy);

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
        const step = currentStep(c);
        if (!step) return c;
        const v = value.trim();
        const required = step.kind === "choice" || step.required;
        if (required && !v)
          return { ...c, error: `${step.kind === "choice" ? step.group : step.label} is needed` };
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
      const prev = CONTACT_STEPS[c.step - 1];
      const restored = prev.kind === "text" ? (c.answers[prev.key] ?? "") : "";
      setInput(restored);
      setCaretPos(restored.length);
      return { ...c, step: c.step - 1, choice: 0, error: null, status: "editing" };
    });
  }, []);

  const send = useCallback(() => {
    setContact((c) => (c.status === "sending" ? c : { ...c, status: "sending", error: null }));
    const body = { ...contactRef.current.answers, website: "" };
    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then(async (r) => {
        const data: unknown = await r.json().catch(() => ({}));
        const err =
          typeof data === "object" && data !== null && "error" in data
            ? String((data as { error: unknown }).error)
            : null;
        if (!r.ok) throw new Error(err ?? `send failed (${r.status})`);
        setContact((c) => ({ ...c, status: "sent", error: null }));
      })
      .catch((e: unknown) => {
        setContact((c) => ({
          ...c,
          status: "error",
          error: e instanceof Error ? e.message : "could not send",
        }));
      });
  }, []);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      const mm = matches(input);
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
        const step = currentStep(contact);
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
        setMode((m) => (m + 1) % MODES.length);
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
          moveSel2(clamp(selIdx2 + d, Math.max(0, act.lines.length - act.rows)));
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
        moveSel2(clamp(selIdx2 + d, Math.max(0, act.lines.length - act.rows)));
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
          moveSel2(Math.max(0, act.lines.length - act.rows));
        else if (act.kind === "carousel") moveSel(act.slides.length - 1);
      } else if (k === "Escape") {
        if (busy) halt("interrupted by user");
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
        reset();
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
      hist,
      histIdx,
      input,
      moveSel,
      moveSel2,
      openSelected,
      selIdx2,
      palIdx,
      releaseSel,
      reset,
      selIdx,
      submit,
    ],
  );

  const activeId = active ? active.id : -1;
  const contactStep =
    active?.kind === "contact" && contact.status !== "sent"
      ? currentStep(contact)
      : null;
  const contactPrompt =
    contactStep?.kind === "text"
      ? `${contactStep.label}${contactStep.required ? "" : " (optional)"} …`
      : null;
  const spinner = SPINNER_FRAMES[engine.spin % SPINNER_FRAMES.length];
  const kTokens = (engine.tokens / 1000).toFixed(1);

  return (
    <div
      className="flex h-screen flex-col overflow-hidden"
      style={{ background: "var(--bg)", color: "var(--fg)" }}
      onClick={() => inputRef.current?.focus()}
    >
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-1"
        onScroll={onScroll}
      >
        <Header mood={mood} />

        {blocks.map((b) => (
          <div key={b.id}>
            {b.kind === "echo" && <EchoBlock text={b.text} />}
            {b.kind === "think" && <ThinkBlock text={b.text} />}
            {b.kind === "say" && <SayBlock full={b.full} n={b.n ?? 0} />}
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
                header={b.header}
                sep={b.sep}
                hint={b.hint}
                items={b.items}
                live={b.id === activeId}
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
            {b.kind === "chips" && <ChipsBlock groups={b.groups} />}
            {b.kind === "voice" && (
              <VoicePicker
                current={b.current}
                index={b.id === activeId ? selIdx : 0}
                live={b.id === activeId}
                onPick={(n) => {
                  moveSel(n);
                  b.onSelect(TONES[n].value);
                }}
                onClaim={() => b.id !== activeId && claim(b.id)}
              />
            )}
            {b.kind === "picker" && (
              <Picker
                title={b.title}
                options={b.options}
                perRow={b.perRow}
                current={b.current}
                index={b.id === activeId ? selIdx : 0}
                live={b.id === activeId}
                onPick={(i) => {
                  moveSel(i);
                  b.onSelect(b.options[i].value);
                }}
                onClaim={() => b.id !== activeId && claim(b.id)}
              />
            )}
            {b.kind === "project" && (
              <ProjectView
                title={b.title}
                slides={b.slides}
                lines={b.lines}
                rows={b.rows}
                live={b.id === activeId}
                slide={b.id === activeId ? selIdx : 0}
                offset={b.id === activeId ? selIdx2 : 0}
                onSlide={moveSel}
                onOffset={moveSel2}
                onClaim={() => b.id !== activeId && claim(b.id)}
              />
            )}
            {b.kind === "contact" && (
              <ContactForm
                state={contact}
                live={b.id === activeId}
                onPick={(i) => {
                  const step = currentStep(contact);
                  if (step?.kind === "choice") advance(step.options[i].value);
                }}
                onClaim={() => b.id !== activeId && claim(b.id)}
              />
            )}
            {b.kind === "scroll" && (
              <ScrollView
                title={b.title}
                lines={b.lines}
                rows={b.rows}
                live={b.id === activeId}
                offset={b.id === activeId ? selIdx : 0}
                onOffsetChange={moveSel}
                onClaim={() => b.id !== activeId && claim(b.id)}
              />
            )}
            {b.kind === "carousel" && (
              <Carousel
                title={b.title}
                slides={b.slides}
                live={b.id === activeId}
                index={b.id === activeId ? selIdx : 0}
                onIndexChange={moveSel}
                onClaim={() => b.id !== activeId && claim(b.id)}
              />
            )}
            {b.kind === "photos" && <PhotosBlock items={b.items} />}
            {b.kind === "shots" && <ShotsBlock items={b.items} />}
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

      {shortcutsOpen && <Shortcuts />}

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
              : "ask anything, or / for commands"
        }
        caretPos={caretPos}
        onChange={(v, caret) => {
          setInput(v);
          setPalIdx(0);
          setCaretPos(caret);
        }}
        onCaret={setCaretPos}
        onKeyDown={onKeyDown}
      />

      <StatusBar
        usageLabel={`Est. usage: $${(engine.tokens * 0.000012).toFixed(4)}`}
        ctxLabel={`context ${Math.min(99, Math.round(engine.tokens / 240))}% · ${kTokens}k tokens`}
        modeLabel={MODES[mode][0]}
        modeColor={MODES[mode][1]}
        onHelp={() => submit("/help")}
      />
    </div>
  );
}
