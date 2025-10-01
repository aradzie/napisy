import { pathTo, readLines } from "./lib/io.js";
import { Morpholog } from "./lib/morpholog.js";
import { findWords } from "./lib/text.js";

const morpholog = await Morpholog.load();

const forms = new Set(morpholog.query("cofnąć", 0, 0).map((word) => word.form));

for await (const line of readLines(pathTo("corpus/corpus1.txt"))) {
  if (matches(line)) {
    console.log(line);
  }
}

function matches(line) {
  for (const word of findWords(line)) {
    if (forms.has(word.toLocaleLowerCase("pl"))) {
      return true;
    }
  }
  return false;
}
