import { findFiles, readLines } from "./io.js";

export class Dict {
  static async load(dict = new Dict()) {
    for await (const path of findFiles("corpus", "dict-*.txt")) {
      console.log(`Loading a dictionary file "${path}"`);
      for await (const line of readLines(path)) {
        const [s1, s2, s3] = line.split("|", 3);
        const lemma = s1.trim();
        const pos = s2.trim();
        const translations = s3
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        if (translations.length > 0) {
          dict.add(pos, lemma, translations);
        }
      }
    }
    return dict;
  }

  #verb = new Map();
  #noun = new Map();
  #adj = new Map();
  #adv = new Map();
  #etc = new Map();

  get(pos, lemma) {
    return this.#getDict(pos).get(lemma) ?? null;
  }

  add(pos, lemma, translations) {
    this.#getDict(pos).set(lemma, { lemma, pos, translations });
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
