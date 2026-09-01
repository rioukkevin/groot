"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { isInteractive } from "./types";

import type { Block, BlockSpec } from "./types";

export interface Engine {
  blocks: Block[];
  busy: boolean;
  busyLabel: string;
  elapsed: number;
  tokens: number;
  spin: number;
  /**
   * Id of the newest block that can own the arrow keys. Changing it hands the
   * arrows to that block and resets its cursor.
   */
  lastInteractiveId: number;
  run: (items: BlockSpec[]) => void;
  push: (spec: BlockSpec) => number;
  halt: (note?: string) => void;
  reset: () => void;
}

/**
 * Replays a queue of blocks with the pacing of a real agent: tools resolve
 * after their duration, prose streams in character by character.
 *
 * A generation counter invalidates in-flight timers, so an interrupt or a new
 * submission can never have a stale callback write into the transcript.
 */
export function useEngine(streamSpeed: number): Engine {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [busy, setBusy] = useState(false);
  const [busyLabel, setBusyLabel] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [tokens, setTokens] = useState(0);
  const [spin, setSpin] = useState(0);
  const [lastInteractiveId, setLastInteractiveId] = useState(-1);

  const uid = useRef(0);
  const gen = useRef(0);
  const queue = useRef<BlockSpec[]>([]);
  const t0 = useRef(0);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);
  const typer = useRef<ReturnType<typeof setInterval> | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speed = useRef(streamSpeed);

  useEffect(() => {
    speed.current = streamSpeed;
  }, [streamSpeed]);

  const clearTimers = useCallback(() => {
    if (tick.current) clearInterval(tick.current);
    if (typer.current) clearInterval(typer.current);
    if (timer.current) clearTimeout(timer.current);
    tick.current = null;
    typer.current = null;
    timer.current = null;
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const push = useCallback((spec: BlockSpec): number => {
    const id = ++uid.current;
    const block = { ...spec, id } as Block;
    setBlocks((bs) => bs.concat([block]));
    if (isInteractive(block)) setLastInteractiveId(id);
    return id;
  }, []);

  const patch = useCallback((id: number, fields: Partial<Block>) => {
    setBlocks((bs) =>
      bs.map((b) => (b.id === id ? ({ ...b, ...fields } as Block) : b)),
    );
  }, []);

  const halt = useCallback(
    (note?: string) => {
      gen.current += 1;
      queue.current = [];
      clearTimers();
      setBusy(false);
      if (note) push({ kind: "think", text: note });
    },
    [clearTimers, push],
  );

  const step = useCallback(
    function step(g: number) {
      if (g !== gen.current) return;

      const next = queue.current.shift();
      if (!next) {
        if (tick.current) clearInterval(tick.current);
        tick.current = null;
        setBusy(false);
        return;
      }

      if (next.kind === "tool") {
        const id = push({
          kind: "tool",
          name: next.name,
          arg: next.arg,
          meta: "running…",
          out: [],
          dur: next.dur,
          done: false,
        });
        setBusyLabel(next.name + "ing…");
        timer.current = setTimeout(() => {
          if (g !== gen.current) return;
          patch(id, { done: true, meta: next.meta, out: next.out });
          setTokens((t) => t + 160 + Math.round(Math.random() * 240));
          step(g);
        }, next.dur);
        return;
      }

      if (next.kind === "say") {
        const rate = Math.max(4, speed.current);
        const id = push({ kind: "say", full: next.full, n: 0 });
        setBusyLabel("Composing…");
        let n = 0;
        if (typer.current) clearInterval(typer.current);
        const iv = setInterval(
          () => {
            if (g !== gen.current) {
              clearInterval(iv);
              return;
            }
            n = Math.min(next.full.length, n + 2);
            patch(id, { n });
            if (n >= next.full.length) {
              clearInterval(iv);
              if (typer.current === iv) typer.current = null;
              setTokens((t) => t + Math.round(next.full.length / 3.6));
              step(g);
            }
          },
          Math.round(120 / rate),
        );
        typer.current = iv;
        return;
      }

      push(next);
      timer.current = setTimeout(() => step(g), next.kind === "think" ? 420 : 90);
    },
    [patch, push],
  );

  const run = useCallback(
    (items: BlockSpec[]) => {
      if (!items.length) return;
      const g = ++gen.current;
      queue.current = items.slice();
      t0.current = Date.now();
      if (tick.current) clearInterval(tick.current);
      setBusy(true);
      setElapsed(0);
      setBusyLabel("Working…");
      tick.current = setInterval(() => {
        if (g !== gen.current) return;
        setElapsed((Date.now() - t0.current) / 1000);
        setSpin((s) => s + 1);
      }, 80);
      step(g);
    },
    [step],
  );

  const reset = useCallback(() => {
    halt();
    setBlocks([]);
    setLastInteractiveId(-1);
  }, [halt]);

  return {
    blocks,
    busy,
    busyLabel,
    elapsed,
    tokens,
    spin,
    lastInteractiveId,
    run,
    push,
    halt,
    reset,
  };
}
