import { Phrase, readDatabase } from "./lib/gen/db.js";
import { Decl, Tags } from "./lib/gen/tags.js";

const db = await readDatabase();

console.log("--- genitive case ---");
console.log(...[...genitiveCase()].map((p) => String(p)));
console.log();
console.log("--- dative case ---");
console.log(...[...dativeCase()].map((p) => String(p)));
console.log();
console.log("--- accusative case ---");
console.log(...[...accusativeCase()].map((p) => String(p)));
console.log();
console.log("--- pronouns ---");
console.log(...[...pronouns()].map((p) => String(p)));

function* genitiveCase() {
  const verbs = ["słuchać"];
  const nouns = ["muzyka"];
  const adjectives = ["dobry", "zły"];
  for (const verb of db.query(verbs, Tags.imperf | Tags.fin, Decl.sg | Decl.pri)) {
    for (const noun of db.query(nouns, Tags.subst, Decl.gen)) {
      const adjDecl = (noun.decl & (Decl.number | Decl.gender)) | Decl.gen;
      for (const adj of db.query(adjectives, Tags.adj | Tags.pos, adjDecl)) {
        yield new Phrase([verb, adj, noun]);
      }
    }
  }
}

function* dativeCase() {
  const verbs = ["dawać"];
  const nouns = ["człowiek", "kobieta", "dziecko"];
  const adjectives = ["wysoki", "niski"];
  for (const verb of db.query(verbs, Tags.imperf | Tags.fin, Decl.sg | Decl.pri)) {
    for (const noun of db.query(nouns, Tags.subst, Decl.dat)) {
      const adjDecl = (noun.decl & (Decl.number | Decl.gender)) | Decl.dat;
      for (const adj of db.query(adjectives, Tags.adj | Tags.pos, adjDecl)) {
        yield new Phrase([verb, adj, noun]);
      }
    }
  }
}

function* accusativeCase() {
  const verbs = ["lubić"];
  const nouns = ["człowiek", "kobieta", "dziecko"];
  const adjectives = ["wysoki", "niski"];
  for (const verb of db.query(verbs, Tags.imperf | Tags.fin, Decl.sg | Decl.pri)) {
    for (const noun of db.query(nouns, Tags.subst, Decl.acc)) {
      const adjDecl = (noun.decl & (Decl.number | Decl.gender)) | Decl.acc;
      for (const adj of db.query(adjectives, Tags.adj | Tags.pos, adjDecl)) {
        yield new Phrase([verb, adj, noun]);
      }
    }
  }
}

function* pronouns() {
  const verbs = ["lubić"];
  const nouns = ["czas", "człowiek", "kobieta", "dziecko"];
  const adjectives = ["taki"];
  for (const pronoun of db.query("*", Tags.ppron12, Decl.sg | Decl.nom)) {
    const verbDecl = pronoun.decl & (Decl.number | Decl.person);
    for (const verb of db.query(verbs, Tags.imperf | Tags.fin, verbDecl)) {
      for (const noun of db.query(nouns, Tags.subst, Decl.acc)) {
        const adjDecl = (noun.decl & (Decl.number | Decl.gender)) | Decl.acc;
        for (const adj of db.query(adjectives, Tags.adj | Tags.pos, adjDecl)) {
          yield new Phrase([pronoun, verb, adj, noun]);
        }
      }
    }
  }
}
