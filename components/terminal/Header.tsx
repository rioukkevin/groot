import { Buddy } from "./Buddy";

import type { ShellContent } from "@/lib/terminal/cms";

import type { BuddyMood } from "./Buddy";

const MOOD_NOTE: Record<BuddyMood, string> = {
  idle: "",
  thinking: "thinking…",
  happy: "done",
  sleepy: "zzz",
  surprised: "",
  smug: "",
};

/**
 * The identity row. Sticky inside the transcript so the buddy stays on screen
 * while you scroll; the availability banner below it scrolls away normally so
 * the pinned strip stays short.
 */
export function Header({
  mood,
  content,
}: {
  mood: BuddyMood;
  content: ShellContent;
}) {
  return (
    <>
      <div
        className="sticky top-0 z-20 pb-2 pt-[14px]"
        style={{ background: "var(--bg)" }}
      >
        <div className="flex items-start gap-[14px]">
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
              {`portfolio shell · ${content.name} · ${content.tagline}`}
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
        {"▲ " + content.ui.banner}{" "}
        <span style={{ color: "var(--dim)" }}>{"· /now"}</span>
      </div>
    </>
  );
}
