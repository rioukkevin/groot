"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { CLEAR, intro, matches, route } from "@/lib/terminal/commands";
import { RESUME_TXT } from "@/lib/terminal/content";
import { MODES, SPINNER_FRAMES } from "@/lib/terminal/types";
import { useEngine } from "@/lib/terminal/useEngine";

import { Header } from "./Header";
import { Palette } from "./Palette";
import { Prompt } from "./Prompt";
import { Shortcuts } from "./Shortcuts";
import { StatusBar } from "./StatusBar";
import { ActionBlock } from "./blocks/ActionBlock";
import { DiffBlock } from "./blocks/DiffBlock";
import { EchoBlock } from "./blocks/EchoBlock";
import { LinesBlock } from "./blocks/LinesBlock";
import { PhotosBlock } from "./blocks/PhotosBlock";
import { SayBlock } from "./blocks/SayBlock";
import { SelectBlock } from "./blocks/SelectBlock";
import { ShotsBlock } from "./blocks/ShotsBlock";
import { ThinkBlock } from "./blocks/ThinkBlock";
import { ToolBlock } from "./blocks/ToolBlock";

import type { CommandContext } from "@/lib/terminal/commands";
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
  const { blocks, busy, run, push, halt, reset, lastSelectId } = engine;

  const [input, setInput] = useState("");
  const [caretPos, setCaretPos] = useState(0);
  const [theme, setTheme] = useState<Theme>("green");
  const [voice, setVoice] = useState<Voice>("warm");
  const [mode, setMode] = useState(0);
  const [palIdx, setPalIdx] = useState(0);
  const [hist, setHist] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  // Selection is stamped with the list it belongs to, so a newly pushed list
  // resets the cursor by derivation rather than by a cascading effect.
  const [selState, setSelState] = useState({ forId: -1, idx: 0, off: false });

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const stick = useRef(true);

  const ctx = useMemo<CommandContext>(
    () => ({
      voice,
      photoGap: PHOTO_GAP,
      download: downloadResume,
      setTheme,
      setVoice,
    }),
    [voice],
  );
  const ctxRef = useRef(ctx);
  useEffect(() => {
    ctxRef.current = ctx;
  }, [ctx]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const selCurrent = selState.forId === lastSelectId;
  const selIdx = selCurrent ? selState.idx : 0;
  const selOff = selCurrent ? selState.off : false;

  const moveSel = useCallback(
    (idx: number) => setSelState({ forId: lastSelectId, idx, off: false }),
    [lastSelectId],
  );
  const releaseSel = useCallback(
    () => setSelState({ forId: lastSelectId, idx: selIdx, off: true }),
    [lastSelectId, selIdx],
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

  const pal = matches(input);
  const palSel = Math.min(palIdx, Math.max(0, pal.length - 1));

  const activeSelect = useMemo(() => {
    if (selOff) return null;
    const sel = blocks.filter((b) => b.kind === "select");
    return sel.length ? sel[sel.length - 1] : null;
  }, [blocks, selOff]);

  const openSelected = useCallback(() => {
    if (!activeSelect) return;
    const it =
      activeSelect.items[Math.min(selIdx, activeSelect.items.length - 1)];
    if (it) submit(it.cmd);
  }, [activeSelect, selIdx, submit]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      const mm = matches(input);
      const k = e.key;
      const sel = input ? null : activeSelect;

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
      } else if (k === "ArrowUp") {
        e.preventDefault();
        // UX addition: the palette wraps, so a long list is reachable from
        // either end without walking the whole way back.
        if (mm.length) setPalIdx((i) => (i - 1 + mm.length) % mm.length);
        else if (sel) moveSel(Math.max(0, selIdx - 1));
        else if (hist.length) {
          const i = histIdx < 0 ? hist.length - 1 : Math.max(0, histIdx - 1);
          setHistIdx(i);
          setInput(hist[i] || "");
        }
      } else if (k === "ArrowDown") {
        e.preventDefault();
        if (mm.length) setPalIdx((i) => (i + 1) % mm.length);
        else if (sel) moveSel(Math.min(sel.items.length - 1, selIdx + 1));
        else if (hist.length) {
          const i = Math.min(hist.length - 1, histIdx + 1);
          setHistIdx(i);
          setInput(hist[i] || "");
        }
      } else if (k === "Home" && sel) {
        e.preventDefault();
        moveSel(0);
      } else if (k === "End" && sel) {
        e.preventDefault();
        moveSel(sel.items.length - 1);
      } else if (k === "Escape") {
        if (busy) halt("interrupted by user");
        else if (sel) {
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
      activeSelect,
      busy,
      halt,
      hist,
      histIdx,
      input,
      moveSel,
      openSelected,
      palIdx,
      releaseSel,
      reset,
      selIdx,
      submit,
    ],
  );

  const activeId = activeSelect ? activeSelect.id : -1;
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
        className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-1 pt-[14px]"
        onScroll={onScroll}
      >
        <Header />

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
                onPick={(i, cmd) => {
                  moveSel(i);
                  submit(cmd);
                }}
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
        placeholder={busy ? "" : "ask anything, or / for commands"}
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
