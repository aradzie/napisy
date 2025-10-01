import { findFiles, readLines } from "./io.js";
import { Word } from "./word.js";

export class LemmataIndex {
  static async read(blacklist) {
    const index = new LemmataIndex();
    for await (const path of findFiles("corpus", "corpus*-lemmata.txt")) {
      console.log(`Reading lemmata from ${path}`);
      for await (const line of readLines(path)) {
        const words = Word.parseWords(line);
        if (words.every((word) => word.upos === "PUNCT" || blacklist.good(word.form))) {
          index.indexPhrase(words);
        }
      }
    }
    return index;
  }

  #dict = new Map();

  indexPhrase(words) {
    const seen = new Set();
    for (const word of words) {
      const { lemma, upos } = word;
      if (upos === "NOUN" || upos === "VERB") {
        if (!seen.has(lemma)) {
          seen.add(lemma);
          let phrases = this.#dict.get(lemma);
          if (phrases == null) {
            this.#dict.set(lemma, (phrases = []));
          }
          phrases.push(words);
        }
      }
    }
  }

  getPhrases(lemma) {
    return this.#dict.get(lemma) ?? [];
  }
}
