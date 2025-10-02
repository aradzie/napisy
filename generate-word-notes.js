import { newNote, printNoteNodes } from "@notatki/core";
import { writeFile } from "node:fs/promises";
import { Blacklist } from "./lib/blacklist.js";
import { readCsvFile } from "./lib/csv.js";
import { Dictionary } from "./lib/dictionary.js";
import { pathTo } from "./lib/io.js";
import { Morpholog } from "./lib/morpholog.js";
import { PhraseIndex } from "./lib/phrase-index.js";
import { capitalize } from "./lib/text.js";
import { Phrase } from "./lib/word.js";
import { Xext, Xpos } from "./lib/xtags.js";

const dictionary = await Dictionary.load();

const morpholog = await Morpholog.load();

const index = await PhraseIndex.load(await Blacklist.load());

await czasowniki();
await rzeczowniki();
await przymiotniki();
await przysłówki();

async function loadFrequencyDictionary(path) {
  const list = [];
  for (const [lemma, pos, ppm] of await readCsvFile(path)) {
    const {
      senses, //
      synonyms,
      antonyms,
      tags,
    } = dictionary.get(pos, lemma) ?? {
      pos,
      lemma,
      senses: [lemma],
      synonyms: [],
      antonyms: [],
      tags: [],
    };
    list.push({
      lemma,
      pos,
      senses,
      synonyms,
      antonyms,
      tags,
      ppm,
    });
  }
  return list;
}

async function czasowniki() {
  const list = await loadFrequencyDictionary(pathTo("corpus/freq-verb.csv"));
  const notes = [];
  const seq = [100, 200, 300, 500, 800, 1300];
  let start = 0;
  for (const end of seq) {
    for (const entry of list.slice(start, end)) {
      notes.push(
        newNote()
          .type("Basic")
          .deck(`Polski::Słowa::Czasowniki::Pos-${start + 1}-${end}`)
          .tags(`Polski Słowo Czasownik Pos-1-${end} Pos-${start + 1}-${end}`)
          .id(`slowo_czasownik_${entry.lemma}_ru`)
          .field("front", makeFront(entry))
          .field("back", makeBack(entry))
          .make(),
      );
    }
    start = end;
  }
  const path = pathTo(`notes/słowa-czasowniki.note`);
  console.log(`Generated ${notes.length} note(s) to file "${path}"`);
  await writeFile(path, printNoteNodes(notes));
}

async function rzeczowniki() {
  const list = await loadFrequencyDictionary(pathTo("corpus/freq-noun.csv"));
  const notes = [];
  const seq = [100, 200, 300, 500, 800, 1300];
  let start = 0;
  for (const end of seq) {
    for (const entry of list.slice(start, end)) {
      notes.push(
        newNote()
          .type("Basic")
          .deck(`Polski::Słowa::Rzeczowniki::Pos-${start + 1}-${end}`)
          .tags(`Polski Słowo Rzeczownik Pos-1-${end} Pos-${start + 1}-${end}`)
          .id(`slowo_rzeczownik_${entry.lemma}_ru`)
          .field("front", makeFront(entry))
          .field("back", makeBack(entry))
          .make(),
      );
    }
    start = end;
  }
  const path = pathTo(`notes/słowa-rzeczowniki.note`);
  console.log(`Generated ${notes.length} note(s) to file "${path}"`);
  await writeFile(path, printNoteNodes(notes));
}

async function przymiotniki() {
  const list = await loadFrequencyDictionary(pathTo("corpus/freq-adj.csv"));
  const notes = [];
  const seq = [100, 200, 300, 500, 800];
  let start = 0;
  for (const end of seq) {
    for (const entry of list.slice(start, end)) {
      notes.push(
        newNote()
          .type("Basic")
          .deck(`Polski::Słowa::Przymiotniki::Pos-${start + 1}-${end}`)
          .tags(`Polski Słowo Przymiotnik Pos-1-${end} Pos-${start + 1}-${end}`)
          .id(`slowo_przymiotnik_${entry.lemma}_ru`)
          .field("front", makeFront(entry))
          .field("back", makeBack(entry))
          .make(),
      );
    }
    start = end;
  }
  const path = pathTo(`notes/słowa-przymiotniki.note`);
  console.log(`Generated ${notes.length} note(s) to file "${path}"`);
  await writeFile(path, printNoteNodes(notes));
}

async function przysłówki() {
  const list = await loadFrequencyDictionary(pathTo("corpus/freq-adv.csv"));
  const notes = [];
  const seq = [100, 200];
  let start = 0;
  for (const end of seq) {
    for (const entry of list.slice(start, end)) {
      notes.push(
        newNote()
          .type("Basic")
          .deck(`Polski::Słowa::Przysłówki::Pos-${start + 1}-${end}`)
          .tags(`Polski Słowo Przysłówek Pos-1-${end} Pos-${start + 1}-${end}`)
          .id(`slowo_przysłówek_${entry.lemma}_ru`)
          .field("front", makeFront(entry))
          .field("back", makeBack(entry))
          .make(),
      );
    }
    start = end;
  }
  const path = pathTo(`notes/słowa-przysłówki.note`);
  console.log(`Generated ${notes.length} note(s) to file "${path}"`);
  await writeFile(path, printNoteNodes(notes));
}

function makeFront({ lemma, pos, senses, synonyms, antonyms, tags, ppm }) {
  const lines = [];
  lines.push(`${[...senses].join(", ")}`);
  if (synonyms.length > 0) {
    lines.push(``);
    lines.push(synonyms.map((synonym) => `~~${synonym}~~`).join(", "));
  }
  return lines.join("\n");
}

function makeBack({ lemma, pos, senses, synonyms, antonyms, tags, ppm }) {
  let title = [lemma];
  const addWords = (words) => {
    for (const word of words) {
      if (!title.includes(word.form)) {
        title.push(word.form);
      }
    }
  };
  if (pos === "VERB") {
    // spotkać -> spotkanie | ger:sg:nom.acc:n:perf:aff
    // addWords(morpholog.findByLemma(lemma, Xpos.ger, Xext.sg | Xext.nom | Xext.aff));
  }
  if (pos === "NOUN") {
    // posiadać -> posiadanie | ger:sg:nom.acc:n:perf:aff
    addWords(morpholog.findByLemma(lemma, Xpos.ger, Xext.sg | Xext.nom | Xext.aff));
  }
  if (pos === "ADJ") {
    const xlemma = Xext.sg | Xext.nom | Xext.m1 | Xext.m2 | Xext.m3;
    // dobry -> lepszy | adj:sg:nom.voc:m1.m2.m3:com
    addWords(morpholog.findByLemma(lemma, Xpos.adj, xlemma | Xext.com));
    // dobry -> najlepszy | adj:sg:nom.voc:m1.m2.m3:sup
    addWords(morpholog.findByLemma(lemma, Xpos.adj, xlemma | Xext.sup));
    // dotyczyć -> dotyczący | pact:sg:nom.voc:m1.m2.m3:imperf:aff
    addWords(morpholog.findByLemma(lemma, Xpos.pact, xlemma | Xext.imperf | Xext.aff));
    // stosować -> stosowany | ppas:sg:nom.voc:m1.m2.m3:imperf:aff
    addWords(morpholog.findByLemma(lemma, Xpos.ppas, xlemma | Xext.imperf | Xext.aff));
    // podać -> podany | ppas:sg:nom.voc:m1.m2.m3:perf:aff
    addWords(morpholog.findByLemma(lemma, Xpos.ppas, xlemma | Xext.perf | Xext.aff));
  }
  if (pos === "ADV") {
    // szybko -> szybciej | adv:com
    addWords(morpholog.findByLemma(lemma, Xpos.adv, Xext.com));
    // szybko -> najszybciej | adv:sup
    addWords(morpholog.findByLemma(lemma, Xpos.adv, Xext.sup));
  }
  const lines = [];
  lines.push(`${title.join(", ")}`);
  lines.push(``);
  lines.push(`[anki:tts lang=pl_PL]${title.join(", ")}[/anki:tts]`);
  if (synonyms.length > 0) {
    lines.push(``);
    lines.push(`**Synonimy**: ${synonyms.join(", ")}`);
  }
  if (antonyms.length > 0) {
    lines.push(``);
    lines.push(`**Antonimy:**: ${antonyms.join(", ")}`);
  }
  if (tags.length > 0) {
    lines.push(``);
    lines.push(`**Grupy:**: ${tags.join(", ")}`);
  }
  lines.push(``);
  lines.push(...makeExamples(lemma, pos));
  lines.push(``);
  lines.push(`Części na milion: ${ppm}`);
  return lines.join("\n");
}

function makeExamples(lemma, pos, count = 5, unique = pos === "VERB" || pos === "NOUN" || pos === "ADJ") {
  const examples = [];
  const phrases = index.getPhrases(pos, lemma);
  const seen = new Set();
  for (const words of phrases) {
    if (examples.length < count) {
      if (!unique || isUnique(words)) {
        examples.push(`- ${printPhrase(words, lemma)}`);
      }
    } else {
      break;
    }
  }
  return examples;

  function isUnique(words) {
    for (const word of words) {
      if (word.lemma === lemma) {
        if (seen.has(word.form)) {
          return false;
        }
        seen.add(word.form);
      }
    }
    return true;
  }
}

function printPhrase(words, lemma) {
  const phrase = new Phrase();
  for (const word of words) {
    if (word.lemma === lemma) {
      if (phrase.isEmpty) {
        phrase.push(`**${capitalize(word.form)}**`);
      } else {
        phrase.push(`**${word.form}**`);
      }
    } else {
      if (phrase.isEmpty) {
        phrase.push(capitalize(word.form));
      } else {
        phrase.push(word.form);
      }
    }
  }
  return phrase.print();
}
