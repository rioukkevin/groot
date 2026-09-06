"use client";

import { groupsOf, isReview, summary } from "@/lib/terminal/contact";

import { CardGrid } from "./CardGrid";

import type { ShellContent } from "@/lib/terminal/shell-content";
import type { ContactState, ContactStep } from "@/lib/terminal/contact";

interface ContactFormProps {
  /** An answer from an earlier turn: read-only, its hint says so. */
  frozen?: boolean;
  /** Steps with the CMS copy already applied, for the active locale. */
  steps: readonly ContactStep[];
  content: ShellContent;
  state: ContactState;
  /** True when this block owns the keyboard. */
  live: boolean;
  /** Character columns the pane shows; the bar, the cards and the envelope fit it. */
  cols: number;
  onPick: (index: number) => void;
  onClaim: () => void;
}

/** Width of one segment of the horizontal progress bar, in characters. */
const SEG = 14;
/** Under this many columns the form folds to one card per row. */
const NARROW = 60;

/**
 * Horizontal coloured progress, used while the three choice steps run: one
 * filled segment per group, the current one half-lit.
 */
function HorizontalProgress({
  reached,
  groups,
  seg,
}: {
  reached: number;
  groups: string[];
  /** Characters per segment. */
  seg: number;
}) {
  return (
    <div className="pb-1">
      <div className="whitespace-pre">
        {groups.map((g, i) => (
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
            {(i < reached ? "█" : i === reached ? "▓" : "░").repeat(seg)}
            {i < groups.length - 1 ? " " : ""}
          </span>
        ))}
      </div>
      <div className="whitespace-pre">
        {groups.map((g, i) => (
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
            {(g + " ".repeat(seg)).slice(0, seg)}
            {i < groups.length - 1 ? " " : ""}
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
function VerticalSummary({
  state,
  steps,
  content,
}: {
  state: ContactState;
  steps: readonly ContactStep[];
  content: ShellContent;
}) {
  const rows = summary(state.answers, steps);
  const step = steps[state.step];
  const pending = steps.filter(
    (s): s is Extract<ContactStep, { kind: "text" }> =>
      s.kind === "text" && !state.answers[s.key],
  );

  return (
    <div className="pt-1">
      <div className="whitespace-pre" style={{ color: "var(--faint)" }}>
        {content.s("wizard.answers", "YOUR ANSWERS")}
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
              {isNow
                ? content.s("wizard.typing", "typing…")
                : s.required
                  ? ""
                  : content.s("wizard.optional", "optional")}
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
function SentEnvelope({
  email,
  content,
  cols,
}: {
  email: string;
  content: ShellContent;
  cols: number;
}) {
  const W = Math.max(24, Math.min(46, cols - 4));
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
      {line("✓  " + content.s("sent.title", "Message sent"))}
      {line("")}
      {line("   " + content.s("sent.lead", "It landed with Kévin. He'll reply to"))}
      {line("   " + (email || content.s("sent.you", "you")) + ",")}
      {line("   " + content.s("sent.when", "usually within a day."))}
      {line("")}
      <div className="whitespace-pre" style={{ color: "var(--accent)" }}>
        {"╳" + dash + "╳"}
      </div>
      <div className="whitespace-pre pt-1" style={{ color: "var(--faint)" }}>
        {content.s("sent.again", "run /contact to send another")}
      </div>
    </div>
  );
}

export function ContactForm({
  steps,
  content,
  state,
  live,
  cols,
  frozen = false,
  onPick,
  onClaim,
}: ContactFormProps) {
  const groups = groupsOf(steps);
  const step = state.step < steps.length ? steps[state.step] : null;
  const reached = step ? groups.indexOf(step.group) : groups.length - 1;

  if (state.status === "sent") {
    return (
      <div className="mb-3 pl-5">
        <SentEnvelope email={state.answers.email ?? ""} content={content} cols={cols} />
      </div>
    );
  }

  // The three choice steps get the horizontal bar; the details step and the
  // review switch to the vertical recap, where there is more to keep track of.
  const vertical = !step || step.kind === "text";

  return (
    <div className="mb-3 pl-5" onClick={onClaim}>
      <HorizontalProgress reached={reached} groups={groups} seg={cols < NARROW ? 8 : SEG} />

      <div className="whitespace-pre pt-1" style={{ color: "var(--fg)" }}>
        {step ? step.question : content.s("wizard.review", "Ready to send?")}
      </div>

      {step?.kind === "choice" && (
        <>
          <CardGrid
            options={step.options}
            perRow={cols < NARROW ? 1 : step.perRow}
            index={state.choice}
            live={live}
            onPick={onPick}
          />
          <Chips state={state} />
        </>
      )}

      {step?.kind === "text" && (
        <div className="whitespace-pre" style={{ color: "var(--faint)" }}>
          {content.s("wizard.type", "type your answer at the prompt below") +
            (step.required ? "" : " · " + content.s("wizard.skip", "↵ to skip"))}
        </div>
      )}

      {!step && (
        <div className="whitespace-pre pt-1" style={{ color: "var(--dim)" }}>
          {state.status === "sending"
            ? content.s("wizard.sending", "sending…")
            : content.s("wizard.sendHint", "↵ send · ⌫ back to change an answer")}
        </div>
      )}

      {state.error && (
        <div className="whitespace-pre pt-1" style={{ color: "var(--err)" }}>
          {"✗ " + state.error}
        </div>
      )}

      {vertical && (
        <VerticalSummary state={state} steps={steps} content={content} />
      )}

      <div className="whitespace-pre-wrap pt-2" style={{ color: "var(--faint)" }}>
        {live
          ? step?.kind === "choice"
            ? content.s("hint.cards", "←→ ↑↓ choose · ↵ confirm · ⌫ back · esc release")
            : content.s("hint.text", "↵ confirm · ⌫ back · esc release")
          : frozen
            ? content.s("hint.past", "earlier answer · read-only")
            : content.s("hint.released", "released · click to take the keyboard back")}
      </div>
    </div>
  );
}
