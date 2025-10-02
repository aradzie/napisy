import { findFiles, readLines } from "./io.js";
import { Word } from "./word.js";
import { parseTags, Xext, Xpos } from "./xtags.js";

export class Morpholog {
  static async load(morpholog = new Morpholog()) {
    for await (const path of findFiles("corpus", "sgjp-*.tab")) {
      console.log(`Loading a morphology file "${path}"`);
      for await (const line of readLines(path)) {
        if (line.length === 0 || line.startsWith("#")) {
          continue;
        }
        let [form, lemma, tags] = line.split(/\t/);
        if (form.length === 0 || lemma.length === 0 || tags.length === 0) {
          continue;
        }
        let pos = null;
        const i = lemma.indexOf(":");
        if (i !== -1) {
          switch (lemma.charAt(i + 1)) {
            case "S":
              pos = "NOUN";
              break;
            case "V":
              pos = "VERB";
              break;
            case "A":
              pos = "ADJ";
              break;
          }
          lemma = lemma.substring(0, i);
        }
        const { xpos, xext } = parseTags(tags);
        morpholog.add(new Word(lemma, form, xpos, xext, pos));
      }
    }
    return morpholog;
  }

  #words = new Map();

  add(word) {
    let list = this.#words.get(word.lemma);
    if (list == null) {
      this.#words.set(word.lemma, (list = []));
    }
    list.push(word);
  }

  find(lemma, xpos, xext) {
    const result = [];
    for (const word of this.#words.get(lemma) ?? []) {
      if ((word.xpos & xpos) === xpos && (word.xext & xext) === xext) {
        result.push(word);
      }
    }
    return result;
  }

  query(lemma, xpos, xext) {
    const result = this.find(lemma, xpos, xext);
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
