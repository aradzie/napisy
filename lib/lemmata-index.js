import { findFiles, readLines } from "./io.js";
import { Word } from "./word.js";

export class LemmataIndex {
  static async load(blacklist) {
    const index = new LemmataIndex();
    for await (const path of findFiles("corpus", "corpus*-lemmata.txt")) {
      console.log(`Loading a lemmata file "${path}"`);
      for await (const line of readLines(path)) {
        const words = Word.parseWords(line);
        if (words.every((word) => word.upos === "PUNCT" || blacklist.good(word.form))) {
          index.indexPhrase(words);
        }
      }
    }
    return index;
  }

  #verb = new Map();
  #noun = new Map();
  #adj = new Map();
  #adv = new Map();
  #etc = new Map();

  indexPhrase(phrase) {
    const seen = new Set();
    for (const word of phrase) {
      const { lemma, upos } = word;
      if (!seen.has(lemma)) {
        seen.add(lemma);
        let phrases = this.#getDict(upos).get(lemma);
        if (phrases == null) {
          this.#getDict(upos).set(lemma, (phrases = []));
        }
        phrases.push(phrase);
      }
    }
  }

  getPhrases(pos, lemma) {
    return this.#getDict(pos).get(lemma) ?? [];
  }

  #getDict(pos) {
    switch (pos) {
      case "VERB":
        return this.#verb;
      case "NOUN":
        return this.#noun;
      case "ADJ":
        return this.#adj;
      case "ADV":
        return this.#adv;
      default:
        return this.#etc;
    }
  }
}
