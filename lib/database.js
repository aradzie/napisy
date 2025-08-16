import { findFiles, readLines } from "./io.js";
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

class Database {
  #words = [];

  add(word) {
    this.#words.push(word);
  }

  query(stem, tags, decl) {
    const result = [];
    for (const word of this.#words) {
      if (stem === "*" || stem === word.stem) {
        if (word.tags === tags && (word.decl & decl) === decl) {
          result.push(word);
        }
      }
    }
    if (result.length === 0) {
      throw new Error(
        `No words found for "${stem}"` + //
          ` with tags ${Tags._toString(tags)}` +
          ` and decl ${Decl._toString(decl)}.`,
      );
    }
    return result;
  }

  one(stem, tags, decl) {
    const result = this.query(stem, tags, decl);
    if (result.length > 1) {
      throw new Error(
        `Many words found for "${stem}"` + //
          ` with tags ${Tags._toString(tags)}` +
          ` and decl ${Decl._toString(decl)}.`,
      );
    }
    return result[0];
  }
}

async function readDatabase() {
  const db = new Database();
  for await (const file of findFiles("dict", "**/*.txt")) {
    console.log(`Parsing a dictionary file "${file}"`);
    for await (const line of readLines(file)) {
      if (line.length === 0 || line.startsWith("#")) {
        continue;
      }
      const [form, stem, tags] = line.split(/\s/);
      if (form.length === 0 || stem.length === 0 || tags.length === 0) {
        continue;
      }
      db.add(parseWord(stem, form, tags));
    }
  }
  return db;
}

function parseWord(stem, form, s) {
  switch (true) {
    case stem.endsWith(":S"):
      // A noun.
      stem = stem.slice(0, -2);
      break;
    case stem.endsWith(":V"):
      // A verb.
      stem = stem.slice(0, -2);
      break;
    case stem.endsWith(":A"):
      // An adjective.
      stem = stem.slice(0, -2);
      break;
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

export { Word, Database, readDatabase };
