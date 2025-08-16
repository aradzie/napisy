// https://nkjp.pl/poliqarp/help/en.html

const idSeq = () => {
  let id = 1;
  return () => {
    const res = id;
    id = id << 1;
    return res;
  };
};

const Tags = ((id) => ({
  // Noun tags.
  subst: id(), // noun

  // Pronoun tags.
  ppron12: id(),
  ppron3: id(),

  // Verb tags.
  imperf: id(), // Aspect: imperfective
  inf: id(), // infinitive
  fin: id(), // non-past form
  praet: id(), // Past tense l-participle
  impt: id(), // Imperative
  cond: id(), // Conditional tense
  ger: id(), // gerund
  imps: id(), // impersonal
  pact: id(), // active adj. participle
  ppas: id(), // passive adj. participle
  pcon: id(), // contemporary adv. participle
  aff: id(), // Negation: affirmative (pisanie, czytanego)
  neg: id(), // Negation: negative (niepisanie, nieczytanego)
  pacta: id(),
  bedzie: id(),
  winien: id(),

  // Adjective tags.
  adj: id(), // adjective
  adja: id(), // ad-adjectival adjective
  adjc: id(), // predicative adjective
  adjp: id(), // post-prepositional adjective
  pos: id(), // Degree: positive (cudny)
  com: id(), // Degree: comparative (cudniejszy)
  sup: id(), // Degree: superlative (najcudniejszy)

  _toString(tags) {
    return Object.entries(Tags)
      .filter(([name, id]) => id !== 0 && (tags & id) === id)
      .map(([name, id]) => name)
      .join(":");
  },
}))(idSeq());

const Decl = ((id) => ({
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

  _toString(tags) {
    return Object.entries(Decl)
      .filter(([name, id]) => id !== 0 && (tags & id) === id)
      .map(([name, id]) => name)
      .join(":");
  },
}))(idSeq());

Decl.number = Decl.sg | Decl.pl;
Decl.gender = Decl.m | Decl.f | Decl.n | Decl.m1 | Decl.m2 | Decl.m3;
Decl.case = Decl.nom | Decl.gen | Decl.dat | Decl.acc | Decl.inst | Decl.loc | Decl.voc;
Decl.person = Decl.pri | Decl.sec | Decl.ter;

export { Tags, Decl };
