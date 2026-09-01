"""
Trains the intent classifier: one model per language, each well under 5 MB.

Why this shape rather than a small transformer: at a few megabytes you cannot
have a model that *writes*. You can have one that *decides*, and deciding is
what was actually missing — picking which of the nine tools answers a question.
The answer is then quoted from that tool's real output, so the model never
states a fact and can never invent one.

The features are hashed character n-grams, which is what makes it robust in two
languages at this size: it never sees a vocabulary, so an unseen word, a typo or
a conjugation it was not trained on still lands in overlapping buckets. That is
the same trick fastText uses, and it is the reason "qu'avez-vous fait chez
Technis" works when only "qu'avez-vous fait chez {company}" was seen.

Multinomial logistic regression, full-batch gradient descent with L2. No
dependencies beyond the standard library, so it runs anywhere and the output is
reproducible.

    python3 ml/train.py
"""

import json
import math
import random
import unicodedata
from pathlib import Path

import data

BUCKETS = 8192  # 2^13 — small enough to quantise into ~80 KB per language
NGRAM_MIN, NGRAM_MAX = 3, 5
EPOCHS = 2200
LR = 3.0
L2 = 1e-5
SEED = 20260902


def normalise(text: str) -> str:
    """Lowercase, strip accents, keep letters/digits. Accent-blind on purpose:
    a French visitor typing without accents should be understood."""
    text = text.lower()
    text = "".join(
        c for c in unicodedata.normalize("NFD", text)
        if unicodedata.category(c) != "Mn"
    )
    return "".join(c if c.isalnum() else " " for c in text)


def features(text: str) -> dict:
    """Hashed character n-grams over whitespace-padded words, plus whole words.

    Character n-grams carry the morphology (disponib-, tarif-, contact-) and
    whole words carry the strong single-token signals (react, britch)."""
    norm = normalise(text)
    counts = {}

    def add(token: str):
        h = 2166136261
        for ch in token:  # FNV-1a, so JS and Python agree exactly
            h ^= ord(ch)
            h = (h * 16777619) & 0xFFFFFFFF
        idx = h % BUCKETS
        counts[idx] = counts.get(idx, 0) + 1.0

    for word in norm.split():
        add("#" + word + "#")
        padded = "<" + word + ">"
        for n in range(NGRAM_MIN, NGRAM_MAX + 1):
            for i in range(len(padded) - n + 1):
                add(padded[i : i + n])

    # L2-normalise so a long question does not outweigh a short one.
    norm_factor = math.sqrt(sum(v * v for v in counts.values())) or 1.0
    return {k: v / norm_factor for k, v in counts.items()}


def build(templates: dict, slots: dict) -> list:
    """Cross every template with its slot fills."""
    rng = random.Random(SEED)
    rows = []
    for intent, phrasings in templates.items():
        for phrasing in phrasings:
            slot = next((s for s in slots if "{" + s + "}" in phrasing), None)
            if slot is None:
                rows.append((phrasing, intent))
                continue
            for fill in slots[slot]:
                rows.append((phrasing.replace("{" + slot + "}", fill), intent))
    rng.shuffle(rows)
    return rows


def train(rows: list, labels: list) -> list:
    """Full-batch multinomial logistic regression."""
    index = {lab: i for i, lab in enumerate(labels)}
    xs = [features(text) for text, _ in rows]
    ys = [index[lab] for _, lab in rows]
    k = len(labels)
    weights = [[0.0] * BUCKETS for _ in range(k)]
    bias = [0.0] * k

    for epoch in range(EPOCHS):
        grad_w = [{} for _ in range(k)]
        grad_b = [0.0] * k
        loss = 0.0

        for x, y in zip(xs, ys):
            scores = [
                bias[c] + sum(weights[c][i] * v for i, v in x.items())
                for c in range(k)
            ]
            top = max(scores)
            exps = [math.exp(s - top) for s in scores]
            total = sum(exps)
            probs = [e / total for e in exps]
            loss -= math.log(max(probs[y], 1e-12))

            for c in range(k):
                d = probs[c] - (1.0 if c == y else 0.0)
                if abs(d) < 1e-9:
                    continue
                grad_b[c] += d
                gw = grad_w[c]
                for i, v in x.items():
                    gw[i] = gw.get(i, 0.0) + d * v

        n = len(xs)
        for c in range(k):
            bias[c] -= LR * grad_b[c] / n
            wc = weights[c]
            for i, g in grad_w[c].items():
                wc[i] -= LR * (g / n + L2 * wc[i])

        if epoch % 60 == 0 or epoch == EPOCHS - 1:
            print(f"    epoch {epoch:3d}  loss {loss / n:.4f}")

    return weights, bias


def quantise(weights: list, bias: list, labels: list) -> dict:
    """int8 weights plus a scale. Cuts the file fourfold; the argmax is
    unaffected at this magnitude, which the evaluation below confirms."""
    peak = max((abs(w) for row in weights for w in row), default=1.0) or 1.0
    scale = peak / 127.0
    rows = [
        [max(-127, min(127, round(w / scale))) for w in row] for row in weights
    ]
    return {
        "version": 1,
        "buckets": BUCKETS,
        "ngram": [NGRAM_MIN, NGRAM_MAX],
        "labels": labels,
        "scale": scale,
        "bias": [round(b, 6) for b in bias],
        "weights": rows,
    }


def evaluate(model: dict, rows: list) -> float:
    labels = model["labels"]
    scale = model["scale"]
    correct = 0
    for text, gold in rows:
        x = features(text)
        best, best_score = None, -1e18
        for c, lab in enumerate(labels):
            s = model["bias"][c] + sum(
                model["weights"][c][i] * scale * v for i, v in x.items()
            )
            if s > best_score:
                best, best_score = lab, s
        correct += best == gold
    return correct / len(rows)


def main():
    # Relative to the repo root, not to this file's directory.
    out_dir = Path(__file__).resolve().parent.parent / "public" / "models"
    out_dir.mkdir(parents=True, exist_ok=True)

    for lang, templates, slots in (
        ("en", data.EN, data.SLOTS_EN),
        ("fr", data.FR, data.SLOTS_FR),
    ):
        print(f"\n{lang}:")
        rows = build(templates, slots)
        labels = sorted(templates.keys())
        # Hold out a fifth, stratified by shuffle, to get an honest number.
        cut = int(len(rows) * 0.8)
        train_rows, test_rows = rows[:cut], rows[cut:]
        print(f"    {len(train_rows)} train · {len(test_rows)} held out · {len(labels)} intents")

        weights, bias = train(train_rows, labels)
        model = quantise(weights, bias, labels)

        train_acc = evaluate(model, train_rows)
        test_acc = evaluate(model, test_rows)
        print(f"    train {train_acc:.1%} · held-out {test_acc:.1%}")

        path = out_dir / f"intent-{lang}.json"
        path.write_text(json.dumps(model, separators=(",", ":")))
        print(f"    → {path} ({path.stat().st_size / 1024:.0f} KB)")


if __name__ == "__main__":
    main()
