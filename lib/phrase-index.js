import { readLines } from "./io.js";
import { Lemmata } from "./lemmata.js";

export class PhraseIndex {
  static async load(blacklist) {
    const index = new PhraseIndex();
    for (const path of await Lemmata.findFiles()) {
      console.log(`Loading a lemmata file "${path}"`);
      for await (const line of readLines(path)) {
        const words = Lemmata.parseLine(line);
        if (words.every((word) => word.pos === "PUNCT" || blacklist.good(word.form))) {
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
      const { lemma, pos } = word;
      if (!seen.has(lemma)) {
        seen.add(lemma);
        let phrases = this.#getDict(pos).get(lemma);
        if (phrases == null) {
          this.#getDict(pos).set(lemma, (phrases = []));
        }
        phrases.push(words);
      }
    }
  }

  getPhrases(pos, lemma) {
    return this.#getDict(pos).get(lemma) ?? [];
  }

  #getDict(pos) {
    let dict = this.#dict.get(pos);
    if (dict == null) {
      this.#dict.set(pos, (dict = new Map()));
    }
    return dict;
  }
}
