"use client";

import { useEffect, useRef, useState } from "react";

import type { KeyboardEvent, RefObject } from "react";

interface PromptProps {
  inputRef: RefObject<HTMLInputElement | null>;
  value: string;
  placeholder: string;
  caretPos: number;
  onChange: (value: string, caret: number) => void;
  onCaret: (caret: number) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  /** Status shown at the right of the prompt row; runs /now when clicked. */
  headline: string;
  headlineTitle: string;
  onHeadline: () => void;
}

/** Measured width of one monospace cell, used to place the block caret. */
function useCharWidth(inputRef: RefObject<HTMLInputElement | null>) {
  const [charW, setCharW] = useState(7.8);

  useEffect(() => {
    const measure = () => {
      const el = inputRef.current;
      if (!el) return;
      const g = document.createElement("canvas").getContext("2d");
      if (!g) return;
      const cs = getComputedStyle(el);
      g.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const w = g.measureText("M".repeat(20)).width / 20;
      if (w > 2) setCharW((prev) => (Math.abs(w - prev) > 0.05 ? w : prev));
    };
    measure();
    document.fonts?.ready.then(measure).catch(() => {});
  }, [inputRef]);

  return charW;
}

export function Prompt({
  inputRef,
  value,
  placeholder,
  caretPos,
  onChange,
  onCaret,
  onKeyDown,
  headline,
  headlineTitle,
  onHeadline,
}: PromptProps) {
  const charW = useCharWidth(inputRef);
  const caretX = +(Math.min(caretPos, value.length) * charW).toFixed(1);
  const wrap = useRef<HTMLDivElement>(null);

  const syncCaret = (el: HTMLInputElement) => {
    const p = el.selectionStart;
    if (p != null && p !== caretPos) onCaret(p);
  };

  return (
    <div
      className="flex flex-none items-center gap-2 border-b border-t px-4 py-[5px]"
      style={{ borderTopColor: "var(--hair)", borderBottomColor: "var(--hair)" }}
    >
      <span className="flex-none" style={{ color: "var(--accent)" }}>
        ❯
      </span>
      <div ref={wrap} className="relative flex min-w-0 flex-1 items-center">
        <input
          ref={inputRef}
          className="relative z-[1] min-w-0 flex-1 bg-none"
          style={{ caretColor: "transparent" }}
          value={value}
          placeholder={placeholder}
          spellCheck={false}
          autoComplete="off"
          aria-label="terminal input"
          onChange={(e) =>
            onChange(
              e.target.value,
              e.target.selectionStart ?? e.target.value.length,
            )
          }
          onKeyDown={onKeyDown}
          onSelect={(e) => syncCaret(e.currentTarget)}
          onClick={(e) => syncCaret(e.currentTarget)}
        />
        <span
          data-caret
          className="pointer-events-none absolute top-1/2 h-[19px] w-2 -translate-y-1/2"
          style={{
            left: `${caretX}px`,
            background: "var(--cursor)",
            animation: "blink 1.05s step-end infinite",
          }}
        />
      </div>
      <button
        className="hidden flex-none whitespace-pre sm:block"
        style={{ color: "var(--dim)" }}
        onClick={onHeadline}
        title={headlineTitle}
      >
        <span style={{ color: "var(--accent)" }}>● </span>
        {headline}
      </button>
    </div>
  );
}
