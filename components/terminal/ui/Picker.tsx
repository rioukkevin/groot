"use client";

import { CardGrid } from "./CardGrid";

import type { ShellContent } from "@/lib/terminal/shell-content";
import type { ChoiceOption } from "@/lib/terminal/contact";

interface PickerProps {
  title: string;
  options: ChoiceOption[];
  perRow: number;
  /** The value currently in effect, marked so the active one is obvious. */
  current: string;
  index: number;
  live: boolean;
  onPick: (index: number) => void;
  onClaim: () => void;
  content: ShellContent;
}

/**
 * A standalone card picker — the contact wizard's grid, reused for settings
 * that apply the moment they are chosen.
 */
export function Picker({
  title,
  options,
  perRow,
  current,
  index,
  live,
  onPick,
  onClaim,
  content,
}: PickerProps) {
  const active = options.findIndex((o) => o.value === current);

  return (
    <div className="mb-3 pl-5" onClick={onClaim}>
      <div className="whitespace-pre" style={{ color: "var(--faint)" }}>
        {title}
      </div>
      <CardGrid
        options={options}
        perRow={perRow}
        index={index}
        live={live}
        onPick={onPick}
      />
      <div className="whitespace-pre pt-1" style={{ color: "var(--faint)" }}>
        {(active >= 0 ? `${content.s("label.inUse", "in use")}: ${options[active].label}   ` : "") +
          (live
            ? content.s("hint.picker", "←→ ↑↓ move · ↵ apply · esc release")
            : content.s("hint.released", "released · click to take the keyboard back"))}
      </div>
    </div>
  );
}
