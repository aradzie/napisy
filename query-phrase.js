import { pathTo, readLines } from "./lib/io.js";
import { Phrase, Word } from "./lib/word.js";

const lines = await Array.fromAsync(readLines(pathTo("corpus/corpus_lemmata.txt")));
for (const line of lines) {
  checkPhrase(Word.parseWords(line), "cofnąć");
}

function checkPhrase(words, lemma) {
  if (phraseContains(words, lemma)) {
    showPhrase(words, lemma);
  }
}

function phraseContains(words, lemma) {
  for (const word of words) {
    if (word.lemma === lemma) {
      return true;
    }
  }
}

function showPhrase(words, lemma) {
  const phrase = new Phrase();
  for (const word of words) {
    if (word.lemma === lemma) {
      phrase.push(word);
    } else {
      phrase.push(word.form);
    }
  }
  console.log(String(phrase));
}
