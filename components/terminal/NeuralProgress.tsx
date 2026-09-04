"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import {
  getServerTierSnapshot,
  getTierSnapshot,
  subscribeTiers,
} from "@/lib/terminal/model-tiers";

import { ProgressBar } from "./ui/ProgressBar";

import type { ShellContent } from "@/lib/terminal/shell-content";
import type { Locale } from "@/lib/terminal/locale";

/** How long the final line stays before the widget steps out of the way. */
const LINGER_MS = 7000;
const BAR_CELLS = 12;

/**
 * The story told while the full model arrives, from the top-right corner.
 *
 * Every line is true: the synapse count is the model's bucket count, the
 * intent count its label count, and the download really is a network being
 * woken on the visitor's machine. The numbers come from the file's own
 * header, read as soon as the first kilobytes land.
 */
function story(
  c: ShellContent,
  frac: number,
  h: { buckets: number; labels: string[] } | null,
): string {
  const n = (x: number) => x.toLocaleString(c.locale === "fr" ? "fr-FR" : "en-GB");
  if (frac < 0.08) return c.s("nn.s0", "waking the neurons…");
  if (frac < 0.38) {
    return c
      .s("nn.s1", "growing {buckets} synapses…")
      .replace("{buckets}", h ? n(h.buckets) : c.s("nn.many", "400 000+"));
  }
  if (frac < 0.66) {
    return c
      .s("nn.s2", "learning {labels} intents…")
      .replace("{labels}", h ? String(h.labels.length) : "29");
  }
  if (frac < 0.92) return c.s("nn.s3", "wiring both languages…");
  return c.s("nn.s4", "settling the weights…");
}

export function NeuralProgress({
  locale,
  content,
}: {
  locale: Locale;
  content: ShellContent;
}) {
  const tiers = useSyncExternalStore(subscribeTiers, getTierSnapshot, getServerTierSnapshot);
  const t = tiers[locale];
  const terminal = t.status === "ready" || t.status === "failed" || t.status === "skipped";

  // The closing line lingers, then the corner goes quiet again.
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    if (!terminal) {
      const reset = setTimeout(() => setHidden(false), 0);
      return () => clearTimeout(reset);
    }
    const id = setTimeout(() => setHidden(true), LINGER_MS);
    return () => clearTimeout(id);
  }, [terminal, locale]);

  if (t.status === "idle" || t.status === "waiting" || hidden) return null;

  const frac = t.total ? Math.min(1, t.loaded / t.total) : 0;
  const mb = (t.total / 1e6).toFixed(1).replace(".", content.locale === "fr" ? "," : ".");
  const size = `${mb} ${content.locale === "fr" ? "Mo" : "MB"}`;

  let line: string;
  let tone = "var(--dim)";
  if (t.status === "downloading") line = story(content, frac, t.header);
  else if (t.status === "settling") line = content.s("nn.s4", "settling the weights…");
  else if (t.status === "ready") {
    line = content.s("nn.done", "neural net online · {size}").replace("{size}", size);
    tone = "var(--accent)";
  } else if (t.status === "skipped") line = content.s("nn.skipped", "data saver on · light model");
  else line = content.s("nn.failed", "staying on the light model");

  return (
    <div className="flex flex-col items-end whitespace-pre text-right" style={{ color: tone }}>
      {/* Only the story line is announced; the bar changes every few
          milliseconds and would drown a screen reader. */}
      <span role="status">{line}</span>
      {(t.status === "downloading" || t.status === "settling") && (
        <span aria-hidden="true">
          <ProgressBar
            value={frac * 100}
            width={BAR_CELLS}
            showPercent={t.status === "downloading"}
            indeterminate={t.status === "settling"}
            label={undefined}
          />
        </span>
      )}
      {t.status === "ready" && (
        <span aria-hidden="true" style={{ color: "var(--faint)" }}>
          {"▓".repeat(BAR_CELLS)}
        </span>
      )}
    </div>
  );
}
