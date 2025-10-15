import { pathTo, readLines } from "./lib/io.js";
import { Lemmata } from "./lib/lemmata.js";
import { Phrase } from "./lib/word.js";

const lines = await Array.fromAsync(readLines(pathTo("corpus/corpus1-lemmata.txt")));
for (const line of lines.slice(0, 10)) {
  console.log(parsePhrase(line));
}

function parsePhrase(line) {
  const phrase = new Phrase();
  for (const word of Lemmata.parseLine(line)) {
    const { form, pos } = word;
    switch (pos) {
      case "NOUN": {
        phrase.push(word);
        break;
      }
      case "ADJ": {
        phrase.push(word);
        break;
      }
      default: {
        phrase.push(form);
      }
    }
  }
  return phrase.print();
}
