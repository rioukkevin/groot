import type { Locale } from "./locale";

/**
 * Runs the intent classifier trained by `ml/train.py`.
 *
 * One model per language, 144 KB each, fetched once and cached. It classifies
 * a question into one of the tools; it does not write anything. That division
 * is the point: at this size a model can decide reliably and cannot compose
 * fluently, so the deciding is its job and the words stay the site's.
 *
 * The feature extraction below must match `features()` in the trainer exactly —
 * same normalisation, same n-gram range, same FNV-1a hash, same L2 norm. The
 * test at `ml/parity.mjs` runs the same inputs through both and asserts the
 * bucket sets are identical, because a silent drift here would degrade
 * predictions without ever throwing.
 */

interface IntentModel {
  version: number;
  buckets: number;
  ngram: [number, number];
  labels: string[];
  scale: number;
  bias: number[];
  weights: number[][];
}

const cache = new Map<Locale, Promise<IntentModel | null>>();

function load(locale: Locale): Promise<IntentModel | null> {
  const hit = cache.get(locale);
  if (hit) return hit;
  const p = fetch(`/models/intent-${locale}.json`)
    .then((r) => (r.ok ? (r.json() as Promise<IntentModel>) : null))
    .catch(() => null);
  cache.set(locale, p);
  return p;
}

/** Lowercase, strip accents, keep alphanumerics. Mirrors `normalise()`. */
function normalise(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Mn}/gu, "")
    .replace(/[^\p{L}\p{N}]/gu, " ");
}

/** FNV-1a over UTF-16 code units, matching the trainer's `ord()` loop. */
function hash(token: string, buckets: number): number {
  let h = 2166136261;
  for (let i = 0; i < token.length; i++) {
    h ^= token.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h % buckets;
}

export function features(
  text: string,
  buckets: number,
  nMin: number,
  nMax: number,
): Map<number, number> {
  const counts = new Map<number, number>();
  const add = (token: string) => {
    const i = hash(token, buckets);
    counts.set(i, (counts.get(i) ?? 0) + 1);
  };

  for (const word of normalise(text).split(/\s+/)) {
    if (!word) continue;
    add(`#${word}#`);
    const padded = `<${word}>`;
    for (let n = nMin; n <= nMax; n++) {
      for (let i = 0; i + n <= padded.length; i++) add(padded.slice(i, i + n));
    }
  }

  let sum = 0;
  for (const v of counts.values()) sum += v * v;
  const norm = Math.sqrt(sum) || 1;
  for (const [k, v] of counts) counts.set(k, v / norm);
  return counts;
}

export interface Prediction {
  intent: string;
  /** Softmax probability of the winner — the caller decides what to trust. */
  confidence: number;
  /** Probability of the second-placed intent, for a margin check. A narrow
   *  margin means two intents fit equally, which is its own kind of wrong. */
  runnerUp: number;
}

/**
 * Classifies a question, or returns null when there is no model for the
 * locale. A low confidence is not an error: the caller falls back to search,
 * which is the honest response to a question the classifier has not seen.
 */
export async function classify(
  question: string,
  locale: Locale,
): Promise<Prediction | null> {
  const model = await load(locale);
  if (!model) return null;

  const x = features(question, model.buckets, model.ngram[0], model.ngram[1]);
  const scores = model.labels.map((_, c) => {
    let s = model.bias[c];
    const row = model.weights[c];
    for (const [i, v] of x) s += row[i] * model.scale * v;
    return s;
  });

  const top = Math.max(...scores);
  const exps = scores.map((s) => Math.exp(s - top));
  const total = exps.reduce((a, b) => a + b, 0);
  const probs = exps.map((e) => e / total);

  let best = 0;
  for (let i = 1; i < probs.length; i++) if (probs[i] > probs[best]) best = i;
  const rest = probs.filter((_, i) => i !== best);
  const runnerUp = rest.length ? Math.max(...rest) : 0;

  return { intent: model.labels[best], confidence: probs[best], runnerUp };
}

/** Warms the model so the first question does not pay for the fetch. */
export function preloadIntent(locale: Locale): void {
  void load(locale);
}
