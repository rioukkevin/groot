/**
 * The full-tier intent model: a fastText-shaped network trained by
 * `ml/train_chat.py`, one per language, 6.7 MB each.
 *
 * It arrives after the page has loaded and quietly replaces the light model
 * for every question that follows. Twenty-nine intents rather than nine: the
 * conversational turns (hello, thanks, tell me more, do you speak French) and
 * every command, trained on tens of thousands of noised variants so a typo, a
 * lead-in or a question in the other language still lands.
 *
 * Like the light model it decides and never writes. The words come from the
 * site's tools and commands.
 *
 * File layout (`write_model` in the trainer):
 *   "KRNN" · uint32 LE header length · JSON header, space-padded ·
 *   int8 table, buckets × dim · float32 head: w1, b1, w2, b2
 *
 * `features()` must match `ml/chat_features.py` bucket for bucket; the check
 * is `ml/parity_chat.mjs`, and `ml/eval_chat.mts` runs the whole model here
 * against the trainer's own predictions.
 */

export interface ChatHeader {
  version: number;
  arch: string;
  lang: string;
  buckets: number;
  dim: number;
  hidden: number;
  ngram: [number, number];
  labels: string[];
  embScale: number[];
  head: { w1: [number, number]; b1: [number]; w2: [number, number]; b2: [number] };
  trainedAt: string;
  stats: { rows: number; heldOut: number; eval: number; evalOther: number };
}

export interface ChatModel {
  header: ChatHeader;
  table: Int8Array;
  w1: Float32Array;
  b1: Float32Array;
  w2: Float32Array;
  b2: Float32Array;
}

const MAGIC = "KRNN";

/**
 * Reads just the header out of the first bytes of the file, so the loader
 * can tell the visitor what is arriving while it is still arriving. Returns
 * null until enough bytes are in.
 */
export function peekHeader(bytes: Uint8Array): ChatHeader | null {
  if (bytes.length < 8) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const len = view.getUint32(4, true);
  if (bytes.length < 8 + len) return null;
  return JSON.parse(new TextDecoder().decode(bytes.subarray(8, 8 + len))) as ChatHeader;
}

export function parseChatModel(buf: ArrayBuffer): ChatModel {
  const bytes = new Uint8Array(buf);
  const magic = String.fromCharCode(...bytes.subarray(0, 4));
  if (magic !== MAGIC) throw new Error(`not a model file (${magic})`);
  const header = peekHeader(bytes);
  if (!header) throw new Error("truncated header");
  if (header.version !== 2 || header.arch !== "embbag-mlp") {
    throw new Error(`unsupported model ${header.arch} v${header.version}`);
  }
  const headerLen = new DataView(buf).getUint32(4, true);
  let offset = 8 + headerLen;

  const tableLen = header.buckets * header.dim;
  const table = new Int8Array(buf, offset, tableLen);
  offset += tableLen;

  const take = (n: number) => {
    // The trainer keeps this offset 4-aligned; a Float32Array view needs it.
    const a = new Float32Array(buf, offset, n);
    offset += n * 4;
    return a;
  };
  const { w1, b1, w2, b2 } = header.head;
  const model: ChatModel = {
    header,
    table,
    w1: take(w1[0] * w1[1]),
    b1: take(b1[0]),
    w2: take(w2[0] * w2[1]),
    b2: take(b2[0]),
  };
  if (offset !== buf.byteLength) throw new Error("model file has trailing bytes");
  return model;
}

/** Mirrors `normalise()` in ml/chat_features.py. */
function normalise(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Mn}/gu, "")
    .replace(/[^\p{L}\p{N}]/gu, " ");
}

/** FNV-1a over UTF-16 code units, then modulo. */
function hash(token: string, buckets: number): number {
  let h = 2166136261;
  for (let i = 0; i < token.length; i++) {
    h ^= token.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h % buckets;
}

/** Bucket → count: character n-grams, words, word bigrams, a length marker. */
export function chatFeatures(
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
  const toks = normalise(text).split(/\s+/).filter(Boolean);
  for (const w of toks) {
    add(`#${w}#`);
    // Sliced by code point, as Python slices, so a letter outside the BMP
    // (which normalise keeps) yields the same n-grams on both sides.
    const padded = [...`<${w}>`];
    for (let n = nMin; n <= nMax; n++) {
      for (let i = 0; i + n <= padded.length; i++) add(padded.slice(i, i + n).join(""));
    }
  }
  for (let i = 0; i + 1 < toks.length; i++) add(`${toks[i]}_${toks[i + 1]}`);
  add(`__n${Math.min(toks.length, 8)}`);
  return counts;
}

export interface ChatPrediction {
  intent: string;
  confidence: number;
  runnerUp: number;
  /** The runner-up's label, for the shell to reason about near ties. */
  second: string;
}

export function predictChat(model: ChatModel, text: string): ChatPrediction {
  const { header, table } = model;
  const D = header.dim;
  const x = chatFeatures(text, header.buckets, header.ngram[0], header.ngram[1]);

  // Mean-pooled embedding, dequantised per dimension.
  const pooled = new Float64Array(D);
  let total = 0;
  for (const [bucket, count] of x) {
    const base = bucket * D;
    for (let d = 0; d < D; d++) pooled[d] += table[base + d] * count;
    total += count;
  }
  const denom = Math.max(total, 1e-6);
  for (let d = 0; d < D; d++) pooled[d] = (pooled[d] * header.embScale[d]) / denom;

  const H = header.hidden;
  const hidden = new Float64Array(H);
  for (let h = 0; h < H; h++) {
    let s = model.b1[h];
    const row = h * D;
    for (let d = 0; d < D; d++) s += model.w1[row + d] * pooled[d];
    hidden[h] = s > 0 ? s : 0;
  }

  const C = header.labels.length;
  const logits = new Float64Array(C);
  let top = -Infinity;
  for (let c = 0; c < C; c++) {
    let s = model.b2[c];
    const row = c * H;
    for (let h = 0; h < H; h++) s += model.w2[row + h] * hidden[h];
    logits[c] = s;
    if (s > top) top = s;
  }
  let sum = 0;
  for (let c = 0; c < C; c++) {
    logits[c] = Math.exp(logits[c] - top);
    sum += logits[c];
  }
  let best = 0;
  let second = -1;
  for (let c = 0; c < C; c++) {
    logits[c] /= sum;
    if (logits[c] > logits[best]) {
      second = best;
      best = c;
    } else if (c !== best && (second < 0 || logits[c] > logits[second])) {
      second = c;
    }
  }
  return {
    intent: header.labels[best],
    confidence: logits[best],
    runnerUp: second >= 0 ? logits[second] : 0,
    second: second >= 0 ? header.labels[second] : header.labels[best],
  };
}
