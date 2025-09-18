import { findFiles, readLines } from "./io.js";
import { Decl, Tags } from "./tags.js";
import { Word } from "./word.js";

class Database {
  static async read(db = new Database()) {
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
        db.add(Word.parse(stem, form, tags));
      }
    }
    return db;
  }

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

export { Database };
