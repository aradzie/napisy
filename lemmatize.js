import { pathTo, readLines } from "./lib/io.js";
import { parseTags } from "./lib/tags.js";
import { Phrase, Word } from "./lib/word.js";

function parsePhrase(line) {
  const phrase = new Phrase();
  const words = line.split("|");
  for (const word of words) {
    const [text, lemma, upos, xpos] = word.split("/");
    switch (upos) {
      case "NOUN": {
        const { tags, decl } = parseTags(xpos);
        phrase.push(new Word(lemma, text, tags, decl, upos));
        break;
      }
      case "ADJ": {
        const { tags, decl } = parseTags(xpos);
        phrase.push(new Word(lemma, text, tags, decl, upos));
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
