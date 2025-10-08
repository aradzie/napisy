// https://nkjp.pl/poliqarp/help/en.html
//
// https://universaldependencies.org/u/pos/
//
// ADJ: adjective
// ADP: adposition
// ADV: adverb
// AUX: auxiliary
// CCONJ: coordinating conjunction
// DET: determiner
// INTJ: interjection
// NOUN: noun
// NUM: numeral
// PART: particle
// PRON: pronoun
// PROPN: proper noun
// PUNCT: punctuation
// SCONJ: subordinating conjunction
// SYM: symbol
// VERB: verb
// X: other

const idSeq = () => {
  let id = 1;
  return () => {
    const res = id;
    id = id << 1;
    return res;
  };
};

const Xpos = ((id) => ({
  // Noun tags.
  subst: id(), // NOUN, noun: "czas", "człowiek"
  depr: id(), // NOUN, depreciative noun: "chłopisko"

  // Pronoun tags.
  ppron12: id(), // PRON
  ppron3: id(), // PRON

  // Verb tags.
  inf: id(), // VERB, infinitive: "stosować", "kochać"
  fin: id(), // VERB, non-past form: "stosuje", "kocha"
  praet: id(), // VERB, past tense l-participle: "stosował", "kochał"
  impt: id(), // VERB, imperative: "stosuj", "kochaj"
  cond: id(), // VERB, conditional tense: "stosowałby", "kochałby"
  ger: id(), // NOUN, gerund: "stosowanie", "kochanie"
  ppas: id(), // VERB or ADJ, passive adjective participle: "stosowany", "kochany"
  pact: id(), // VERB or ADJ, active adjective participle: "stosujący", "kochający"
  imps: id(), // ADV (or VERB???), impersonal: "stosowano", "kochano"
  pcon: id(), // ADV (or VERB???), contemporary adverbial participle "stosując", "kochając"
  pacta: id(), // ADV, contemporary adverbial participle "stosująco", "kochająco"
  bedzie: id(),
  winien: id(),

  // Adjective tags.
  adj: id(), // ADJ, adjective: "szybki"
  adja: id(), // ADJ, ad-adjectival adjective: "szybko"
  adjc: id(), // ADJ, predicative adjective
  adjp: id(), // ADJ, post-prepositional adjective

  // Adverb tags.
  adv: id(), // adverb: "szybko"

  // Other tags.
  pred: id(), // ADV or VERB, predicative expression: "trzeba", "warto", "szkoda"
  prep: id(), // ADP, preposition: "w", "na", "z", "do"
  conj: id(), // CCONJ or SCONJ, conjunction: "i", "ale", "że", "bo"
  comp: id(), // SCONJ, comparison words: "jak", "niż"

  _toString(tags) {
    return Object.entries(Xpos)
      .filter(([name, id]) => id !== 0 && (tags & id) === id)
      .map(([name, id]) => name)
      .join(":");
  },
}))(idSeq());

const Xext = ((id) => ({
  // Verb tags.
  imperf: id(), // Perfective aspect: imperfective/niedokonany
  perf: id(), // Perfective aspect: perfective/dokonany
  aff: id(), // Negation: affirmative (pisanie, czytanego)
  neg: id(), // Negation: negative (niepisanie, nieczytanego)

  // Verb, noun and adjective tags.
  sg: id(), // Number: singular
  pl: id(), // Number: plural
  m: id(), // Gender: masculine
  f: id(), // Gender: feminine
  n: id(), // Gender: neuter
  m1: id(), // Gender: human masculine (papież, kto, wujostwo)
  m2: id(), // Gender: animate masculine (baranek, walc, babsztyl)
  m3: id(), // Gender: inanimate masculine (stół)

  // Noun and adjective tags.
  nom: id(), // Case: nominative, mianownik (kto? co?)
  gen: id(), // Case: genitive, dopełniacz (kogo? czego?)
  dat: id(), // Case: dative, celownik (komu? czemu?)
  acc: id(), // Case: accusative, biernik (kogo? co?)
  inst: id(), // Case: instrumental, narzędnik (z kim? z czym?)
  loc: id(), // Case: locative, miejscownik (o kim? o czym?)
  voc: id(), // Case: vocative, wołacz

  // Verb and pronoun tags.
  pri: id(), // Person: first (bredzę, my)
  sec: id(), // Person: second (bredzisz, wy)
  ter: id(), // Person: third (bredzi, oni)

  // Adjective and adverb tags.
  pos: id(), // Degree: positive (cudny, szybki, szybko)
  com: id(), // Degree: comparative (cudniejszy, szybszy, szybciej)
  sup: id(), // Degree: superlative (najcudniejszy, najszybszy, najszybciej)

  // aglt: id(), // agglutinative
  // wok: id(), // vocalic
  // nwok: id(), // non-vocalic

  _toString(tags) {
    return Object.entries(Xext)
      .filter(([name, id]) => id !== 0 && (tags & id) === id)
      .map(([name, id]) => name)
      .join(":");
  },
}))(idSeq());

Xext.number = Xext.sg | Xext.pl;
Xext.gender = Xext.m | Xext.f | Xext.n | Xext.m1 | Xext.m2 | Xext.m3;
Xext.case = Xext.nom | Xext.gen | Xext.dat | Xext.acc | Xext.inst | Xext.loc | Xext.voc;
Xext.person = Xext.pri | Xext.sec | Xext.ter;

const verbTags =
  Xpos.inf /* stosować, kochać */ |
  Xpos.fin /* stosuje, kocha */ |
  Xpos.praet /* stosował, kochał */ |
  Xpos.impt /* stosuj,  kochaj */ |
  Xpos.cond; /* stosowałby, kochałby */
const nounTags =
  Xpos.subst /* czas, człowiek */ | //
  Xpos.ger; /* stosowanie, kochanie */
const pronTags =
  Xpos.ppron12 /* ja */ | //
  Xpos.ppron3; /* on */
const adjTags =
  Xpos.adj /* czasowy, ludzki, szybki */ | //
  Xpos.adja /* czarno, przyczynowo, finansowo */ | //
  Xpos.adjc /* gotów, ciekaw, winien */ | //
  Xpos.adjp /* po prostu, po cichu, z daleka */ | //
  Xpos.ppas /* stosowany, kochany */ |
  Xpos.pact; /* stosujący, kochający */
const advTags =
  Xpos.adv /* szybko */ | //
  Xpos.imps /* stosowano, kochano */ |
  Xpos.pcon /* stosując, kochając */ |
  Xpos.pacta; /* stosująco, kochająco */

function detectPos(xpos) {
  if ((xpos & verbTags) !== 0) {
    return "VERB";
  }
  if ((xpos & nounTags) !== 0) {
    return "NOUN";
  }
  if ((xpos & pronTags) !== 0) {
    return "PRON";
  }
  if ((xpos & adjTags) !== 0) {
    return "ADJ";
  }
  if ((xpos & advTags) !== 0) {
    return "ADV";
  }
  return null;
}

function parseTags(s) {
  let xpos = 0;
  let xext = 0;
  for (const f0 of s.split(":")) {
    for (const f1 of f0.split(".")) {
      const a = Xpos[f1];
      if (a != null && a > 0) {
        xpos |= a;
        continue;
      }
      const b = Xext[f1];
      if (b != null && b > 0) {
        xext |= b;
        continue;
      }
    }
  }
  return { xpos, xext };
}

export { Xpos, Xext, detectPos, parseTags };
