import { newNote, printNoteNodes } from "@notatki/core";
import { writeFile } from "node:fs/promises";
import { Blacklist } from "./lib/blacklist.js";
import { readCsvFile } from "./lib/csv.js";
import { Dict } from "./lib/dict.js";
import { pathTo } from "./lib/io.js";
import { LemmataIndex } from "./lib/lemmata-index.js";
import { capitalize } from "./lib/text.js";
import { Phrase } from "./lib/word.js";

const dict = await Dict.load();

const index = await LemmataIndex.load(await Blacklist.load());

await rzeczowniki();
await czasowniki();
await przymiotniki();
await przysłówki();

async function readFreq(path) {
  const map = new Map();
  const list = [];
  for (const [lemma, pos, ppm] of await readCsvFile(path)) {
    const { translations } = dict.get(pos, lemma) ?? { translations: [lemma] };
    const key = translations.join("|");
    const entry = map.get(key);
    if (entry == null) {
      const entry = { lemmas: [{ lemma, ppm: Number(ppm) }], pos, translations };
      map.set(key, entry);
      list.push(entry);
    } else {
      entry.lemmas.push({ lemma, ppm: Number(ppm) });
    }
  }
  return list;
}

async function czasowniki() {
  const freq = await readFreq(pathTo("corpus/freq-verb.csv"));
  const notes = [];
  const seq = [100, 200, 300, 500, 800, 1300];
  let start = 0;
  for (const end of seq) {
    for (const entry of freq.slice(start, end)) {
      const id = entry.lemmas.map(({ lemma }) => lemma).join("_");
      notes.push(
        newNote()
          .type("Basic")
          .deck(`Polski::Słowa::Czasowniki::Pos-${start + 1}-${end}`)
          .tags(`Polski Słowo Czasownik Pos-1-${end} Pos-${start + 1}-${end}`)
          .id(`slowo_czasownik_${id}_ru`)
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
  const freq = await readFreq(pathTo("corpus/freq-noun.csv"));
  const notes = [];
  const seq = [100, 200, 300, 500, 800, 1300];
  let start = 0;
  for (const end of seq) {
    for (const entry of freq.slice(start, end)) {
      const id = entry.lemmas.map(({ lemma }) => lemma).join("_");
      notes.push(
        newNote()
          .type("Basic")
          .deck(`Polski::Słowa::Rzeczowniki::Pos-${start + 1}-${end}`)
          .tags(`Polski Słowo Rzeczownik Pos-1-${end} Pos-${start + 1}-${end}`)
          .id(`slowo_rzeczownik_${id}_ru`)
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
  const freq = await readFreq(pathTo("corpus/freq-adj.csv"));
  const notes = [];
  const seq = [100, 200, 300, 500, 800];
  let start = 0;
  for (const end of seq) {
    for (const entry of freq.slice(start, end)) {
      const id = entry.lemmas.map(({ lemma }) => lemma).join("_");
      notes.push(
        newNote()
          .type("Basic")
          .deck(`Polski::Słowa::Przymiotniki::Pos-${start + 1}-${end}`)
          .tags(`Polski Słowo Przymiotnik Pos-1-${end} Pos-${start + 1}-${end}`)
          .id(`slowo_przymiotnik_${id}_ru`)
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
  const freq = await readFreq(pathTo("corpus/freq-adv.csv"));
  const notes = [];
  const seq = [100, 200];
  let start = 0;
  for (const end of seq) {
    for (const entry of freq.slice(start, end)) {
      const id = entry.lemmas.map(({ lemma }) => lemma).join("_");
      notes.push(
        newNote()
          .type("Basic")
          .deck(`Polski::Słowa::Przysłówki::Pos-${start + 1}-${end}`)
          .tags(`Polski Słowo Przysłówek Pos-1-${end} Pos-${start + 1}-${end}`)
          .id(`slowo_przysłówek_${id}_ru`)
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

function makeFront({ lemmas, pos, translations }) {
  return `${[...translations].join(", ")} (${pos})`;
}

function makeBack({ lemmas, pos, translations }) {
  const lines = [];
  let index = 0;
  for (const { lemma, ppm } of lemmas) {
    if (index > 0) {
      lines.push("\n---\n");
    }
    const prefix = lemmas.length > 1 ? `${index + 1}. ` : ``;
    lines.push(
      `${prefix}${lemma}\n\n` + //
        `[anki:tts lang=pl_PL]${lemma}[/anki:tts]\n\n` +
        `${makeExamples(lemma, pos)}\n\n` +
        `Części na milion: ${ppm}`,
    );
    index += 1;
  }

  return lines.join("\n");
}

function makeExamples(lemma, pos, count = 5, unique = pos === "VERB" || pos === "NOUN" || pos === "ADJ") {
  const examples = [];
  const phrases = index.getPhrases(pos, lemma);
  const seen = new Set();
  for (const words of phrases) {
    if (!unique || isNew(words)) {
      examples.push(printPhrase(words, lemma));
    }
    if (examples.length >= count) {
      break;
    }
  }
  return examples.map((phrase) => `- ${phrase}`).join("\n");

  function isNew(words) {
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
