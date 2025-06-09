import dictionary from "dictionary-pl";
import NSpell from "nspell";

const spellChecker = new (class SpellChecker {
  #nspell = new NSpell(dictionary);
  #white = new Set();
  #black = new Set();

  constructor() {}

  has(word) {
    if (this.#white.has(word)) {
      return true;
    }
    if (this.#black.has(word)) {
      return false;
    }
    if (this.#nspell.correct(word)) {
      this.#white.add(word);
      return true;
    } else {
      this.#black.add(word);
      return false;
    }
  }
})();

export { spellChecker };
