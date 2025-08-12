import { Note, noteTypes } from "@anotes/core";
import { capitalize } from "../text.js";
import { readDatabase } from "./db.js";
import { md } from "./markdown.js";
import { Decl, Tags } from "./tags.js";

async function generateExamples(notes) {
  const db = await readDatabase();
  genitiveCase(db, notes);
  dativeCase(db, notes);
  accusativeCase(db, notes);
  instrumentalCase(db, notes);
  locativeCase(db, notes);
}

function genitiveCase(db, notes) {
  // szukać, uczyć, słuchać, używać, życzyć, potrzebować (kogo czego)
  const words = expand([
    ["szukać", [["dobry|zły|taki", ["człowiek", "kobieta", "dziecko"]]]],
    [
      "potrzebować",
      [
        ["duży|mały|taki", ["magazyn"]],
        ["biały|czarny|taki", ["książka"]],
        ["cichy|miły|taki", ["miejsce"]],
      ],
    ],
  ]);
  const help = `
Dopełniacz (*kogo? czego?*)

|lp               |lm            |
|:----------------|:-------------|
|dobrego człowieka|dobrych ludzi |
|dobrej kobiety   |dobrych kobiet|
|dobrego dziecka  |dobrych dzieci|
`;
  for (const [verb, verbTail] of words) {
    for (const [adj, adjTail] of verbTail) {
      for (const noun of adjTail) {
        for (const V of db.query(verb, Tags.imperf | Tags.fin, Decl.pri)) {
          const verbDecl = V.decl & Decl.number;
          const Nnom = db.one(noun, Tags.subst, verbDecl | Decl.nom);
          const Ngen = db.one(noun, Tags.subst, verbDecl | Decl.gen);
          const nounDecl = Nnom.decl & (Decl.number | Decl.gender);
          const Anom = db.one(adj, Tags.adj | Tags.pos, nounDecl | Decl.nom);
          const Agen = db.one(adj, Tags.adj | Tags.pos, nounDecl | Decl.gen);
          const q = `(${md.i(`kogo? czego?`)}) [${md.b(Anom.form)} ${md.b(Nnom.form)}]`;
          const a = `${md.b(Agen.form)} ${md.b(Ngen.form)}`;
          const front = capitalize(`${V.form} ${q}.`);
          const back = md.p(capitalize(`${V.form} ${a}.`)) + help;
          const id = `genitive_${V.form}_${Anom.form}_${Nnom.form}`;
          addNote(notes, id, front, back);
          console.log(`Genitive case: ${V.form} (${Anom.form}->${Agen.form}) (${Nnom.form}->${Ngen.form})`);
        }
      }
    }
  }
}

function dativeCase(db, notes) {
  const words = expand([
    ["dawać", [["dobry|zły|taki", ["człowiek", "kobieta", "dziecko"]]]],
    ["pomagać", [["ważny|miły|taki", ["nauczyciel", "nauczycielka", "dziecko"]]]],
  ]);
  const help = `
Celownik (*komu? czemu?*)

|lp                 |lm             |
|:------------------|:--------------|
|dobremu człowiekowi|dobrym ludziom |
|dobrej kobiecie    |dobrym kobietom|
|dobremu dziecku    |dobrym dzieciom|
`;
  for (const [verb, verbTail] of words) {
    for (const [adj, adjTail] of verbTail) {
      for (const noun of adjTail) {
        for (const V of db.query(verb, Tags.imperf | Tags.fin, Decl.pri)) {
          const verbDecl = V.decl & Decl.number;
          const Nnom = db.one(noun, Tags.subst, verbDecl | Decl.nom);
          const Ndat = db.one(noun, Tags.subst, verbDecl | Decl.dat);
          const nounDecl = Nnom.decl & (Decl.number | Decl.gender);
          const Anom = db.one(adj, Tags.adj | Tags.pos, nounDecl | Decl.nom);
          const Adat = db.one(adj, Tags.adj | Tags.pos, nounDecl | Decl.dat);
          const q = `(${md.i(`komu? czemu?`)}) [${md.b(Anom.form)} ${md.b(Nnom.form)}]`;
          const a = `${md.b(Adat.form)} ${md.b(Ndat.form)}`;
          const front = capitalize(`${V.form} ${q}.`);
          const back = md.p(capitalize(`${V.form} ${a}.`)) + help;
          const id = `dative_${V.form}_${Anom.form}_${Nnom.form}`;
          addNote(notes, id, front, back);
          console.log(`Dative case: ${V.form} (${Anom.form}->${Adat.form}) (${Nnom.form}->${Ndat.form})`);
        }
      }
    }
  }
}

function accusativeCase(db, notes) {
  // widzieć, czytać, kupować, lubić (kogo co)
  const words = expand([
    ["lubić", [["dobry|zły|taki", ["człowiek", "brat", "kobieta", "siostra", "dziecko"]]]],
    ["mieć", [["dobry|zły|taki", ["dom", "torba", "krzesło"]]]],
    ["pisać", [["dobry|zły|taki", ["tekst", "muzyka", "pytanie"]]]],
  ]);
  const help = `
Biernik (*kogo? co?*)

|lp               |lm           |
|:----------------|:------------|
|dobry film       |dobre filmy  |
|dobrego człowieka|dobrych ludzi|
|dobrą kobietę    |dobre kobiety|
|dobre dziecko    |dobre dzieci |
`;
  for (const [verb, verbTail] of words) {
    for (const [adj, adjTail] of verbTail) {
      for (const noun of adjTail) {
        for (const V of db.query(verb, Tags.imperf | Tags.fin, Decl.pri)) {
          const verbDecl = V.decl & Decl.number;
          const Nnom = db.one(noun, Tags.subst, verbDecl | Decl.nom);
          const Nacc = db.one(noun, Tags.subst, verbDecl | Decl.acc);
          const nounDecl = Nnom.decl & (Decl.number | Decl.gender);
          const Anom = db.one(adj, Tags.adj | Tags.pos, nounDecl | Decl.nom);
          const Aacc = db.one(adj, Tags.adj | Tags.pos, nounDecl | Decl.acc);
          const q = `(${md.i(`kogo? co?`)}) [${md.b(Anom.form)} ${md.b(Nnom.form)}]`;
          const a = `${md.b(Aacc.form)} ${md.b(Nacc.form)}`;
          const front = capitalize(`${V.form} ${q}.`);
          const back = md.p(capitalize(`${V.form} ${a}.`)) + help;
          const id = `accusative_${V.form}_${Anom.form}_${Nnom.form}`;
          addNote(notes, id, front, back);
          console.log(`Accusative case: ${V.form} (${Anom.form}->${Aacc.form}) (${Nnom.form}->${Nacc.form})`);
        }
      }
    }
  }
}

function instrumentalCase(db, notes) {
  const words = expand([
    ["rozmawiać+z", [["dobry|zły|taki", ["człowiek", "kobieta", "dziecko", "nauczyciel", "nauczycielka"]]]],
    ["interesować+się", [["silny|słaby|taki", ["człowiek", "kobieta", "dziecko", "nauczyciel", "nauczycielka"]]]],
  ]);
  const help = `
Narzędnik (*z kim? z czym?*)

|lp                  |lm                 |
|:-------------------|:------------------|
|z dobrym człowiekiem|z dobrymi ludźmi   |
|z dobrą kobietą     |z dobrymi kobietami|
|z dobrym dzieckiem  |z dobrymi dziećmi  |
`;
  for (const [verb, verbTail] of words) {
    for (const [adj, adjTail] of verbTail) {
      for (const noun of adjTail) {
        for (const V of db.query(stem(verb), Tags.imperf | Tags.fin, Decl.pri)) {
          const verbDecl = V.decl & Decl.number;
          const Nnom = db.one(noun, Tags.subst, verbDecl | Decl.nom);
          const Ninst = db.one(noun, Tags.subst, verbDecl | Decl.inst);
          const nounDecl = Nnom.decl & (Decl.number | Decl.gender);
          const Anom = db.one(adj, Tags.adj | Tags.pos, nounDecl | Decl.nom);
          const Ainst = db.one(adj, Tags.adj | Tags.pos, nounDecl | Decl.inst);
          const q = `(${md.i(`z kim? z czym?`)}) [${md.b(Anom.form)} ${md.b(Nnom.form)}]`;
          const a = `${md.b(Ainst.form)} ${md.b(Ninst.form)}`;
          const cverb = conn(V.form, verb);
          const front = capitalize(`${cverb} ${q}.`);
          const back = md.p(capitalize(`${cverb} ${a}.`)) + help;
          const id = `instrumental_${V.form}_${Anom.form}_${Nnom.form}`;
          addNote(notes, id, front, back);
          console.log(`Instrumental case: ${cverb} (${Anom.form}->${Ainst.form}) (${Nnom.form}->${Ninst.form})`);
        }
      }
    }
  }
}

function locativeCase(db, notes) {
  const words = expand([
    ["mówić+o", [["dobry|zły|taki", ["człowiek", "kobieta", "dziecko", "nauczyciel", "nauczycielka"]]]],
    ["pisać+o|czytać+o", [["silny|słaby|taki", ["człowiek", "kobieta", "dziecko", "nauczyciel", "nauczycielka"]]]],
  ]);
  const help = `
Miejscownik (*o kim? o czym?*)

|lp                |lm                 |
|:-----------------|:------------------|
|o dobrym człowieku|o dobrych ludziach |
|o dobrej kobiecie |o dobrych kobietach|
|o dobrym dziecku  |o dobrych dzieciach|
`;
  for (const [verb, verbTail] of words) {
    for (const [adj, adjTail] of verbTail) {
      for (const noun of adjTail) {
        for (const V of db.query(stem(verb), Tags.imperf | Tags.fin, Decl.pri)) {
          const verbDecl = V.decl & Decl.number;
          const Nnom = db.one(noun, Tags.subst, verbDecl | Decl.nom);
          const Nloc = db.one(noun, Tags.subst, verbDecl | Decl.loc);
          const nounDecl = Nnom.decl & (Decl.number | Decl.gender);
          const Anom = db.one(adj, Tags.adj | Tags.pos, nounDecl | Decl.nom);
          const Aloc = db.one(adj, Tags.adj | Tags.pos, nounDecl | Decl.loc);
          const q = `(${md.i(`o kim? o czym?`)}) [${md.b(Anom.form)} ${md.b(Nnom.form)}]`;
          const a = `${md.b(Aloc.form)} ${md.b(Nloc.form)}`;
          const cverb = conn(V.form, verb);
          const front = capitalize(`${cverb} ${q}.`);
          const back = md.p(capitalize(`${cverb} ${a}.`)) + help;
          const id = `locative_${V.form}_${Anom.form}_${Nnom.form}`;
          addNote(notes, id, front, back);
          console.log(`Locative case: ${cverb} (${Anom.form}->${Aloc.form}) (${Nnom.form}->${Nloc.form})`);
        }
      }
    }
  }
}

function addNote(notes, id, front, back) {
  const note = new Note(noteTypes.basic);
  note.deck = `Polski::Odmiany::Rzeczowniki`;
  note.tags = `Polski Odmiana`;
  note.id = id;
  note.set("front", front.trim());
  note.set("back", back.trim());
  notes.add(note);
}

function expand(words) {
  const words1 = [];
  for (const [verbs, verbTail] of words) {
    for (const verb of verbs.split("|")) {
      const verbTail1 = [];
      words1.push([verb, verbTail1]);
      for (const [adjs, adjTail] of verbTail) {
        for (const adj of adjs.split("|")) {
          const adjTail1 = [];
          verbTail1.push([adj, adjTail1]);
          for (const nouns of adjTail) {
            for (const noun of nouns.split("|")) {
              adjTail1.push(noun);
            }
          }
        }
      }
    }
  }
  return words1;
}

function stem(word) {
  const i = word.indexOf("+");
  if (i === -1) {
    return word;
  }
  return word.substring(0, i);
}

function conn(form, word) {
  const i = word.indexOf("+");
  if (i === -1) {
    return form;
  }
  return form + " " + word.substring(i + 1);
}

export { generateExamples };
