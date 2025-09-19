import { parseTags, Xext } from "./xtags.js";

class Word {
  static VERB = "VERB";
  static NOUN = "NOUN";
  static PRON = "PRON";
  static ADJ = "ADJ";
  static ADV = "ADJ";

  static parse(stem, form, tags) {
    let pos = null;
    switch (true) {
      case stem.endsWith(":S"):
        // A noun.
        stem = stem.slice(0, -2);
        pos = Word.NOUN;
        break;
      case stem.endsWith(":V"):
        // A verb.
        stem = stem.slice(0, -2);
        pos = Word.VERB;
        break;
      case stem.endsWith(":A"):
        // An adjective.
        stem = stem.slice(0, -2);
        pos = Word.ADJ;
        break;
    }
    const { xpos, xext } = parseTags(tags);
    return new Word(stem, form, xpos, xext, pos);
  }

  #stem;
  #form;
  #xpos;
  #xext;
  #upos;

  constructor(stem, form, xpos, xext, upos = null) {
    this.#stem = stem;
    this.#form = form;
    this.#xpos = xpos;
    this.#xext = xext;
    this.#upos = upos;
  }

  get stem() {
    return this.#stem;
  }

  get form() {
    return this.#form;
  }

  get xpos() {
    return this.#xpos;
  }

  get xext() {
    return this.#xext;
  }

  get upos() {
    return this.#upos;
  }

  gPerson() {
    if ((this.#xext & Xext.pri) === Xext.pri) {
      return "first";
    }
    if ((this.#xext & Xext.sec) === Xext.sec) {
      return "second";
    }
    if ((this.#xext & Xext.ter) === Xext.ter) {
      return "third";
    }
    return null;
  }

  gNumber() {
    if ((this.#xext & Xext.sg) === Xext.sg) {
      return "singular";
    }
    if ((this.#xext & Xext.pl) === Xext.pl) {
      return "plural";
    }
    return null;
  }

  gGender() {
    if ((this.#xext & Xext.m) === Xext.m) {
      return "masculine";
    }
    if ((this.#xext & Xext.f) === Xext.f) {
      return "feminine";
    }
    if ((this.#xext & Xext.n) === Xext.n) {
      return "neuter";
    }
    return null;
  }

  toString() {
    return this.#form;
  }
}

class Phrase {
  #parts = [];

  get parts() {
    return [...this.#parts];
  }

  push(item) {
    if (this.#parts.length > 0 && !(item === "," || item === "." || item === "!" || item === "?")) {
      this.#push(" ");
    }
    this.#push(item);
  }

  #push(item) {
    if (this.#parts.length > 0) {
      const top = this.#parts.pop();
      if (typeof top === "string" && typeof item === "string") {
        this.#parts.push(top + item);
      } else {
        this.#parts.push(top);
        this.#parts.push(item);
      }
    } else {
      this.#parts.push(item);
    }
  }

  toString() {
    return this.#parts
      .map((item) => {
        if (typeof item === "string") {
          return item;
        } else {
          return `[${item.stem}/${item.form},${item.gNumber()}]`;
        }
      })
      .join("");
  }
}

export { Word, Phrase };
