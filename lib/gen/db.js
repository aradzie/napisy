import { glob } from "node:fs/promises";
import { parse } from "node:path";
import { pathTo, readLines } from "../io.js";
import { capitalize } from "../text.js";
import { Decl, Tags } from "./tags.js";

class Word {
  #stem;
  #form;
  #tags;
  #decl;

  constructor(stem, form, tags, decl) {
    this.#stem = stem;
    this.#form = form;
    this.#tags = tags;
    this.#decl = decl;
  }

  get stem() {
    return this.#stem;
  }

  get form() {
    return this.#form;
  }

  get tags() {
    return this.#tags;
  }

  get decl() {
    return this.#decl;
  }

  toString() {
    const a = Tags._toString(this.#tags);
    const b = Decl._toString(this.#decl);
    return `${this.#stem}/${this.#form}/${a}/${b}`;
  }
}

class Phrase {
  #words;

  constructor(words) {
    this.#words = [...words];
  }

  get words() {
    return this.#words;
  }

  toString() {
    return capitalize(this.#words.map(({ form }) => form).join(" ")) + ".";
  }
}

class WordSet {
  static from(words) {
    if (words instanceof WordSet) {
      return words;
    }
    if (words === "*") {
      return new (class extends WordSet {
        test(word) {
          return true;
        }
      })();
    } else {
      if (!Array.isArray(words)) {
        words = [words];
      }
      const set = new Set(words);
      return new (class extends WordSet {
        test(word) {
          return set.has(word);
        }
      })();
    }
  }

  test(word) {}
}

class Database {
  #words = [];

  add(word) {
    this.#words.push(word);
  }

  query(stem, tags, decl) {
    stem = WordSet.from(stem);
    const result = [];
    for (const word of this.#words) {
      if (stem.test(word.stem)) {
        if (word.tags === tags && (word.decl & decl) === decl) {
          result.push(word);
        }
      }
    }
    return result;
  }
}

async function readDatabase() {
  const db = new Database();
  for await (const file of glob(`**/*.txt`, {
    cwd: pathTo("dict"),
  })) {
    const { dir, name } = parse(file);
    const inputFile = pathTo(`dict/${dir}/${name}.txt`);
    for await (const line of readLines(inputFile)) {
      if (line.length === 0 || line.startsWith("#")) {
        continue;
      }
      const [form, stem, tags] = line.split(/\s+/);
      if (form.length === 0 || stem.length === 0 || tags.length === 0) {
        continue;
      }
      db.add(parseWord(stem, form, tags));
    }
  }
  return db;
}

function parseWord(stem, form, s) {
  if (stem.endsWith(":S")) {
    // A noun.
    stem = stem.slice(0, -2);
  } else if (stem.endsWith(":V")) {
    // A verb.
    stem = stem.slice(0, -2);
  } else if (stem.endsWith(":A")) {
    // An adjective.
    stem = stem.slice(0, -2);
  }
  let tags = 0;
  let decl = 0;
  for (const f0 of s.split(":")) {
    for (const f1 of f0.split(".")) {
      const a = Tags[f1];
      if (a != null && a > 0) {
        tags |= a;
        continue;
      }
      const b = Decl[f1];
      if (b != null && b > 0) {
        decl |= b;
        continue;
      }
    }
  }
  return new Word(stem, form, tags, decl);
}

export { Word, Phrase, Database, readDatabase };
