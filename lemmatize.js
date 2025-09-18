import { pathTo, readLines } from "./lib/io.js";
import { Phrase, Word } from "./lib/word.js";
import { parseTags } from "./lib/xtags.js";

function parsePhrase(line) {
  const phrase = new Phrase();
  const words = line.split("|");
  for (const word of words) {
    const [text, lemma, upos0, xpos0] = word.split("/");
    switch (upos0) {
      case "NOUN": {
        const { xpos, xext } = parseTags(xpos0);
        phrase.push(new Word(lemma, text, xpos, xext, upos0));
        break;
      }
      case "ADJ": {
        const { xpos, xext } = parseTags(xpos0);
        phrase.push(new Word(lemma, text, xpos, xext, upos0));
        break;
      }
      default: {
        phrase.push(text);
      }
    }
  }
  return String(phrase);
}

const lines = await Array.fromAsync(readLines(pathTo("corpus/lemmas.txt")));
for (const line of lines.slice(0, 10)) {
  console.log(parsePhrase(line));
}
