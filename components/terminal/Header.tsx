import { Buddy } from "./Buddy";

import type { BuddyMood } from "./Buddy";

const LOGO = `▗▄▄▄▄▄▄▄▖
▐ ❯_    ▌
▝▀▀▀▀▀▀▀▘`;

const MOOD_NOTE: Record<BuddyMood, string> = {
  idle: "",
  thinking: "thinking…",
  happy: "done",
  sleepy: "zzz",
};

/**
 * The identity row. Sticky inside the transcript so the buddy stays on screen
 * while you scroll; the availability banner below it scrolls away normally so
 * the pinned strip stays short.
 */
export function Header({ mood }: { mood: BuddyMood }) {
  return (
    <>
      <div
        className="sticky top-0 z-20 pb-2 pt-[14px]"
        style={{ background: "var(--bg)" }}
      >
        <div className="flex items-start gap-[14px]">
          <div
            className="flex-none whitespace-pre pt-px text-[13px] leading-[1.15]"
            style={{ color: "var(--accent)" }}
          >
            {LOGO}
          </div>
          <div className="flex-none" style={{ color: "var(--accent)" }}>
            <Buddy mood={mood} />
          </div>
          <div className="min-w-0">
            <div>
              <span className="font-bold">kr</span>{" "}
              <span style={{ color: "var(--dim)" }}>v2.4.1</span>{" "}
              <span style={{ color: "var(--faint)" }}>{MOOD_NOTE[mood]}</span>
            </div>
            <div style={{ color: "var(--dim)" }}>
              portfolio shell · Kévin Riou · fullstack web & mobile, freelance
            </div>
            <div style={{ color: "var(--dim)" }}>~/work/kevin-riou</div>
          </div>
        </div>
        <div
          className="h-px w-full"
          style={{ background: "var(--hair)", marginTop: "8px" }}
        />
      </div>
      <div
        className="mb-3 mt-2 whitespace-pre-wrap"
        style={{ color: "var(--warn)" }}
      >
        ▲ Available for new work from mid-September{" "}
        <span style={{ color: "var(--dim)" }}>· run /now for what changed</span>
      </div>
    </>
  );
}
