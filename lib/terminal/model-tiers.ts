import { parseChatModel, peekHeader } from "./chat-model";

import manifest from "@/public/models/chat-manifest.json";

import type { ChatHeader, ChatModel } from "./chat-model";
import type { Locale } from "./locale";

/**
 * Two tiers of intent model, and the hand-over between them.
 *
 * The light model (200 KB, `intent.ts`) is fetched with the page and answers
 * from the first keystroke. The full one (6.7 MB, `chat-model.ts`) is worth
 * having but not worth making a visitor wait for, so it is fetched only once
 * the page has finished loading and the browser is idle, streamed so the
 * header can show what is arriving, and then swapped in without a word: the
 * next question simply gets the better answer.
 *
 * This module is the single owner of that state. The UI reads it through
 * `useSyncExternalStore`; the classifier asks `fullModel()`.
 */

export type TierStatus =
  | "idle"
  | "waiting"
  | "downloading"
  | "settling"
  | "ready"
  | "failed"
  | "skipped";

export interface TierState {
  status: TierStatus;
  /** Bytes received so far and the file's size, from the manifest. */
  loaded: number;
  total: number;
  /** The file's header, readable long before the file has finished. */
  header: ChatHeader | null;
  /** Wall-clock when the download began, for the story's pacing. */
  startedAt: number;
}

export type TierSnapshot = Readonly<Record<Locale, TierState>>;

interface ManifestEntry {
  file: string;
  bytes: number;
  buckets: number;
  dim: number;
  hidden: number;
  labels: number;
  trainedAt: string;
}

const MANIFEST = manifest as Partial<Record<Locale, ManifestEntry>>;

const idle = (): TierState => ({
  status: "idle",
  loaded: 0,
  total: 0,
  header: null,
  startedAt: 0,
});

/** The server never has a model; the client starts from the same object so
 *  hydration sees nothing to reconcile. */
const SERVER_SNAPSHOT: TierSnapshot = { en: idle(), fr: idle() };
let snapshot: TierSnapshot = SERVER_SNAPSHOT;
const models: Partial<Record<Locale, ChatModel>> = {};
const listeners = new Set<() => void>();

function set(locale: Locale, patch: Partial<TierState>) {
  snapshot = { ...snapshot, [locale]: { ...snapshot[locale], ...patch } };
  for (const l of listeners) l();
}

export function subscribeTiers(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export const getTierSnapshot = (): TierSnapshot => snapshot;

export const getServerTierSnapshot = (): TierSnapshot => SERVER_SNAPSHOT;

/** The full model for a locale, or null while the light one is still on duty. */
export const fullModel = (locale: Locale): ChatModel | null => models[locale] ?? null;

/** Which tier will answer the next question in this locale. */
export const tierOf = (locale: Locale): "light" | "full" =>
  models[locale] ? "full" : "light";

export const manifestFor = (locale: Locale): ManifestEntry | null =>
  MANIFEST[locale] ?? null;

/**
 * Resolves once the page is loaded and the browser has a quiet moment. The
 * model is a nice-to-have; nothing about the first paint should wait on it.
 */
function pageSettled(): Promise<void> {
  return new Promise((resolve) => {
    const whenIdle = () => {
      const w = window as Window & {
        requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      };
      // A beat after load, so the intro's typing and the fonts are not
      // competing with a 6.7 MB download for the same connection.
      const go = () => setTimeout(resolve, 1200);
      if (w.requestIdleCallback) w.requestIdleCallback(go, { timeout: 4000 });
      else setTimeout(go, 800);
    };
    if (document.readyState === "complete") whenIdle();
    else window.addEventListener("load", whenIdle, { once: true });
  });
}

/** Honour a visitor who asked their browser to save data. */
function saveData(): boolean {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return true;
  return window.matchMedia?.("(prefers-reduced-data: reduce)").matches ?? false;
}

async function download(locale: Locale, entry: ManifestEntry): Promise<void> {
  const res = await fetch(entry.file);
  if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

  const chunks: Uint8Array[] = [];
  let loaded = 0;
  let peeked = false;
  let lastEmit = 0;
  const reader = res.body.getReader();

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    loaded += value.length;

    // The header sits in the first 2 KB; once it is in, the story can quote
    // real numbers rather than round ones.
    let header: ChatHeader | null = null;
    if (!peeked) {
      const head = concat(chunks, Math.min(loaded, 4096));
      header = peekHeader(head);
      if (header) peeked = true;
    }

    const now = performance.now();
    if (header || now - lastEmit > 60 || loaded >= entry.bytes) {
      lastEmit = now;
      set(locale, { loaded, ...(header ? { header } : {}) });
    }
  }

  set(locale, { status: "settling", loaded });
  // Parsing is synchronous and quick, but let the frame paint first so the
  // last story line is seen.
  await new Promise((r) => setTimeout(r, 40));
  const model = parseChatModel(concat(chunks, loaded).buffer as ArrayBuffer);
  models[locale] = model;
  set(locale, { status: "ready", header: model.header, loaded });
}

function concat(chunks: Uint8Array[], limit: number): Uint8Array {
  const out = new Uint8Array(limit);
  let off = 0;
  for (const c of chunks) {
    if (off >= limit) break;
    const take = Math.min(c.length, limit - off);
    out.set(take === c.length ? c : c.subarray(0, take), off);
    off += take;
  }
  return out;
}

/**
 * Starts the upgrade for a locale, once. Safe to call on every render path
 * that might want it — mount, language switch — because it is idempotent.
 */
export function upgradeWhenIdle(locale: Locale): void {
  if (typeof window === "undefined") return;
  if (snapshot[locale].status !== "idle") return;
  const entry = MANIFEST[locale];
  if (!entry) return;

  set(locale, { status: "waiting", total: entry.bytes });
  void (async () => {
    await pageSettled();
    if (saveData()) {
      set(locale, { status: "skipped" });
      return;
    }
    set(locale, { status: "downloading", startedAt: performance.now() });
    try {
      await download(locale, entry);
    } catch {
      // The light model is still there; the visitor loses nothing they had.
      set(locale, { status: "failed" });
    }
  })();
}
