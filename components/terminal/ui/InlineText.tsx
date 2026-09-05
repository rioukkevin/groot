import type { ReactNode } from "react";

/** A markdown link, `[label](url)`, with an http(s) URL. */
const LINK = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;

/**
 * A line of transcript text with its markdown links made real.
 *
 * Content stores a link as `[label](url)`; here the label is what shows and
 * the URL is where it goes, in a new tab. Everything else is left exactly as
 * written, spaces included, so padded columns stay aligned.
 */
export function InlineText({ text }: { text: string }): ReactNode {
  if (!text.includes("](")) return text;
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK)) {
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    out.push(
      <a key={at} href={m[2]} target="_blank" rel="noopener noreferrer">
        {m[1]}
      </a>,
    );
    last = at + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}
