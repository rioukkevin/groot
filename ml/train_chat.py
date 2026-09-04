"""
Trains the full-tier intent model: one per language, sized to fill 6.70 MB.

    uv run --python 3.12 --with numpy python ml/train_chat.py          # both
    uv run --python 3.12 --with numpy python ml/train_chat.py fr       # one

Why a second, larger model when a 200 KB one already routes questions: the
light one knows nine intents and is trained on a few hundred templates. This
one knows twenty-nine — the conversational turns (hello, thanks, tell me more,
do you speak French) and every command — and is trained on tens of thousands of
noised variants, so a typo, a lead-in, a text-message spelling or a question in
the other language still lands. It is the model the shell swaps to once the
page has finished loading; the light one answers until then.

Architecture, fastText-shaped: hashed character n-grams, words, word bigrams
→ an int8 embedding table (this is where the bytes go) → mean pool → a small
ReLU layer → softmax over the intents. The table is sized from the byte budget
downwards: more buckets means fewer hash collisions, which is the one thing
that gets better with size at this scale.

The model decides; it never writes. Facts come from the tools it routes to.
"""

import hashlib
import json
import math
import random
import re
import struct
import sys
import time
from pathlib import Path

import numpy as np

import chat_augment as A
import chat_features as F
import data as light_data

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "ml" / "data"
OUT = ROOT / "public" / "models"
REPORT = ROOT / "ml" / "out"

BUDGET = 6_700_000  # bytes per file, the number the whole design is sized to
HEADER_BYTES = 2048  # fixed, so the bucket count can be derived exactly
DIM = 16
HIDDEN = 48
NGRAM = (F.NGRAM_MIN, F.NGRAM_MAX)

SEED = 20260904
EPOCHS = 14
BATCH = 256
LR_EMB = 0.012
LR_HEAD = 0.003
FEATURE_DROPOUT = 0.25
LABEL_SMOOTH = 0.05
WEIGHT_DECAY = 1e-4
MIN_ROWS, MAX_ROWS = 1400, 4800  # per intent, primary language
SECONDARY_SHARE = 0.45  # how much of the other language each model also learns
HELD_OUT_TEMPLATES = 0.15

LABELS = sorted(
    [
        "get_profile", "get_availability", "get_rates", "get_contact", "get_email",
        "list_roles", "get_role", "list_projects", "get_project", "get_skills",
        "get_soft_skills", "get_education", "get_photos", "get_resume",
        "set_theme", "set_voice", "help", "clear",
        "greeting", "thanks", "goodbye", "how_are_you", "about_site",
        "compliment", "affirm", "deny", "more", "language", "unknown",
    ]
)
LABEL_INDEX = {l: i for i, l in enumerate(LABELS)}
LANGS = ("en", "fr")


# ── size ──────────────────────────────────────────────────────────────────


def is_prime(n: int) -> bool:
    if n < 2:
        return False
    if n % 2 == 0:
        return n == 2
    for d in range(3, int(n**0.5) + 1, 2):
        if n % d == 0:
            return False
    return True


def head_floats(dim: int, hidden: int, classes: int) -> int:
    return hidden * dim + hidden + classes * hidden + classes


def bucket_count() -> int:
    """The largest prime that fits: budget less magic, length, header, head."""
    fixed = 4 + 4 + HEADER_BYTES + 4 * head_floats(DIM, HIDDEN, len(LABELS))
    n = (BUDGET - fixed) // DIM
    while not is_prime(n):
        n -= 1
    return n


BUCKETS = bucket_count()
# The browser reads the head as a Float32Array view, which needs a 4-aligned
# offset; that holds because DIM and HEADER_BYTES are multiples of 4, and this
# says so before an hour of training rather than after.
if (8 + HEADER_BYTES + BUCKETS * DIM) % 4:
    raise SystemExit("head offset is not 4-aligned; make DIM or HEADER_BYTES a multiple of 4")


# ── data ──────────────────────────────────────────────────────────────────


def load_templates(lang: str) -> dict:
    merged = {l: [] for l in LABELS}
    for path in sorted((DATA / lang).glob("templates.*.json")):
        for intent, lines in json.loads(path.read_text()).items():
            if intent not in LABEL_INDEX:
                raise SystemExit(f"{path}: unknown intent {intent!r}")
            merged[intent].extend(lines)
    unknown = json.loads((DATA / lang / "unknown.json").read_text())
    # The light model's out-of-scope list, minus the one- and two-word lines
    # that the new conversation intents now own (hello, thanks, ok, non…).
    legacy = light_data.OUT_OF_SCOPE_EN if lang == "en" else light_data.OUT_OF_SCOPE_FR
    unknown += [l for l in legacy if len(l.split()) >= 3]
    merged["unknown"] = list(dict.fromkeys(unknown))
    for intent in LABELS:
        # Dedupe on what the model sees — "who are you" and "who are you?" are
        # one template — and refuse a line that normalises to nothing, which
        # would teach the empty-input marker an intent.
        by_key = {}
        for line in merged[intent]:
            line = line.strip()
            if not line:
                continue
            key = " ".join(F.tokens_of(line))
            if not key:
                raise SystemExit(f"{lang}/{intent}: no tokens after normalise: {line!r}")
            by_key.setdefault(key, line)
        merged[intent] = list(by_key.values())
    return merged


def load_questions(lang: str) -> dict:
    """The golden set — questions the way visitors type them, labelled by
    intent (ml/data/<lang>/questions.*.json, also the acceptance test in
    tests/questions.test.ts). Always trained on, never held out: the test
    asks whether the model handles these, not whether it would have."""
    out = {l: [] for l in LABELS}
    for path in sorted((DATA / lang).glob("questions.*.json")):
        for row in json.loads(path.read_text()):
            if row["intent"] not in LABEL_INDEX:
                raise SystemExit(f"{path}: unknown intent {row['intent']!r}")
            if F.tokens_of(row["q"]):
                out[row["intent"]].append(row["q"])
    return out


def load_eval(lang: str) -> list:
    rows = json.loads((DATA / lang / "eval.json").read_text())
    return [(r["text"], r["intent"]) for r in rows if r["intent"] in LABEL_INDEX]


SLOT_RE = re.compile(r"\{(\w+)\}")


def expand(template: str, slots: dict, rng: random.Random, max_fills: int) -> list:
    """Every slot filled, capped, so a {tech} line does not become 56 rows.

    A template with two slots is filled slot by slot; the cap applies to the
    whole template, so two slots share it rather than multiplying it."""
    m = SLOT_RE.search(template)
    if not m:
        return [template]
    values = slots.get(m.group(1))
    if not values:
        return expand(SLOT_RE.sub("", template, count=1).strip(), slots, rng, max_fills)
    more = SLOT_RE.search(template, m.end()) is not None
    cap = max(2, int(math.sqrt(max_fills))) if more else max_fills
    fills = values if len(values) <= cap else rng.sample(values, cap)
    out = []
    for v in fills:
        out.extend(expand(template.replace(m.group(0), v, 1), slots, rng, cap))
    return out


def build_rows(lang: str, templates: dict, slots: dict, rng: random.Random, primary: bool, questions: dict | None = None):
    """(train_rows, held_rows) as lists of (text, label_index).

    Held out by *template*, not by row: two fills of one template are near
    duplicates, and holding out rows would make the number a lie. The golden
    questions join the training side after the cut, so none is held out."""
    lo = MIN_ROWS if primary else int(MIN_ROWS * SECONDARY_SHARE)
    hi = MAX_ROWS if primary else int(MAX_ROWS * SECONDARY_SHARE)
    train, held = [], []
    for intent in LABELS:
        y = LABEL_INDEX[intent]
        tpl = templates[intent][:]
        rng.shuffle(tpl)
        # Only the language being evaluated holds templates out; the other
        # language is there to be learned from, not measured.
        cut = max(3, int(len(tpl) * HELD_OUT_TEMPLATES)) if primary and len(tpl) > 8 else 0
        held_tpl, train_tpl = tpl[:cut], tpl[cut:]
        train_tpl = train_tpl + (questions or {}).get(intent, [])

        def pool_of(tpls, fills):
            out = []
            for t in tpls:
                out.extend(expand(t, slots, rng, fills))
            return out

        pool = pool_of(train_tpl, 18)
        held_pool = pool_of(held_tpl, 6)
        if not pool:
            raise SystemExit(f"{lang}: no templates for {intent}")

        rows = [(p, y) for p in pool]
        # Noised variants until the class is big enough to matter, but never so
        # many that one intent drowns the others.
        target = min(hi, max(lo, len(pool) * 4))
        while len(rows) < target:
            rows.append((A.noise(rng.choice(pool), lang, rng), y))
        if len(rows) > hi:
            rows = rng.sample(rows, hi)
        train.extend(rows)

        held.extend((p, y) for p in held_pool)
        held.extend((A.noise(p, lang, rng), y) for p in held_pool)

    # Keyboard mashing is generated, not hand written; it goes to unknown.
    gib = light_data.gibberish(SEED + (0 if lang == "en" else 1), 320 if primary else 120)
    train.extend((g, LABEL_INDEX["unknown"]) for g in gib)
    rng.shuffle(train)
    return train, held


# ── features ──────────────────────────────────────────────────────────────


def featurise(texts: list):
    """Flat CSR-style arrays: idx, cnt, ptr. Every row has ≥1 feature (the
    token-count marker), which `reduceat` relies on."""
    idx, cnt, ptr = [], [], [0]
    for t in texts:
        f = F.features(t, BUCKETS)
        idx.extend(f.keys())
        cnt.extend(f.values())
        ptr.append(len(idx))
    return (
        np.asarray(idx, dtype=np.int64),
        np.asarray(cnt, dtype=np.float32),
        np.asarray(ptr, dtype=np.int64),
    )


def gather(idx, cnt, ptr, rows):
    parts_i = [idx[ptr[r] : ptr[r + 1]] for r in rows]
    parts_c = [cnt[ptr[r] : ptr[r + 1]] for r in rows]
    lens = np.fromiter((len(p) for p in parts_i), dtype=np.int64, count=len(rows))
    starts = np.concatenate([[0], np.cumsum(lens)[:-1]])
    return np.concatenate(parts_i), np.concatenate(parts_c), starts, lens


# ── model ─────────────────────────────────────────────────────────────────


class Model:
    def __init__(self, rng: np.random.Generator):
        c = len(LABELS)
        self.E = rng.uniform(-1.0 / DIM, 1.0 / DIM, size=(BUCKETS, DIM)).astype(np.float32)
        self.touched = np.zeros(BUCKETS, dtype=bool)
        self.W1 = (rng.standard_normal((HIDDEN, DIM)) * math.sqrt(2.0 / DIM)).astype(np.float32)
        self.b1 = np.zeros(HIDDEN, dtype=np.float32)
        self.W2 = (rng.standard_normal((c, HIDDEN)) * math.sqrt(1.0 / HIDDEN)).astype(np.float32)
        self.b2 = np.zeros(c, dtype=np.float32)

    def pool(self, E, fi, fc, starts, lens):
        emb = E[fi] * fc[:, None]
        X = np.add.reduceat(emb, starts, axis=0)
        tot = np.add.reduceat(fc, starts)
        tot = np.maximum(tot, 1e-6)
        return X / tot[:, None], tot

    def forward(self, X):
        Z1 = X @ self.W1.T + self.b1
        H1 = np.maximum(Z1, 0)
        logits = H1 @ self.W2.T + self.b2
        logits -= logits.max(axis=1, keepdims=True)
        ex = np.exp(logits)
        probs = ex / ex.sum(axis=1, keepdims=True)
        return Z1, H1, probs


class Adam:
    def __init__(self, shape, lr):
        self.m = np.zeros(shape, dtype=np.float32)
        self.v = np.zeros(shape, dtype=np.float32)
        self.lr = lr
        self.t = 0

    def step(self, p, g, lr_scale=1.0, decay=0.0):
        self.t += 1
        b1, b2, eps = 0.9, 0.999, 1e-8
        self.m = b1 * self.m + (1 - b1) * g
        self.v = b2 * self.v + (1 - b2) * g * g
        mh = self.m / (1 - b1**self.t)
        vh = self.v / (1 - b2**self.t)
        p -= self.lr * lr_scale * (mh / (np.sqrt(vh) + eps) + decay * p)


class LazyAdam:
    """Adam that only touches the rows in the batch. The moment arrays are as
    large as the table, which is fine at 27 MB each."""

    def __init__(self, shape, lr):
        self.m = np.zeros(shape, dtype=np.float32)
        self.v = np.zeros(shape, dtype=np.float32)
        # Bias correction per row: a bucket seen twice is on its second step,
        # whatever the batch counter says, or rare n-grams get outsized updates.
        self.n = np.zeros(shape[0], dtype=np.int64)
        self.lr = lr

    def step(self, E, rows, g, lr_scale=1.0):
        b1, b2, eps = 0.9, 0.999, 1e-8
        self.n[rows] += 1
        t = self.n[rows][:, None].astype(np.float32)
        m = self.m[rows]
        v = self.v[rows]
        m = b1 * m + (1 - b1) * g
        v = b2 * v + (1 - b2) * g * g
        self.m[rows] = m
        self.v[rows] = v
        mh = m / (1 - b1**t)
        vh = v / (1 - b2**t)
        E[rows] -= self.lr * lr_scale * mh / (np.sqrt(vh) + eps)


def train(model: Model, feats, labels, held_feats, held_labels, rng: np.random.Generator, log):
    idx, cnt, ptr = feats
    n = len(labels)
    y = np.asarray(labels, dtype=np.int64)
    c = len(LABELS)
    optE = LazyAdam(model.E.shape, LR_EMB)
    opt = {k: Adam(getattr(model, k).shape, LR_HEAD) for k in ("W1", "b1", "W2", "b2")}
    steps_total = EPOCHS * math.ceil(n / BATCH)
    step = 0
    best = (-1.0, None)

    for epoch in range(EPOCHS):
        order = rng.permutation(n)
        loss_sum, seen = 0.0, 0
        t0 = time.time()
        for s in range(0, n, BATCH):
            rows = order[s : s + BATCH]
            fi, fc, starts, lens = gather(idx, cnt, ptr, rows)
            b = len(rows)
            if FEATURE_DROPOUT:
                keep = (rng.random(len(fc)) >= FEATURE_DROPOUT).astype(np.float32)
                fc = fc * keep
            X, tot = model.pool(model.E, fi, fc, starts, lens)
            Z1, H1, probs = model.forward(X)

            target = np.full((b, c), LABEL_SMOOTH / (c - 1), dtype=np.float32)
            target[np.arange(b), y[rows]] = 1.0 - LABEL_SMOOTH
            loss_sum += -float(np.sum(target * np.log(probs + 1e-9)))
            seen += b

            # cosine decay over the run, with a short warm-up
            frac = step / max(1, steps_total)
            lr_scale = min(1.0, (step + 1) / 200) * (0.5 * (1 + math.cos(math.pi * frac)) * 0.9 + 0.1)

            dlog = (probs - target) / b
            gW2 = dlog.T @ H1
            gb2 = dlog.sum(axis=0)
            dH1 = dlog @ model.W2
            dZ1 = dH1 * (Z1 > 0)
            gW1 = dZ1.T @ X
            gb1 = dZ1.sum(axis=0)
            dX = dZ1 @ model.W1  # (b, D)

            seg = np.repeat(np.arange(b), lens)
            demb = dX[seg] * (fc / tot[seg])[:, None]  # (nnz, D)
            u, inv = np.unique(fi, return_inverse=True)
            g = np.zeros((len(u), DIM), dtype=np.float32)
            np.add.at(g, inv, demb)
            optE.step(model.E, u, g, lr_scale)
            model.touched[u] = True

            opt["W1"].step(model.W1, gW1, lr_scale, WEIGHT_DECAY)
            opt["b1"].step(model.b1, gb1, lr_scale)
            opt["W2"].step(model.W2, gW2, lr_scale, WEIGHT_DECAY)
            opt["b2"].step(model.b2, gb2, lr_scale)
            step += 1

        acc = accuracy(model, held_feats, held_labels)
        log(f"    epoch {epoch + 1:2d}/{EPOCHS}  loss {loss_sum / seen:.4f}  held-out {acc:.1%}  ({time.time() - t0:.0f}s)")
        if acc >= best[0]:
            best = (acc, snapshot(model))
    # Keep the best epoch by held-out templates, which is early stopping.
    restore(model, best[1])
    return best[0]


def snapshot(m: Model):
    return {k: getattr(m, k).copy() for k in ("E", "W1", "b1", "W2", "b2", "touched")}


def restore(m: Model, s):
    for k, v in s.items():
        setattr(m, k, v.copy())


def predict_probs(model: Model, E, feats, rows=None, batch=2048):
    idx, cnt, ptr = feats
    n = len(ptr) - 1
    rows = np.arange(n) if rows is None else rows
    out = []
    for s in range(0, len(rows), batch):
        fi, fc, starts, lens = gather(idx, cnt, ptr, rows[s : s + batch])
        X, _ = model.pool(E, fi, fc, starts, lens)
        out.append(model.forward(X)[2])
    return np.concatenate(out) if out else np.zeros((0, len(LABELS)))


def accuracy(model, feats, labels, E=None):
    if not len(labels):
        return 0.0
    probs = predict_probs(model, model.E if E is None else E, feats)
    return float(np.mean(probs.argmax(axis=1) == np.asarray(labels)))


# ── quantisation ──────────────────────────────────────────────────────────


def quantise(model: Model):
    """Per-dimension symmetric int8. Rows never touched in training are
    zeroed: an n-gram the model has never seen should say nothing, not add
    its initialisation noise."""
    E = model.E.copy()
    E[~model.touched] = 0
    clip = np.percentile(np.abs(E[model.touched]), 99.95, axis=0) if model.touched.any() else np.ones(DIM)
    scale = np.maximum(clip / 127.0, 1e-8).astype(np.float32)
    q = np.clip(np.rint(E / scale), -127, 127).astype(np.int8)
    return q, scale


def dequantised(q: np.ndarray, scale: np.ndarray) -> np.ndarray:
    return q.astype(np.float32) * scale


# ── report ────────────────────────────────────────────────────────────────


def gate(probs, min_conf=0.5, min_margin=0.15):
    """The shell's decision rule, so the reported number is the one the
    visitor experiences: below the floors the shell says it is unsure."""
    top = probs.argmax(axis=1)
    srt = np.sort(probs, axis=1)
    conf, second = srt[:, -1], srt[:, -2]
    unsure = (conf < min_conf) | (conf - second < min_margin)
    return top, unsure


def report_eval(model, E, rows, log, title):
    if not rows:
        log(f"    {title}: no rows")
        return 0.0, []
    texts = [t for t, _ in rows]
    gold = np.asarray([LABEL_INDEX[i] for _, i in rows])
    probs = predict_probs(model, E, featurise(texts))
    pred, unsure = gate(probs)
    raw = float(np.mean(pred == gold))
    unknown = LABEL_INDEX["unknown"]
    # After the gate an "unsure" is treated as "unknown", because that is what
    # the shell shows; being unsure about nonsense is therefore right.
    gated = np.where(unsure, unknown, pred)
    gated_acc = float(np.mean(gated == gold))
    soft_pred, soft_unsure = gate(probs, 0.4, 0.12)
    soft_acc = float(np.mean(np.where(soft_unsure, unknown, soft_pred) == gold))
    log(
        f"    {title}: {len(rows)} rows · top-1 {raw:.1%} · gate 0.5/0.15 → {gated_acc:.1%} (unsure {float(unsure.mean()):.1%})"
        f" · gate 0.4/0.12 → {soft_acc:.1%} (unsure {float(soft_unsure.mean()):.1%})"
    )
    mistakes = [
        (texts[i], LABELS[gold[i]], LABELS[gated[i]], float(probs[i].max()))
        for i in range(len(rows))
        if gated[i] != gold[i]
    ]
    per = {}
    for i in range(len(rows)):
        g = LABELS[gold[i]]
        per.setdefault(g, [0, 0])
        per[g][1] += 1
        per[g][0] += int(gated[i] == gold[i])
    weak = sorted(((v[0] / v[1], k, v) for k, v in per.items()))[:6]
    log("      weakest: " + ", ".join(f"{k} {v[0]}/{v[1]}" for _, k, v in weak))
    return gated_acc, mistakes


# ── output ────────────────────────────────────────────────────────────────


def write_model(lang, model, q, scale, stats):
    OUT.mkdir(parents=True, exist_ok=True)
    head = np.concatenate(
        [model.W1.ravel(), model.b1, model.W2.ravel(), model.b2]
    ).astype("<f4")
    header = {
        "version": 2,
        "arch": "embbag-mlp",
        "lang": lang,
        "buckets": BUCKETS,
        "dim": DIM,
        "hidden": HIDDEN,
        "ngram": list(NGRAM),
        "labels": LABELS,
        "embScale": [float(f"{s:.8e}") for s in scale],
        "head": {"w1": [HIDDEN, DIM], "b1": [HIDDEN], "w2": [len(LABELS), HIDDEN], "b2": [len(LABELS)]},
        "trainedAt": time.strftime("%Y-%m-%d"),
        "stats": stats,
    }
    hjson = json.dumps(header, separators=(",", ":")).encode("utf-8")
    if len(hjson) > HEADER_BYTES:
        raise SystemExit(f"header is {len(hjson)} bytes, over the {HEADER_BYTES} reserved")
    hjson = hjson + b" " * (HEADER_BYTES - len(hjson))

    body = b"KRNN" + struct.pack("<I", HEADER_BYTES) + hjson + q.tobytes(order="C") + head.tobytes()
    if len(body) > BUDGET:
        raise SystemExit(f"{lang}: {len(body)} bytes exceeds the {BUDGET} budget")
    digest = hashlib.sha256(body).hexdigest()[:10]
    for old in OUT.glob(f"chat-{lang}.*.bin"):
        old.unlink()
    path = OUT / f"chat-{lang}.{digest}.bin"
    path.write_bytes(body)

    manifest_path = OUT / "chat-manifest.json"
    manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
    manifest[lang] = {
        "file": f"/models/{path.name}",
        "bytes": len(body),
        "buckets": BUCKETS,
        "dim": DIM,
        "hidden": HIDDEN,
        "labels": len(LABELS),
        "trainedAt": header["trainedAt"],
    }
    manifest_path.write_text(json.dumps(manifest, indent=2, sort_keys=True) + "\n")
    return path, len(body)


def dump_predictions(lang, model, E, rows):
    """What the quantised model says on the eval set, for the browser-side
    parity test to compare against."""
    REPORT.mkdir(parents=True, exist_ok=True)
    texts = [t for t, _ in rows]
    probs = predict_probs(model, E, featurise(texts))
    out = [
        {
            "text": t,
            "gold": g,
            "pred": LABELS[int(p.argmax())],
            "p": float(p.max()),
            "p2": float(np.sort(p)[-2]),
        }
        for (t, g), p in zip(rows, probs)
    ]
    (REPORT / f"eval-pred-{lang}.json").write_text(json.dumps(out, ensure_ascii=False, indent=1))


# ── main ──────────────────────────────────────────────────────────────────


def key(text: str) -> str:
    """What the model actually sees of a string, for duplicate detection."""
    return " ".join(F.tokens_of(text))


def run(lang: str, log=print):
    other = "fr" if lang == "en" else "en"
    rng = random.Random(SEED)
    nrng = np.random.default_rng(SEED)
    slots = json.loads((DATA / "slots.json").read_text())

    log(f"\n{lang}: {BUCKETS} buckets × {DIM} dims · {HIDDEN} hidden · {len(LABELS)} intents")
    templates = load_templates(lang)
    log("    templates: " + ", ".join(f"{k} {len(v)}" for k, v in templates.items()))
    other_templates = load_templates(other)
    questions, other_questions = load_questions(lang), load_questions(other)
    log(f"    golden questions: {sum(len(v) for v in questions.values())} {lang} · {sum(len(v) for v in other_questions.values())} {other}")
    train_rows, held_rows = build_rows(lang, templates, slots[lang], rng, primary=True, questions=questions)
    sec_train, _ = build_rows(other, other_templates, slots[other], rng, primary=False, questions=other_questions)
    rows = train_rows + sec_train
    rng.shuffle(rows)
    # A held-out row the model will see anyway, modulo normalisation, is not
    # held out; the other language shares the short ones (ok, merci, hello).
    seen = {key(t) for t, _ in rows}
    held_rows = [r for r in held_rows if key(r[0]) not in seen]
    log(f"    {len(train_rows)} {lang} rows + {len(sec_train)} {other} rows · {len(held_rows)} held-out rows")

    t0 = time.time()
    feats = featurise([t for t, _ in rows])
    held_feats = featurise([t for t, _ in held_rows])
    log(f"    featurised in {time.time() - t0:.0f}s · {len(feats[0]) / len(rows):.0f} features/row · {len(np.unique(feats[0]))} buckets in use")

    model = Model(nrng)
    best = train(model, feats, [y for _, y in rows], held_feats, [y for _, y in held_rows], nrng, log)
    log(f"    best held-out (float) {best:.1%}")

    q, scale = quantise(model)
    Eq = dequantised(q, scale)
    log(f"    quantised held-out {accuracy(model, held_feats, [y for _, y in held_rows], Eq):.1%} · {int(model.touched.sum())} rows carry weight")

    # The eval set was written without sight of the templates, but short
    # questions get written the same way twice ("your email", "merci"). Only
    # the rows the model has never seen, in any language and any noising,
    # measure generalisation — that is the number the header carries.
    everything = seen | {
        key(t)
        for tpls in (templates, other_templates)
        for lines in tpls.values()
        for tpl in lines
        for t in expand(tpl, slots[lang] if tpls is templates else slots[other], rng, 10_000)
    } | {key(q) for qs in (questions, other_questions) for lines in qs.values() for q in lines}
    eval_all = load_eval(lang)
    eval_rows = [r for r in eval_all if key(r[0]) not in everything]
    log(f"    eval: {len(eval_all)} rows, {len(eval_all) - len(eval_rows)} also appear among the templates and are set aside")
    report_eval(model, Eq, eval_all, log, f"eval, every row ({lang})")
    eval_acc, mistakes = report_eval(model, Eq, eval_rows, log, f"eval, unseen rows only ({lang})")
    sec_all = load_eval(other)
    sec_rows = [r for r in sec_all if key(r[0]) not in everything]
    sec_acc, _ = report_eval(model, Eq, sec_rows, log, f"eval, unseen rows only ({other})")
    if mistakes:
        log("    misses:")
        for t, g, p, c in mistakes[:40]:
            log(f"      {g:>16} → {p:<16} {c:.2f}  {t}")
    dump_predictions(lang, model, Eq, eval_rows)

    stats = {
        "rows": len(rows),
        "heldOut": round(float(accuracy(model, held_feats, [y for _, y in held_rows], Eq)), 4),
        "eval": round(eval_acc, 4),
        "evalOther": round(sec_acc, 4),
    }
    path, size = write_model(lang, model, q, scale, stats)
    log(f"    → {path.relative_to(ROOT)} ({size / 1e6:.3f} MB of {BUDGET / 1e6:.2f})")


if __name__ == "__main__":
    which = [a for a in sys.argv[1:] if a in LANGS] or list(LANGS)
    for lang in which:
        run(lang)
