import { findFiles, readLines } from "./io.js";
import { Word } from "./word.js";
import { Xext, Xpos } from "./xtags.js";

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

  query(stem, xpos, xext) {
    const result = [];
    for (const word of this.#words) {
      if (stem === "*" || stem === word.stem) {
        if (word.xpos === xpos && (word.xext & xext) === xext) {
          result.push(word);
        }
      }
    }
    if (result.length === 0) {
      throw new Error(
        `No words found for "${stem}"` + //
          ` with xpos ${Xpos._toString(xpos)}` +
          ` and xext ${Xext._toString(xext)}.`,
      );
    }
    return result;
  }

  one(stem, xpos, xext) {
    const result = this.query(stem, xpos, xext);
    if (result.length > 1) {
      throw new Error(
        `Many words found for "${stem}"` + //
          ` with xpos ${Xpos._toString(xpos)}` +
          ` and xext ${Xext._toString(xext)}.`,
      );
    }
    return result[0];
  }
}

export { Database };
