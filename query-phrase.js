import { Dictionary } from "./lib/dictionary.js";
import { pathTo, readLines } from "./lib/io.js";
import { findWords } from "./lib/text.js";

const dict = await Dictionary.read();

const forms = new Set(dict.query("cofnąć", 0, 0).map((word) => word.form));

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
