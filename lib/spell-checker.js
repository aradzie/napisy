import dictionary from "dictionary-pl";
import NSpell from "nspell";

let nspell = null;

export function getSpellChecker() {
  if (nspell == null) {
    nspell = new NSpell(dictionary);
  }
  return nspell;
}
