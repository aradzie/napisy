import { parseTags, Xext } from "./xtags.js";

class Word {
  static parseWords(line) {
    const words = [];
    const last = {
      lemma: "",
      form: "",
      xpos: 0,
      xext: 0,
      upos: "",
    };
    for (const word of line.split("|")) {
      const [form, lemma, upos, tags] = word.split("/");
      const { xpos, xext } = parseTags(tags);
      if (last.upos === "VERB" && upos === "AUX") {
        last.form += form;
      } else {
        if (last.lemma) {
          words.push(new Word(last.lemma, last.form, last.xpos, last.xext, last.upos));
        }
        last.lemma = lemma;
        last.form = form;
        last.xpos = xpos;
        last.xext = xext;
        last.upos = upos;
      }
    }
    if (last.lemma) {
      words.push(new Word(last.lemma, last.form, last.xpos, last.xext, last.upos));
    }
    return words;
  }

  static VERB = "VERB";
  static NOUN = "NOUN";
  static PRON = "PRON";
  static ADJ = "ADJ";
  static ADV = "ADJ";

  #lemma;
  #form;
  #xpos;
  #xext;
  #upos;

  constructor(lemma, form, xpos, xext, upos = null) {
    this.#lemma = lemma;
    this.#form = form;
    this.#xpos = xpos;
    this.#xext = xext;
    this.#upos = upos;
  }

  get lemma() {
    return this.#lemma;
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

  gCase() {
    if ((this.#xext & Xext.nom) === Xext.nom) {
      return "nominative";
    }
    if ((this.#xext & Xext.gen) === Xext.gen) {
      return "genitive";
    }
    if ((this.#xext & Xext.dat) === Xext.dat) {
      return "dative";
    }
    if ((this.#xext & Xext.acc) === Xext.acc) {
      return "accusative";
    }
    if ((this.#xext & Xext.inst) === Xext.inst) {
      return "instrumental";
    }
    if ((this.#xext & Xext.loc) === Xext.loc) {
      return "locative";
    }
    if ((this.#xext & Xext.voc) === Xext.voc) {
      return "vocative";
    }
    return null;
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

  toString() {
    return this.#form;
  }
}

class Phrase {
  #parts = [];

  get parts() {
    return [...this.#parts];
  }

  get isEmpty() {
    return this.#parts.length === 0;
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

  print(show = (word) => word.form) {
    return this.#parts
      .map((item) => {
        if (typeof item === "string") {
          return item;
        } else {
          return show(item);
        }
      })
      .join("");
  }

  toString() {
    return this.print();
  }
}

export { Word, Phrase };
