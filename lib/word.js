import { Decl, parseTags } from "./tags.js";

class Word {
  static VERB = "VERB";
  static NOUN = "NOUN";
  static PRON = "PRON";
  static ADJ = "ADJ";
  static ADV = "ADJ";

  static parse(stem, form, tagsString) {
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
    const { tags, decl } = parseTags(tagsString);
    return new Word(stem, form, tags, decl, pos);
  }

  #stem;
  #form;
  #tags;
  #decl;
  #upos;

  constructor(stem, form, tags, decl, upos = null) {
    this.#stem = stem;
    this.#form = form;
    this.#tags = tags;
    this.#decl = decl;
    this.#upos = upos;
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

  get upos() {
    return this.#upos;
  }

  gPerson() {
    if ((this.#decl & Decl.pri) === Decl.pri) {
      return "first";
    }
    if ((this.#decl & Decl.sec) === Decl.sec) {
      return "second";
    }
    if ((this.#decl & Decl.ter) === Decl.ter) {
      return "third";
    }
    return null;
  }

  gNumber() {
    if ((this.#decl & Decl.sg) === Decl.sg) {
      return "singular";
    }
    if ((this.#decl & Decl.pl) === Decl.pl) {
      return "plural";
    }
    return null;
  }

  gGender() {
    if ((this.#decl & Decl.m) === Decl.m) {
      return "masculine";
    }
    if ((this.#decl & Decl.f) === Decl.f) {
      return "feminine";
    }
    if ((this.#decl & Decl.n) === Decl.n) {
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
    return this.#parts.join("");
  }
}

export { Word, Phrase };
