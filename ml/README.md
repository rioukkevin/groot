# Intent models

Two tiers of classifier, one model per language in each. They pick which of
the site's tools answers a question; the answer itself is quoted from that
tool's real output, so a model never states a fact and cannot invent one.

| tier  | file                          | size    | intents | when it answers                         |
| ----- | ----------------------------- | ------- | ------- | --------------------------------------- |
| light | `public/models/intent-{lang}.json`   | 200 KB  | 9       | from the first keystroke                |
| full  | `public/models/chat-{lang}.<hash>.bin` | 6.70 MB | 29      | once the page has loaded and gone quiet |

```bash
bun run ml:train          # light tier · ~75s · python3, no dependencies
bun run ml:parity         # light tier · browser features == trainer features
bun run ml:train:chat     # full tier · ~1 min · uv brings numpy
bun run ml:parity:chat    # full tier · browser features == trainer features
bun run ml:eval:chat      # full tier · the shipped .bin, run by the browser code, matches the trainer
```

## Why not a small language model

A model that *writes* fluent, factual prose does not exist at these sizes —
100 MB is roughly the floor, and that is a per-visitor download. What was
actually missing was not writing but *deciding*: which tool answers this
question. Deciding fits in 200 KB; deciding well, with typos, lead-ins,
text-message spellings and the other language mixed in, fits in 6.7 MB.

## The light tier

Hashed character n-grams (3–5, plus whole words) into 10 240 buckets, feeding
multinomial logistic regression, quantised to int8. Trained by `train.py` on
`data.py`: templates crossed with slot fills. Held-out accuracy is 91% (en)
and 87% (fr) across nine intents.

## The full tier

fastText-shaped: hashed character n-grams (3–6), whole words, word bigrams
and a token-count marker → an int8 embedding table → mean pool → a 48-unit
ReLU layer → softmax over 29 intents. The table is 418 051 buckets × 16
dims; that number is derived from the byte budget downwards (the largest
prime that fits), so each file is exactly 6 699 820 bytes. More buckets means
fewer hash collisions, which is the one thing that gets better with size here.

Trained by `train_chat.py` on `data/<lang>/`:

- `templates.*.json` — phrasings per intent, with `{company}` `{project}`
  `{tech}` `{when}` `{work}` placeholders filled from `slots.json`;
- `questions.*.json` — the golden set: a thousand questions per language,
  written the way visitors type them and labelled with intent and slot. They
  are always trained on (never held out) and they are the acceptance test in
  `tests/questions.test.ts`, which asserts the tool calls, the command, the
  lit fact and the rich display for every one of them;
- `unknown.json` — what the site cannot answer, so the model can say so;
- `eval.json` — an independent test set, written without sight of the
  templates. Short questions get written the same way twice ("your email",
  "merci"), so the trainer sets aside every eval row that also appears among
  the templates, in either language, and reports the rest separately. That
  unseen-only number is the one that matters, and the one the header carries.

Each row is noised at build time (`chat_augment.py`): keyboard-aware typos,
lead-ins and tails, a lost word, casing, punctuation. Each model also learns
about half of the other language's rows, because visitors on /fr type English
and vice versa. Held-out is by template, not by row, so the number is honest.

Unseen-only eval, top-1: 95.5% (en, 199 rows) and 97.1% (fr, 208 rows);
every row: 97.4% and 98.1%. The golden set, which the model has trained on,
passes end to end — tools, command, lit fact, display — at 100% (en) and
99.8% (fr); before it was added to training it passed at 72.5% and 78.3%,
which is the honest measure of how far templates alone carried. Below the
shell's confidence floors the model says it is unsure and the answer layer
falls back to topic words, then a content search — being unsure about
nonsense counts as right.

`bun test` runs the golden set and a hand-picked table through the shipped
files and the answer layer, asserting the tool calls, the command, the
highlighted fact and the display blocks (`tests/`). Misses land in
`ml/out/golden-<lang>.json`, ready for the next training round.

### File layout

```
"KRNN" · uint32 LE header length (2048) · JSON header, space-padded ·
int8 table (buckets × dim) · float32 head: w1 (48×16), b1, w2 (29×48), b2
```

The header carries the labels, the per-dimension dequantisation scales and
the training stats. `public/models/chat-manifest.json` points the browser at
the current file; the hash in the name lets `next.config.ts` mark it immutable.

## The hand-over

`lib/terminal/model-tiers.ts` fetches the full model after `load`, on an idle
callback, streaming so the corner of the header can narrate what is arriving
with the file's own numbers. It skips the download under data saver. When the
file has parsed, `classify()` in `lib/terminal/intent.ts` starts using it; the
visitor is not told, except by the better answers.

## The parity tests

`lib/terminal/intent.ts` and `lib/terminal/chat-model.ts` re-implement the two
feature extractors in TypeScript. Each must agree bucket-for-bucket with its
Python original or every prediction degrades silently, without ever throwing.
`parity.mjs` and `parity_chat.mts` run the same inputs through both sides;
`eval_chat.mts` goes further and runs the shipped file through the browser's
inference code, checking every prediction and confidence against the trainer's.

## Degradation

If the full model never arrives, the light one keeps answering. If the light
one 404s, or either is under its floors, a content search answers instead,
and below that the shell says it did not understand. The feature gets worse,
never absent.
