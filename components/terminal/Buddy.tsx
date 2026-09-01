"use client";

import { useEffect, useState } from "react";

import { ShaderPhoto } from "./ShaderPhoto";

/** What the shell is doing, which the buddy's face reflects. */
export type BuddyMood = "idle" | "thinking" | "happy" | "sleepy";

/**
 * blobatar serves a deterministic SVG per name with `access-control-allow-origin: *`,
 * so it can be rasterised and read back by WebGL without tainting the canvas.
 */
const EXPRESSION: Record<BuddyMood, string> = {
  idle: "idle",
  thinking: "thinking",
  happy: "happy",
  sleepy: "sleepy",
};

const avatarUrl = (name: string, mood: BuddyMood) =>
  `https://blobatar.dev/avatar/${encodeURIComponent(name)}?size=256&expression=${EXPRESSION[mood]}`;

interface BuddyProps {
  name?: string;
  mood: BuddyMood;
  /** Rendered size in px; snapped to whole cells by the shader. */
  size?: number;
}

/**
 * The blobatar run through the same cell-grid shader as the photos, so it
 * reads as part of the terminal rather than as a pasted-in avatar. Hovering
 * still dissolves it to the original artwork.
 */
export function Buddy({ name = "kev", mood, size = 60 }: BuddyProps) {
  // Warm the other expressions once so switching mood does not flash.
  useEffect(() => {
    const moods: BuddyMood[] = ["idle", "thinking", "happy", "sleepy"];
    const imgs = moods.map((m) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = avatarUrl(name, m);
      return img;
    });
    return () => imgs.forEach((img) => (img.src = ""));
  }, [name]);

  return (
    <ShaderPhoto
      src={avatarUrl(name, mood)}
      width={size}
      height={size}
      cellW={5}
      cellH={5}
      gap={1}
      label={`${name} buddy`}
    />
  );
}

/**
 * Derives the buddy's mood from shell activity: thinking while the engine
 * works, a brief grin when it finishes, and dozing off after a long silence.
 */
export function useBuddyMood(busy: boolean): BuddyMood {
  const [settled, setSettled] = useState<Exclude<BuddyMood, "thinking">>("idle");

  useEffect(() => {
    if (busy) return;
    // Every transition is scheduled rather than applied inline, so the effect
    // never sets state synchronously and cannot cascade a render. On first
    // mount the intro makes `busy` true within the same tick, which cancels
    // the grin before it fires.
    const grin = setTimeout(() => setSettled("happy"), 30);
    const settle = setTimeout(() => setSettled("idle"), 2200);
    const doze = setTimeout(() => setSettled("sleepy"), 45000);
    return () => {
      clearTimeout(grin);
      clearTimeout(settle);
      clearTimeout(doze);
    };
  }, [busy]);

  // "thinking" is derived, not stored: it is exactly "the engine is working".
  return busy ? "thinking" : settled;
}
