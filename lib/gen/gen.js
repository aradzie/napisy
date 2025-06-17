import { capitalize } from "../text.js";
import { readDatabase } from "./db.js";
import { Decl, Tags } from "./tags.js";

const html = {
  i: (str) => `<em>${str}</em>`,
  b: (str) => `<strong>${str}</strong>`,
};

async function generateExamples(notes) {
  const db = await readDatabase();
  console.log("--- genitive case ---");
  genitiveCase(db, notes);
  console.log();
  console.log("--- dative case ---");
  dativeCase(db, notes);
  console.log();
  console.log("--- accusative case ---");
  accusativeCase(db, notes);
  console.log("--- accusative case with pronouns ---");
  accusativeCaseWithPronouns(db, notes);
}

function genitiveCase(db, notes) {
  const verbs = ["brać", "słuchać"];
  const nouns = ["człowiek", "kobieta", "dziecko", "książka"];
  const adjectives = ["dobry", "zły", "czarny", "biały"];
  for (const verb of db.query(verbs, Tags.imperf | Tags.fin, Decl.sg | Decl.pri)) {
    for (const nounGen of db.query(nouns, Tags.subst, Decl.gen)) {
      const nounDecl = nounGen.decl & (Decl.number | Decl.gender);
      const nounNom = db.one(nounGen.stem, nounGen.tags, nounDecl | Decl.nom);
      for (const adjGen of db.query(adjectives, Tags.adj | Tags.pos, nounDecl | Decl.gen)) {
        const adjNom = db.one(adjGen.stem, adjGen.tags, nounDecl | Decl.nom);
        const q = `(${html.i(`kogo? czego?`)}) [${html.b(adjNom.form)} ${html.b(nounNom.form)}]`;
        const a = `${html.b(adjGen.form)} ${html.b(nounGen.form)}`;
        const front = capitalize(`${verb.form} ${q}.`);
        const back = capitalize(`${verb.form} ${a}.`);
        notes.push({
          type: `Basic`,
          deck: `Polski::Odmiany::Rzeczowniki`,
          tags: `Polski Odmiana`,
          front,
          back,
        });
        console.log(`${front} / ${back}`);
      }
    }
  }
}

function dativeCase(db, notes) {
  const verbs = ["dawać"];
  const nouns = ["człowiek", "kobieta", "dziecko"];
  const adjectives = ["wysoki", "niski", "czarny", "biały"];
  for (const verb of db.query(verbs, Tags.imperf | Tags.fin, Decl.sg | Decl.pri)) {
    for (const nounDat of db.query(nouns, Tags.subst, Decl.dat)) {
      const nounDecl = nounDat.decl & (Decl.number | Decl.gender);
      const nounNom = db.one(nounDat.stem, nounDat.tags, nounDecl | Decl.nom);
      for (const adjDat of db.query(adjectives, Tags.adj | Tags.pos, nounDecl | Decl.dat)) {
        const adjNom = db.one(adjDat.stem, adjDat.tags, nounDecl | Decl.nom);
        const q = `(${html.i(`komu? czemu?`)}) [${html.b(adjNom.form)} ${html.b(nounNom.form)}]`;
        const a = `${html.b(adjDat.form)} ${html.b(nounDat.form)}`;
        const front = capitalize(`${verb.form} ${q}.`);
        const back = capitalize(`${verb.form} ${a}.`);
        notes.push({
          type: `Basic`,
          deck: `Polski::Odmiany::Rzeczowniki`,
          tags: `Polski Odmiana`,
          front,
          back,
        });
        console.log(`${front} / ${back}`);
      }
    }
  }
}

function accusativeCase(db, notes) {
  const verbs = ["lubić"];
  const nouns = ["człowiek", "kobieta", "dziecko"];
  const adjectives = ["wysoki", "niski"];
  for (const verb of db.query(verbs, Tags.imperf | Tags.fin, Decl.sg | Decl.pri)) {
    for (const nounAcc of db.query(nouns, Tags.subst, Decl.acc)) {
      const nounDecl = nounAcc.decl & (Decl.number | Decl.gender);
      const nounNom = db.one(nounAcc.stem, nounAcc.tags, nounDecl | Decl.nom);
      for (const adjAcc of db.query(adjectives, Tags.adj | Tags.pos, nounDecl | Decl.acc)) {
        const adjNom = db.one(adjAcc.stem, adjAcc.tags, nounDecl | Decl.nom);
        const q = `(${html.i(`kogo? co?`)}) [${html.b(adjNom.form)} ${html.b(nounNom.form)}]`;
        const a = `${html.b(adjAcc.form)} ${html.b(nounAcc.form)}`;
        const front = capitalize(`${verb.form} ${q}.`);
        const back = capitalize(`${verb.form} ${a}.`);
        notes.push({
          type: `Basic`,
          deck: `Polski::Odmiany::Rzeczowniki`,
          tags: `Polski Odmiana`,
          front,
          back,
        });
        console.log(`${front} / ${back}`);
      }
    }
  }
}

function accusativeCaseWithPronouns(db, notes) {
  const verbs = ["lubić"];
  const nouns = ["czas", "człowiek", "kobieta", "dziecko"];
  const adjectives = ["taki"];
  for (const pronoun of db.query("*", Tags.ppron12, Decl.sg | Decl.nom)) {
    const pronounDecl = pronoun.decl & (Decl.number | Decl.person);
    for (const verb of db.query(verbs, Tags.imperf | Tags.fin, pronounDecl)) {
      for (const nounAcc of db.query(nouns, Tags.subst, Decl.acc)) {
        const nounDecl = nounAcc.decl & (Decl.number | Decl.gender);
        const nounNom = db.one(nounAcc.stem, nounAcc.tags, nounDecl | Decl.nom);
        for (const adjAcc of db.query(adjectives, Tags.adj | Tags.pos, nounDecl | Decl.acc)) {
          const adjNom = db.one(adjAcc.stem, adjAcc.tags, nounDecl | Decl.nom);
          const q = `(${html.i(`kogo? co?`)}) [${html.b(adjNom.form)} ${html.b(nounNom.form)}]`;
          const a = `${html.b(adjAcc.form)} ${html.b(nounAcc.form)}`;
          const front = capitalize(`${pronoun.form} ${verb.form} ${q}.`);
          const back = capitalize(`${pronoun.form} ${verb.form} ${a}.`);
          notes.push({
            type: `Basic`,
            deck: `Polski::Odmiany::Rzeczowniki`,
            tags: `Polski Odmiana`,
            front,
            back,
          });
          console.log(`${front} / ${back}`);
        }
      }
    }
  }
}

export { generateExamples };
