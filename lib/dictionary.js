import { findFiles, readLines } from "./io.js";

export class Dictionary {
  static async load(dictionary = new Dictionary()) {
    const list = [];
    for await (const path of findFiles("corpus", "dict-*.txt")) {
      console.log(`Loading a dictionary file "${path}"`);
      for await (let line of readLines(path)) {
        const index = line.indexOf(";");
        if (index !== -1) {
          line = line.substring(0, index);
        }
        const items = line.trim().split("|", 3);
        if (items.length === 3) {
          const [s1, s2, s3] = items;
          const lemma = s1.trim();
          const pos = s2.trim();
          const senses = s3
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
          if (senses.length > 0) {
            list.push({
              pos,
              lemma,
              senses,
              synonyms: [],
              antonyms: [],
              tags: [],
            });
          }
        }
      }
    }
    const groups = new Map();
    for (const entry of list) {
      for (const sense of entry.senses) {
        let group = groups.get(sense);
        if (group == null) {
          groups.set(sense, (group = []));
        }
        group.push(entry);
      }
    }
    for (const group of groups.values()) {
      for (const entry of group) {
        for (const other of group) {
          if (entry !== other) {
            if (!entry.synonyms.includes(other.lemma)) {
              entry.synonyms.push(other.lemma);
            }
          }
        }
      }
    }
    for (const entry of list) {
      dictionary.add(entry);
    }
    return dictionary;
  }

  #verb = new Map();
  #noun = new Map();
  #adj = new Map();
  #adv = new Map();
  #etc = new Map();

  get(pos, lemma) {
    return this.#getDict(pos).get(lemma) ?? null;
  }

  add(entry) {
    this.#getDict(entry.pos).set(entry.lemma, entry);
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
