"use client";

import { gaze } from "blobatar/gaze";
import { Blobatar } from "blobatar/react";
import { useEffect, useRef, useState } from "react";

import {
  happy,
  idle,
  sleepy,
  smug,
  surprised,
  thinking,
} from "blobatar/expression";

import type { Voice } from "@/lib/terminal/types";

import "blobatar/motion.css";
import "blobatar/gaze.css";

/** The faces the shell drives. blobatar ships each as an object, not a name. */
export type BuddyMood =
  | "idle"
  | "thinking"
  | "happy"
  | "sleepy"
  | "surprised"
  | "smug";

const FACE = { idle, thinking, happy, sleepy, surprised, smug } as const;

/** The resting face for each register, so the voice is visible on the buddy. */
const VOICE_FACE: Record<Voice, BuddyMood> = {
  warm: "happy",
  brief: "idle",
  terse: "smug",
};

/**
 * Resolves a CSS colour — including oklch(), which computes to lab() — to a
 * hex string, by painting it and reading the pixel back. blobatar's palette
 * takes hex, and this keeps the buddy on whatever the active theme resolves to
 * rather than on a table that has to be kept in step with the stylesheet.
 */
function resolveHex(value: string, fallback: string): string {
  try {
    const c = document.createElement("canvas");
    c.width = c.height = 1;
    const g = c.getContext("2d");
    if (!g) return fallback;
    g.fillStyle = fallback;
    g.fillStyle = value;
    g.fillRect(0, 0, 1, 1);
    const [r, gg, b] = g.getImageData(0, 0, 1, 1).data;
    return (
      "#" + [r, gg, b].map((n) => n.toString(16).padStart(2, "0")).join("")
    );
  } catch {
    return fallback;
  }
}

interface BuddyProps {
  name?: string;
  mood: BuddyMood;
  size?: number;
  /** Bumped by the shell on every command, to make the buddy react. */
  pulse?: number;
}

/**
 * The blobatar, drawn live so it can move: eyes track the pointer, the face
 * follows the voice and what the shell is doing, and the palette is taken from
 * the active theme so it belongs to whichever one is on.
 */
/**
 * Eye excursion, in SVG user units. gaze.css only declares the property (with
 * an initial value of 0, which zeroes every delta); setting it is the
 * consumer's job, and it is the knob for how far the eyes travel.
 */
const TRACK_TRAVEL = "5px";

/**
 * Trait overrides are the raw uniform the generator maps into each range, so 1
 * is the top of it. `eye.ratio` spans 1.9–3.2 height-over-width, and pushing it
 * high gives the tall, narrow eyes the shell wants.
 */
const TRAITS = { "eye.ratio": 0.92, "eye.stretch": 0.85 };

/**
 * A grid of holes punched through the buddy, so the live SVG reads as cells
 * the way the photos do. Two repeating gradients intersected: opaque for the
 * cell, transparent for the gutter. The animation runs underneath it, which a
 * rasterising shader could not allow.
 */
const CELL = 5;
const GUTTER = 1;
const squareMask = {
  WebkitMaskImage: `repeating-linear-gradient(to right, #000 0 ${CELL}px, transparent ${CELL}px ${CELL + GUTTER}px), repeating-linear-gradient(to bottom, #000 0 ${CELL}px, transparent ${CELL}px ${CELL + GUTTER}px)`,
  maskImage: `repeating-linear-gradient(to right, #000 0 ${CELL}px, transparent ${CELL}px ${CELL + GUTTER}px), repeating-linear-gradient(to bottom, #000 0 ${CELL}px, transparent ${CELL}px ${CELL + GUTTER}px)`,
  WebkitMaskComposite: "source-in",
  maskComposite: "intersect",
} as const;

export function Buddy({ name = "kevin-riou", mood, size = 56 }: BuddyProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ink, setInk] = useState({ head: "#8fd6a8", eye: "#0c0c0c" });

  // Re-read the palette whenever the theme attribute changes.
  useEffect(() => {
    const read = () => {
      const cs = getComputedStyle(document.documentElement);
      setInk({
        head: resolveHex(cs.getPropertyValue("--accent").trim(), "#8fd6a8"),
        eye: resolveHex(cs.getPropertyValue("--bg").trim(), "#0c0c0c"),
      });
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => mo.disconnect();
  }, []);

  // The adapter does not forward a ref, so the svg is found in the DOM. It is
  // re-attached whenever the expression redraws the eyes, because the driver
  // measures the face on start. It parks itself when nothing moves, and does
  // nothing at all without a fine pointer or under reduced motion.
  useEffect(() => {
    const svg = hostRef.current?.querySelector("svg");
    if (!(svg instanceof SVGSVGElement)) return;
    // The driver aims at nothing unless told to: "pointer" is an explicit
    // target, not the default, so nothing tracks by accident.
    const tracker = gaze(svg, { target: "pointer" });
    return () => tracker.stop();
  }, [mood, ink.head, ink.eye]);

  return (
    <div
      ref={hostRef}
      className="flex-none"
      style={{
        width: size,
        height: size,
        ["--mo-track-travel" as string]: TRACK_TRAVEL,
        ...squareMask,
      }}
    >
      <Blobatar
        name={name}
        size={size}
        background={false}
        animate="always"
        expression={FACE[mood]}
        palette={{ head: ink.head, eye: ink.eye }}
        traits={TRAITS}
        title={`${name}, ${mood}`}
        style={{ display: "block" }}
      />
    </div>
  );
}

/**
 * The buddy's face, from what the shell is doing and which voice is on.
 *
 * Precedence: working beats reacting, reacting beats the resting face, and a
 * long silence beats all of it.
 */
export function useBuddyMood(
  busy: boolean,
  voice: Voice,
  pulse: number,
): BuddyMood {
  const [settled, setSettled] = useState<"resting" | "happy" | "sleepy">(
    "resting",
  );
  const [reacting, setReacting] = useState(false);

  useEffect(() => {
    if (busy) return;
    // Scheduled rather than applied inline, so the effect never sets state
    // synchronously and cannot cascade a render.
    const grin = setTimeout(() => setSettled("happy"), 30);
    const settle = setTimeout(() => setSettled("resting"), 2200);
    const doze = setTimeout(() => setSettled("sleepy"), 45000);
    return () => {
      clearTimeout(grin);
      clearTimeout(settle);
      clearTimeout(doze);
    };
  }, [busy]);

  // A command was submitted: a beat of surprise before the work starts.
  useEffect(() => {
    if (pulse === 0) return;
    const on = setTimeout(() => setReacting(true), 0);
    const off = setTimeout(() => setReacting(false), 420);
    return () => {
      clearTimeout(on);
      clearTimeout(off);
    };
  }, [pulse]);

  if (busy) return "thinking";
  if (reacting) return "surprised";
  if (settled === "sleepy") return "sleepy";
  if (settled === "happy") return "happy";
  return VOICE_FACE[voice];
}
