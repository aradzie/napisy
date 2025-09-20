import { pathTo, readLines } from "./lib/io.js";
import { Phrase, Word } from "./lib/word.js";
import { parseTags } from "./lib/xtags.js";

const lines = await Array.fromAsync(readLines(pathTo("corpus/corpus_lemmata.txt")));
for (const line of lines) {
  checkPhrase(parseWords(line), "cofnąć");
}

function parseWords(line) {
  const words = [];
  for (const word of line.split("|")) {
    const [text, lemma, upos0, xpos0] = word.split("/");
    const { xpos, xext } = parseTags(xpos0);
    words.push(new Word(lemma, text, xpos, xext, upos0));
  }
  return words;
}

function checkPhrase(words, lemma) {
  if (phraseContains(words, lemma)) {
    showPhrase(words, lemma);
  }
}

function phraseContains(words, lemma) {
  for (const word of words) {
    if (word.stem === lemma) {
      return true;
    }
  }
}

function showPhrase(words, lemma) {
  const phrase = new Phrase();
  for (const word of words) {
    if (word.stem === lemma) {
      phrase.push(word);
    } else {
      phrase.push(word.form);
    }
  }
  console.log(String(phrase));
}
