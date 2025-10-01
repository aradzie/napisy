import { findFiles } from "./io.js";
import { Word } from "./word.js";
import { parseTags } from "./xtags.js";

export class Lemmata {
  static async findFiles() {
    return await Array.fromAsync(findFiles("corpus", "corpus*-lemmata.txt"));
  }

  static parseLine(line) {
    const words = [];
    const last = {
      lemma: "",
      form: "",
      xpos: 0,
      xext: 0,
      pos: "",
    };
    for (const word of line.split("|")) {
      const [form, lemma, pos, tags] = word.split("/");
      const { xpos, xext } = parseTags(tags);
      if (last.pos === "VERB" && pos === "AUX") {
        last.form += form;
      } else {
        if (last.lemma) {
          words.push(new Word(last.lemma, last.form, last.xpos, last.xext, last.pos));
        }
        last.lemma = lemma;
        last.form = form;
        last.xpos = xpos;
        last.xext = xext;
        last.pos = pos;
      }
    }
    if (last.lemma) {
      words.push(new Word(last.lemma, last.form, last.xpos, last.xext, last.pos));
    }
    return words;
  }
}
