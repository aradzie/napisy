import { findFiles, readLines } from "./io.js";
import { Word } from "./word.js";
import { parseTags, Xext, Xpos } from "./xtags.js";

class Dictionary {
  static async load(dict = new Dictionary()) {
    for await (const path of findFiles("corpus/dict", "**/*.txt")) {
      console.log(`Loading a dictionary file "${path}"`);
      for await (const line of readLines(path)) {
        if (line.length === 0 || line.startsWith("#")) {
          continue;
        }
        let [form, lemma, tags] = line.split(/\s/);
        if (form.length === 0 || lemma.length === 0 || tags.length === 0) {
          continue;
        }
        let pos = null;
        switch (true) {
          case lemma.endsWith(":S"):
            // A noun.
            lemma = lemma.slice(0, -2);
            pos = "NOUN";
            break;
          case lemma.endsWith(":V"):
            // A verb.
            lemma = lemma.slice(0, -2);
            pos = "VERB";
            break;
          case lemma.endsWith(":A"):
            // An adjective.
            lemma = lemma.slice(0, -2);
            pos = "ADJ";
            break;
        }
        const { xpos, xext } = parseTags(tags);
        dict.add(new Word(lemma, form, xpos, xext, pos));
      }
    }
    return dict;
  }

  #words = [];

  add(word) {
    this.#words.push(word);
  }

  query(lemma, xpos, xext) {
    const result = [];
    for (const word of this.#words) {
      if (lemma === "*" || lemma === word.lemma) {
        if ((word.xpos & xpos) === xpos && (word.xext & xext) === xext) {
          result.push(word);
        }
      }
    }
    if (result.length === 0) {
      throw new Error(
        `No words found for "${lemma}"` + //
          ` with xpos ${Xpos._toString(xpos)}` +
          ` and xext ${Xext._toString(xext)}.`,
      );
    }
    return result;
  }

  one(lemma, xpos, xext) {
    const result = this.query(lemma, xpos, xext);
    if (result.length > 1) {
      throw new Error(
        `Many words found for "${lemma}"` + //
          ` with xpos ${Xpos._toString(xpos)}` +
          ` and xext ${Xext._toString(xext)}.`,
      );
    }
    return result[0];
  }
}

export { Dictionary };
