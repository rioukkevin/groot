"use client";

import {
  CONTACT_GROUPS,
  CONTACT_STEPS,
  currentStep,
  isReview,
  summary,
} from "@/lib/terminal/contact";

import { CardGrid } from "./CardGrid";

import type { ContactState } from "@/lib/terminal/contact";

interface ContactFormProps {
  state: ContactState;
  /** True when this block owns the keyboard. */
  live: boolean;
  onPick: (index: number) => void;
  onClaim: () => void;
}

/** Width of one segment of the horizontal progress bar, in characters. */
const SEG = 14;

/**
 * Horizontal coloured progress, used while the three choice steps run: one
 * filled segment per group, the current one half-lit.
 */
function HorizontalProgress({ reached }: { reached: number }) {
  return (
    <div className="pb-1">
      <div className="whitespace-pre">
        {CONTACT_GROUPS.map((g, i) => (
          <span
            key={g}
            style={{
              color:
                i < reached
                  ? "var(--accent)"
                  : i === reached
                    ? "var(--warn)"
                    : "var(--hair)",
            }}
          >
            {(i < reached ? "█" : i === reached ? "▓" : "░").repeat(SEG)}
            {i < CONTACT_GROUPS.length - 1 ? " " : ""}
          </span>
        ))}
      </div>
      <div className="whitespace-pre">
        {CONTACT_GROUPS.map((g, i) => (
          <span
            key={g}
            style={{
              color:
                i < reached
                  ? "var(--accent)"
                  : i === reached
                    ? "var(--fg)"
                    : "var(--faint)",
            }}
          >
            {(g + " ".repeat(SEG)).slice(0, SEG)}
            {i < CONTACT_GROUPS.length - 1 ? " " : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Selections as chips, sat under the card grid. The end caps are half-blocks
 * in the fill colour, which is how a monospace grid draws a rounded pill —
 * the cell either side is filled to its inner edge and nothing else.
 */
function Chips({ state }: { state: ContactState }) {
  const rows = summary(state.answers);
  if (!rows.length) return null;
  const fill = "color-mix(in oklab, var(--accent) 18%, transparent)";

  return (
    <div className="pt-1">
      <div className="whitespace-pre" style={{ color: "var(--faint)" }}>
        YOUR SELECTIONS
      </div>
      <div className="flex flex-wrap items-center gap-x-2">
        {rows.map(([label, value]) => (
          <div key={label} className="whitespace-pre">
            <span style={{ color: fill }}>▐</span>
            <span style={{ background: fill }}>
              <span style={{ color: "var(--dim)" }}>{label + "  "}</span>
              <span style={{ color: "var(--fg)" }}>{value}</span>
            </span>
            <span style={{ color: fill }}>▌</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Vertical recap, used from the details step onward: every choice already made
 * and every field already filled, one per line, so the whole answer is visible
 * while the last of it is typed.
 */
function VerticalSummary({ state }: { state: ContactState }) {
  const rows = summary(state.answers);
  const step = currentStep(state);
  const pending = CONTACT_STEPS.filter(
    (s) => s.kind === "text" && !state.answers[s.key],
  ) as Extract<(typeof CONTACT_STEPS)[number], { kind: "text" }>[];

  return (
    <div className="pt-1">
      <div className="whitespace-pre" style={{ color: "var(--faint)" }}>
        YOUR ANSWERS
      </div>
      {rows.map(([label, value]) => (
        <div key={label} className="whitespace-pre">
          <span style={{ color: "var(--accent)" }}>{"● "}</span>
          <span style={{ color: "var(--dim)" }}>
            {(label + "          ").slice(0, 10)}
          </span>
          <span style={{ color: "var(--fg)" }}>{value}</span>
        </div>
      ))}
      {pending.map((s) => {
        const isNow = step?.key === s.key;
        return (
          <div key={s.key} className="whitespace-pre">
            <span style={{ color: isNow ? "var(--warn)" : "var(--hair)" }}>
              {isNow ? "▶ " : "○ "}
            </span>
            <span style={{ color: isNow ? "var(--fg)" : "var(--faint)" }}>
              {(s.label + "          ").slice(0, 10)}
            </span>
            <span style={{ color: "var(--faint)" }}>
              {isNow ? "typing…" : s.required ? "" : "optional"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Confirmation, drawn as a dashed frame with a cross in each corner — the
 * nearest a monospace grid gets to an airmail envelope, since no envelope
 * glyph exists in the face.
 */
function SentEnvelope({ email }: { email: string }) {
  const W = 46;
  const dash = "╌".repeat(W);
  const line = (content: string) => (
    <div className="whitespace-pre">
      <span style={{ color: "var(--accent)" }}>╎</span>
      <span style={{ color: "var(--fg)" }}>
        {(" " + content + " ".repeat(W)).slice(0, W)}
      </span>
      <span style={{ color: "var(--accent)" }}>╎</span>
    </div>
  );
  return (
    <div className="py-1">
      <div className="whitespace-pre" style={{ color: "var(--accent)" }}>
        {"╳" + dash + "╳"}
      </div>
      {line("")}
      {line("✓  Message sent")}
      {line("")}
      {line("   It landed with Kévin. He'll reply to")}
      {line("   " + email + ",")}
      {line("   usually within a day.")}
      {line("")}
      <div className="whitespace-pre" style={{ color: "var(--accent)" }}>
        {"╳" + dash + "╳"}
      </div>
      <div className="whitespace-pre pt-1" style={{ color: "var(--faint)" }}>
        {"run /contact to send another"}
      </div>
    </div>
  );
}

export function ContactForm({ state, live, onPick, onClaim }: ContactFormProps) {
  const step = currentStep(state);
  const reached = isReview(state)
    ? CONTACT_GROUPS.length - 1
    : CONTACT_GROUPS.indexOf(CONTACT_STEPS[state.step].group);

  if (state.status === "sent") {
    return (
      <div className="mb-3 pl-5">
        <SentEnvelope email={state.answers.email ?? "you"} />
      </div>
    );
  }

  // The three choice steps get the horizontal bar; the details step and the
  // review switch to the vertical recap, where there is more to keep track of.
  const vertical = !step || step.kind === "text";

  return (
    <div className="mb-3 pl-5" onClick={onClaim}>
      <HorizontalProgress reached={reached} />

      <div className="whitespace-pre pt-1" style={{ color: "var(--fg)" }}>
        {step ? step.question : "Ready to send?"}
      </div>

      {step?.kind === "choice" && (
        <>
          <CardGrid
            options={step.options}
            perRow={step.perRow}
            index={state.choice}
            live={live}
            onPick={onPick}
          />
          <Chips state={state} />
        </>
      )}

      {step?.kind === "text" && (
        <div className="whitespace-pre" style={{ color: "var(--faint)" }}>
          {"type your answer at the prompt below" +
            (step.required ? "" : " · ↵ to skip")}
        </div>
      )}

      {!step && (
        <div className="whitespace-pre pt-1" style={{ color: "var(--dim)" }}>
          {state.status === "sending"
            ? "sending…"
            : "↵ send · ⌫ back to change an answer"}
        </div>
      )}

      {state.error && (
        <div className="whitespace-pre pt-1" style={{ color: "var(--err)" }}>
          {"✗ " + state.error}
        </div>
      )}

      {vertical && <VerticalSummary state={state} />}

      <div className="whitespace-pre pt-2" style={{ color: "var(--faint)" }}>
        {live
          ? step?.kind === "choice"
            ? "←→ ↑↓ choose · ↵ confirm · ⌫ back · esc release"
            : "↵ confirm · ⌫ back · esc release"
          : "released · click to take the keyboard back"}
      </div>
    </div>
  );
}
