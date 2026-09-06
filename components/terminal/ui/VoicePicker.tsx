"use client";

import { useEffect, useRef, useState } from "react";

import type { ShellContent } from "@/lib/terminal/shell-content";
import type { Voice } from "@/lib/terminal/types";

interface VoicePickerProps {
  /** A phone-width pane: the hint drops under the label instead of beside it. */
  narrow?: boolean;
  /** An answer from an earlier turn: read-only, its hint says so. */
  frozen?: boolean;
  current: Voice;
  index: number;
  live: boolean;
  onPick: (index: number) => void;
  onClaim: () => void;
  content: ShellContent;
}

interface Tone {
  value: Voice;
  label: string;
  hint: string;
  /** Peak amplitude, 0-1. */
  amp: number;
  /** How much of the trace carries signal rather than silence, 0-1. */
  duty: number;
  /** Cycles across the width — low rolls, high chatters. */
  freq: number;
}

export const TONES: readonly Tone[] = [
  {
    value: "warm",
    label: "warm",
    hint: "full sentences, first person",
    amp: 1,
    duty: 0.95,
    freq: 1.6,
  },
  {
    value: "brief",
    label: "brief",
    hint: "complete, but nothing spare",
    amp: 0.72,
    duty: 0.7,
    freq: 3.1,
  },
  {
    value: "terse",
    label: "terse",
    hint: "clipped, sysadmin energy",
    amp: 0.52,
    duty: 0.34,
    freq: 6.4,
  },
];

const COLS = 44;
/** Bottom-anchored eighths. The face has eight levels down and only two up, so
 *  a mirrored trace would be lopsided — bars read as a waveform and stay on
 *  the grid. */
const LEVELS = " ▁▂▃▄▅▆▇█";

/** Deterministic per-column jitter, so a tone always looks like itself. */
function noise(i: number, seed: number): number {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function targetShape(tone: Tone, phase: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < COLS; i++) {
    const t = i / COLS;
    const carrier = Math.abs(Math.sin(t * Math.PI * tone.freq + phase));
    const grain = 0.55 + 0.45 * noise(i, tone.freq);
    const gate = noise(i, tone.freq + 7) < tone.duty ? 1 : 0.08;
    // Taper the ends so the trace does not stop dead at the frame.
    const envelope = Math.sin(Math.PI * Math.min(1, Math.max(0, t)));
    out.push(tone.amp * carrier * grain * gate * (0.35 + 0.65 * envelope));
  }
  return out;
}

/**
 * The three registers as a vertical list, with the highlighted one drawn as a
 * live waveform beside it. Amplitudes ease toward the new tone's shape rather
 * than cutting, so moving the cursor reads as the voice changing.
 */
export function VoicePicker({
  narrow = false,
  current,
  index,
  live,
  frozen = false,
  onPick,
  onClaim,
  content,
}: VoicePickerProps) {
  const i = Math.min(Math.max(0, index), TONES.length - 1);
  const [trace, setTrace] = useState<string>(" ".repeat(COLS));
  const amps = useRef<number[]>(new Array(COLS).fill(0));
  const toneRef = useRef<Tone>(TONES[i]);
  // Synced in an effect rather than during render; the animation loop reads it
  // on the next frame, so a one-frame lag on a tone change is invisible.
  useEffect(() => {
    toneRef.current = TONES[i];
  }, [i]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      const shape = targetShape(toneRef.current, 0);
      setTrace(
        shape
          .map((a) => LEVELS[Math.round(a * (LEVELS.length - 1))])
          .join(""),
      );
      return;
    }

    let raf = 0;
    let last = performance.now();
    let phase = 0;

    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      phase += dt * 0.0022;

      const target = targetShape(toneRef.current, phase);
      const a = amps.current;
      for (let n = 0; n < COLS; n++) {
        // Ease toward the target; a tone change is a change of target, so the
        // same easing covers both the drift and the switch.
        a[n] += (target[n] - a[n]) * 0.18;
      }
      setTrace(
        a.map((x) => LEVELS[Math.round(Math.min(1, Math.max(0, x)) * (LEVELS.length - 1))]).join(""),
      );
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="mb-3 pl-5" onClick={onClaim}>
      <div className="whitespace-pre" style={{ color: "var(--faint)" }}>
        {content.s("label.voice", "VOICE · the shape of the answer")}
      </div>

      <div className="flex flex-col gap-x-6 gap-y-1 pt-1 md:flex-row md:items-center">
        <div className="flex-none" role="listbox" aria-label="voice">
          {TONES.map((t, n) => {
            const on = live && n === i;
            const inUse = t.value === current;
            // The label and hint are the CMS's; amp/duty/freq stay here
            // because they are the waveform's shape, not words.
            const hint = content.voiceHints[t.value] ?? t.hint;
            return (
              <button
                key={t.value}
                role="option"
                aria-selected={on}
                className="block whitespace-pre"
                style={{
                  background: on
                    ? "color-mix(in oklab, var(--accent) 15%, transparent)"
                    : "transparent",
                }}
                onClick={() => onPick(n)}
              >
                <span style={{ color: "var(--accent)" }}>{on ? "❯ " : "  "}</span>
                <span
                  style={{
                    color: on ? "var(--fg)" : "var(--dim)",
                    fontWeight: on ? 500 : 400,
                  }}
                >
                  {(t.label + "        ").slice(0, 8)}
                </span>
                {!narrow && (
                  <span style={{ color: "var(--faint)" }}>
                    {(hint + " ".repeat(30)).slice(0, 30)}
                  </span>
                )}
                <span style={{ color: "var(--accent2)" }}>
                  {inUse ? " ● " + content.s("label.inUse", "in use") : "         "}
                </span>
                {narrow && (
                  <span className="block whitespace-pre-wrap pl-[2ch]" style={{ color: "var(--faint)" }}>
                    {"  " + hint}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div
          className="min-w-0 flex-none overflow-x-auto whitespace-pre"
          style={{ color: "var(--accent)" }}
          aria-hidden="true"
        >
          {trace}
        </div>
      </div>

      <div className="whitespace-pre-wrap pt-1" style={{ color: "var(--faint)" }}>
        {live
          ? content.s("hint.voice", "↑↓ move · ↵ apply · esc release")
          : frozen
            ? content.s("hint.past", "earlier answer · read-only")
            : content.s("hint.released", "released · click to take the keyboard back")}
      </div>
    </div>
  );
}
