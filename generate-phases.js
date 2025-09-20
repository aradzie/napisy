import { pathTo, readLines } from "./lib/io.js";
import { Phrase, Word } from "./lib/word.js";

const lines = await Array.fromAsync(readLines(pathTo("corpus/corpus_lemmata.txt")));
for (const line of lines.slice(0, 10)) {
  console.log(parsePhrase(line));
}

function parsePhrase(line) {
  const phrase = new Phrase();
  for (const word of Word.parseWords(line)) {
    const { form, upos } = word;
    switch (upos) {
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
