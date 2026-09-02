/**
 * Asserts the browser's feature extraction matches the trainer's, bucket for
 * bucket. A drift here would not throw — it would just make every prediction
 * slightly wrong — so it is checked rather than assumed.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

// Read the geometry from the trained model rather than repeating it, so a
// change to BUCKETS in the trainer cannot make this test disagree with both
// implementations at once.
const model = JSON.parse(readFileSync("public/models/intent-en.json", "utf8"));
const { buckets, ngram } = model;

const CASES = [
  "are you free in September?", "quels sont vos tarifs ?", "Qu'avez-vous fait chez Technis",
  "what do you know about react", "parle moi de britch", "who are you?",
  "ETES-VOUS DISPONIBLE", "comment vous joindre ?", "react native + graphql",
  "disponibilite", "où avez-vous étudié", "a", "",
];

function normalise(t){return t.toLowerCase().normalize("NFD").replace(/\p{Mn}/gu,"").replace(/[^\p{L}\p{N}]/gu," ");}
function hash(tok,b){let h=2166136261;for(let i=0;i<tok.length;i++){h^=tok.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}return h%b;}
function features(text,buckets,nMin,nMax){
  const c=new Map();
  const add=t=>{const i=hash(t,buckets);c.set(i,(c.get(i)??0)+1);};
  for(const w of normalise(text).split(/\s+/)){
    if(!w)continue; add(`#${w}#`);
    const p=`<${w}>`;
    for(let n=nMin;n<=nMax;n++) for(let i=0;i+n<=p.length;i++) add(p.slice(i,i+n));
  }
  let s=0; for(const v of c.values()) s+=v*v;
  const nf=Math.sqrt(s)||1;
  for(const[k,v]of c) c.set(k,v/nf);
  return c;
}

const py = JSON.parse(execFileSync("python3", ["-c", `
import sys, json
sys.path.insert(0, "ml")
from train import features
cases = json.loads(sys.argv[1])
print(json.dumps([sorted((int(k), round(v, 9)) for k, v in features(c).items()) for c in cases]))
`, JSON.stringify(CASES)], { encoding: "utf8" }));

let bad = 0;
CASES.forEach((c, i) => {
  const js = [...features(c, buckets, ngram[0], ngram[1])].map(([k,v])=>[k,Math.round(v*1e9)/1e9]).sort((a,b)=>a[0]-b[0]);
  const same = JSON.stringify(js) === JSON.stringify(py[i]);
  if (!same) { bad++; console.log(`  MISMATCH ${JSON.stringify(c)}: js=${js.length} py=${py[i].length}`); }
});
console.log(bad === 0
  ? `parity OK — ${CASES.length} cases at ${buckets} buckets, identical`
  : `${bad} MISMATCHES`);
process.exit(bad ? 1 : 0);
