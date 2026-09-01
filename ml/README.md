# Intent models

Two classifiers, one per language, 144 KB each. They pick which of the site's
tools answers a question; the answer itself is quoted from that tool's real
output, so the model never states a fact and cannot invent one.

```bash
bun run ml:train    # ~75s, writes public/models/intent-{en,fr}.json
bun run ml:parity   # asserts the browser features match the trainer's
```

## Why not a small language model

A model that *writes* fluent, factual prose does not exist at this size —
100 MB is roughly the floor, and that is a per-visitor download. What was
actually missing was not writing but *deciding*: which tool answers this
question. Deciding fits in 144 KB with room to spare.

## How it works

Hashed character n-grams (3–5, plus whole words) into 8192 buckets, feeding
multinomial logistic regression, quantised to int8. Character n-grams are what
make it work in two languages at this size: there is no vocabulary, so an
unseen conjugation, a typo, or a word never in the training data still lands in
overlapping buckets.

Trained on templates crossed with slot fills — `ml/data.py`. Held-out accuracy
is 91% (en) and 87% (fr) across eight intents.

## The parity test

`lib/terminal/intent.ts` re-implements the feature extraction in TypeScript.
The two must agree bucket-for-bucket or every prediction degrades silently,
without ever throwing. `ml/parity.mjs` runs the same inputs through both and
asserts the outputs are identical.

## Degradation

If the model 404s or the classifier is under 40% confident, a keyword table
answers instead, and below that a content search. The feature gets worse, never
absent.
