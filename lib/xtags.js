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
  subst: id(), // noun

  // Pronoun tags.
  ppron12: id(),
  ppron3: id(),

  // Verb tags.
  imperf: id(), // imperfective
  inf: id(), // infinitive
  fin: id(), // non-past form
  praet: id(), // past tense l-participle
  impt: id(), // imperative
  cond: id(), // conditional tense
  ger: id(), // gerund
  imps: id(), // impersonal
  pact: id(), // active adj. participle
  pacta: id(),
  ppas: id(), // passive adj. participle
  pcon: id(), // contemporary adv. participle
  aglt: id(), // agglutinative
  wok: id(), // vocalic
  nwok: id(), // non-vocalic
  bedzie: id(),
  winien: id(),

  // Adjective tags.
  adj: id(), // adjective
  adja: id(), // ad-adjectival adjective
  adjc: id(), // predicative adjective
  adjp: id(), // post-prepositional adjective

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

export { Xpos, Xext, parseTags };
