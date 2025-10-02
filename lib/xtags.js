// https://nkjp.pl/poliqarp/help/en.html

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
  subst: id(), // noun: "czas", "człowiek"

  // Pronoun tags.
  ppron12: id(),
  ppron3: id(),

  // Verb tags.
  imperf: id(), // imperfective
  perf: id(), // perfective
  inf: id(), // infinitive: "stosować", "kochać"
  fin: id(), // non-past form: "stosuje", "kocha"
  praet: id(), // past tense l-participle: "stosował", "kochał"
  impt: id(), // imperative: "stosuj", "kochaj"
  cond: id(), // conditional tense: "stosowałby", "kochałby"
  ger: id(), // gerund: "stosowanie", "kochanie"
  imps: id(), // impersonal: "stosowano", "kochano"
  pact: id(), // active adjective participle: "stosujący", "kochający"
  ppas: id(), // passive adjective participle: "stosowany", "kochany"
  pcon: id(), // contemporary adverbial participle "stosując", "kochając"
  pacta: id(), // contemporary adverbial participle "stosująco", "kochająco"
  bedzie: id(),
  winien: id(),

  // Adjective tags.
  adj: id(), // adjective: "szybki"
  adja: id(), // ad-adjectival adjective: "szybko"
  adjc: id(), // predicative adjective
  adjp: id(), // post-prepositional adjective

  // Adverb tags.
  adv: id(), // adverb: "szybko"

  _toString(tags) {
    return Object.entries(Xpos)
      .filter(([name, id]) => id !== 0 && (tags & id) === id)
      .map(([name, id]) => name)
      .join(":");
  },
}))(idSeq());

const Xext = ((id) => ({
  // Verb, noun and adjective tags.
  sg: id(), // Number: singular.
  pl: id(), // Number: plural.
  m: id(), // Gender: masculine.
  f: id(), // Gender: feminine.
  n: id(), // Gender: neuter.
  m1: id(), // Gender: human masculine (papież, kto, wujostwo).
  m2: id(), // Gender: animate masculine (baranek, walc, babsztyl).
  m3: id(), // Gender: inanimate masculine (stół).

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

  // Verb tags.
  aff: id(), // Negation: affirmative (pisanie, czytanego)
  neg: id(), // Negation: negative (niepisanie, nieczytanego)

  // Adjective tags.
  pos: id(), // Degree: positive (cudny)
  com: id(), // Degree: comparative (cudniejszy)
  sup: id(), // Degree: superlative (najcudniejszy)

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
