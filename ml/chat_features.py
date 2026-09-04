"""
Feature extraction for the full-tier ("chat") intent model.

Pure Python, no dependencies: `ml/parity_chat.mjs` imports this to check the
browser's TypeScript copy (`lib/terminal/chat-model.ts`) bucket for bucket.

Differences from the light model's `features()` in train.py, all deliberate:
  - character n-grams run 3..6 rather than 3..5, so longer stems survive intact;
  - adjacent word bigrams are added, which is what separates "tell me more"
    from "more detail in general" and "do you know react" from "who are you";
  - a token-count marker, because one-word inputs behave differently from
    sentences and the model should be allowed to know which it is looking at;
  - counts are kept raw — the network mean-pools, so normalisation is its job.

The hash runs over UTF-16 code units, exactly as JavaScript's charCodeAt does,
so an astral character (an emoji that survives normalisation cannot, but
future-proofing is free) hashes identically on both sides.
"""

import struct
import unicodedata

NGRAM_MIN, NGRAM_MAX = 3, 6


def normalise(text: str) -> str:
    """Lowercase, strip combining marks, keep letters and digits (Unicode
    categories L* and N*, the same set as JavaScript's \\p{L}\\p{N})."""
    text = text.lower()
    out = []
    for c in unicodedata.normalize("NFD", text):
        cat = unicodedata.category(c)
        if cat == "Mn":
            continue
        out.append(c if cat[0] in ("L", "N") else " ")
    return "".join(out)


def fnv1a(token: str, buckets: int) -> int:
    """FNV-1a over UTF-16LE code units; `Math.imul(h, 16777619) >>> 0` in JS."""
    b = token.encode("utf-16-le")
    h = 2166136261
    for cu in struct.unpack(f"<{len(b) // 2}H", b):
        h ^= cu
        h = (h * 16777619) & 0xFFFFFFFF
    return h % buckets


def tokens_of(text: str) -> list:
    return normalise(text).split()


def features(text: str, buckets: int) -> dict:
    """Bucket → count. Order does not matter; the pooling is a mean."""
    counts = {}

    def add(token: str):
        i = fnv1a(token, buckets)
        counts[i] = counts.get(i, 0) + 1

    toks = tokens_of(text)
    for w in toks:
        add("#" + w + "#")
        padded = "<" + w + ">"
        for n in range(NGRAM_MIN, NGRAM_MAX + 1):
            for i in range(len(padded) - n + 1):
                add(padded[i : i + n])
    for a, b in zip(toks, toks[1:]):
        add(a + "_" + b)
    add("__n" + str(min(len(toks), 8)))
    return counts
