"use client";

import { CardGrid } from "./CardGrid";

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
        {(active >= 0 ? `in use: ${options[active].label}   ` : "") +
          (live
            ? "←→ ↑↓ move · ↵ apply · esc release"
            : "released · click to take the keyboard back")}
      </div>
    </div>
  );
}
