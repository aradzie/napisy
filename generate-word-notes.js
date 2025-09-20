import { newNote, printNoteNodes } from "@notatki/core";
import { writeFile } from "node:fs/promises";
import { Blacklist } from "./lib/blacklist.js";
import { readCsvFile } from "./lib/csv.js";
import { pathTo } from "./lib/io.js";
import { LemmataIndex } from "./lib/lemmata-index.js";
import { capitalize } from "./lib/text.js";
import { Phrase } from "./lib/word.js";

const dict = await LemmataIndex.read(await Blacklist.load());

await rzeczowniki();
await czasowniki();

async function rzeczowniki() {
  const freq = await readCsvFile(pathTo("corpus/freq-noun.csv"));
  const notes = [];
  const seq = [100, 200, 300, 500, 800, 1300];
  let start = 0;
  for (const end of seq) {
    for (const [lemma, upos, ppm] of freq.slice(start, end)) {
      notes.push(
        newNote()
          .type("Basic")
          .deck(`Polski::Słowa::Rzeczowniki::Pos-${start + 1}-${end}`)
          .tags(`Polski Słowo Rzeczownik Pos-1-${end} Pos-${start + 1}-${end}`)
          .id(`slowo_rzeczownik_${lemma}_ru`)
          .field("front", makeFront(lemma))
          .field("back", makeBack(lemma, ppm))
          .make(),
      );
    }
    start = end;
  }
  const path = pathTo(`notes/słowa-rzeczowniki.note`);
  console.log(`Generated ${notes.length} note(s) to file "${path}"`);
  await writeFile(path, printNoteNodes(notes));
}

async function czasowniki() {
  const freq = await readCsvFile(pathTo("corpus/freq-verb.csv"));
  const notes = [];
  const seq = [100, 200, 300, 500, 800, 1300];
  let start = 0;
  for (const end of seq) {
    for (const [lemma, upos, ppm] of freq.slice(start, end)) {
      notes.push(
        newNote()
          .type("Basic")
          .deck(`Polski::Słowa::Czasowniki::Pos-${start + 1}-${end}`)
          .tags(`Polski Słowo Czasownik Pos-1-${end} Pos-${start + 1}-${end}`)
          .id(`slowo_czasownik_${lemma}_ru`)
          .field("front", makeFront(lemma))
          .field("back", makeBack(lemma, ppm))
          .make(),
      );
    }
    start = end;
  }
  const path = pathTo(`notes/słowa-czasowniki.note`);
  console.log(`Generated ${notes.length} note(s) to file "${path}"`);
  await writeFile(path, printNoteNodes(notes));
}

function makeFront(lemma) {
  return `${lemma}`;
}

function makeBack(lemma, ppm) {
  return (
    `${lemma}\n\n` + //
    `[anki:tts lang=pl_PL]${lemma}[/anki:tts]\n\n` +
    `${makeExamples(lemma)}\n\n` +
    `Części na milion: ${ppm}`
  );
}

function makeExamples(lemma, count = 10) {
  const examples = [];
  const phrases = dict.getPhrases(lemma);
  const seen = new Set();
  for (const words of phrases) {
    if (isNew(words)) {
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
