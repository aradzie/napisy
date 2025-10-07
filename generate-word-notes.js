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

const all = await loadFrequencyDictionary(pathTo("corpus/freq-all.csv"));
const list = all.filter(
  (entry) =>
    entry.pos === "VERB" || //
    entry.pos === "NOUN" ||
    entry.pos === "ADJ" ||
    entry.pos === "ADV",
);
const notes = [];
const seq = [100, 200, 300, 500, 800, 1300, 2100, 3400, 5500];
let start = 0;
for (const end of seq) {
  for (const entry of list.slice(start, end)) {
    const pn = posName(entry.pos);
    notes.push(
      newNote()
        .type("Word")
        .deck(`Polski::Słowa::Pos-${num(start + 1)}-${num(end)}`)
        .tags(`Polski Słowo ${pn} Pos-1-${end} Pos-${start + 1}-${end}`)
        .id(`slowo_${pn.toLocaleLowerCase("pl")}_${entry.lemma}_ru`)
        .field("Front", makeFront(entry))
        .field("Back", makeBack(entry))
        .field("POS", pn)
        .field("PPM", String(entry.ppm).padStart(6, "0"))
        .make(),
    );
  }
  start = end;
}
const path = pathTo(`notes/słowa.note`);
console.log(`Generated ${notes.length} note(s) to file "${path}"`);
await writeFile(path, printNoteNodes(notes));

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

function makeFront({ lemma, pos, senses, synonyms, antonyms, tags, ppm }) {
  const lines = [];
  lines.push(`${[...senses].join(", ")}`);
  if (synonyms.length > 0) {
    lines.push(``);
    lines.push(synonyms.map((synonym) => `~~${synonym}~~`).join(", "));
  }
  lines.push(``);
  lines.push(`*${posName(pos)}*`);
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
  if (pos === "ADJ") {
    const xlemma = Xext.sg | Xext.nom | Xext.m1 | Xext.m2 | Xext.m3;
    // dobry -> lepszy | adj:sg:nom.voc:m1.m2.m3:com
    addWords(morpholog.find(lemma, Xpos.adj, xlemma | Xext.com));
    // dobry -> najlepszy | adj:sg:nom.voc:m1.m2.m3:sup
    addWords(morpholog.find(lemma, Xpos.adj, xlemma | Xext.sup));
  }
  if (pos === "ADV") {
    // szybko -> szybciej | adv:com
    addWords(morpholog.find(lemma, Xpos.adv, Xext.com));
    // szybko -> najszybciej | adv:sup
    addWords(morpholog.find(lemma, Xpos.adv, Xext.sup));
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

function posName(pos) {
  switch (pos) {
    case "VERB":
      return "Czasownik";
    case "NOUN":
      return "Rzeczownik";
    case "ADJ":
      return "Przymiotnik";
    case "ADV":
      return "Przysłówek";
  }
  return "?";
}

function num(v) {
  return String(v).padStart(4, "0");
}
