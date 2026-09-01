"use client";

import { useEffect, useRef } from "react";

import {
  CONTACT_GROUPS,
  CONTACT_STEPS,
  currentStep,
  isReview,
  summary,
} from "@/lib/terminal/contact";

import type { ContactState } from "@/lib/terminal/contact";

interface ContactFormProps {
  state: ContactState;
  /** True when this block owns the keyboard. */
  live: boolean;
  onPick: (index: number) => void;
  onClaim: () => void;
}

/** ─ Project ─▶ Budget ─▶ Timeline ─▶ Details, with the reached ones lit. */
function Stepper({ state }: { state: ContactState }) {
  const reached = isReview(state)
    ? CONTACT_GROUPS.length
    : CONTACT_GROUPS.indexOf(CONTACT_STEPS[state.step].group);

  return (
    <div className="whitespace-pre pb-1" style={{ color: "var(--faint)" }}>
      {"  "}
      {CONTACT_GROUPS.map((g, i) => (
        <span key={g}>
          <span
            style={{
              color:
                i < reached
                  ? "var(--accent)"
                  : i === reached
                    ? "var(--fg)"
                    : "var(--faint)",
            }}
          >
            {i < reached ? "● " : i === reached ? "▶ " : "○ "}
            {g}
          </span>
          {i < CONTACT_GROUPS.length - 1 ? (
            <span style={{ color: "var(--hair)" }}>{"  ──  "}</span>
          ) : null}
        </span>
      ))}
    </div>
  );
}

function Selections({ state }: { state: ContactState }) {
  const rows = summary(state.answers);
  if (!rows.length) return null;
  return (
    <div className="pt-2">
      <div className="whitespace-pre" style={{ color: "var(--faint)" }}>
        {"  YOUR SELECTIONS"}
      </div>
      {rows.map(([label, value]) => (
        <div key={label} className="whitespace-pre">
          <span style={{ color: "var(--faint)" }}>{"  "}</span>
          <span style={{ color: "var(--dim)" }}>
            {(label + "          ").slice(0, 10)}
          </span>
          <span style={{ color: "var(--fg)" }}>{value}</span>
        </div>
      ))}
    </div>
  );
}

export function ContactForm({ state, live, onPick, onClaim }: ContactFormProps) {
  const step = currentStep(state);
  const activeRow = useRef<HTMLButtonElement>(null);

  // Same rule as the lists: the highlighted option follows the arrows.
  useEffect(() => {
    if (!live) return;
    activeRow.current?.scrollIntoView({ block: "nearest" });
  }, [live, state.choice]);

  const sent = state.status === "sent";

  return (
    <div className="mb-3 pl-5" onClick={onClaim}>
      <Stepper state={state} />

      {sent ? (
        <div className="pt-1">
          <div className="whitespace-pre" style={{ color: "var(--add)" }}>
            {"  ✓ Sent. I'll reply to " + (state.answers.email ?? "you") + "."}
          </div>
          <div className="whitespace-pre" style={{ color: "var(--faint)" }}>
            {"  Usually within a day. Run /contact to send another."}
          </div>
        </div>
      ) : (
        <>
          <div className="whitespace-pre pt-1" style={{ color: "var(--fg)" }}>
            {"  " + (step ? step.question : "Ready to send?")}
          </div>

          {step?.kind === "choice" && (
            <div role="listbox" aria-label={step.group}>
              {step.options.map((opt, i) => {
                const on = live && i === state.choice;
                return (
                  <button
                    key={opt}
                    ref={on ? activeRow : null}
                    role="option"
                    aria-selected={on}
                    className="block whitespace-pre"
                    style={{
                      background: on
                        ? "color-mix(in oklab, var(--accent) 15%, transparent)"
                        : "transparent",
                      color: on ? "var(--fg)" : "var(--dim)",
                    }}
                    onClick={() => onPick(i)}
                  >
                    <span style={{ color: "var(--accent)" }}>
                      {on ? "❯ " : "  "}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {step?.kind === "text" && (
            <div className="whitespace-pre" style={{ color: "var(--faint)" }}>
              {"  type your answer at the prompt below" +
                (step.required ? "" : " · ↵ to skip")}
            </div>
          )}

          {!step && (
            <div className="whitespace-pre pt-1" style={{ color: "var(--dim)" }}>
              {state.status === "sending"
                ? "  sending…"
                : "  ↵ send · ← back to change an answer"}
            </div>
          )}

          {state.error && (
            <div className="whitespace-pre pt-1" style={{ color: "var(--err)" }}>
              {"  ✗ " + state.error}
            </div>
          )}
        </>
      )}

      <Selections state={state} />

      {!sent && (
        <div className="whitespace-pre pt-2" style={{ color: "var(--faint)" }}>
          {live
            ? step?.kind === "choice"
              ? "  ↑↓ choose · ↵ confirm · ← back · esc release"
              : "  ↵ confirm · ← back · esc release"
            : "  released · click to take the keyboard back"}
        </div>
      )}
    </div>
  );
}
