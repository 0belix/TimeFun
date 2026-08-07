import { readFileSync } from "node:fs";

/* Fångar den klass av fel som just uppstod: en animation som pekar på
   keyframes som inte finns. CSS är tyst om det — inget fel syns någonstans,
   rörelsen uteblir bara. */
const CSS_KEYWORDS = new Set(["none", "inherit", "initial", "unset", "revert"]);
let failures = 0;

for (const file of ["index.html", "ordsprak.html"]) {
  const css = readFileSync(file, "utf8").split("<style>")[1]?.split("</style>")[0] ?? "";
  const used = new Set([...css.matchAll(/animation:\s*([a-z][\w-]*)/g)]
    .map((m) => m[1]).filter((name) => !CSS_KEYWORDS.has(name)));
  const defined = new Set([...css.matchAll(/@keyframes\s+([\w-]+)/g)].map((m) => m[1]));

  const missing = [...used].filter((name) => !defined.has(name)).sort();
  const unused = [...defined].filter((name) => !used.has(name)).sort();
  console.log(`${file}: ${used.size} animationer, ${defined.size} keyframes`);
  if (missing.length) { console.log(`  SAKNAR KEYFRAMES: ${missing.join(", ")}`); failures += 1; }
  if (unused.length) console.log(`  oanvända keyframes: ${unused.join(", ")}`);
  if (!missing.length && !unused.length) console.log("  OK — alla animationer har sina keyframes");
}
console.log(failures === 0 ? "\nOK  inga trasiga animationer" : `\nFEL ${failures} fil(er) med trasiga animationer`);
