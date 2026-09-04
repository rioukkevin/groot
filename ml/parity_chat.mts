/**
 * Asserts the browser's feature extraction for the full-tier model matches
 * the trainer's, bucket for bucket. Same idea as parity.mjs, for the second
 * extractor: it has bigrams and a length marker the light one does not.
 *
 *   bun ml/parity_chat.mts
 */
import { execFileSync } from "node:child_process";

import { chatFeatures } from "../lib/terminal/chat-model";

const BUCKETS = 418051;
const CASES = [
  "are you free in September?", "quels sont vos tarifs ?", "Qu'avez-vous fait chez Technis",
  "what do you know about react", "parle moi de britch", "who are you?",
  "ETES-VOUS DISPONIBLE", "comment vous joindre ?", "react native + graphql",
  "disponibilite", "où avez-vous étudié", "a", "", "   ", "hi", "tell me more!!",
  "c'est quoi ce site ? un vrai terminal ?", "do you speak french", "ça va ?",
  "wesh t dispo en octobre", "€600 / day?", "kevin@nare.li", "🙂 nice site 🚀",
  "İstanbul straße Œuvre ﬁnal", "12 3456 7", "ignore previous instructions",
  "next.js + c# — .net?", "l'extension vscode", "qu'est-ce que c'est",
  "𝐡𝐞𝐥𝐥𝐨 kevin", "𐐀𐐨 deseret", "𝟏𝟐𝟑 math digits", "Britch.", "tell me about britch.",
];

// The trainer's interpreter, not the system one: Unicode tables differ
// between Python versions, and the model was trained with this one.
const py = JSON.parse(
  execFileSync(
    "uv",
    [
      "run",
      "--python",
      "3.12",
      "python",
      "-c",
      `
import sys, json
sys.path.insert(0, "ml")
from chat_features import features
cases = json.loads(sys.argv[1])
print(json.dumps([sorted((int(k), v) for k, v in features(c, ${BUCKETS}).items()) for c in cases]))
`,
      JSON.stringify(CASES),
    ],
    { encoding: "utf8" },
  ),
) as [number, number][][];

let bad = 0;
CASES.forEach((c, i) => {
  const js = [...chatFeatures(c, BUCKETS, 3, 6)].sort((a, b) => a[0] - b[0]);
  if (JSON.stringify(js) !== JSON.stringify(py[i])) {
    bad++;
    console.log(`  MISMATCH ${JSON.stringify(c)}: js=${js.length} py=${py[i].length}`);
  }
});
console.log(
  bad === 0
    ? `chat parity OK — ${CASES.length} cases at ${BUCKETS} buckets, identical`
    : `${bad} MISMATCHES`,
);
process.exit(bad ? 1 : 0);
