import { newNote, printNoteNodes } from "@notatki/core";
import { writeFile } from "node:fs/promises";
import { Dictionary } from "./lib/dictionary.js";
import { pathTo } from "./lib/io.js";
import { md } from "./lib/markdown.js";
import { capitalize } from "./lib/text.js";
import { Xext, Xpos } from "./lib/xtags.js";

const dict = await Dictionary.read();
const notes = [];
for (const [przypadek, generator] of [
  ["dopełniacz", dopełniacz],
  ["celownik", celownik],
  ["biernik", biernik],
  ["narzędnik", narzędnik],
  ["miejscownik", miejscownik],
]) {
  generator(dict, notes);
}
const path = pathTo(`notes/odmiany/rzeczowniki.note`);
console.log(`Generated ${notes.length} note(s) to file "${path}"`);
await writeFile(path, printNoteNodes(notes));

function dopełniacz(dict, notes) {
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
        for (const V of dict.query(verb, Xpos.imperf | Xpos.fin, Xext.pri)) {
          const verbDecl = V.xext & Xext.number;
          const Nnom = dict.one(noun, Xpos.subst, verbDecl | Xext.nom);
          const Ngen = dict.one(noun, Xpos.subst, verbDecl | Xext.gen);
          const nounDecl = Nnom.xext & (Xext.number | Xext.gender);
          const Anom = dict.one(adj, Xpos.adj | Xpos.pos, nounDecl | Xext.nom);
          const Agen = dict.one(adj, Xpos.adj | Xpos.pos, nounDecl | Xext.gen);
          const q = `(${md.i(`kogo? czego?`)}) [${md.b(Anom.form)} ${md.b(Nnom.form)}]`;
          const a = `${md.b(Agen.form)} ${md.b(Ngen.form)}`;
          const front = capitalize(`${V.form} ${q}.`);
          const back = md.p(capitalize(`${V.form} ${a}.`)) + help;
          const id = `dopełniacz_${V.form}_${Anom.form}_${Nnom.form}`;
          addNote(notes, id, front, back);
          console.log(`Dopełniacz: ${V.form} (${Anom.form}->${Agen.form}) (${Nnom.form}->${Ngen.form})`);
        }
      }
    }
  }
}

function celownik(dict, notes) {
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
        for (const V of dict.query(verb, Xpos.imperf | Xpos.fin, Xext.pri)) {
          const verbDecl = V.xext & Xext.number;
          const Nnom = dict.one(noun, Xpos.subst, verbDecl | Xext.nom);
          const Ndat = dict.one(noun, Xpos.subst, verbDecl | Xext.dat);
          const nounDecl = Nnom.xext & (Xext.number | Xext.gender);
          const Anom = dict.one(adj, Xpos.adj | Xpos.pos, nounDecl | Xext.nom);
          const Adat = dict.one(adj, Xpos.adj | Xpos.pos, nounDecl | Xext.dat);
          const q = `(${md.i(`komu? czemu?`)}) [${md.b(Anom.form)} ${md.b(Nnom.form)}]`;
          const a = `${md.b(Adat.form)} ${md.b(Ndat.form)}`;
          const front = capitalize(`${V.form} ${q}.`);
          const back = md.p(capitalize(`${V.form} ${a}.`)) + help;
          const id = `celownik_${V.form}_${Anom.form}_${Nnom.form}`;
          addNote(notes, id, front, back);
          console.log(`Celownik: ${V.form} (${Anom.form}->${Adat.form}) (${Nnom.form}->${Ndat.form})`);
        }
      }
    }
  }
}

function biernik(dict, notes) {
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
        for (const V of dict.query(verb, Xpos.imperf | Xpos.fin, Xext.pri)) {
          const verbDecl = V.xext & Xext.number;
          const Nnom = dict.one(noun, Xpos.subst, verbDecl | Xext.nom);
          const Nacc = dict.one(noun, Xpos.subst, verbDecl | Xext.acc);
          const nounDecl = Nnom.xext & (Xext.number | Xext.gender);
          const Anom = dict.one(adj, Xpos.adj | Xpos.pos, nounDecl | Xext.nom);
          const Aacc = dict.one(adj, Xpos.adj | Xpos.pos, nounDecl | Xext.acc);
          const q = `(${md.i(`kogo? co?`)}) [${md.b(Anom.form)} ${md.b(Nnom.form)}]`;
          const a = `${md.b(Aacc.form)} ${md.b(Nacc.form)}`;
          const front = capitalize(`${V.form} ${q}.`);
          const back = md.p(capitalize(`${V.form} ${a}.`)) + help;
          const id = `biernik_${V.form}_${Anom.form}_${Nnom.form}`;
          addNote(notes, id, front, back);
          console.log(`Biernik: ${V.form} (${Anom.form}->${Aacc.form}) (${Nnom.form}->${Nacc.form})`);
        }
      }
    }
  }
}

function narzędnik(dict, notes) {
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
        for (const V of dict.query(stem(verb), Xpos.imperf | Xpos.fin, Xext.pri)) {
          const verbDecl = V.xext & Xext.number;
          const Nnom = dict.one(noun, Xpos.subst, verbDecl | Xext.nom);
          const Ninst = dict.one(noun, Xpos.subst, verbDecl | Xext.inst);
          const nounDecl = Nnom.xext & (Xext.number | Xext.gender);
          const Anom = dict.one(adj, Xpos.adj | Xpos.pos, nounDecl | Xext.nom);
          const Ainst = dict.one(adj, Xpos.adj | Xpos.pos, nounDecl | Xext.inst);
          const q = `(${md.i(`z kim? z czym?`)}) [${md.b(Anom.form)} ${md.b(Nnom.form)}]`;
          const a = `${md.b(Ainst.form)} ${md.b(Ninst.form)}`;
          const cverb = conn(V.form, verb);
          const front = capitalize(`${cverb} ${q}.`);
          const back = md.p(capitalize(`${cverb} ${a}.`)) + help;
          const id = `narzędnik_${V.form}_${Anom.form}_${Nnom.form}`;
          addNote(notes, id, front, back);
          console.log(`Narzędnik: ${cverb} (${Anom.form}->${Ainst.form}) (${Nnom.form}->${Ninst.form})`);
        }
      }
    }
  }
}

function miejscownik(dict, notes) {
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
        for (const V of dict.query(stem(verb), Xpos.imperf | Xpos.fin, Xext.pri)) {
          const verbDecl = V.xext & Xext.number;
          const Nnom = dict.one(noun, Xpos.subst, verbDecl | Xext.nom);
          const Nloc = dict.one(noun, Xpos.subst, verbDecl | Xext.loc);
          const nounDecl = Nnom.xext & (Xext.number | Xext.gender);
          const Anom = dict.one(adj, Xpos.adj | Xpos.pos, nounDecl | Xext.nom);
          const Aloc = dict.one(adj, Xpos.adj | Xpos.pos, nounDecl | Xext.loc);
          const q = `(${md.i(`o kim? o czym?`)}) [${md.b(Anom.form)} ${md.b(Nnom.form)}]`;
          const a = `${md.b(Aloc.form)} ${md.b(Nloc.form)}`;
          const cverb = conn(V.form, verb);
          const front = capitalize(`${cverb} ${q}.`);
          const back = md.p(capitalize(`${cverb} ${a}.`)) + help;
          const id = `miejscownik_${V.form}_${Anom.form}_${Nnom.form}`;
          addNote(notes, id, front, back);
          console.log(`Miejscownik: ${cverb} (${Anom.form}->${Aloc.form}) (${Nnom.form}->${Nloc.form})`);
        }
      }
    }
  }
}

function addNote(notes, id, front, back) {
  notes.push(
    newNote()
      .type("Basic")
      .deck(`Polski::Odmiany::Rzeczowniki`)
      .tags(`Polski Odmiana`)
      .id(id)
      .field("front", front.trim())
      .field("back", back.trim())
      .make(),
  );
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
